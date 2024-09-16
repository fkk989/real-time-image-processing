import { useImageEditor } from "../context/imageEditorContext";
import { useRedo, useUndo } from "../hooks/undo_redo";
import { TurnArrow } from "./icons/TurnArrow";
import ResoterArrow from "./icons/ResoterArrow";
import clsx from "clsx";
import { useRestoreImage } from "../hooks/image";

export const HistoryManager = () => {
  const { undoStack, redoStack } = useImageEditor();
  const { undo } = useUndo();
  const { redo } = useRedo();
  const { mutation: restore } = useRestoreImage();

  return (
    <div className="absolute left-[20px] bottom-[20px] w-[150px] h-[40px] flex items-center justify-evenly bg-white rounded-full shadow-xl">
      {/* redo undo  */}
      <div className="flex justify-between w-[40%]">
        <TurnArrow
          onClick={(e) => {
            e.preventDefault();
            undo();
          }}
          className={clsx(
            "rotate-[90deg] w-[22px] h-[22px]",
            undoStack.length !== 0
              ? "text-gray-600 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          )}
        />
        <TurnArrow
          onClick={(e) => {
            e.preventDefault();
            redo();
          }}
          className={clsx(
            "rotate_x_90 w-[22px] h-[22px]",
            redoStack.length !== 0
              ? "text-gray-600 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          )}
        />
      </div>
      {/* devider */}
      <div className="w-[1px] h-[80%] bg-[#EFF0F0] text-gray-600"></div>
      <ResoterArrow
        onClick={(e) => {
          e.preventDefault();
          if (undoStack.length === 0 && redoStack.length === 0) {
            return;
          }
          restore.mutate();
        }}
        className={clsx(
          "w-[22px] h-[22px]",
          undoStack.length !== 0 || redoStack.length !== 0
            ? "text-gray-600 cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        )}
      />
    </div>
  );
};
