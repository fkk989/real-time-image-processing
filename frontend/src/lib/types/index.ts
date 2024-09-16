import { ImageContextProp } from "../../context/imageEditorContext";

export type ImagePropertyTypes = "brightness" | "contrast" | "rotate" | "crop";

export type LogoProps = React.ComponentProps<"svg">;

export type EditType = Omit<
  ImageContextProp,
  | "setImagePath"
  | "setType"
  | "setBrightness"
  | "setContrast"
  | "setRotate"
  | "setCrop"
  | "loading"
  | "setLoading"
  | "undoStack"
  | "setUndoStack"
  | "redoStack"
  | "setRedoStack"
>;

export type ImageSizeType = "big" | "small" | "medium" | "jumbo";
