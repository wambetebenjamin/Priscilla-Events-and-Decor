import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import PageHead from '@/components/PageHead';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import Reveal from '@/components/Reveal';
import { formatPostDate, getAllPosts, getPost, getRelatedPosts } from '@/lib/blog';
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript, postMetadata } from '@/lib/seo';
import { CONTACT } from '@/lib/site';

/** Blog articles revalidate on the 3600 second schedule the brief sets. */
export const revalidate = 3600;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Article not found' };
  return postMetadata(post);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return (
    <>
      <PageHead
        eyebrow={post.category}
        title={post.title}
        intro={post.description}
        crumbs={[
          { name: 'Journal', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
        image={post.image}
        imageAlt={post.imageAlt}
      />

      <section className="section">
        <div className="shell">
          <article className="article">
            <div className="post-meta" style={{ marginBottom: 22 }}>
              <span>{post.author}</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span>{post.readingTime}</span>
            </div>

            <figure className="article-hero">
              <img
                src={post.image}
                alt={post.imageAlt}
                width={1400}
                height={932}
                fetchPriority="high"
                decoding="async"
              />
            </figure>

            <div className="article-body">
              <MDXRemote source={post.body} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>

            {post.tags.length > 0 ? (
              <div className="filter-bar" style={{ justifyContent: 'flex-start', marginTop: 40 }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="filter-tab" style={{ cursor: 'default' }}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <hr className="rule" style={{ margin: '40px 0' }} />

            <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <Link href="/enquire" className="btn btn-primary">
                Talk to us about your event
              </Link>
              <Link href="/style-quiz" className="btn btn-quiet">
                Take the style quiz
              </Link>
            </div>

            <p className="meta" style={{ marginTop: 20 }}>
              {CONTACT.responsePromise} WhatsApp{' '}
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                {CONTACT.phoneDisplay}
              </a>
              .
            </p>
          </article>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section tint-cream" aria-labelledby="related-heading">
          <div className="shell-wide">
            <div className="section-head">
              <span className="eyebrow">Keep reading</span>
              <h2 className="section-title" id="related-heading">
                More from the journal
              </h2>
            </div>
            <div className="post-grid">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 70}>
                  <PostCard post={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section tint-sand" aria-labelledby="newsletter-heading">
        <div className="shell">
          <div className="newsletter">
            <div>
              <span className="eyebrow">Newsletter</span>
              <h2 id="newsletter-heading">Monthly decor inspiration and seasonal offers.</h2>
              <p>Get the next article, plus the offers we only send to subscribers.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            articleJsonLd(post),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Journal', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]),
        }}
      />
    </>
  );
}
