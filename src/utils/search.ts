/**
 * Search Index Builder
 *
 * Builds a search index from blog posts for use with Fuse.js
 * client-side search. The index is generated at build time
 * and loaded on demand when the user triggers search.
 */

interface SearchItem {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  date: string;
  excerpt?: string;
}

/**
 * Build a search index from blog posts
 * @param posts - Array of blog posts from content collection
 * @returns Array of search-ready items
 */
export function buildSearchIndex(
  posts: Array<{
    id: string;
    data: {
      title: string;
      description: string;
      slug?: string;
      category: string;
      tags: string[];
      date: Date;
      excerpt?: string;
      draft?: boolean;
    };
    body?: string;
  }>
): SearchItem[] {
  return posts
    .filter((post) => !post.data.draft)
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      slug: post.data.slug || post.id,
      category: post.data.category,
      tags: post.data.tags,
      date: post.data.date.toISOString(),
      excerpt: post.data.excerpt || post.data.description,
    }));
}

/**
 * Fuse.js search options for the blog search
 */
export const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.25 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.15 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};
