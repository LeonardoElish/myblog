import React, { useState, useMemo } from 'react';
import { useStore } from '~/stores';
import { ChevronLeft, ChevronRight, Home, HardDrive, Clock } from 'lucide-react';

export default function Explorer({ filemap = [], openpath = [] }: any) {
  const [currentPath, setCurrentPath] = useState<string[]>(openpath);
  const [selectedId, setSelectedId] = useState<string | null>(null); // 🌟 增加选中状态
  const openApp = useStore(state => state.openApp);

  // 1. 解析当前路径下的文件列表 (逻辑保持不变)
  const currentDirItems = useMemo(() => {
    let curr = filemap;
    for (const seg of currentPath) {
      const found = curr.find((f: any) => f.name === seg && f.children);
      if (found) curr = found.children;
      else return [];
    }
    return [...curr].sort((a: any, b: any) => {
      const aFolder = a.children !== undefined;
      const bFolder = b.children !== undefined;
      if (aFolder !== bFolder) return aFolder ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [filemap, currentPath]);

  // 2. 处理双击打开
  const handleDoubleClick = (item: any) => {
    if (item.children) {
      setCurrentPath([...currentPath, item.name]);
      setSelectedId(null);
    } else {
      const ext = item.name.split('.').pop()?.toLowerCase();
      const payload = { filesrc: item.path, filename: item.name, size: item.size };

      if (ext === 'md') {
        openApp('typora', payload);
      } else if (ext === 'cpp' || ext === 'h') {
        openApp('vscode', payload);
      } else {
        openApp('finder', payload);
      }
    }
  };

  const goBack = () => {
    if (currentPath.length > 0) setCurrentPath(p => p.slice(0, -1));
  };

  return (
    <div 
      className="flex flex-col h-full w-full bg-white dark:bg-gray-900 select-none overflow-hidden"
      onClick={() => setSelectedId(null)} // 点击空白处取消选中
    >
      {/* 顶部工具栏 */}
      <div className="h-10 flex items-center px-4 gap-2 bg-gray-100/80 dark:bg-gray-800/80 border-b border-black/5 dark:border-white/5 backdrop-blur-md">
        <div className="flex gap-1 mr-2">
          <button 
            onClick={(e) => { e.stopPropagation(); goBack(); }} 
            disabled={currentPath.length === 0}
            className={`p-1 rounded ${currentPath.length > 0 ? 'hover:bg-black/10' : 'opacity-30'}`}
          >
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 opacity-30"><ChevronRight size={16} /></button>
        </div>
        
        {/* 面包屑导航 */}
        <div className="flex items-center text-xs overflow-hidden h-6">
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentPath([]); }} 
            className="flex items-center px-2 py-0.5 hover:bg-black/10 rounded transition-colors"
          >
            <Home size={12} className="mr-1.5 opacity-60"/> Desktop
          </button>
          {currentPath.map((seg, i) => (
            <React.Fragment key={i}>
              <span className="mx-0.5 opacity-30">/</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentPath(currentPath.slice(0, i + 1)); }} 
                className="px-2 py-0.5 hover:bg-black/10 rounded truncate"
              >
                {seg}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex grow min-h-0">
        {/* 侧边栏 */}
        <div className="w-40 flex-none border-r border-black/5 dark:border-white/5 p-2 flex flex-col gap-0.5 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
           <div className="px-2 py-1.5 opacity-40 text-[10px] font-bold uppercase mb-1 mt-2 tracking-wider">Favorites</div>
           <div className="px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-xs flex items-center gap-2 opacity-50"><Clock size={14}/> Recent</div>
           <div 
            onClick={(e) => { e.stopPropagation(); setCurrentPath([]); }} 
            className={`px-2 py-1.5 rounded text-xs flex items-center gap-2 cursor-pointer ${currentPath.length === 0 ? 'bg-blue-500/15 text-blue-600 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
           >
             <Home size={14}/> Desktop
           </div>
           <div className="px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-xs flex items-center gap-2 opacity-60"><HardDrive size={14}/> Macintosh HD</div>
        </div>

        {/* 列表区 */}
        <div className="flex-grow flex flex-col bg-white dark:bg-gray-900">
          <div className="flex px-4 py-1.5 border-b border-black/5 dark:border-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            <div className="w-1/2">Name</div>
            <div className="w-1/4">Date Modified</div>
            <div className="w-1/4">Size</div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-1 custom-scrollbar">
            {currentDirItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <img src="/img/icons/folder.png" className="w-16 grayscale mb-2" alt="empty" />
                <span className="text-sm">Empty Folder</span>
              </div>
            ) : (
              currentDirItems.map((item: any) => (
                <div 
                  key={item.fileuuid} 
                  onClick={(e) => { e.stopPropagation(); setSelectedId(item.fileuuid); }} // 单击选中
                  onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(item); }} 
                  className={`group flex items-center px-3 py-1 rounded-md text-[13px] cursor-default transition-colors mb-[1px]
                    ${selectedId === item.fileuuid 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-blue-500/10 dark:hover:bg-blue-500/20 text-gray-700 dark:text-gray-200'}
                  `}
                >
                  <div className="w-1/2 flex items-center gap-3">
                    <img 
                      src={item.children ? "/img/icons/folder.png" : "/img/icons/text.png"} 
                      className={`select-none ${item.children ? 'w-5' : 'w-4 ml-0.5'}`}
                      alt="icon" 
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className={`w-1/4 text-xs font-mono ${selectedId === item.fileuuid ? 'text-blue-100' : 'opacity-60'}`}>Today 10:17</div>
                  <div className={`w-1/4 text-xs font-mono ${selectedId === item.fileuuid ? 'text-blue-100' : 'opacity-60'}`}>
                    {item.children ? '--' : (item.size > 1024 ? `${(item.size/1024).toFixed(1)} KB` : `${item.size} B`)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}