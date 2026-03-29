import React, { useState, useMemo } from 'react';
import { useStore } from '~/stores';

// --- 辅助组件：单个桌面图标 (保持简单，只负责展示和触发事件) ---
function DesktopFileIcon({ name, type, size, onDoubleClick }: any) {
  const [isHover, setIsHover] = useState(false);
  const [uuid] = useState(() => crypto.randomUUID());
  
  const focusId = useStore((state) => state.currentFocus);
  const setFocus = (id: string) => useStore.getState().setFocus(id);

  const isFocused = focusId === uuid;

  // 🌟 单击：设置焦点
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFocus(uuid);
  };

  // 🌟 双击：直接调用父组件传进来的函数
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(); 
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="pt-2 pb-1 px-2 flex flex-col items-center relative transition-all rounded-md hover:bg-white/10"
      style={{ width: "80px", height: "90px", zIndex: isHover ? 50 : "auto" }}
    >
      <img 
        src={type === 0 ? "/img/icons/folder.png" : "/img/icons/text.png"} 
        className={`drop-shadow-md ${type === 0 ? 'w-11' : 'w-9'}`} 
        alt="icon" 
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <div className="mt-1 w-[76px] flex justify-center">
        <span className={`leading-tight py-0.5 px-1 rounded-sm text-[11px] text-center line-clamp-2 break-all ${isFocused ? 'bg-blue-500 text-white' : 'text-white drop-shadow-md'}`}>
          {name}
        </span>
      </div>
    </div>
  );
}

// --- 主组件：桌面图标容器 (在这里进行路由分发) ---
export default function DesktopFileGrid({ filemap = [] }: { filemap: any[] }) {
  const openApp = useStore((state) => state.openApp);

  const sortedFiles = useMemo(() => {
    return [...filemap].map(item => ({
      ...item,
      mode: item.children === undefined ? 1 : 0 // 0是文件夹，1是文件
    })).sort((a, b) => {
      if (a.mode !== b.mode) return a.mode - b.mode;
      return a.name.localeCompare(b.name);
    });
  }, [filemap]);

  // 🌟 核心分发逻辑
  const handleDoubleClick = (item: any) => {
    document.body.style.cursor = 'progress';
    
    setTimeout(() => {
      document.body.style.cursor = 'default';
      
      if (item.mode === 0) {
        // 1. 文件夹 -> 打开 Explorer
        openApp('explorer', { openpath: [item.name] });
      } else {
        // 2. 文件 -> 根据后缀名分发
        const ext = item.name.split('.').pop()?.toLowerCase();
        const payload = { filesrc: item.path, filename: item.name, size: item.size };

        if (ext === 'md') {
          openApp('typora', payload); // 🌟 调用 Typora
        } else if (ext === 'cpp' || ext === 'h' || ext === 'ts' || ext === 'js') {
          openApp('vscode', payload); // 🌟 调用 VSCode
        } else {
          openApp('finder', payload); // 🌟 默认预览组件
        }
      }
    }, 200);
  };

  return (
    <div className="w-full h-full flex flex-col flex-wrap content-start p-2 gap-2 pointer-events-none">
      {sortedFiles.map((item) => (
        <div key={item.fileuuid} className="pointer-events-auto">
          <DesktopFileIcon
            name={item.name}
            type={item.mode}
            size={item.size}
            onDoubleClick={() => handleDoubleClick(item)}
          />
        </div>
      ))}
    </div>
  );
}