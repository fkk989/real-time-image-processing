import { createContext, SetStateAction, useContext, useState } from "react";
import { EditType } from "../lib/types";

export interface ImageContextProp {
  imagePath: string;
  setImagePath: React.Dispatch<SetStateAction<ImageContextProp["imagePath"]>>;
  type: "jpeg" | "png";
  setType: React.Dispatch<React.SetStateAction<ImageContextProp["type"]>>;
  brightness: number;
  setBrightness: React.Dispatch<
    React.SetStateAction<ImageContextProp["brightness"]>
  >;
  contrast: number;
  setContrast: React.Dispatch<
    React.SetStateAction<ImageContextProp["contrast"]>
  >;
  rotate: number;
  setRotate: React.Dispatch<React.SetStateAction<ImageContextProp["rotate"]>>;
  isCroping: boolean;
  setIsCroping: React.Dispatch<
    React.SetStateAction<ImageContextProp["isCroping"]>
  >;
  crop: {
    width: number;
    height: number;
    top: number;
    left: number;
  } | null;
  setCrop: React.Dispatch<React.SetStateAction<ImageContextProp["crop"]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  undoStack: EditType[] | [];
  setUndoStack: React.Dispatch<
    React.SetStateAction<ImageContextProp["undoStack"]>
  >;
  redoStack: EditType[] | [];
  setRedoStack: React.Dispatch<
    React.SetStateAction<ImageContextProp["redoStack"]>
  >;
}

const ImageEditorContext = createContext<ImageContextProp | null>(null);

export const ImageEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // undo and redo stack
  const [undoStack, setUndoStack] = useState<ImageContextProp["undoStack"]>([]);
  const [redoStack, setRedoStack] = useState<ImageContextProp["redoStack"]>([]);
  //
  const [imagePath, setImagePath] = useState("");
  const [type, setType] = useState<ImageContextProp["type"]>("jpeg");
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState<ImageContextProp["crop"]>(null);
  const [isCroping, setIsCroping] =
    useState<ImageContextProp["isCroping"]>(false);
  //
  return (
    <ImageEditorContext.Provider
      value={{
        undoStack,
        setUndoStack,
        redoStack,
        setRedoStack,
        imagePath,
        setImagePath,
        type,
        setType,
        brightness,
        setBrightness,
        contrast,
        setContrast,
        rotate,
        setRotate,
        isCroping,
        setIsCroping,
        crop,
        setCrop,
        loading,
        setLoading,
      }}
    >
      {children}
    </ImageEditorContext.Provider>
  );
};

export const useImageEditor = () => {
  const context = useContext(ImageEditorContext)!;
  return context;
};
