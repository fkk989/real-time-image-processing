import express, { Router } from "express";
import { upload } from "../middlewares/upload";
import {
  deleteService,
  downloadService,
  editService,
  getImage,
  restoreService,
  uploadService,
} from "../services/imageServices";
//
export const imageRouter = Router();

imageRouter.get("/:image_path", getImage);

imageRouter.post(
  "/upload",
  express.urlencoded({ extended: false }),
  upload.single("upload-image"),
  uploadService
);

imageRouter.delete("/delete/:image_path", deleteService);

imageRouter.post("/edit", editService);

imageRouter.post("/restore", restoreService);

imageRouter.post("/download", downloadService);
