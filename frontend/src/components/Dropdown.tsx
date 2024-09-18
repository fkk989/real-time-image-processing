import React, { createContext, CSSProperties, useContext } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

const DropdownMenuContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
} | null>(null);

const Root: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}> = ({ children, className, style, isOpen, setIsOpen }) => {
  //
  const toggle = () => setIsOpen((crnt) => !crnt);
  const close = () => setIsOpen(false);
  //
  const { ref } = useClickOutside(close);
  return (
    <DropdownMenuContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const Trigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toggle } = useContext(DropdownMenuContext)!;

  return (
    <button onClick={toggle} style={{ backgroundColor: "transparent" }}>
      {children}
    </button>
  );
};

const Content: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}> = ({ children, className, style }) => {
  const { isOpen } = useContext(DropdownMenuContext)!;

  if (!isOpen) return null;

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
};
