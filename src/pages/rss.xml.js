import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import settings from '@data/settings.json';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  // Filter for valid posts (published, non-draft, past date)
  const now = new Date();
  const validPosts = posts
    .filter(post => !post.data.draft && post.data.date <= now)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: settings.title,
    description: settings.description,
    site: context.site,
    items: validPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.data?.slug || post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
