import { currentUser } from "./../../middlewares/currentUser";
import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const authRes = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "pass" })
    .expect(201);
  const cookie = authRes.get("Set-Cookie");
  const response = await request(app).get("/api/users/currentuser").set("Cookie", cookie).expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});
