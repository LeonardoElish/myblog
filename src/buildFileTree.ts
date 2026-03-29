const rawFiles = import.meta.glob('/src/blog/**/*', { query: '?url', import: 'default', eager: true });

interface FileNode {
  name: string;
  fileuuid: string;
  path?: string;
  size?: number;
  children?: FileNode[];
}

export function generateDesktopFiles(): FileNode[] {
  const rootNodes: FileNode[] = [
    { name: 'Projects', fileuuid: 'd1', children: [] },
    { name: 'picture', fileuuid: 'b37', children: [] },
  ];

  let idCounter = 1;
  console.log("Vite 扫描到的文件:", rawFiles); 

  for (const [fullPath, fileUrl] of Object.entries(rawFiles)) {
    // 现在的 fullPath 类似: '/src/blog/About c-cpp/demo.cpp'
    const relativePath = fullPath.replace('/src/blog/', '');
    const pathParts = relativePath.split('/');

    let currentLevel = rootNodes;

    pathParts.forEach((part, index) => {
      const isFile = index === pathParts.length - 1; 
      
      let existingNode = currentLevel.find(node => node.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          fileuuid: `auto_${idCounter++}`
        };

        if (isFile) {
          // 🌟 神奇魔法：fileUrl 是 Vite 自动处理好的可用路径，fetch 绝对不会报 404
          existingNode.path = fileUrl as string; 
          existingNode.size = 800; 
        } else {
          existingNode.children = [];
        }
        
        currentLevel.push(existingNode);
      }

      if (existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  }

  return rootNodes;
}