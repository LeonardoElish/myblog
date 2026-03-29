import React from "react";

interface MenuItemProps {
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

interface MenuItemGroupProps {
  border?: boolean;
  children: React.ReactNode;
}

const MenuItem = (props: MenuItemProps) => {
  return (
    <li
      onClick={props.onClick}
      className={`
        group relative px-2 mx-1.5 py-1 rounded-md flex items-center justify-between
        transition-all duration-75 cursor-default
        ${props.disabled 
          ? "opacity-40 pointer-events-none" 
          : "hover:bg-[#007aff] hover:text-white text-gray-800 dark:text-gray-200"
        }
      `}
    >
      <span className="flex items-center gap-2">
        {/* 这里将来可以扩展图标 */}
        {props.children}
      </span>
      
      {/* 模拟 macOS 菜单的右侧小箭头或快捷键提示（可选） */}
      {/* <span className="text-[10px] opacity-50 group-hover:text-white">⌘N</span> */}
    </li>
  );
};

const MenuItemGroup = (props: { border?: boolean; children: React.ReactNode }) => {
  return (
    <ul className={`
      relative py-0.5
      ${props.border ? "border-b border-black/5 dark:border-white/5 mb-0.5 pb-1" : ""}
    `}>
      {props.children}
    </ul>
  );
};

export { MenuItem, MenuItemGroup };