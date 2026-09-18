#!/usr/bin/env python3
"""
Build script: takes each *.template.html and produces a self-contained
*.html by:
  1. Inlining styles.css into a <style> block (replacing the <link>).
  2. Inlining any <script src="LOCAL_FILE.js"></script> where LOCAL_FILE.js
     exists on disk (theme.js, data.js, global.js, app.js, country.js,
     advisor.js, media.js, subscribe.js, preferences.js) into an inline
     <script>...</script> block, in the original tag's position/order.
  3. Leaving external CDN <script src="https://...">/<link href="https://...">
     tags untouched (Leaflet, jsPDF, Google Fonts).
"""
import glob
import os
import re
import shutil

LOCAL_JS = ["theme.js", "data.js", "global.js", "app.js", "country.js",
            "advisor.js", "media.js", "subscribe.js", "preferences.js", "eu.js"]

# Data files the browser loads from the site root but the serverless functions
# in api/ must also be able to read. Vercel only bundles files that sit inside
# api/, so the build copies them there — this keeps the two copies in step
# automatically instead of relying on anyone to remember.
API_DATA_COPIES = ["kr-taxonomy-activities.json", "eu-taxonomy-activities.json"]

def inline_styles(html, css_content):
    return re.sub(
        r'<link rel="stylesheet" href="styles\.css"\s*/?>',
        f"<style>\n{css_content}\n</style>",
        html
    )

def inline_scripts(html):
    def repl(m):
        src = m.group(1)
        if src in LOCAL_JS and os.path.exists(src):
            with open(src, encoding="utf-8") as f:
                js = f.read()
            return f"<script>\n{js}\n</script>"
        return m.group(0)
    return re.sub(r'<script src="([^"]+)"></script>', repl, html)

def sync_api_data():
    for name in API_DATA_COPIES:
        if not os.path.exists(name):
            print(f"WARNING: {name} not found — api/ copy left as is")
            continue
        dest = os.path.join("api", name)
        shutil.copyfile(name, dest)
        print(f"Synced {dest} from {name}")


def main():
    sync_api_data()

    with open("styles.css", encoding="utf-8") as f:
        css_content = f.read()

    templates = sorted(glob.glob("*.template.html"))
    for tpl in templates:
        out_name = tpl.replace(".template.html", ".html")
        with open(tpl, encoding="utf-8") as f:
            html = f.read()
        html = inline_styles(html, css_content)
        html = inline_scripts(html)
        with open(out_name, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Built {out_name} from {tpl}")

if __name__ == "__main__":
    main()
