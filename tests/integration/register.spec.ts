import request from "supertest";
import app from "../../src/app";
import { expect } from "@jest/globals";
import prisma from "../../src/db";
import { Roles } from "../../src/constants";

// --- Test Configuration ---

const path = "/auth/register";

// A valid user payload to reuse in tests
const validUserData = {
  name: "John Doe",
  email: "johndoe@gmail.com",
  password: "StrongP@ssw0rd", // Must match your validation rules
};

// --- Test Suite ---

describe(`POST ${path}`, () => {
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

  // ---
  // --- 1. Happy Path ---
  // ---
  describe("Happy Path: Successful User Creation", () => {

    describe("When given valid user data", () => {

      it("Test 1 & 2: Should respond with 201 Created and JSON content-type", async () => {
        // Act : Make the request
        const response = await request(app).post(path).send(validUserData);
        // Assert: Check the HTTP response
        expect(response.status).toBe(201);
        expect(response.headers["content-type"]).toMatch(/json/);
      });

      it("Test 3, 4 & 5: Should save the user to the database with correct defaults and a hashed password", async () => {
        // Act: Make the request
        await request(app).post(path).send(validUserData);

        // Assert: Check the database state
        const savedUser = await prisma.user.findUnique({
          where: { email: validUserData.email },
        });

        console.log("Saved User:", savedUser);
        // 4. Persisted user
        expect(savedUser).not.toBeNull();
        expect(savedUser?.email).toBe(validUserData.email);
        expect(savedUser?.name).toBe(validUserData.name);

        // 3. Default role
        expect(savedUser?.role).toBe(Roles.CUSTOMER);

        // 5. Hashed password
        // On Official Docs of bcrypt , Every hashed password have length of 60 and starts with $2a$, $2b$ or $2y$
        expect(savedUser?.password).toBeDefined();
        expect(savedUser?.password).not.toBe(validUserData.password);
        expect(savedUser?.password).toHaveLength(60);
        expect(savedUser?.password).toMatch(/^\$2[aby]\$.{56}$/);

      });

      it("Test 7: Should ignore extra fields (e.g., 'role') in the request body", async () => {
        // Arrange
        const maliciousUserData = {
          ...validUserData,
          email: "attacker@gmail.com", // Use a new email
          role: Roles.ADMIN, // Attempt to set role
        };

        // Act
        await request(app).post(path).send(maliciousUserData);

        // Assert
        const savedUser = await prisma.user.findUnique({
          where: { email: maliciousUserData.email },
        });
        expect(savedUser).not.toBeNull();
        expect(savedUser?.role).toBe(Roles.CUSTOMER); // Should still be CUSTOMER
      });

      // TODO
      // it.skip("Test 8: Should return a JWT and set a secure HttpOnly cookie", async () => {
      //   // Act
      //   const response = await request(app).post(path).send(validUserData);
      //   // Assert: Check body for token
      //   expect(response.body.token).toBeDefined();
      //   expect(response.body.token.split(".").length).toBe(3);

      //   // Assert: Check headers for cookie
      //   const cookies = response.headers["set-cookie"];
      //   expect(cookies).toBeDefined();
      //   const tokenCookie = cookies.find((cookie: string) =>
      //     cookie.startsWith("token="),
      //   );
      //   expect(tokenCookie).toBeDefined();
      //   expect(tokenCookie).toContain("HttpOnly");
      // });
    });
  });

  /*
  ---------------------------------------
  --- 2. Validation & Error Scenarios ---
  ---------------------------------------
  */
  describe("Validation & Error Scenarios", () => {
    
    describe("Tests 8-13: Missing or Empty Fields", () => {
      // We use test.each to run the same logic for multiple invalid inputs
      // This is much cleaner than 6 separate 'it' blocks.
      const testCases = [
        {
          case: "missing 'name'",
          payload: { email: validUserData.email, password: validUserData.password },
          expectedMsg: "name is required",
        },
        {
          case: "missing 'email'",
          payload: { name: validUserData.name, password: validUserData.password },
          expectedMsg: "email is required",
        },
        {
          case: "missing 'password'",
          payload: { name: validUserData.name, email: validUserData.email },
          expectedMsg: "password is required",
        },
        {
          case: "empty 'name'",
          payload: { ...validUserData, name: "" },
          expectedMsg: "name is required",
        },
        {
          case: "empty 'email'",
          payload: { ...validUserData, email: "" },
          expectedMsg: "email is required",
        },
        {
          case: "empty 'password'",
          payload: { ...validUserData, password: "" },
          expectedMsg: "password is required",
        },
      ];

      test.each(testCases)("Should return 400 for $case", async ({ payload, expectedMsg }) => {
        // Act
        const response = await request(app).post(path).send(payload);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toContain(expectedMsg);
      });
    });

    describe("Tests 13-15: Duplicate Email Conflict and invalid format", () => {
      it("Test 14: Should return 409 Conflict for a duplicate email", async () => {
        // Arrange: Create the first user
        await request(app).post(path).send(validUserData);

        // Act: Try to create the same user again
        const secondResponse = await request(app).post(path).send(validUserData);

        // Assert
        expect(secondResponse.status).toBe(409); // 409 Conflict
        expect(secondResponse.body.errors[0].msg).toContain(
          "User with this email already exists",
        );
      });

      it("Test 15: Should return 400 for an invalid email format", async () => {
        // Arrange
        const invalidEmailData = { ...validUserData, email: "not-an-email.com" };

        // Act
        const response = await request(app).post(path).send(invalidEmailData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toContain("Please provide a valid email addres");
      });

      });
    });

    describe("Test 16-20: Password Strength Validation", () => {
      // Again, test.each is perfect for this.
      const strengthTestCases = [
        {
          case: "too short",
          password: "S@1a",
          expectedMsg: "Password must be at least 8 characters long",
        },
        {
          case: "missing an uppercase letter",
          password: "strongp@ssw0rd",
          expectedMsg: "Password must contain at least one uppercase letter",
        },
        {
          case: "missing a lowercase letter",
          password: "STRONGP@SSW0RD",
          expectedMsg: "Password must contain at least one lowercase letter",
        },
        {
          case: "missing a number",
          password: "StrongP@ssword",
          expectedMsg: "Password must contain at least one number",
        },
        {
          case: "missing a special character",
          password: "StrongPassw0rd",
          expectedMsg: "Password must contain at least one special character",
        },
      ];

      test.each(strengthTestCases)(
        "Should return 400 for password $case",
        async ({ password, expectedMsg }) => {
          // Arrange
          const weakPasswordData = { ...validUserData, password: password };

          // Act
          const response = await request(app).post(path).send(weakPasswordData);

          // Assert
          expect(response.status).toBe(400);
          expect(response.body.errors[0].msg).toContain(expectedMsg);
        },
      );
    });
  });
;