import express from "express";
import cors from "cors";
import { createResponse } from "./lib/constants";
import { imageRouter } from "./contorllers/imageController";

export const app = express();

app.use(cors(), express.json());

app.use("/api/image", imageRouter);

// health Checkup
app.get("/health", (req, res) => {
  return res.json(createResponse(true, "server running fine"));
});
