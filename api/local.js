import express from "express";
import { handler } from "./index.mjs";
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

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
    res.status(result.statusCode).header(result.headers).json(result.body);
  } else {
    res.status(400).json('no endpoint');
  }
})

app.listen(4000);