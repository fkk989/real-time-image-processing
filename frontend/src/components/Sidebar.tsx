import { Slider } from "./Slider";
import { useImageEditor } from "../context/imageEditorContext";
import { EditType } from "../lib/types";
import { editImage } from "../hooks/image";
import { useUndo } from "../hooks/undo_redo";
import toast from "react-hot-toast";

export const Sidebar = () => {
  //
  const {
    type,
    imagePath,
    crop,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    rotate,
    setRotate,
    setLoading,
    setIsCroping,
  } = useImageEditor();

  const { setUndo } = useUndo();

  const reqBody: EditType = {
    imagePath,
    brightness,
    contrast,
    rotate,
    crop,
    type,
  };

  return (
    <div className="w-[350px] h-full flex flex-col items-center gap-[20px] bg-[#2B2C2F]">
      {/* brightness & color */}
      <div className="w-full flex flex-col items-center mt-[50px]">
        <h3 className="text-white text-[13px]">Brightness & color</h3>
        <div className="w-full flex flex-col gap-[20px]">
          {/* birghtness */}
          <Slider
            className="mt-[20px]"
            lable="Brightness"
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setBrightness(value);
              reqBody.brightness = value;
              editImage({ body: reqBody, setLoading, setUndo });
            }}
            min={-100}
            max={100}
            value={brightness}
          />
          {/* contrast */}
          <Slider
            className="mt-[20px]"
            lable="Contrast"
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setContrast(value);
              reqBody.contrast = value;
              editImage({ body: reqBody, setLoading, setUndo });
            }}
            min={-100}
            max={100}
            value={contrast}
          />
        </div>
      </div>
      {/* size */}
      <div className="w-full flex flex-col items-center mt-[50px]">
        <h3 className="text-white text-[13px]">Size</h3>
        <div className="w-full flex flex-col items-center ">
          {/* crop */}
          <button
            onClick={() => {
              if (!imagePath) return toast.error("please upload a image");
              setIsCroping(true);
            }}
            className={
              "flex items-center w-[80%] h-[30px] text-white text-[13px] cursor-pointer hover:bg-[#ffffff2d] pl-[2px] rounded-md"
            }
          >
            Crop
          </button>
          {/* rotate */}
          <Slider
            className="mt-[20px]"
            lable="Rotate"
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setRotate(value);
              reqBody.rotate = value;
              editImage({ body: reqBody, setLoading, setUndo });
            }}
            min={0}
            max={360}
            value={rotate}
          />
        </div>
      </div>
    </div>
  );
};
