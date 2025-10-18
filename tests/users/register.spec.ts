import request from "supertest";
import app from "../../src/app";
import { expect } from "@jest/globals";
import prisma from "../../src/db";

describe("POST /auth/register", () => {
  const path = "/auth/register";

  // Clean up database before each test
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
    expect(response.body.user).toBeDefined(); // Ensure Response does have a user object and it's not null
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
  });

  // it("should not register a user with missing fields",async()=>{})
  // it("should not register a user with duplicate email",async()=>{})
  // it("should not register a user with weak password",async()=>{})
});
