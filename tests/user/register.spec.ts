import request from "supertest";
import app from "../../src/app";
import { expect } from "@jest/globals";

describe("POST /auth/register", () => {
  const path = "/auth/register";

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

  it("should return json content type",async()=>{
    // Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "StrongP@ssw0rd",
    };
    // Act
    const response = await request(app).post(path).send(userData);
    // Assert
    expect(response.headers['content-type']).toMatch(/json/);
  });

  // it("should persist user in the database",async()=>{
  //   // Arrange
  //   const userData = {
  //     name: "John Doe",
  //     email: "johndoe@gmail.com",
  //     password: "StrongP@ssw0rd",
  //   };
  //   // Act
  //   const response = await request(app).post(path).send(userData);
  //   // Assert
  //   expect(response.body.user).toBeDefined();
  //   expect(response.body.user.email).toBe(userData.email);
  // });

  // it("should not register a user with missing fields",async()=>{})
  // it("should not register a user with duplicate email",async()=>{})
  // it("should not register a user with weak password",async()=>{})
});
