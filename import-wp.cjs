const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const XML_FILE = 'caretofun.WordPress.2025-11-23.xml';
const LIST_FILE = 'posts-to-import.txt';
const OUTPUT_DIR = path.join(__dirname, 'src', 'content', 'posts');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Get the list of selected titles
const selectedTitlesRaw = fs.readFileSync(LIST_FILE, 'utf8').split('\n');
const selectedTitles = new Set(selectedTitlesRaw.map(t => t.trim()).filter(t => t.length > 0));

console.log(`Looking for ${selectedTitles.size} selected posts...`);

// 2. Parse XML
const xml = fs.readFileSync(XML_FILE, 'utf8');
const items = xml.split('<item>');
items.shift(); // Remove channel header

let imported = 0;

for (const item of items) {
  if (item.includes('<wp:post_type><![CDATA[post]]></wp:post_type>')) {
    const titleMatch = item.match(/<title>(.*?)<\/title>/);
    let title = titleMatch && titleMatch[1] ? titleMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim() : '';
    
    if (selectedTitles.has(title)) {
      // We found a selected post!
      
      // Extract content
      const contentMatch = item.match(/<content:encoded>(.*?)<\/content:encoded>/s);
      let htmlContent = contentMatch && contentMatch[1] ? contentMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim() : '';
      
      // WordPress uses <!--nextpage--> which we want to KEEP for our new feature!
      // Turndown might escape it. We need to preserve it.
      htmlContent = htmlContent.replace(/<!--nextpage-->/g, '<div class="wp-next-page"></div>');
      
      let markdownContent = turndownService.turndown(htmlContent);
      markdownContent = markdownContent.replace(/<div class="wp-next-page"><\/div>/g, '\n\n<!--nextpage-->\n\n');
      
      // Create a slug
      const slugMatch = item.match(/<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/);
      let slug = slugMatch && slugMatch[1] ? slugMatch[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // The user wants updated title and year
      const updatedTitle = title.includes('202') ? title.replace(/202[0-5]/g, '2026') : `${title} (2026 Update)`;
      
      // Set date to current time in 2026 to ensure it's "latest"
      const now = new Date();
      now.setFullYear(2026);
      
      // Try to extract categories (fallback to 'technology')
      const categoryMatch = item.match(/<category domain="category" nicename=".*?"><!\[CDATA\[(.*?)\]\]><\/category>/);
      let category = categoryMatch && categoryMatch[1] ? categoryMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'technology';
      
      // Ensure category exists locally or fallback
      if (!fs.existsSync(path.join(__dirname, 'src', 'content', 'categories', `${category}.md`))) {
         category = 'technology';
      }
      
      const frontmatter = `---
title: "${updatedTitle.replace(/"/g, '\\"')}"
description: "${updatedTitle.replace(/"/g, '\\"')} - Updated for 2026 with the latest information."
date: ${now.toISOString()}
featured: false
draft: true
category: "${category}"
tags:
  - imported
---

${markdownContent}
`;

      fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.md`), frontmatter);
      imported++;
      console.log(`Imported: ${updatedTitle}`);
    }
  }
}

console.log(`\nSuccessfully imported ${imported} posts as Drafts!`);
