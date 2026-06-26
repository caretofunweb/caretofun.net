const fs = require('fs');

const xml = fs.readFileSync('caretofun.WordPress.2025-11-23.xml', 'utf8');
const items = xml.split('<item>');
items.shift(); // Remove channel header

const titles = [];

for (const item of items) {
  // Only get posts (not attachments or pages)
  if (item.includes('<wp:post_type><![CDATA[post]]></wp:post_type>')) {
    const titleMatch = item.match(/<title>(.*?)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      // Remove CDATA if present
      let title = titleMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim();
      titles.push(title);
    }
  }
}

fs.writeFileSync('posts-to-import.txt', titles.join('\n'));
console.log(`Extracted ${titles.length} post titles to posts-to-import.txt`);
