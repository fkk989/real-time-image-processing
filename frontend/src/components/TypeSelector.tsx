import { DropdownMenu } from "./Dropdown";
import { useState } from "react";
import { clsx } from "clsx";
import { Check, ChevronDown } from "./icons";
import { editImage } from "../hooks/image";
import {
  ImageContextProp,
  useImageEditor,
} from "../context/imageEditorContext";
import { EditType } from "../lib/types";
import { useUndo } from "../hooks/undo_redo";
import toast from "react-hot-toast";

export const TypeSelector = ({ body }: { body: EditType }) => {
  //
  const [open, setOpen] = useState(false);
  const {
    type: selectedType,
    setType,
    setLoading,
    imagePath,
  } = useImageEditor();
  const { setUndo } = useUndo();
  const types: ImageContextProp["type"][] = ["jpeg", "png"];
  //l
  return (
    <DropdownMenu.Root
      isOpen={open}
      setIsOpen={setOpen}
      className="flex items-center gap-[10px] justify-center mt-[30px]"
    >
      <div className="text-white">Image format</div>
      <div className="relative flex flex-col items-center">
        {/* trigger */}
        <DropdownMenu.Trigger>
          <div className="w-[100px] h-[30px] flex items-center justify-between border-purple-800 border-[1px] bg-white hover:bg-[#EBE9DF] rounded-lg box-border px-[10px]">
            <div>{open ? "" : imagePath ? selectedType : "None"}</div>
            <ChevronDown
              className={clsx(
                "w-[20px] h-[20px] rotate-0 transition-all duration-300 ease-out",
                open && "rotate-[-180deg]"
              )}
            />
          </div>
        </DropdownMenu.Trigger>

        {/* content */}
        <DropdownMenu.Content className="absolute top-[40px]">
          <ul className=" w-[100px]  flex flex-col items-center gap-[10px] bg-[#E8E8E8] py-[10px] px-[5px] rounded-md overflow-scroll">
            {open &&
              types.map((type) => {
                return (
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      if (!imagePath)
                        return toast.error("please upload a image");
                      const reqBody: EditType = { ...body, type };

                      if (selectedType !== type) {
                        editImage({ body: reqBody, setLoading, setUndo });
                      }
                      setType(type);
                      setOpen(false);
                    }}
                    key={type}
                    className={clsx(
                      `group relative w-full flex justify-center  items-center gap-[10px] rounded-lg hover:bg-[#44A1FF] hover:text-white cursor-pointer`,
                      selectedType === type && imagePath && "text-[#969393]"
                    )}
                  >
                    {selectedType === type && imagePath && (
                      <Check className="absolute left-[5px] group-hover:text-white w-[15px] h-[15px] text-[#969393]" />
                    )}
                    {type}
                  </li>
                );
              })}
          </ul>
        </DropdownMenu.Content>
      </div>
    </DropdownMenu.Root>
  );
};
