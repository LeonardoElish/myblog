import React from 'react';
import { useStore } from '~/stores';

export default function MessageCenter() {
  const showSideBar = useStore((state) => state.showSideBar);
  const closeSideBar = useStore((state) => state.closeSideBar);

  return (
    <>
      {showSideBar && <div className="fixed inset-0 z-[9998]" onClick={closeSideBar} />}
      <div 
        className={`fixed top-4 bottom-4 left-4 w-[350px] z-[9999] rounded-2xl shadow-2xl transition-all duration-500 flex flex-col bg-white/70 dark:bg-gray-800/70 backdrop-blur-3xl border border-white/20
          ${showSideBar ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'}`}
      >
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Message Center</h2>
            <button className="p-2 bg-black/5 rounded-full"><span className="i-bi:trash"></span></button>
          </div>
          
          <h3 className="text-2xl font-black mb-4">News</h3>
          {/* 模拟一条通知 */}
          <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl mb-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">About LuspNet • 2 days ago</div>
            <div className="font-bold text-sm">两大主流模型</div>
            <div className="text-xs text-gray-600 mt-1">1. Reactor 事件驱动模型</div>
          </div>
        </div>
      </div>
    </>
  );
}