import React, { useRef } from "react";
import user from "~/configs/user";
import { useClickOutside } from "~/hooks"; // 确保你的项目中依然有这个 hook

interface AppleMenuProps {
  logout: () => void;
  shut: (e: React.MouseEvent<HTMLLIElement>) => void;
  restart: (e: React.MouseEvent<HTMLLIElement>) => void;
  sleep: (e: React.MouseEvent<HTMLLIElement>) => void;
  toggleAppleMenu: () => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function AppleMenu({
  logout,
  shut,
  restart,
  sleep,
  toggleAppleMenu,
  btnRef
}: AppleMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 监听点击外部关闭菜单
  useClickOutside(ref, toggleAppleMenu, [btnRef]);

  // 内部封装一个统一风格的 Item，点击后自动关闭菜单
  const Item = ({ children, onClick }: { children: React.ReactNode; onClick?: any }) => (
    <button
      onClick={(e) => {
        if (onClick) onClick(e);
        toggleAppleMenu(); // 点击任意选项后自动收起菜单
      }}
      className="w-full px-3 py-1 text-left text-[13px] rounded-md transition-colors text-white/90 hover:bg-[#0066d6] hover:text-white"
    >
      {children}
    </button>
  );

  // 内部封装一个统一风格的分割线
  const Divider = () => <div className="h-[1px] bg-white/10 my-1 mx-2"></div>;

  return (
    <div
      ref={ref}
      className="absolute top-full left-2 mt-[2px] w-56 rounded-lg p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100 origin-top-left z-[2001]"
      style={{
        backgroundColor: 'rgba(30, 30, 30, 0.75)',
        backdropFilter: 'saturate(200%) blur(40px)',
        WebkitBackdropFilter: 'saturate(200%) blur(40px)',
        border: '0.5px solid rgba(255,255,255,0.15)'
      }}
    >
      <div className="flex flex-col">
        <Item>About This Mac</Item>
        <Divider />
        
        <Item>System Preferences...</Item>
        <Item>App Store...</Item>
        <Divider />
        
        <Item>Recent Items</Item>
        <Divider />
        
        <Item>Force Quit...</Item>
        <Divider />
        
        <Item onClick={sleep}>Sleep</Item>
        <Item onClick={restart}>Restart...</Item>
        <Item onClick={shut}>Shut Down...</Item>
        <Divider />
        
        <Item onClick={logout}>Lock Screen</Item>
        <Item onClick={logout}>Log Out {user.name}...</Item>
      </div>
    </div>
  );
}