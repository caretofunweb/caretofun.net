/**
 * Related Posts Algorithm
 *
 * Finds related posts by scoring shared tags and categories.
 * Posts with more overlapping tags rank higher.
 */

interface PostData {
  id: string;
  data: {
    title: string;
    category: string;
    tags: string[];
    [key: string]: unknown;
  };
}

/**
 * Find related posts based on shared tags and category
 * @param currentPost - The current post to find related posts for
 * @param allPosts - All available posts
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts, sorted by relevance score
 */
export function getRelatedPosts(
  currentPost: PostData,
  allPosts: PostData[],
  limit: number = 3
): PostData[] {
  const scoredPosts = allPosts
    // Exclude the current post
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      let score = 0;

      // Score for matching category (weighted higher)
      if (post.data.category === currentPost.data.category) {
        score += 3;
      }

      // Score for each matching tag
      const currentTags = currentPost.data.tags || [];
      const postTags = post.data.tags || [];
      const sharedTags = currentTags.filter((tag: string) => postTags.includes(tag));
      score += sharedTags.length * 2;

      return { post, score };
    })
    // Only include posts with at least some relevance
    .filter(({ score }) => score > 0)
    // Sort by score descending
    .sort((a, b) => b.score - a.score)
    // Take top N
    .slice(0, limit);

  return scoredPosts.map(({ post }) => post);
}
