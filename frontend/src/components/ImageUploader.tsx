import { handleImgInput } from "../lib/helpers";
import { useUploadImg } from "../hooks/image";

const ImageUploader = () => {
  const { mutation } = useUploadImg();
  return (
    <div className="w-full h-full flex  justify-center items-center gap-[10px]">
      <div className="w-[600px] h-[400px] flex flex-col gap-[20px] justify-center items-center bg-white border-[1px] border-dashed border-gray-400 rounded-md">
        <h2 className="text-[40px]">Upload Image</h2>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleImgInput(mutation);
          }}
          className="w-[200px] h-[50px] flex justify-center items-center bg-cyan-700 hover:bg-cyan-600 text-white text-[30px] rounded-md"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
