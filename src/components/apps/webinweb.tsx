import React, { useState } from 'react';

interface WebInWebProps {
  // 默认加载你指定的地址
  url?: string; 
}

export default function WebInWeb({ url = "https://enter.sakiko.wiki" }: WebInWebProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full bg-white dark:bg-gray-900">
      {/* 顶部加载进度条 */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-100 overflow-hidden z-10">
          <div className="h-full bg-blue-500 w-1/2 animate-pulse" />
        </div>
      )}

      {/* 核心：iframe 页中页 */}
      <iframe
        src={url}
        className="w-full h-full border-none bg-white"
        title="Web in Web"
        onLoad={() => setLoading(false)}
        // 安全沙箱配置：允许同源请求、允许执行脚本、允许表单提交等
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}