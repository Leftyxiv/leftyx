import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from '../../natsWrapper';




it("returns a 404 on a ticket that does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 20,
    })
    .expect(404);
});
it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "title",
      price: 20,
    })
    .expect(401);
});
it("returns a 401 if the user does not own a ticket", async () => {
  const res = await request(app).post(`/api/tickets`).set("Cookie", global.signin()).send({
    title: "title",
    price: 20,
  });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "updated title",
      price: 200,
    })
    .expect(401);
});

it("returns a 400 if the user provides and invalid title or price", async () => {
  const cookie = global.signin();
  const res = await request(app).post(`/api/tickets`).set("Cookie", cookie).send({
    title: "title",
    price: 20,
  });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: -5,
    })
    .expect(400);
});
it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const res = await request(app).post(`/api/tickets`).set("Cookie", cookie).send({
    title: "title",
    price: 20,
  });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "tiitle",
      price: 15,
    })

    .expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200);
  expect(ticketResponse.body.title).toEqual("tiitle");
  expect(ticketResponse.body.price).toEqual(15);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const res = await request(app).post(`/api/tickets`).set("Cookie", cookie).send({
    title: "title",
    price: 20,
  });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "tiitle",
      price: 15,
    })

    .expect(200);


  expect(natsWrapper.client.publish).toHaveBeenCalled();
})