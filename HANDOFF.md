##/Users/hyx/projects/playground-macos/
├── src/
│   ├── configs/           # ⭐ 主要配置文件
│   │   ├── user.ts        # 用户名、头像
│   │   ├── terminal.tsx   # 终端内容
│   │   ├── bear.tsx       # Bear 笔记项目列表
│   │   └── music.ts       # 背景音乐配置
│   └── components/
├── public/
│   ├── pricing.html       # 定制服务报价单
│   ├── screenshots/       # 项目截图 (WebP 格式)
│   └── markdown/          # 个人介绍和项目详情页
├── vercel.json            # Vercel 部署配置
└── HANDOFF.md             # 本交接文档
```

---

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 提交并部署 (自动触发 Vercel)
git add -A && git commit -m "update" && git push
```

---

*文档更新时间: 2026-01-30*
