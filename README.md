# AstroBlog — Modern Blogging CMS

A production-ready, modern blogging platform built with Astro 7, Tailwind CSS v4, and Decap CMS. Designed with a premium aesthetic featuring glassmorphism, dynamic gradients, and fluid animations.

## 🚀 Features

- **Blazing Fast**: Built with Astro 7 (Rust compiler, Vite 8/Rolldown) with static output mode.
- **Premium Design**: Modern UI with glassmorphism, gradients, micro-animations, and full dark mode support using Tailwind CSS v4.
- **Content Management**: Git-based CMS powered by Decap CMS (v3). No database required.
- **SEO Optimized**: Automatic JSON-LD schema generation, Open Graph tags, Twitter cards, sitemap, and RSS feed.
- **Client-side Search**: Fast, typo-tolerant search powered by Fuse.js.
- **Rich Content**: Markdown support with frontmatter, categories, tags, and reading time estimation.
- **Cloudflare Pages Ready**: Configured for seamless deployment to Cloudflare Pages including custom GitHub OAuth proxy for Decap CMS.
- **Scheduled Publishing**: GitHub Actions workflow included to automate publishing of future-dated posts.

## 🛠 Tech Stack

- [Astro 7](https://astro.build/) - Web framework
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [Decap CMS](https://decapcms.org/) - Git-based content management system
- [Fuse.js](https://fusejs.io/) - Lightweight fuzzy-search
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting and Serverless Functions

## 🏁 Quick Start

### Prerequisites
- Node.js 22+
- npm

### Local Development

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Astro development server:**
   ```bash
   npm run dev
   ```
   Your site will be available at `http://localhost:4321`.

3. **Start the local Decap CMS proxy server (in a separate terminal):**
   ```bash
   npx decap-server
   ```
   This allows you to edit content locally without pushing to GitHub. Access the CMS at `http://localhost:4321/admin/`. Note: Set `local_backend: true` in `public/admin/config.yml` during local development if you want to save changes to your local file system.

## ☁️ Deployment (Cloudflare Pages)

1. Push your code to a GitHub repository.
2. Log in to the Cloudflare dashboard and go to **Pages**.
3. Create a new project -> **Connect to Git**.
4. Select your repository.
5. Configure the build settings:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Click **Save and Deploy**.

### Setting up GitHub OAuth for Decap CMS

Because Cloudflare Pages doesn't provide a built-in authentication provider like Netlify, we use Cloudflare Pages Functions as an OAuth proxy.

1. Go to your GitHub Developer Settings -> **OAuth Apps** -> **New OAuth App**.
2. Fill in the details:
   - Homepage URL: `https://your-cloudflare-pages-domain.pages.dev`
   - Authorization callback URL: `https://your-cloudflare-pages-domain.pages.dev/api/callback`
3. Generate a new Client Secret.
4. Go to your Cloudflare Pages project settings -> **Settings** -> **Environment variables**.
5. Add the following environment variables:
   - `OAUTH_GITHUB_CLIENT_ID`: (Your GitHub App Client ID)
   - `OAUTH_GITHUB_CLIENT_SECRET`: (Your GitHub App Client Secret)
6. Ensure `public/admin/config.yml` is configured with your repository details:
   ```yaml
   backend:
     name: github
     repo: your-github-username/your-repo-name
     branch: main
     base_url: https://your-cloudflare-pages-domain.pages.dev
     auth_endpoint: /api/auth
   ```

## 📝 Content Management Guide

Access the CMS at `/admin/` on your live site or locally.

- **Posts**: Create and edit blog posts. You can schedule posts by setting a future `date`.
- **Categories**: Define categories with custom theme colors.
- **Tags**: Create reusable tags for your posts.
- **Authors**: Manage author profiles and social links.
- **Site Settings**: Update site title, description, SEO image, and newsletter configuration.
- **Navigation & Footer**: Manage your site's menus.

## 🕒 Scheduled Publishing

To automatically publish posts with future dates:
1. In Cloudflare Pages, go to **Settings** -> **Builds & Deployments** -> **Deploy Hooks**.
2. Create a new deploy hook and copy the URL.
3. In your GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions**.
4. Create a new repository secret named `CF_DEPLOY_HOOK_URL` and paste the webhook URL.
5. The included `.github/workflows/scheduled-publish.yml` will now automatically trigger a rebuild every 6 hours, publishing any posts whose scheduled date has passed.

## 📄 License
MIT
