import os
import random
import re

# We will only assign these high-quality placeholder images to broken posts
VALID_IMAGES = [
    "/images/uploads/ai_automation_1782499815793.png",
    "/images/uploads/ai_everyday_1782499838207.png",
    "/images/uploads/ai_future_1782499827829.png",
    "/images/uploads/ai_image_generation_1782499785934.png",
    "/images/uploads/ai_vibe_coding_1782499776119.png",
    "/images/uploads/ai_video_generation_1782499795959.png",
    "/images/uploads/machine_learning_1782499855982.png"
]

posts_dir = "src/content/posts"
public_dir = "public"

fixed_count = 0

for filename in os.listdir(posts_dir):
    if not filename.endswith(".md"):
        continue
        
    filepath = os.path.join(posts_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Find the image path in frontmatter
    match = re.search(r"^image:\s*(.+)$", content, re.MULTILINE)
    if match:
        image_val = match.group(1).strip().strip('"').strip("'")
        
        # Check if the image exists in public folder
        # image_val usually looks like /images/uploads/xxx.png
        # So we look at public/images/uploads/xxx.png
        if image_val.startswith("/"):
            local_path = os.path.join(public_dir, image_val[1:].replace("/", os.sep))
        else:
            local_path = os.path.join(public_dir, image_val.replace("/", os.sep))
            
        if not os.path.exists(local_path):
            print(f"Broken image found in {filename}: {image_val}")
            
            # Replace with a random valid image
            new_image = random.choice(VALID_IMAGES)
            
            # Replace in content
            new_content = re.sub(
                r"^image:\s*.+$", 
                f'image: "{new_image}"', 
                content, 
                flags=re.MULTILINE
            )
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
                
            fixed_count += 1
            print(f"  -> Fixed! Replaced with {new_image}")

print(f"Total broken posts fixed: {fixed_count}")
