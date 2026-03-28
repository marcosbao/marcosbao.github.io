# AiSheiShei

极简版 Astro 内容站骨架。

## 当前范围

- 首页
- 博客列表页
- 博客正文页
- Markdown 内容
- OSS 图片路径预留

## 开发

```bash
npm install
npm run dev
```

## 文章图片

正文和封面图支持直接写 OSS 路径。

- 完整地址可直接写 `https://...`
- OSS 对象路径可写成 `posts/2026/example.jpg`
- 最终会自动拼接 `OSS_PUBLIC_URL`
