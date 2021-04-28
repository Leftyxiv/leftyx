import request from "supertest";
import { app } from "../../app";

it("has a router handler listening to /api/tickets for post requests", async () => {
  const res = await request(app).post("/api/tickets").send({});
  expect(res.status).not.toEqual(404);
});

it("can only be accessed by authenticated user", async () => {
  const res = await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if authenticated", async () => {
  const res = await request(app).post("/api/tickets").set("Cookie", global.signin()).send({});

  expect(res.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "lefty's tix",
      price: -4,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "lefty's tix",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  //add in a check to make suire a ticket was saved to the database
  await request(app)
    .post('/api/tickets')
    .send({
      title: '4e54w5',
      price: 20
    })
    .expect(201);
});
