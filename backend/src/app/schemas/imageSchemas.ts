import { z } from "zod";

const imageSchema = z.object({
  type: z.enum(["jpeg", "png"], {
    message: "image type can only be jpeg or png",
  }),
  brightness: z
    .number()
    .min(-100)
    .max(100, { message: "brightness should be 0-100" }),
  contrast: z
    .number()
    .min(-100)
    .max(200, { message: "contrast should be 0-100" }),
  rotate: z
    .number()
    .nonnegative({ message: "rotate angle cannot be negative" })
    .max(360, { message: "rotate angle should be 0-360" }),
  crop: z
    .object({
      width: z
        .number({ required_error: "width is required" })
        .nonnegative({ message: "widht cannot be negative" }),
      height: z
        .number({ required_error: "height is required" })
        .nonnegative({ message: "height cannot be negative" }),
      top: z
        .number({ required_error: "top offset is required" })
        .nonnegative({ message: "top offset cannot be negative" }),
      left: z
        .number({ required_error: "left offset is required" })
        .nonnegative({ message: "left offset cannot be negative" }),
    })
    .nullable(),
});

export const restoreScheme = z.object({
  imagePath: z.string(),
});

export const reqBodyImageSchema = imageSchema.merge(restoreScheme);

export type ImageSizeType = "small" | "medium" | "big" | "xl" | "xxl";
