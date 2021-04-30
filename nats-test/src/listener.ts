import nats from "node-nats-streaming";
import { TicketCreatedListener } from './events/TicketCreatedListener';


console.clear();

const stan = nats.connect("leftyx", Date.now().toString(), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to nats");

  stan.on("close", () => {
    console.log("nats connection closed");
    // @ts-ignore
    process.exit();
  });

  new TicketCreatedListener(stan).listen();


});
// @ts-ignore
process.on("SIGNINT", () => stan.close());
// @ts-ignore
process.on("SIGTERM", () => stan.close());



