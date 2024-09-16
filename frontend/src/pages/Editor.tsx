import { useImageEditor } from "../context/imageEditorContext";
import { Sidebar } from "../components/Sidebar";
import { ArrowDown } from "../components/icons";
import { HistoryManager } from "../components/HistoryManager";
import { useDownloadImg } from "../hooks/image";
import ImageUploader from "../components/ImageUploader";

export const Editor = () => {
  const { imagePath, loading } = useImageEditor();
  const { mutation: downloadImage } = useDownloadImg();
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-screen h-[70px] bg-[#1E1F22] flex items-center justify-between px-[20px]">
        <div className="w-full flex justify-center">
          <h1 className="pink-gradient bg-clip-text text-[30px] font-bold tracking-wider translate-x-[150px]">
            Editor
          </h1>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            downloadImage.mutate();
          }}
          className="w-[150px] h-[40px] flex items-center justify-center gap-[10px] rounded-full bg-[#2D7CFA] hover:bg-[#2d7cfacd]"
        >
          <ArrowDown className="w-[18px] h-[18px] text-white" />
          <p className="text-white text-[18px] font-[300]">Download</p>
        </button>
      </div>
      <div className="w-full h-full flex">
        <Sidebar />
        <div className="relative w-full h-full flex justify-center items-center bg-[#F0F1F2]">
          {imagePath ? (
            <>
              {!loading ? (
                <img
                  src={`/api/image/${imagePath}?${Date.now()}`}
                  alt={imagePath}
                />
              ) : (
                <div className="relative w-fit h-fit">
                  <img
                    src={`/api/image/${imagePath}`}
                    alt={""}
                    className="w-full h-full"
                  />
                  <div className="absolute top-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.5)]">
                    <div className="w-[100px] h-[100px] rounded-full border-[3px] border-white border-r-[0] animate-spin"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ImageUploader />
          )}
          {/* HistoryManager */}
          <HistoryManager />
        </div>
      </div>
    </div>
  );
};
