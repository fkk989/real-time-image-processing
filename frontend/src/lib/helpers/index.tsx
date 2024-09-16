import toast from "react-hot-toast";
import { ImageContextProp } from "../../context/imageEditorContext";
import { v4 as uuidv4 } from "uuid";
export function debounce<T extends (...args: any) => any>(
  cb: T,
  delay: number
): (...args: Parameters<T>) => ReturnType<T> | void {
  let timeout: any;

  return (...args): any => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export const handleImgInput = async (uploadImgMutation: any) => {
  //

  //
  const imgInput = document.createElement("input");
  imgInput.setAttribute("id", "upload-img-input");
  imgInput.setAttribute("type", "file"),
    imgInput.setAttribute("accept", "image/jpeg, image/png");
  imgInput.addEventListener("change", () => {
    const selectedImg: File | null | undefined = imgInput.files?.item(0);
    if (!selectedImg) {
      return toast.error("please select a image");
    }
    uploadImgMutation.mutate(selectedImg);
  });
  imgInput.click();
};

export function resetState(useImageEditor: ImageContextProp) {
  const {
    setBrightness,
    setContrast,
    setRotate,
    setCrop,
    setUndoStack,
    setRedoStack,
  } = useImageEditor;
  setBrightness(0);
  setContrast(0);
  setRotate(0);
  setCrop(null);
  setUndoStack([]);
  setRedoStack([]);
}

export const generateUUID = () => {
  const newUUID = uuidv4();
  return newUUID;
};
