import { buildSearchIndex } from '../utils/search';
import { getCollection } from 'astro:content';

export async function GET() {
  try {
    const allPosts = await getCollection('posts');
    
    // Filter out drafts and future posts
    const now = new Date();
    const validPosts = allPosts.filter(post => !post.data.draft && post.data.date <= now);
    
    const index = buildSearchIndex(validPosts);
    
    return new Response(JSON.stringify(index), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache the search index for 1 hour on CDN, revalidate every request locally
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating search index:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate search index' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
