import { useMutation } from "@tanstack/react-query";
import {
  ImageContextProp,
  useImageEditor,
} from "../context/imageEditorContext";
import toast from "react-hot-toast";
import axios from "axios";
import { debounce, resetState } from "../lib/helpers";
import { EditType } from "../lib/types";

//
export const useUploadImg = () => {
  //
  const { setImagePath, setLoading } = useImageEditor();
  const mutation = useMutation({
    mutationKey: ["upload-img"],
    mutationFn: async (image: File) => {
      //
      setLoading(true);
      const formData = new FormData();
      formData.append("upload-image", image);

      const data = (await axios.post(`/api/image/upload`, formData)).data;

      return data;
    },
    onSuccess: async (data) => {
      console.log("imagedata", data);
      //
      setImagePath(data.imagePath);

      //
      toast.success("image uploaded", { id: "upload-img" });
      setLoading(false);
      document.getElementById("upload-img-input")?.remove();
    },
    onError: (e) => {
      setLoading(false);
      console.log("upload Errro", e);
      toast.error("error");
    },
  });
  return { mutation };
};

export const editImage = debounce(async function ({
  body,
  setLoading,
  setUndo,
}: {
  body: EditType;
  setLoading: ImageContextProp["setLoading"];
  setUndo: () => void;
}) {
  try {
    setLoading(true);
    const data = (await axios.post("api/image/edit", body)).data;

    if (data.success) {
      setUndo();
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
},
300);
//
export const useRestoreImage = () => {
  const imageContext = useImageEditor();

  const mutation = useMutation({
    mutationKey: ["resotre-img"],
    mutationFn: async () => {
      // dont do anything if undo and redo stack are empty

      imageContext.setLoading(true);
      const data = (
        await axios.post("/api/image/restore", {
          imagePath: imageContext.imagePath,
        })
      ).data;
      return data;
    },
    onSuccess: (data) => {
      resetState(imageContext);
      if (data.success) {
        toast.success("image restored");
      }
      imageContext.setLoading(false);
    },
    onError: (e) => {
      console.log("resoter", e);
      toast.error("error");
      imageContext.setLoading(false);
    },
  });

  return { mutation };
};

//
export const useDownloadImg = () => {
  const imageContext = useImageEditor();
  //
  const reqbody = {
    imagePath: imageContext.imagePath,
    type: imageContext.type,
    brightness: imageContext.brightness,
    contrast: imageContext.contrast,
    rotate: imageContext.rotate,
    crop: imageContext.crop,
  };

  console.log("reqBody", reqbody);
  const mutation = useMutation({
    mutationKey: ["download-image"],
    mutationFn: async () => {
      if (!imageContext.imagePath) {
        return toast.error("please upload a image first", {
          id: "download-img",
        });
      }
      const data = (
        await axios.post("/api/image/download", reqbody, {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        })
      ).data;
      return data;
    },
    onSuccess: (data) => {
      toast.success("image downloaded", { id: "download-img" });
      resetState(imageContext);
      imageContext.setImagePath("");
      console.log("donwload image data", data);
      const blob = data;
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `image.${imageContext.type}`;
      document.body.appendChild(link);
      link.click();

      // Clean up the link and URL object
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      axios
        .delete(`/api/image/delete/${imageContext.imagePath}`)
        .then(({ data }) => {
          if (data.success) {
            resetState(imageContext);
            imageContext.setImagePath("");
          }
          console.log("delete img data", data);
        })
        .catch((error) => {
          console.log("delete img data", error);
        });
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return { mutation };
};
//
