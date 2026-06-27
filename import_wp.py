import os
import sys
import xml.etree.ElementTree as ET
import re
from datetime import datetime
import textwrap

try:
    from markdownify import markdownify as md
except ImportError:
    print("Error: Required libraries not found.")
    print("Please run: pip install -r requirements.txt")
    sys.exit(1)

# WordPress XML Namespaces
NAMESPACES = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'dc': 'http://purl.org/dc/elements/1.1/'
}

OUTPUT_DIR = os.path.join("src", "content", "posts")

def create_slug(title):
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug

def parse_wp_xml(file_path):
    print(f"Parsing XML file: {file_path}...")
    try:
        tree = ET.parse(file_path)
    except Exception as e:
        print(f"Failed to parse XML: {e}")
        sys.exit(1)
        
    root = tree.getroot()
    channel = root.find('channel')
    
    posts = []
    
    for item in channel.findall('item'):
        post_type = item.find('wp:post_type', NAMESPACES)
        post_status = item.find('wp:status', NAMESPACES)
        
        # We only want published posts
        if post_type is not None and post_type.text == 'post' and post_status is not None and post_status.text == 'publish':
            
            title = item.find('title').text or 'Untitled'
            link = item.find('link').text
            pub_date = item.find('pubDate').text
            
            # Format Date for Astro
            try:
                date_obj = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %z")
                formatted_date = date_obj.strftime("%Y-%m-%dT%H:%M:%SZ")
            except:
                formatted_date = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            
            content = item.find('content:encoded', NAMESPACES)
            html_content = content.text if content is not None else ""
            
            # Extract categories and tags
            categories = []
            tags = []
            for cat in item.findall('category'):
                domain = cat.get('domain')
                if domain == 'category':
                    categories.append(cat.text)
                elif domain == 'post_tag':
                    tags.append(cat.text)
                    
            posts.append({
                'title': title,
                'date': formatted_date,
                'html_content': html_content,
                'categories': categories,
                'tags': tags
            })
            
    return posts

def generate_markdown(post):
    slug = create_slug(post['title'])
    
    # Convert HTML to Markdown
    markdown_content = md(post['html_content'], heading_style="ATX")
    
    # Prepare Frontmatter
    category = post['categories'][0] if post['categories'] else "general"
    tags_yaml = "\n".join([f"  - \"{tag}\"" for tag in post['tags']]) if post['tags'] else "  - \"imported\""
    
    # We use a default placeholder image. You can change this in the CMS later.
    default_image = "/images/uploads/ai_vibe_coding_1782499776119.png"
    
    frontmatter = textwrap.dedent(f"""\
    ---
    title: "{post['title'].replace('"', "'")}"
    description: "{post['title'].replace('"', "'")} - Imported from WordPress."
    date: {post['date']}
    draft: false
    featured: false
    image: "{default_image}"
    category: "{category.lower()}"
    tags:
    {tags_yaml}
    author: "faizan"
    ---
    """)
    
    return slug, frontmatter + "\n" + markdown_content

def main():
    if len(sys.argv) < 2:
        print("Usage: python import_wp.py <path_to_wordpress_xml>")
        sys.exit(1)
        
    xml_file = sys.argv[1]
    if not os.path.exists(xml_file):
        print(f"File not found: {xml_file}")
        sys.exit(1)
        
    posts = parse_wp_xml(xml_file)
    
    if not posts:
        print("No published posts found in the XML file.")
        sys.exit(0)
        
    print(f"\nFound {len(posts)} published posts!")
    print("-" * 50)
    for i, post in enumerate(posts):
        print(f"[{i+1}] {post['title']}")
    print("-" * 50)
    
    print("\nEnter the number of the post you want to import.")
    print("Or type 'all' to import everything.")
    print("Or type 'q' to quit.")
    
    choice = input("\nYour choice: ").strip().lower()
    
    if choice == 'q':
        sys.exit(0)
        
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    posts_to_import = []
    if choice == 'all':
        posts_to_import = posts
    else:
        try:
            index = int(choice) - 1
            if 0 <= index < len(posts):
                posts_to_import.append(posts[index])
            else:
                print("Invalid number.")
                sys.exit(1)
        except ValueError:
            print("Invalid input. Please enter a number or 'all'.")
            sys.exit(1)
            
    print(f"\nStarting import of {len(posts_to_import)} post(s)...")
    
    for post in posts_to_import:
        slug, markdown = generate_markdown(post)
        filename = f"{slug}.md"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(markdown)
            
        print(f"✅ Successfully imported: {post['title']}")
        print(f"   Saved to: {filepath}")
        
    print("\nImport complete! You can now start Astro (`npm run dev`) or push to GitHub.")

if __name__ == "__main__":
    main()
