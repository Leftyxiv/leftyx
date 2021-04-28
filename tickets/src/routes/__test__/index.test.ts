import request from "supertest";
import { app } from "../../app";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
};

it("returns a list of all tickets", async () => {
  await createTicket("this is my ticket", 15);
  await createTicket("this is also my ticket", 20);
  await createTicket("this ismy third ticket", 20);

  const res = await request(app).get("/api/tickets").send().expect(200);
  expect(res.body.length).toEqual(3);
});
