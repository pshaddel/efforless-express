import app from "./sample_project/index.js";
import request from "supertest";

describe("sample_project", () => {
  it("should be able to ping the app", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("file with .route.js extension must been loaded as routes", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "users router: index.route.js" });
  });

  it("folders with :something must be considered", async () => {
    const response = await request(app).get("/posts/Cal_Newport");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Posts Router - GET Method",
      author: "Cal_Newport",
    });
  });

  it("folders with :something must be considered with other http methods", async () => {
    const response = await request(app).put("/posts/Cal_Newport");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Posts Router - PUT Method",
      author: "Cal_Newport",
    });
  });
  // "Posts Router Base - GET Method"
  it("should be able to have a route in each folder and nested ones", async () => {
    const response = await request(app).get("/posts");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Posts Base router: posts.js" });
  });

  it("should be able to handle plain functions too(not a express router)", async () => {
    const response = await request(app).get("/healthcheck");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Health Check Route" });
  });

  describe("Should be able to handle files with http methods as extension", () => {
    const methods = ["get", "post", "put", "delete", "patch"];
    methods.forEach((method) => {
      it(`should be able to handle files with http methods as extension ${method.toUpperCase()}`, async () => {
        const response = await request(app)[method]("/payments");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          message: `Payments Router - ${method.toUpperCase()} Method`,
        });
      });
    });
    it("should work in nested folders", async () => {
      const response = await request(app).get("/payments/report");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Payments Report Router" });
    });
  });

  it("A combination pattern like fileName.route.get.js should be considered as a single route", async () => {
    const response = await request(app).get("/weather");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Weather Router - GET Method" });
  });
});
