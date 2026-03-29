import React, { useState, useEffect } from 'react';

// --- 1. 子组件：NotificationItem (内部组件) ---
interface NotificationItemProps {
  id: string;
  title?: string;
  abstract?: string;
  content?: string;
  time?: string;
  lastedittime?: number;
  filesrc?: string;
  filename?: string;
  filesize?: number;
  onClose: (id: string) => void;
  isClearingAll?: boolean;
}

const NotificationItem = (props: NotificationItemProps) => {
  const [mouseOn, setMouseOn] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (props.isClearingAll) setIsClosing(true);
  }, [props.isClearingAll]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => props.onClose(props.id), 400);
  };

  return (
    <div 
      className={`w-full px-3 mt-3 select-none transition-all duration-400 transform origin-right 
        ${isClosing ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'} 
        animate-in fade-in slide-in-from-right-4`}
      onMouseEnter={() => setMouseOn(true)}
      onMouseLeave={() => setMouseOn(false)}
    >
      <div className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl overflow-hidden shadow-sm border border-white/20 dark:border-gray-700/50">
        <div className="w-full h-8 bg-gray-200/40 dark:bg-gray-700/40 flex items-center px-3">
          <img src="/images/icons/text.png" className="h-4 w-4 object-contain opacity-80" alt="" />
          <div className="ml-2 text-xs font-semibold text-gray-700 dark:text-gray-300">{props.content || 'System'}</div>
          <div className="flex-grow"></div>
          {!mouseOn ? (
            <div className="text-gray-500 text-xs">{props.time}</div>
          ) : (
            <button 
              onClick={triggerClose}
              className="w-5 h-5 bg-black/5 hover:bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="i-bi:x text-gray-600 dark:text-gray-300"></span>
            </button>
          )}
        </div>
        <div className="flex flex-row-reverse p-2">
          <div className="flex items-center px-2">
            <button className="px-4 py-1.5 rounded-lg font-bold text-sm bg-gray-100/40 hover:bg-white/80 dark:bg-gray-700/40 dark:hover:bg-gray-600/80 text-blue-600 dark:text-blue-400 transition-all">
              View
            </button>
          </div>
          <div className="flex-grow py-1 px-2">
            <div className="font-semibold text-[15px] text-gray-800 dark:text-gray-100">{props.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">{props.abstract}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. 主组件：Notifications (导出组件) ---
export default function Notifications() {
  const [notices, setNotices] = useState([
    { id: '1', title: 'Welcome', abstract: 'Mac OS is ready.', content: 'System', time: 'Now' },// 这是一个示例通知，实际使用中可以通过 props 或 API 获取通知数据
    { id: '2', title: 'Update', abstract: 'Notification system merged.', content: 'Update', time: '2m ago' }// 你可以根据需要添加更多示例通知
  ]);
  const [clearing, setClearing] = useState(false);

  const handleClose = (id: string) => setNotices(prev => prev.filter(n => n.id !== id));

  const clearAll = () => {
    setClearing(true);
    setTimeout(() => {
      setNotices([]);
      setClearing(false);
    }, 500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700/50 bg-white/40 dark:bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="i-bi:app-indicator text-blue-500 text-lg"></span>
          <span className="font-bold text-lg">Notifications</span>
        </div>
        <button 
          onClick={clearAll}
          className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md active:scale-95 transition-all disabled:opacity-50"
          disabled={notices.length === 0}
        >
          Clear All
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
        {notices.map(n => (
          <NotificationItem key={n.id} {...n} onClose={handleClose} isClearingAll={clearing} />
        ))}
        {notices.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <span className="i-bi:bell-slash text-5xl mb-2 opacity-30"></span>
            <p>No Notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}