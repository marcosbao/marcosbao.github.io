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

## 浏览量状态

当前浏览量接口已固定接到：

- `https://api.aisheishei.tech`

博客正文页会直接请求该接口，不再依赖前端构建期环境变量开关。

## .tech API 正式接入说明

未来等 `aisheishei.tech` 和 API 域名准备好后，直接按下面这套接入即可。

### 前端配置

当前前端已将浏览量 API 固定写入代码，GitHub Actions 里只需要保留：

- `OSS_REGION`
- `OSS_ENDPOINT`
- `OSS_BUCKET`
- `OSS_PUBLIC_URL`

### API 域名建议

- 站点：`https://aisheishei.tech`
- API：`https://api.aisheishei.tech`
- `.dev` 站点也统一请求 `https://api.aisheishei.tech`

### API 服务端环境变量

服务端建议使用：

- `PORT=8787`
- `DATABASE_URL=postgresql://...`
- `ALLOWED_ORIGINS=https://aisheishei.dev,https://www.aisheishei.dev,https://aisheishei.tech,https://www.aisheishei.tech`

### Nginx 方向

正式切换时，把 `api.aisheishei.tech` 反代到 ECS 上运行的 views API 容器即可。

## .tech 静态站自动部署

仓库里已增加一条独立 workflow：

- `.github/workflows/deploy-tech.yml`

它的职责是：

- 构建 Astro 站点
- 通过 SSH / rsync 同步 `dist/` 到 ECS
- 发布到 `/opt/aisheishei/site-tech/releases/<commit-sha>`
- 自动切换 `/opt/aisheishei/site-tech/current`

### 需要在 GitHub 配置的 secrets

请在仓库的 `Settings -> Secrets and variables -> Actions -> Secrets` 中新增：

- `TECH_DEPLOY_HOST`
- `TECH_DEPLOY_PORT`
- `TECH_DEPLOY_USER`
- `TECH_DEPLOY_PATH`
- `TECH_DEPLOY_SSH_KEY`

推荐值：

- `TECH_DEPLOY_HOST=8.140.222.47`
- `TECH_DEPLOY_PORT=22`
- `TECH_DEPLOY_USER=root`
- `TECH_DEPLOY_PATH=/opt/aisheishei/site-tech`

`TECH_DEPLOY_SSH_KEY` 需要填写一把可登录该服务器的私钥内容。

### 到时候你只要告诉我

到时候你只需要告诉我下面几项，我就可以直接继续处理：

- `api.aisheishei.tech` 是否已经解析到 ECS
- 证书是否已可签发
- `.tech` 是否已完成备案并可正常访问
- 是否正式开启浏览量
