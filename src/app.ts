import dotenv from "dotenv";
import express from "express";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Dariya and Stanislaw and Oleg, and Lyda and Mariana");
});

// @ts-ignore
app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
