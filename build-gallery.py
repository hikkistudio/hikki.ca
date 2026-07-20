#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-gallery.py — hikki.ca gallery 相片管理工具

用法：
  1. 將新相片掉入 photos/（檔名格式：g391_關鍵字_關鍵字.webp）
  2. 行：python3 build-gallery.py
  3. 完成。新相會按檔名關鍵字自動猜分類，並寫入 gallery-data.js
     想改分類，直接開 gallery-data.js 手改嗰行嘅 cat 就得。

規則：
  - 已存在於 gallery-data.js 嘅相片：保留原有分類，唔會郁。
  - photos/ 入面搵唔到嘅舊記錄：會警告（唔會自動刪，怕你搬緊檔案）。
  - 分類猜測（可多個）：
      times   ← wedding / bride / vow / family / party / birthday / anniversary
      friends ← dog / cat / pet / bird / shelti / puppy / kitten / tabby / parrot...
      souls   ← portrait / girl+filmic 人像類（保守，猜唔中就 fallback cities）
      cities  ← 其他一律 cities（最安全嘅預設）
"""
import os
import re
import sys
import base64
import io

ROOT = os.path.dirname(os.path.abspath(__file__))
PHOTO_DIR = os.path.join(ROOT, 'photos')
DATA_FILE = os.path.join(ROOT, 'gallery-data.js')

EXTS = ('.webp', '.jpg', '.jpeg', '.png')

# 朦朧色底：每張相生成 10px 闊 JPEG base64（~0.3KB/張），
# recalibrating 遮罩後面透出，相「浮現」而唔係「彈出」。
PH_W = 10
PH_Q = 30

def tiny_placeholder(path):
    try:
        from PIL import Image
    except ImportError:
        return ''
    try:
        im = Image.open(path).convert('RGB')
        h = max(1, round(im.height * PH_W / im.width))
        im = im.resize((PH_W, h), Image.BILINEAR)
        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=PH_Q, optimize=True)
        return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode('ascii')
    except Exception:
        return ''

RULES = [
    ('times',   r'wedding|bride|bridesmate|vow|prewedding|family|party|birthday|thanksgiving|anniversary'),
    ('friends', r'dog|cat_|_cat|kitten|puppy|pet|bird|birl|shelti|tabby|coon|parrot|myna|pheasant|straydog'),
    ('souls',   r'portrait|soul'),
]

def guess_cats(name):
    low = name.lower()
    cats = [c for c, pat in RULES if re.search(pat, low)]
    if not cats:
        cats = ['cities']
    return cats

def natural_key(name):
    m = re.match(r'x?g(\d+)', name.lower())
    return (int(m.group(1)) if m else 10**9, name)

def main():
    if not os.path.isdir(PHOTO_DIR):
        sys.exit('搵唔到 photos/ 資料夾')

    src = open(DATA_FILE, encoding='utf-8').read() if os.path.exists(DATA_FILE) else ''
    existing = dict(re.findall(r'\{\s*src:\s*"([^"]+)",\s*cat:\s*\[([^\]]*)\]\s*\}', src))

    files = sorted(
        (f for f in os.listdir(PHOTO_DIR) if f.lower().endswith(EXTS)),
        key=natural_key,
    )
    fileset = set(files)

    added = []
    removed = []
    lines = []
    def entry(name, cats_js):
        ph = tiny_placeholder(os.path.join(PHOTO_DIR, name))
        ph_js = f', ph: "{ph}"' if ph else ''
        return f'  {{ src: "{name}", cat: [{cats_js}]{ph_js} }},'
    # 舊記錄按原順序保留（分類唔郁，色底每次重新生成）；死記錄剪走（會列出）
    for name, cats in existing.items():
        if name not in fileset:
            removed.append(name)
            continue
        lines.append(entry(name, cats))
    # 新檔案
    for f in files:
        if f in existing:
            continue
        cats = guess_cats(f)
        cats_js = ', '.join(f'"{c}"' for c in cats)
        lines.append(entry(f, cats_js))
        added.append((f, cats))

    out = (
        '/* =====================================================\n'
        '   gallery-data.js — 由 build-gallery.py 生成/維護\n'
        '   新增相片：掉入 photos/ 之後行 python3 build-gallery.py\n'
        '   分類：souls / times / cities / friends（可多個）\n'
        '   ===================================================== */\n'
        'const PHOTO_DIR = "photos/";\n'
        'const IMAGE_DATA = [\n' + '\n'.join(lines) + '\n];\n'
    )
    open(DATA_FILE, 'w', encoding='utf-8').write(out)

    if removed:
        print(f'✂ 移除 {len(removed)} 條死記錄（photos/ 冇呢啲檔案）：')
        for n in removed:
            print(f'   {n}')
    if added:
        print(f'✚ 新增 {len(added)} 張：')
        for f, cats in added:
            print(f'   {f}  →  {"/".join(cats)}')
        print('（分類唔啱嘅話直接改 gallery-data.js 對應行）')
    if not added and not removed:
        print('冇變動。')
    print(f'總數：{len(lines)} 張')

if __name__ == '__main__':
    main()
