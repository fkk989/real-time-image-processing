import { Request, Response } from "express";
import { createResponse } from "../lib/constants";
import path from "path";
import sharp from "sharp";
import { reqBodyImageSchema, restoreScheme } from "../schemas/imageSchemas";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { get_custom_width_and_height } from "../lib/helpers";
//

export async function getImage(req: Request, res: Response) {
  try {
    const { image_path } = req.params;
    const filePath = path.join(
      __dirname,
      `../../../uploads/preview/${image_path}`
    );

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.json(createResponse(false, err.message));
      } else {
        res.sendFile(filePath);
      }
    });
  } catch (e: any) {
    res.json(createResponse(false, e.message));
  }
}
//upload
export async function uploadService(req: Request, res: Response) {
  try {
    const file = req.file;

    const imagePath = path.join(
      __dirname,
      `../../../uploads/original/${file?.filename}`
    );

    const mimeType = file?.mimetype.split("/")[1] as "jpeg" | "png";
    // uplading lower quality image to preview folder
    const newFileName = `${uuidv4()}.${mimeType}`;

    const originalImgPath = path.join(
      __dirname,
      `../../../uploads/original/${file?.filename}`
    );

    // resizing original image so we can crop extra large image properly
    const originalImage = sharp(originalImgPath);
    const originalImgMetadata = await originalImage.metadata();

    if (originalImgMetadata.height && originalImgMetadata.width) {
      const { height, width } = get_custom_width_and_height({
        height: originalImgMetadata.height,
        width: originalImgMetadata.width,
      });
      console.log("widht:", width, "height", height);
      originalImage.resize({ width, height });
    }

    console.log("filename", file?.filename, "newFileName", newFileName);
    console.log("before");
    await originalImage.toFile(
      path.join(__dirname, `../../../uploads/original/${newFileName}`)
    );

    console.log("after");
    const previewImage = sharp(
      path.join(__dirname, `../../../uploads/original/${newFileName}`)
    ).toFormat(mimeType, {
      quality: 50,
    });
    //
    const previewFilePath = path.join(
      __dirname,
      `../../../uploads/preview/${newFileName}`
    );
    //
    await previewImage.toFile(previewFilePath);

    //
    res.json(
      createResponse(true, "image uploaded", {
        imagePath: newFileName,
        type: mimeType,
      })
    );
  } catch (e: any) {
    console.log(e);
    res.status(400).json(createResponse(false, e.message));
  }
}
//
export async function deleteService(req: Request, res: Response) {
  try {
    const { image_path } = req.params;
    const originalImgPath = path.join(
      __dirname,
      `../../../uploads/original/${image_path}`
    );
    const previewImagePath = path.join(
      __dirname,
      `../../../uploads/preview/${image_path}`
    );

    fs.unlink(originalImgPath, (e) => {
      if (e) {
        console.log(e);
      }
    });
    fs.unlink(previewImagePath, (e) => {
      if (e) {
        console.log(e);
      }
    });

    res.json(createResponse(true, "images deleted"));
    //
  } catch (e: any) {
    console.log("delete error", e);
    res.json(createResponse(false, e.message));
  }
}

// edit and undo redo service
export async function editService(req: Request, res: Response) {
  try {
    const reqBody = req.body;
    const parsedInput = reqBodyImageSchema.safeParse(reqBody);

    if (!parsedInput.success) {
      return res
        .status(400)
        .json(
          createResponse(false, "Invalid input", parsedInput.error.format())
        );
    }

    const { type, brightness, contrast, rotate, crop, imagePath } =
      parsedInput.data;
    //
    const originalImgPath = path.join(
      __dirname,
      `../../../uploads/original/${imagePath}`
    );

    // Createing a Sharp pipeline to process the image
    let image = sharp(originalImgPath).toFormat(type);
    const imageMetaData = await image.metadata();
    //

    if (imageMetaData && imageMetaData.format) {
      image.toFormat(imageMetaData.format, { quality: 50 });
    }

    const uploadImagPath = path.join(
      __dirname,
      `../../../uploads/preview/${imagePath}`
    );
    //
    // Apply brightness using modulate
    if (brightness !== 0) {
      const brightnessValue =
        brightness > 0 ? brightness / 100 + 1 : brightness / 200 + 1;

      image = image.modulate({ brightness: brightnessValue });
    }

    // Apply contrast using linear
    if (contrast !== 0) {
      const contrastFactor =
        contrast > 0 ? contrast / 100 + 1 : contrast / 200 + 1;

      image = image.linear(contrastFactor, 0);
    }

    // Apply rotation
    if (rotate !== 0) {
      image = image.rotate(rotate);
    }

    // applying crop
    if (crop) {
      image = image.extract(crop);
    }

    // upload updated image with full quality to preview for download
    await image.toFile(uploadImagPath);

    res.json(createResponse(true, "image updated"));
    // removing previous preview image
    //
  } catch (e: any) {
    res.status(500).json(createResponse(false, e.message));
  }
}
//download service
export async function downloadService(req: Request, res: Response) {
  try {
    const reqBody = req.body;

    const parsedInput = reqBodyImageSchema.safeParse(reqBody);

    if (!parsedInput.success) {
      return res
        .status(400)
        .json(
          createResponse(false, "Invalid input", parsedInput.error.format())
        );
    }

    const { type, brightness, contrast, rotate, crop, imagePath } =
      parsedInput.data;
    //
    const originalImgPath = path.join(
      __dirname,
      `../../../uploads/original/${imagePath}`
    );
    //

    // Createing a Sharp pipeline to process the image
    const image = sharp(originalImgPath).toFormat(type);

    const imageMetaData = await image.metadata();
    //

    // Apply brightness using modulate
    if (brightness !== 0) {
      const brightnessValue =
        brightness > 0 ? brightness / 100 + 1 : brightness / 200 + 1;

      image.modulate({ brightness: brightnessValue });
    }

    // apply contrast using linear
    if (contrast !== 0) {
      const contrastFactor =
        contrast > 0 ? contrast / 100 + 1 : contrast / 200 + 1;

      image.linear(contrastFactor, 0);
    }

    // Apply rotation
    if (rotate !== 0) {
      image.rotate(rotate);
    }

    // getting orinal crop value as we resized the image for the preview
    if (crop) {
      // applying crop
      image.extract(crop);
    }

    // upload updated image with full quality to preview for download
    const imageBuffer = await image.toBuffer();

    res.send(imageBuffer);
  } catch (e: any) {
    res.status(500).json(createResponse(false, e.message));
  }
}
// restore service
export async function restoreService(req: Request, res: Response) {
  try {
    const reqBody = req.body;
    //
    const parsedInput = restoreScheme.safeParse(reqBody);

    if (!parsedInput.success) {
      return res
        .status(400)
        .json(
          createResponse(false, "Invalid input", parsedInput.error.format())
        );
    }

    const { imagePath } = parsedInput.data;

    const originalImgPath = path.join(
      __dirname,
      `../../../uploads/original/${imagePath}`
    );
    const uploadImagPath = path.join(
      __dirname,
      `../../../uploads/preview/${imagePath}`
    );

    // Createing a Sharp pipeline to process the image
    const image = sharp(originalImgPath);
    const imageMetaData = await image.metadata();

    //  setting custom size for big size image

    if (imageMetaData.format) {
      image.toFormat(imageMetaData.format, { quality: 50 });
    }

    // upload updated image with full quality to preview for download
    await image.toFile(uploadImagPath);

    res.json(createResponse(true, "image resotred"));
    // deleting old preview img

    //
  } catch (e: any) {
    res.status(500).json(createResponse(false, e.message));
  }
}
