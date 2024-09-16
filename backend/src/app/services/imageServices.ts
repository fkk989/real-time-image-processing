import { Request, Response } from "express";
import { createResponse } from "../lib/constants";
import path from "path";
import sharp from "sharp";
import { reqBodyImageSchema, restoreScheme } from "../schemas/imageSchemas";
import fs from "fs";
import { getWithAndHeith } from "../lib/helpers";
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
      `../../../uploads/orignal/${file?.filename}`
    );
    const mimeType = file?.mimetype.split("/")[1] as "jpeg" | "png";
    // uplading lower quality image to preview folder
    const previewFilePath = path.join(
      __dirname,
      `../../../uploads/preview/${file?.filename}`
    );
    const image = sharp(path.join(imagePath)).toFormat(mimeType, {
      quality: 50,
    });
    const metadata = await image.metadata();

    //
    //  setting custom size for big size image
    if (metadata.height && metadata.width) {
      const { height, width } = getWithAndHeith({
        width: metadata.width,
        height: metadata.height,
      });

      image.resize({ width: Math.ceil(width), height: Math.ceil(height) });
    }

    //
    await image.toFile(previewFilePath);
    //
    res.json(
      createResponse(true, "image uploaded", {
        imagePath: file?.filename,
      })
    );
  } catch (e: any) {
    res.status(400).json(createResponse(false, e.message));
  }
}
//
export async function deleteService(req: Request, res: Response) {
  try {
    const { image_path } = req.params;
    const originalImgPath = path.join(
      __dirname,
      `../../../uploads/orignal/${image_path}`
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
      `../../../uploads/orignal/${imagePath}`
    );

    // Createing a Sharp pipeline to process the image
    let image = sharp(originalImgPath).toFormat(type);
    const imageMetaData = await image.metadata();
    //
    //  setting custom size for big size image
    if (imageMetaData.height && imageMetaData.width) {
      const { height, width } = getWithAndHeith({
        width: imageMetaData.width,
        height: imageMetaData.height,
      });

      image.resize({ width: Math.ceil(width), height: Math.ceil(height) });
    }

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
      `../../../uploads/orignal/${imagePath}`
    );
    //

    // Createing a Sharp pipeline to process the image
    const image = sharp(originalImgPath).toFormat(type);

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

    // applying crop
    if (crop) {
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
      `../../../uploads/orignal/${imagePath}`
    );
    const uploadImagPath = path.join(
      __dirname,
      `../../../uploads/preview/${imagePath}`
    );

    // Createing a Sharp pipeline to process the image
    const image = sharp(originalImgPath);
    const imageMetaData = await image.metadata();

    //  setting custom size for big size image
    if (imageMetaData.height && imageMetaData.width) {
      const { height, width } = getWithAndHeith({
        width: imageMetaData.width,
        height: imageMetaData.height,
      });

      image.resize({ width: Math.ceil(width), height: Math.ceil(height) });
    }

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
