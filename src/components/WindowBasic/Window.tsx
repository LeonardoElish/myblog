import React, { useState, useEffect } from 'react';
import { Rnd } from "react-rnd"; 
import { useStore } from "~/stores";

interface WindowProps {
  id: string;
  title?: string;
  zindex?: number;
  minimized?: boolean;
  maximized?: boolean;
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export default function Window({ 
  id, 
  title = "Window", 
  zindex = 50, 
  minimized = false, 
  maximized = false,
  width = 700,
  height = 500,
  children 
}: WindowProps) {
  const store = useStore();
  
  // 1. 窗口尺寸与位置状态
  const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState({ width, height });
  const [pos, setPos] = useState({
    x: (window.innerWidth - width) / 2 + (Math.random() * 40 - 20),
    y: (window.innerHeight - height) / 2 + (Math.random() * 40 - 20)
  });

  useEffect(() => {
    const handleResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (minimized) return null;

  const TOP_BAR_HEIGHT = 30;

  return (
    <Rnd
      size={{ 
        width: maximized ? winSize.w : size.width, 
        height: maximized ? winSize.h - TOP_BAR_HEIGHT : size.height 
      }}
      position={{ 
        x: maximized ? 0 : pos.x, 
        y: maximized ? TOP_BAR_HEIGHT : pos.y 
      }}
      
      // 🌟 核心：强制开启所有方向的缩放
      enableResizing={!maximized ? {
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
      } : false}

      // 🌟 核心：加厚缩放感应区。让透明的手柄向外延伸，防止被圆角裁掉
      resizeHandleStyles={{
        right: { width: '10px', right: '-5px', cursor: 'ew-resize' },
        bottom: { height: '10px', bottom: '-5px', cursor: 'ns-resize' },
        bottomRight: { width: '20px', height: '20px', right: '-10px', bottom: '-10px', cursor: 'nwse-resize' },
        left: { width: '10px', left: '-5px', cursor: 'ew-resize' },
        top: { height: '10px', top: '-5px', cursor: 'ns-resize' },
      }}

      // 给手柄强制加一个高层级，防止被 children 内容覆盖
      resizeHandleClasses={{
        right: "z-[999]",
        bottom: "z-[999]",
        bottomRight: "z-[999]",
        left: "z-[999]",
        top: "z-[999]"
      }}

      minWidth={300}
      minHeight={200}
      
      onDragStop={(e, d) => { if (!maximized) setPos({ x: d.x, y: d.y }); }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({ 
          width: parseInt(ref.style.width), 
          height: parseInt(ref.style.height) 
        });
        setPos(position);
      }}

      dragHandleClassName="window-header"
      disableDragging={maximized}
      style={{ zIndex: zindex, position: 'fixed' }}
      onMouseDown={() => store.setFocus(id)}
    >
      {/* 🌟 容器层：overflow 必须设为 visible，否则 Rnd 溢出的手柄会被裁掉导致点不动 */}
      <div className={`
        flex flex-col w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl
        shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/10 dark:border-white/10
        ${maximized ? 'rounded-none' : 'rounded-xl'}
        transition-[border-radius] duration-300 relative overflow-visible
      `}>
        
        {/* --- 标题栏 (Header) --- */}
        <div 
          className="window-header h-10 flex-none flex items-center justify-center relative bg-gray-100/40 dark:bg-gray-800/40 border-b border-black/5 select-none rounded-t-xl"
          onDoubleClick={() => store.maximizeApp(id)}
        >
          {/* 红绿灯按钮 */}
          <div className="absolute left-4 flex items-center space-x-2 z-[100]" onDoubleClick={(e) => e.stopPropagation()}>
            <button 
              onClick={(e) => { e.stopPropagation(); store.closeApp(id); }}
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:brightness-90 transition-all"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); store.minimizeApp(id); }}
              className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-[#d8a124] hover:brightness-90 transition-all"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); store.maximizeApp(id); }}
              className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aab29] hover:brightness-90 transition-all"
            />
          </div>

          <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200 opacity-80">
            {title}
          </span>
        </div>

        {/* --- 内容区 (Content) --- */}
        <div className="flex-grow w-full relative overflow-hidden rounded-b-xl">
          {/* 使用 absolute 铺满，并开启滚动 */}
          <div className="absolute inset-0 overflow-auto custom-scrollbar">
            {children}
          </div>
        </div>

      </div>
    </Rnd>
  );
}