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
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "pass" }).expect(201);
  await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "pass" }).expect(400);
});

it("sets a cookie after successful sign up", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "pass" })
    .expect(201);
  expect(res.get("Set-Cookie")).toBeDefined();
});
