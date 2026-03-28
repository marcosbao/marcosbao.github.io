export const site = {
  title: 'AiSheiShei',
  subtitle: 'AI谁谁',
  description:
    '记录 AI 时代的噪音、落地、协作与个人判断，关注技术落地、项目管理与真实现场。',
  nav: [
    { href: '/', label: '首页' },
    { href: '/blog', label: '博客' },
    { href: '/editor', label: '编辑器' }
  ]
};

export const oss = {
  bucket: import.meta.env.OSS_BUCKET || '',
  region: import.meta.env.OSS_REGION || '',
  endpoint: import.meta.env.OSS_ENDPOINT || '',
  publicUrl: (import.meta.env.OSS_PUBLIC_URL || '').replace(/\/$/, '')
};

export const resolveOssUrl = (path: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return oss.publicUrl ? `${oss.publicUrl}/${path.replace(/^\//, '')}` : path;
};
