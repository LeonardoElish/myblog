import React, { useEffect } from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor, useInstance } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { replaceAll } from "@milkdown/utils"; 
import { useStore } from "~/stores";
import { Type, Plus, ChevronDown } from "lucide-react";

const MilkdownEditor = ({ filesrc }: { filesrc?: string }) => {
  const { setTyporaMd } = useStore((state) => ({
    setTyporaMd: state.setTyporaMd
  }));

  const [loading, getEditor] = useInstance();

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, ""); 
        
        ctx.get(listenerCtx)
          .mounted((ctx) => {
            const wrapper = ctx.get(rootCtx) as HTMLDivElement;
            const editor = wrapper.querySelector(".editor[role='textbox']") as HTMLDivElement;
            wrapper.onclick = () => editor?.focus();
          })
          .markdownUpdated((_, markdown) => setTyporaMd(markdown));

        // 🌟 宽度适配：使用 max-w-[920px] 配合 mx-auto
        root.className = "typora-inner milkdown h-full outline-none max-w-[980px] mx-auto w-full px-10 py-12";
      })
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(history)
  );

  useEffect(() => {
    if (!filesrc || loading) return;
    const loadContent = async () => {
      try {
        const res = await fetch(filesrc);
        if (!res.ok) throw new Error("File not found");
        const markdown = await res.text();
        const editor = getEditor();
        if (editor) {
          editor.action(replaceAll(markdown));
        }
      } catch (err) {
        console.error("Failed to load markdown:", err);
      }
    };
    loadContent();
  }, [filesrc, loading, getEditor]);

  return <Milkdown />;
};

export default function Typora({ filesrc, filename = "Untitled.md", size = 0 }: { filesrc?: string, filename?: string, size?: number }) {
  const sizeDisplay = size > 1024 ? `${(size / 1024).toFixed(1)} KiB` : `${size} B`;

  return (
    <div className="typora flex flex-col h-full w-full bg-[#fcfcfc] dark:bg-[#282c34] font-sans">
      
      {/* 🌟 1. 顶部标签栏 (Tab Bar) - 调整了背景色与高度比例 */}
      <div className="flex items-center px-4 py-2 bg-[#f6f6f6] dark:bg-[#1e2227] border-b border-gray-200/80 dark:border-gray-800 select-none">
        
        {/* T 图标按钮 */}
        <button className="flex items-center justify-center w-7 h-7 mr-3 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200/80 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Type size={15} strokeWidth={2.5} />
        </button>

        {/* 激活的标签页 - 完美复刻截图的蓝色块 */}
        <div className="flex items-center px-3.5 py-1.5 bg-[#1a73e8] text-white rounded-md shadow-sm text-[13px] font-medium min-w-[120px] justify-center cursor-default tracking-wide">
          {filename}
        </div>

        {/* 添加新标签按钮 */}
        <button className="flex items-center justify-center w-7 h-7 ml-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors">
          <Plus size={18} />
        </button>
      </div>

      {/* 🌟 2. 中间编辑器区域 */}
      <div className="flex-1 overflow-y-auto custom-typora-scrollbar">
        <MilkdownProvider>
          <MilkdownEditor filesrc={filesrc} />
        </MilkdownProvider>
      </div>

      {/* 🌟 3. 底部状态栏 (Status Bar) - 拉开间距，适应宽屏 */}
      <div className="flex justify-between items-center px-5 py-1.5 bg-[#fcfcfc] dark:bg-[#282c34] border-t border-gray-200/80 dark:border-gray-800 text-[12px] text-gray-500 dark:text-gray-400 select-none cursor-default">
        {/* 左侧信息 */}
        <div className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          Ln 33, Col 107
        </div>

        {/* 右侧信息矩阵 */}
        <div className="flex items-center gap-6">
          <span className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">{sizeDisplay}</span>
          <span className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Browse</span>
          
          <div className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer">
            UTF-8 <ChevronDown size={14} />
          </div>
          
          <div className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer">
            None <ChevronDown size={14} />
          </div>
        </div>
      </div>

    </div>
  );
}