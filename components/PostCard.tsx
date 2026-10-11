import Link from 'next/link';
import { formatPostDate, type Post } from '@/lib/blog';

/** One article card, used on the blog index, the home page and the related list. */
export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <div className="post-media">
        <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
          <img
            src={post.image}
            alt={post.imageAlt}
            width={1400}
            height={875}
            loading="lazy"
            decoding="async"
          />
        </Link>
      </div>

      <div className="post-body">
        <div className="post-meta">
          <span>{post.category}</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>{post.readingTime}</span>
        </div>

        <h3 className="post-title">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="post-excerpt">{post.description}</p>

        <div className="post-foot">
          <Link href={`/blog/${post.slug}`} className="link-cta">
            Read the article <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
