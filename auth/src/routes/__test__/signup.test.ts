import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pass",
    })
    .expect(201);
});

it("returns a 400 on bad sign up, invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.c",
      password: "pass",
    })
    .expect(400);
});

it("returns a 400 on bad sign up, invalid pass", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.co",
      password: "pas",
    })
    .expect(400);
});

it("returns a 400 on bad sign up, invalid everything", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({})
    .expect(400);
});
