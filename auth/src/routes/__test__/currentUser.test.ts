import { currentUser } from "@leftyx/common";
import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = await global.signin();
  const response = await request(app).get("/api/users/currentuser").set("Cookie", cookie).expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with current user of null", async () => {
  const res = await request(app).get("/api/users/currentuser").expect(200);
  expect(res.body.currentUser).toEqual(null);
});
