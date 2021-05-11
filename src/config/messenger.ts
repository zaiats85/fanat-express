import amqp, { Channel, Message } from "amqplib/callback_api";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

let channel: Channel;
const exchange = "places";
const { CLOUDAMQP_URL = "amqp://localhost:5672" } = process.env;

const init = async () =>
    new Promise((resolved, rejected) => {
      amqp.connect(CLOUDAMQP_URL, (err, connection) => {
        if (err) {
          return rejected(err);
        }

        // tslint:disable-next-line:variable-name
        connection.createChannel((err, _channel) => {
          if (err) {
            return rejected(err);
          }

          channel = _channel;

          channel.assertExchange(exchange, "fanout", {
            durable: false,
          });

          logger.info({
            message: `Rabbitmq client connected`,
          });

          resolved(channel);
        });
      });
    });

const subscribe = (fn: (message: any) => void) => {
  if (!channel) {
    setTimeout(() => subscribe(fn), 8080);
    return;
  }

  const channelCfg = {
    exclusive: true,
  };

  const callback = (msg: Message | null) => {
    if (msg) {
      fn(JSON.parse(msg.content.toString()));
    }
  };

  channel.assertQueue("", channelCfg, (err, q) => {
    if (err) {
      throw err;
    }

    channel.bindQueue(q.queue, exchange, "");
    channel.consume(q.queue, callback, {
      noAck: true,
    });
  });
};

const publish = (message: any) => {
  channel.publish(exchange, "", Buffer.from(JSON.stringify(message)));
};

export { init, publish, subscribe };
