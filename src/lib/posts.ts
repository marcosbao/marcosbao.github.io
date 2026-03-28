import { resolveOssUrl } from './site';

export interface PostFrontmatter {
  title: string;
  description: string;
  publishDate: string;
  tags?: string[];
  cover?: string;
  coverAlt?: string;
  featured?: boolean;
}

interface MarkdownModule {
  frontmatter: PostFrontmatter;
  Content: unknown;
  file: string;
}

const modules = import.meta.glob('../content/blog/*.md', { eager: true }) as Record<string, MarkdownModule>;

const toSlug = (file: string) => file.split('/').pop()?.replace(/\.md$/, '') || '';

export const getPosts = () => {
  return Object.values(modules)
    .map((module) => ({
      slug: toSlug(module.file),
      ...module.frontmatter,
      tags: module.frontmatter.tags ?? [],
      coverUrl: module.frontmatter.cover ? resolveOssUrl(module.frontmatter.cover) : ''
    }))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
};

export const getPost = (slug: string) => {
  const module = Object.values(modules).find((item) => toSlug(item.file) === slug);
  if (!module) return null;

  return {
    slug,
    ...module.frontmatter,
    tags: module.frontmatter.tags ?? [],
    coverUrl: module.frontmatter.cover ? resolveOssUrl(module.frontmatter.cover) : '',
    Content: module.Content
  };
};
