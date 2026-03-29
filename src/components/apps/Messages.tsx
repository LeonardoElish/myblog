import React, { useEffect, useRef } from "react";
import { init } from "@waline/client";
import "@waline/client/style"; // 引入基础样式

export default function Messages() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const waline = init({
        el: containerRef.current,
        serverURL: "https://api.sakiko.wiki/", // 替换成你第一步得到的URL
        dark: "html.dark", // 自动跟随你 html 标签上的 dark 类名切换主题
        emoji: [
          "//unpkg.com/@waline/emojis@1.1.0/weibo",
          "//unpkg.com/@waline/emojis@1.1.0/bilibili"
        ]
      });

      return () => waline?.destroy();
    }
  }, []);

  return (
    <div className="size-full bg-c-100 flex flex-col overflow-hidden">
      {/* 模拟 macOS 顶栏 */}
      <div className="h-10 border-b border-menu flex items-center justify-center bg-c-200/50 flex-shrink-0">
        <span className="text-sm font-semibold text-c-700">留言板 Guestbook</span>
      </div>

      {/* 留言内容区 */}
      <div className="flex-1 overflow-y-auto p-6 custom-waline-container">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-c-800">留下你的足迹 </h1>
            <p className="mt-2 text-c-500">欢迎交换友链或提出建议</p>
          </header>

          {/* Waline 挂载点 */}
          <div ref={containerRef} />
        </div>
      </div>
    </div>
  );
}
