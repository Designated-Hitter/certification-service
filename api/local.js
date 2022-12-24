import express from "express";
import { handler } from "./index.mjs";

const app = express();
app.use(express.json());

app.use(async (req, res) => {
  const event = {
    "requestContext":{
       "http":{
          "method": req.method,
          "path": req.url
       },
    },
    "body": JSON.stringify(req.body)
  }

  const result = await handler(event);

  if (result) {
    res.status(result.statusCode).json(result.body);
  } else {
    res.status(400).json('no endpoint');
  }
})

app.listen(4000);