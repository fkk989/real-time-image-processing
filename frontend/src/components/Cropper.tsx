import { useEffect, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useImageEditor } from "../context/imageEditorContext";
import { editImage } from "../hooks/image";
import { useUndo } from "../hooks/undo_redo";
import { EditType } from "../lib/types";
//
export const ImageCropper = () => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const {
    imagePath,
    setCrop: setMainCrop,
    crop: mainCrop,
    brightness,
    contrast,
    rotate,
    type,
    setLoading,
    setIsCroping,
  } = useImageEditor();
  //
  const { setUndo } = useUndo();
  //
  useEffect(() => {
    console.log("mainCrop", mainCrop);
  }, [mainCrop]);
  //

  //
  const reqBody: EditType = {
    imagePath,
    brightness,
    contrast,
    rotate,
    crop: mainCrop,
    type,
  };
  //
  return (
    <div className="flex flex-col items-center gap-[30px]">
      <ReactCrop
        crop={crop}
        onChange={(c) => {
          setMainCrop({
            left: Math.floor(c.x),
            top: Math.floor(c.y),
            width: Math.floor(c.width),
            height: Math.floor(c.height),
          });
          setCrop(c);
        }}
      >
        <img src={`/api/image/${imagePath}?${Date.now()}`} alt={imagePath} />
      </ReactCrop>
      {/*  */}
      <div className="flex items-center gap-[30px]">
        <button
          onClick={() => {
            setMainCrop(null);
            setIsCroping(false);
          }}
          className="w-[100px] h-[40px] bg-[tomato] hover:bg-red-400 rounded-full text-white font-bold text-[15px]"
        >
          Cancel
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsCroping(false);
            editImage({ body: reqBody, setLoading, setUndo });
          }}
          className="w-[100px] h-[40px] bg-[#2D7CFA] hover:bg-[#2d7cfacd] rounded-full text-white font-bold text-[15px]"
        >
          Save
        </button>
      </div>
    </div>
  );
};
