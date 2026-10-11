import { fail, methodNotAllowed, ok, withErrorHandling } from '@/lib/api';
import { getAllPosts, getPost, type Post } from '@/lib/blog';

/**
 * GET /api/blog
 *
 * Serves the MDX articles as JSON, alongside the rendered pages. The body of each
 * article is the raw MDX, which is deliberate: it lets a future app or a partner
 * site render the article with its own pipeline rather than receiving HTML that
 * has already been styled for this one.
 *
 * Query parameters:
 *   ?slug=...      one article
 *   ?category=...  filter by category
 *   ?limit=3       cap the number returned
 *   ?full=1        include the MDX body. Omitted by default, because the index
 *                  does not need it and it makes the payload much larger.
 */
export const revalidate = 3600;

type Serialised = Omit<Post, 'body'> & { body?: string };

function serialise(post: Post, full: boolean): Serialised {
  const { body, ...rest } = post;
  return full ? { ...rest, body } : rest;
}

export const GET = withErrorHandling('api/blog', async (request: Request) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const category = url.searchParams.get('category');
  const limitRaw = Number.parseInt(url.searchParams.get('limit') ?? '', 10);
  const full = url.searchParams.get('full') === '1';

  if (slug) {
    const post = getPost(slug);
    if (!post) return fail('No article with that slug.', 404);
    return ok({
      message: post.title,
      count: 1,
      posts: [serialise(post, true)],
    });
  }

  let posts = getAllPosts();

  if (category) {
    posts = posts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
  }

  if (Number.isFinite(limitRaw) && limitRaw > 0) {
    posts = posts.slice(0, limitRaw);
  }

  const categories = Array.from(new Set(getAllPosts().map((post) => post.category)));

  return ok({
    message: `${posts.length} article${posts.length === 1 ? '' : 's'}.`,
    count: posts.length,
    categories,
    posts: posts.map((post) => serialise(post, full)),
  });
});

export function POST() {
  return methodNotAllowed(['GET']);
}
