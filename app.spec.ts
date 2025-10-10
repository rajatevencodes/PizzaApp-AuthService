import request from "supertest";
import app from "./src/app";

describe("simple test case", () => {
  it("should pass a basic math check", () => {
    expect(1 + 10).toBe(11);
  });

  it("should return a 200 status code and 'Okay!' message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Okay!");
  });
});
