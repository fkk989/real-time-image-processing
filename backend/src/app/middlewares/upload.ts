import multer, { FileFilterCallback } from "multer";
import mime from "mime-types";
import path from "path";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads/orignal"));
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const imageType = mime.lookup(file.originalname);
  //
  const allowImageType = ["image/jpeg", "image/png"];

  // Validate if the MIME type is in the allowed list
  if (imageType && allowImageType.includes(imageType)) {
    cb(null, true);
  } else {
    cb(new Error("only jpeg and png are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
