import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Reader({ filesrc, filename, size }: any) {
  const [content, setContent] = useState("Loading...");

  useEffect(() => {
    if (!filesrc) {
      setContent("# Welcome to Reader\nDouble click a file on the desktop to open it.");
      return;
    }
    fetch(filesrc)
      .then(res => res.text())
      .then(data => setContent(data.startsWith('<!DOCTYPE') ? '# 404 Not Found' : data))
      .catch(() => setContent("# Failed to load file"));
  }, [filesrc]);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="h-10 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 bg-gray-50 dark:bg-gray-800 select-none">
        <span className="text-sm font-medium bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md">{filename || 'Untitled.md'}</span>
      </div>
      <div className="flex-grow overflow-y-auto p-6 prose dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="h-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end px-4 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800">
        <span>UTF-8</span>
        <span className="mx-4">|</span>
        <span>{size ? `${size} Bytes` : '--'}</span>
      </div>
    </div>
  );
}