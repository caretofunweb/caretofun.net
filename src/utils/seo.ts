/**
 * SEO Utilities
 *
 * Generates JSON-LD structured data for Schema.org markup,
 * and provides helpers for Open Graph and Twitter Card meta tags.
 */

import settings from '@data/settings.json';

interface SiteMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Generate WebSite JSON-LD schema
 */
export function getWebsiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.title,
    description: settings.description,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BlogPosting JSON-LD schema
 */
export function getBlogPostSchema(post: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string; image?: string };
  tags?: string[];
  wordCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: post.url,
    image: post.image,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
      image: post.author.image,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.title,
      url: settings.siteUrl,
    },
    keywords: post.tags?.join(', '),
    wordCount: post.wordCount,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Build Open Graph meta properties from metadata
 */
export function getOpenGraphMeta(meta: SiteMetadata) {
  const og: Record<string, string> = {
    'og:title': meta.title,
    'og:description': meta.description,
    'og:url': meta.url,
    'og:type': meta.type || 'website',
    'og:site_name': settings.title,
  };

  if (meta.image) {
    og['og:image'] = meta.image;
    og['og:image:width'] = '1200';
    og['og:image:height'] = '630';
  }

  if (meta.publishedTime) {
    og['article:published_time'] = meta.publishedTime;
  }
  if (meta.modifiedTime) {
    og['article:modified_time'] = meta.modifiedTime;
  }
  if (meta.section) {
    og['article:section'] = meta.section;
  }
  if (meta.tags) {
    meta.tags.forEach((tag) => {
      og[`article:tag`] = tag;
    });
  }

  return og;
}

/**
 * Build Twitter Card meta properties from metadata
 */
export function getTwitterMeta(meta: SiteMetadata) {
  const twitter: Record<string, string> = {
    'twitter:card': meta.image ? 'summary_large_image' : 'summary',
    'twitter:title': meta.title,
    'twitter:description': meta.description,
  };

  if (meta.image) {
    twitter['twitter:image'] = meta.image;
  }

  if (settings.seo?.twitterHandle) {
    twitter['twitter:site'] = settings.seo.twitterHandle;
  }

  return twitter;
}
