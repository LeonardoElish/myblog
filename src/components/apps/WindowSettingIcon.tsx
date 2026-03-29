import React from 'react';

interface Props {
  tag: string;
  active: boolean;
  onClick: () => void;
  img?: string;
  appIcon?: string;
  mdi?: string;
}

export default function WindowSettingIcon({ tag, active, onClick, img, appIcon, mdi }: Props) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 mb-1.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
        active 
          ? 'bg-[#007AFF] text-white shadow-sm scale-[0.98]' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="w-5 h-5 mr-3 flex items-center justify-center flex-shrink-0">
        {/* 这里是你之前配置的图标渲染，如果找不到图片会默认不显示，但不影响排版 */}
        {img && <img src={`/images/icons/${img}.png`} alt="" className="w-full object-contain" onError={(e) => e.currentTarget.style.display='none'} />}
        {appIcon && <img src={`/images/icons/${appIcon}.png`} alt="" className="w-full object-contain" onError={(e) => e.currentTarget.style.display='none'} />}
        {mdi && <span className={`mdi mdi-${mdi} text-lg ${active ? 'text-white' : 'text-gray-500'}`} />}
        
        {/* 如果上面的图片没加载出来，给一个默认的占位符（可选） */}
        {!img && !appIcon && !mdi && (
          <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-gray-400'}`}></div>
        )}
      </div>
      <span className={`text-[14px] tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
        {tag}
      </span>
    </div>
  );
}