/**
 * Blog.
 *
 * Articles are MDX files in /content/blog, read from disk at build time and
 * revalidated on the schedule the brief sets for the blog, which is 3600 seconds.
 * Frontmatter is parsed with gray-matter and rendered through next-mdx-remote's
 * React Server Component entry point, so no MDX runtime reaches the browser.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO date, used for sorting, display and structured data. */
  date: string;
  author: string;
  category: string;
  image: string;
  imageAlt: string;
  /** Human readable reading time, for example "6 min read". */
  readingTime: string;
  tags: string[];
};

export type Post = PostFrontmatter & {
  slug: string;
  /** Raw MDX body, without the frontmatter block. */
  body: string;
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function readPostFile(fileName: string): Post | null {
  const fullPath = path.join(BLOG_DIR, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const slug = fileName.replace(/\.mdx?$/, '');

  const frontmatter = data as Partial<PostFrontmatter>;

  // Fail loudly at build time rather than shipping a page with missing data.
  const required: (keyof PostFrontmatter)[] = [
    'title',
    'description',
    'date',
    'author',
    'category',
    'image',
    'imageAlt',
    'readingTime',
  ];
  const missing = required.filter((key) => !frontmatter[key]);
  if (missing.length > 0) {
    throw new Error(`Blog post "${fileName}" is missing frontmatter: ${missing.join(', ')}`);
  }

  return {
    slug,
    title: frontmatter.title as string,
    description: frontmatter.description as string,
    date: frontmatter.date as string,
    author: frontmatter.author as string,
    category: frontmatter.category as string,
    image: frontmatter.image as string,
    imageAlt: frontmatter.imageAlt as string,
    readingTime: frontmatter.readingTime as string,
    tags: (frontmatter.tags as string[]) ?? [],
    body: content,
  };
}

/** Every post, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readPostFile)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const file = ['mdx', 'md'].map((ext) => `${slug}.${ext}`).find((name) =>
    fs.existsSync(path.join(BLOG_DIR, name)),
  );
  if (!file) return null;
  return readPostFile(file);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/** Related posts: same category first, then the most recent others. */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const posts = getAllPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) return posts.slice(0, limit);

  const sameCategory = posts.filter(
    (post) => post.slug !== slug && post.category === current.category,
  );
  const others = posts.filter((post) => post.slug !== slug && post.category !== current.category);

  return [...sameCategory, ...others].slice(0, limit);
}

/** Format used on cards and article headers: 12 March 2026. */
export function formatPostDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
