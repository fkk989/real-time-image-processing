import toast from "react-hot-toast";
import { useImageEditor } from "../context/imageEditorContext";
import { EditType } from "../lib/types";
import axios from "axios";

// Function to undo last change
export const useUndo = () => {
  //

  const {
    undoStack,
    setUndoStack,
    setRedoStack,
    imagePath,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    rotate,
    setRotate,
    crop,
    setCrop,
    type,
    setLoading,
  } = useImageEditor();
  //
  function setUndo() {
    const tempUndo: EditType = {
      type,
      imagePath,
      brightness,
      contrast,
      rotate,
      crop,
    };

    setUndoStack((pre) => {
      const newUndoState = [...pre, tempUndo];

      return newUndoState;
    });
  }

  async function undo() {
    // setting loading
    //

    if (undoStack.length === 0) {
      return;
    }

    setLoading(true);

    const latestUndo = undoStack[undoStack.length - 1];
    const last2ndUndo = undoStack[undoStack.length - 2] || {
      type: latestUndo.type,
      imagePath,
      brightness: 0,
      contrast: 0,
      rotate: 0,
      crop: null,
    };
    // setting preview image to latest preview image
    last2ndUndo.imagePath = imagePath;
    try {
      //
      const data = (await axios.post("/api/image/edit", last2ndUndo)).data;
      if (data.success) {
        setLoading(false);

        // setting all image property state success

        setBrightness(last2ndUndo.brightness);
        setContrast(last2ndUndo.contrast);
        setRotate(last2ndUndo.rotate);
        setCrop(last2ndUndo.crop);

        // remove last undo object
        setUndoStack(undoStack.slice(0, -1));

        setRedoStack((pre) => {
          const newRedoState = [...pre, latestUndo];
          return newRedoState;
        });
      }
      //
    } catch (error: any) {
      //
      setLoading(false);
      console.log("undo error", error);
      const errMsg = error.response.data.message;
      toast.error(errMsg || "Error", {
        id: "update-brightness",
      });
      //
    }
  }

  return { setUndo, undo };
};

//  Function to redo the undo
export const useRedo = () => {
  const {
    imagePath,
    setUndoStack,
    redoStack,
    setRedoStack,
    setBrightness,
    setContrast,
    setRotate,
    setCrop,
    setLoading,
  } = useImageEditor();

  async function redo() {
    if (redoStack.length === 0) {
      return;
    }
    setLoading(true);
    const lastRedo = redoStack[redoStack.length - 1];
    lastRedo.imagePath = imagePath;
    try {
      //
      const data = (await axios.post("/api/image/edit", lastRedo)).data;
      if (data.success) {
        setLoading(false);
        // setting all image property state success
        setBrightness(lastRedo.brightness);
        setContrast(lastRedo.contrast);
        setRotate(lastRedo.rotate);
        setCrop(lastRedo.crop);
        //
        // insert last change into undo stack
        setUndoStack((pre) => {
          const newRedoState = [...pre, lastRedo];
          return newRedoState;
        });

        //  remve obj form redoStack
        setRedoStack(redoStack.slice(0, -1));
      }
      //
    } catch (error: any) {
      setLoading(false);
      const errMsg = error.response.data.message;
      toast.error(errMsg || "Error", {
        id: "update-brightness",
      });
      //
    }
  }

  return { redo };
};
