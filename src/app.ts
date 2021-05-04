import dotenv from "dotenv";
import express from "express";
import path from "path";
import { Observable } from "rxjs";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

const foo = new Observable((subscriber) => {
  subscriber.next("Hello,");
  subscriber.next("My name is...");
  subscriber.next("Linus :)");
  subscriber.complete();
});

foo.subscribe({
  next: (x) => {
    console.log(x);
  },
  // tslint:disable-next-line:object-literal-sort-keys
  error: (err) => {
    console.log("Error : " + err);
  },
  complete: () => {
    console.log("Done...");
  },
});

app.get("/", (req, res) => {
  res.send("Hello Dariya and Stanislaw and Oleg, and Lyda");
});

// @ts-ignore
app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
