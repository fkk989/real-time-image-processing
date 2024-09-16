import clsx from "clsx";
import React, { ChangeEvent, CSSProperties } from "react";

interface SliderProp {
  className?: string;
  style?: CSSProperties;
  lable: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  value: number;
}

export const Slider: React.FC<SliderProp> = (prop) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center  gap-[10px] w-full ",
        prop.className
      )}
      style={prop.style}
    >
      <div className="w-[80%] flex justify-between items-center">
        <span className="text-white text-[11px]">{prop.lable}</span>
        <span className="font-semibold text-white text-[11px]">
          {prop.lable === "Rotate" ? `${prop.value} deg` : prop.value}
        </span>
      </div>
      <input
        type="range"
        min={prop.min}
        max={prop.max}
        value={prop.value}
        onChange={prop.onChange}
        className="w-[80%] h-[2px]   rounded-lg  cursor-pointer"
      />
    </div>
  );
};
