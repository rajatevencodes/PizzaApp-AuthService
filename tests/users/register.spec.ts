import request from "supertest";
import app from "../../src/app";
import { expect } from "@jest/globals";
import prisma from "../../src/db";

/*
All the test cases
1. should return a status code 201 when registering a user with all valid fields
2. should return json content type
3. should persist user in the database
4. should not register a user with missing fields
5. should not register a user with duplicate email
6. should not register a user with weak password
7. should not register a user with invalid email format
8. should not register a user with empty name
*/

describe("POST /auth/register", () => {
  const path = "/auth/register";

  // Clean up database before each test
  // ! Note: Our whole database is getting deleted before `npm run test` and after all tests
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  // Clean up and close database connection after all tests
  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it("should return a status code 201 when registering a user with all valid fields", async () => {
    // * AAA - Arrange, Act, Assert
    // * Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "StrongP@ssw0rd",
    };
    // * Act
    const response = await request(app).post(path).send(userData);
    // * Assert
    expect(response.status).toBe(201);
  });

  it("should return json content type", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "StrongP@ssw0rd",
    };
    // Act
    const response = await request(app).post(path).send(userData);
    // Assert
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("should persist user in the database", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "StrongP@ssw0rd",
    };
    // Act
    const response = await request(app).post(path).send(userData);

    // Assert - Check response
    expect(response.body.user).toBeDefined(); // Ensuring response does have a user object and it's not null
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.name).toBe(userData.name);

    // Assert - Verify user exists in database
    const savedUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    // savedUser should not be null
    expect(savedUser).not.toBeNull();
    // Ensure the name and email is the same as the one in the request
    expect(savedUser?.email).toBe(userData.email);
    expect(savedUser?.name).toBe(userData.name);
    expect(savedUser?.id).toBeDefined();
    console.log(savedUser);
  });

  it("should not register a user with missing fields", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      // email is missing
      password: "StrongP@ssw0rd",
    };
    // Act
    const response = await request(app).post(path).send(userData);
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toContain("All fields are required");
  });

  it("should not register a user with duplicate email", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "StrongP@ssw0rd",
    };
    // Act - First registration (should succeed)
    const firstResponse = await request(app).post(path).send(userData);
    expect(firstResponse.status).toBe(201);

    // Act - Second registration with same email (should fail)
    const secondResponse = await request(app).post(path).send(userData);

    // Assert
    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.errors).toBeDefined();
    expect(secondResponse.body.errors[0].msg).toContain(
      "User with this email already exists",
    );
  });

  it("should not register a user with weak password", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "weak", // Too short password
    };
    // Act
    const response = await request(app).post(path).send(userData);
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toContain("Password must be");
  });

  it("should not register a user with invalid email format", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "invalid-email", // Invalid email format
      password: "StrongP@ssw0rd",
    };
    // Act
    const response = await request(app).post(path).send(userData);
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should not register a user with empty name", async () => {
    // Arrange
    const userData = {
      name: "", // Empty name
      email: "johndoe@gmail.com",
      password: "StrongP@ssw0rd",
    };
    // Act
    const response = await request(app).post(path).send(userData);
    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toContain("All fields are required");
  });
});
