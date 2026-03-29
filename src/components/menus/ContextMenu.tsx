import React, { useRef } from "react";
import { useStore } from "~/stores";
import { useClickOutside } from "~/hooks";
import { MenuItem, MenuItemGroup } from "./base"; // 确保路径正确

export default function ContextMenu() {
  const { contextMenu, setContextMenu } = useStore((state) => ({
    contextMenu: state.contextMenu,
    setContextMenu: state.setContextMenu
  }));

  const ref = useRef<HTMLDivElement>(null);

  // 点击外部自动关闭
  useClickOutside(ref, () => {
    if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
  }, []);

  if (!contextMenu.show) return null;

  // 简单的边缘检测，防止菜单掉出屏幕右侧或下方
  let x = contextMenu.x;
  let y = contextMenu.y;
  const menuWidth = 224; // w-56
  if (x + menuWidth > window.innerWidth) x -= menuWidth;
  if (y + 200 > window.innerHeight) y -= 180;

  return (
    <div
      ref={ref}
      className="fixed z-[9999] w-[180px] py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] 
               rounded-xl border border-white/20 bg-white/70 dark:bg-[#2c2c2c]/70 
               backdrop-blur-2xl text-[13px] select-none overflow-hidden"
      style={{ top: y, left: x }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 动态渲染 Group 和 Item */}
      {(() => {
        const groups: any[][] = [[]];
        contextMenu.items.forEach((item) => {
          if (item.divider) groups.push([]);
          else groups[groups.length - 1].push(item);
        });

        return groups.map((group, gIdx) => (
          group.length > 0 && (
            <MenuItemGroup key={gIdx} border={gIdx !== groups.length - 1}>
              {group.map((item, iIdx) => (
                <MenuItem
                  key={iIdx}
                  onClick={(e) => {
                    if (item.disabled) return;
                    item.onClick?.(e);
                    setContextMenu({ ...contextMenu, show: false });
                  }}
                >
                  <span className={item.disabled ? "opacity-35" : ""}>
                    {item.title}
                  </span>
                </MenuItem>
              ))}
            </MenuItemGroup>
          )
        ));
      })()}
    </div>
  );
}