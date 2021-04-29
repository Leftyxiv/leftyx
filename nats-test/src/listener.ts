import nats, { Message } from "node-nats-streaming";

console.clear();

const stan = nats.connect("leftyx", Date.now().toString(), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to nats");

  const subscription = stan.subscribe("ticket:created");
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
