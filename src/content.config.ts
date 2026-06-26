/**
 * Content Collections Configuration — Astro Content Layer API
 *
 * Defines schemas and loaders for all content types managed by Decap CMS.
 * Uses glob() loader for local Markdown files.
 *
 * @see https://docs.astro.build/en/guides/content-collections/
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* --------------------------------------------------------------------------
   Blog Posts Collection
   -------------------------------------------------------------------------- */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    excerpt: z.string().optional(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('admin'),
    // SEO fields
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    canonicalUrl: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
  }),
});

/* --------------------------------------------------------------------------
   Categories Collection
   -------------------------------------------------------------------------- */
const categories = defineCollection({
  loader: glob({ base: './src/content/categories', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    color: z.string().default('#6366f1'),
    icon: z.string().optional(),
  }),
});

/* --------------------------------------------------------------------------
   Tags Collection
   -------------------------------------------------------------------------- */
const tags = defineCollection({
  loader: glob({ base: './src/content/tags', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
});

/* --------------------------------------------------------------------------
   Authors Collection
   -------------------------------------------------------------------------- */
const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    avatar: z.string().optional(),
    bio: z.string(),
    email: z.string().optional(),
    social: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
      linkedin: z.string().optional(),
    }).optional(),
  }),
});

/* --------------------------------------------------------------------------
   Pages Collection (CMS-managed pages)
   -------------------------------------------------------------------------- */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    layout: z.enum(['default', 'full-width', 'sidebar']).default('default'),
    showInNav: z.boolean().default(false),
    navOrder: z.number().optional(),
  }),
});

/* --------------------------------------------------------------------------
   Export all collections
   -------------------------------------------------------------------------- */
export const collections = {
  posts,
  categories,
  tags,
  authors,
  pages,
};
