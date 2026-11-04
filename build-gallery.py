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

# ══════════════════════════════════════════════════════════════
#  alt 文字：由檔名砌一句短描述
#  舊版把成條檔名倒出嚟——城市串成一行、同一個字重複兩次、串錯字照抄
#  （photograher）、連唔相干嘅省份都有（ontario calgary）。咁樣對讀屏
#  軟件係噪音，對搜尋引擎係堆砌訊號。新版：地名只留一個、淨係講畫面、
#  最多五隻字。規則同 scratchpad/altgen.py 同一份，改就兩邊一齊改。
# ══════════════════════════════════════════════════════════════
# 串錯字（檔名入面真係咁串）
TYPO = {
    'casion': 'casino', 'bilding': 'building', 'birl': 'girl',
    'bridesmate': 'bridesmaid', 'phtography': 'photography',
    'architechture': 'architecture', 'vancovuer': 'vancouver',
    'photograher': 'photographer', 'photographe': 'photographer',
    'nightime': 'night', 'cityview': 'city view', 'foodcourt': 'food court',
    'streetphotographer': 'photographer', 'dt': 'downtown',
    'floristwebp': 'florist', 'straydog': 'stray dog',
    'apperal': 'apparel', 'easten': 'eastern', 'blossm': 'blossom',
    'breakfest': 'breakfast', 'herigate': 'heritage', 'luxary': 'luxury',
    'artizia': 'Aritzia', 'arbertia': 'Aritzia', 'instragram': 'Instagram',
    'pourtgese': 'Portuguese', 'portugese': 'Portuguese', 'valut': 'vault',
    'sweing': 'sewing', 'erring': 'earring', 'buddist': 'Buddhist',
    'reflextion': 'reflection', 'bnw': 'black and white', 'anf': 'and',
    'citycentre': 'city centre', 'oldbuilding': 'old building',
    'dailylife': 'daily life', 'reallife': 'real life', 'oldschool': 'old school',
    'stilllife': 'still life', 'whitesocks': 'white socks',
    'whitevan': 'white van', 'citygirl': 'city girl', 'sadgirl': 'sad girl',
    'marketsquare': 'market square', 'wetmarket': 'wet market',
    'dogwalk': 'dog walk', 'cagecity': 'cage city', 'hmart': 'H Mart',
    'tnt': 'T&T', 'mplus': 'M+', 'girlpower': 'girl power',
    'ourlet': 'outlet', 'vauged': 'vague', 'preperation': 'preparation',
    'fairmount': 'Fairmont', 'richomnd': 'richmond', 'couquitlam': 'coquitlam',
}

# 地名（連唔喺 BC 嘅都要識，先至拎得走）
PLACES = {
    'hongkong': 'Hong Kong', 'macau': 'Macau', 'vancouver': 'Vancouver',
    'victoria': 'Victoria', 'burnaby': 'Burnaby', 'richmond': 'Richmond',
    'coquitlam': 'Coquitlam', 'canada': 'Canada', 'china': 'China',
    'portugal': 'Portugal', 'asia': 'Asia', 'bc': 'BC', 'gastown': 'Gastown',
    'metrotown': 'Metrotown', 'chinatown': 'Chinatown', 'kitsilano': 'Kitsilano',
    'kerrisdale': 'Kerrisdale', 'uvic': 'UVic', 'ubc': 'UBC',
    'stanley': 'Stanley Park', 'granville': 'Granville', 'kowloon': 'Kowloon',
    'taipa': 'Taipa', 'coloane': 'Coloane', 'senado': 'Senado',
    'mongkok': 'Mong Kok', 'lisboa': 'Lisboa', 'whistler': 'Whistler', 'surrey': 'Surrey',
    'langley': 'Langley', 'seattle': 'Seattle', 'shanghai': 'Shanghai',
    'beijing': 'Beijing', 'sichuan': 'Sichuan', 'ontario': 'Ontario',
    'calgary': 'Calgary', 'alberta': 'Alberta', 'toronto': 'Toronto',
    'montreal': 'Montreal', 'japan': 'Japan', 'korea': 'Korea',
    'taiwan': 'Taiwan', 'asian': 'Asia', 'burnany': 'Burnaby',
    'arberdeen': 'Aberdeen', 'northvan': 'North Vancouver',
    'westvan': 'West Vancouver', 'yvr': 'Vancouver', 'yyc': 'Calgary',
    'shenzhen': 'Shenzhen', 'brentwood': 'Brentwood', 'gilmore': 'Gilmore',
    'renfrew': 'Renfrew', 'fisgard': 'Fisgard', 'capilano': 'Capilano',
    'fraser': 'Fraser', 'sfu': 'SFU', 'eastvan': 'East Vancouver',
}

# 檔名入面拆開咗嘅地名：hong_kong、mong_kok
PAIRS = {('hong', 'kong'): 'Hong Kong', ('mong', 'kok'): 'Mong Kok'}

# 唔係地名、但要保留大寫
PROPER = {
    'english': 'English', 'chinese': 'Chinese', 'portuguese': 'Portuguese',
    'japanese': 'Japanese', 'cantonese': 'Cantonese', 'german': 'German',
    'christmas': 'Christmas', 'halloween': 'Halloween', 'polaroid': 'Polaroid',
    'kodak': 'Kodak', 'fuji': 'Fuji', 'leica': 'Leica', 'costco': 'Costco',
    'ikea': 'IKEA', 'starbucks': 'Starbucks', 'disney': 'Disney',
}

DROP = {'of', 'and', 'the', 'with', 'a', 'in', 'on', 'at', 'to', 'x', 'is',
        'for', 'by', 'from', 'my', 'her', 'his', 'its', 'no'}

# 賣廣告同器材雜訊：alt 要講畫面，唔係講服務
SKIP = {'photographer', 'photography', 'photographers', 'photo', 'photos',
        'filmic', 'film', 'shoot', 'shooting', 'session', 'pic', 'picture',
        'jpg', 'jpeg', 'webp', 'png', 'raw', 'edit', 'edited', 'final',
        'copy', 'new', 'best', 'top', 'hikki', 'photograph', 'photoshoot',
        'petphoto', 'capture', 'capturing', 'shot', 'zoom', 'lens'}

MAXW = 5          # 主體最多五隻字：夠描述，唔夠堆砌


def alt_text(fname):
    n = re.sub(r'\.(webp|jpe?g|png)$', '', fname, flags=re.I)
    n = re.sub(r'^x?g\d+[-_]?', '', n)

    raw = [t.strip().lower() for t in re.split(r'[_\-\s]+', n) if t.strip()]
    toks, i = [], 0
    while i < len(raw):
        pair = PAIRS.get((raw[i], raw[i + 1])) if i + 1 < len(raw) else None
        if pair:
            toks.append(pair.lower().replace(' ', ''))   # hongkong / mongkok
            i += 2
            continue
        toks.append(re.sub(r'\d+$', '', raw[i]) or raw[i])   # skyline2 → skyline
        i += 1

    words, place, seen = [], None, set()
    for t in toks:
        if not t:
            continue
        t = re.sub(r'(webp|jpe?g|png)$', '', t) or t      # floristwebp → florist
        t = TYPO.get(t, t)
        if t.isdigit() or t in DROP or t in SKIP:
            continue
        if len(t) <= 2 and t not in ('ox', 'ox'):          # dt、a1、v2 之類碎片
            continue
        if re.fullmatch(r'[a-z]\d{1,3}', t):
            continue
        if t in PLACES:                                    # 地名抽起，只留第一個做後綴
            if place is None:
                place = PLACES[t]
            continue
        w = PROPER.get(t, t)
        if w.lower() in seen:                              # 成句去重，唔只去連續重複
            continue
        seen.add(w.lower())
        words.append(w)

    if len(words) > MAXW:
        words = words[-MAXW:]                              # 尾段先至係分得開嘅細節

    body = ' '.join(words)
    if not body:
        body = 'Documentary photograph'
    body = body[0].upper() + body[1:]
    return body + ' — ' + place if place else body


# ══════════════════════════════════════════════════════════════
#  responsive 變體：photos/r/<base>-<w>.webp
#  手機以前要硬食 1200px 嘅相去填一個 375px 嘅格。
# ══════════════════════════════════════════════════════════════
VARIANT_DIR = os.path.join(ROOT, 'photos', 'r')
WIDTHS = (400, 800, 1200)


def variants(fname):
    base = os.path.splitext(fname)[0]
    return [w for w in WIDTHS
            if os.path.exists(os.path.join(VARIANT_DIR, f'{base}-{w}.webp'))]


RULES = [
    ('times',   r'wedding|bride|bridesmaid|bridesmate|vow|prewedding|family|party|birthday|thanksgiving|anniversary'),
    ('friends', r'dog|[-_]cat|cat[-_]|kitten|puppy|pet|bird|birl|shelti|tabby|coon|parrot|myna|pheasant|stray'),
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
    existing = dict(re.findall(r'\{\s*src:\s*"([^"]+)",\s*cat:\s*\[([^\]]*)\]', src))

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
        a = alt_text(name).replace('"', "'")
        ws = variants(name)
        w_js = f', w: [{", ".join(str(w) for w in ws)}]' if ws else ''
        return f'  {{ src: "{name}", cat: [{cats_js}], alt: "{a}"{w_js}{ph_js} }},'
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

    ordered = []
    for ln in lines:
        m = re.search(r'src:\s*"([^"]+)".*?alt:\s*"([^"]*)"', ln)
        if m:
            ordered.append((m.group(1), m.group(2)))
    n_static = write_static_block(ordered)
    n_img = write_image_sitemap(ordered)
    print(f'靜態後備清單：{n_static} 張寫入 gallery.html')
    print(f'圖片 sitemap：{n_img} 張寫入 sitemap-images.xml')


# ══════════════════════════════════════════════════════════════
#  爬蟲／冇 JS 嘅後備：靜態相片清單 + 圖片 sitemap
#  以前 gallery.html 靜態 HTML 得 178 字、1 個 <img>，380 張相
#  全部靠 JS 注入，唔行 JS 嘅爬蟲乜都見唔到。
# ══════════════════════════════════════════════════════════════
GAL_FILE = os.path.join(ROOT, 'gallery.html')
SITEMAP_IMG = os.path.join(ROOT, 'sitemap-images.xml')
STATIC_N = 48
BASE_URL = 'https://hikki.ca/'


def esc(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;')
             .replace('>', '&gt;').replace('"', '&quot;'))


def write_static_block(items):
    """把頭 STATIC_N 張寫入 gallery.html 嘅 <noscript>。"""
    if not os.path.exists(GAL_FILE):
        return 0
    rows = []
    for name, alt in items[:STATIC_N]:
        rows.append(f'      <li><img src="photos/{esc(name)}" alt="{esc(alt)}" '
                    f'width="800" height="1200" loading="lazy"></li>')
    block = ('  <noscript>\n'
             '    <h2>Selected photographs</h2>\n'
             '    <ul class="gal-static">\n' + '\n'.join(rows) + '\n'
             '    </ul>\n'
             '  </noscript>\n')
    g = open(GAL_FILE, encoding='utf-8').read()
    pat = re.compile(r'  <noscript>\s*\n    <h2>Selected photographs</h2>.*?  </noscript>\n',
                     re.S)
    if pat.search(g):
        g = pat.sub(block, g)
    else:
        i = g.find('<div class="load-more-wrap">')
        if i < 0:
            return 0
        g = g[:i] + block + '  ' + g[i:]
    open(GAL_FILE, 'w', encoding='utf-8').write(g)
    return len(rows)


def write_image_sitemap(items):
    """圖片 sitemap：唔使爬蟲行 JS 都收錄到全部 380 張。"""
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
           f'  <url>', f'    <loc>{BASE_URL}gallery.html</loc>']
    for name, alt in items:
        out.append('    <image:image>')
        out.append(f'      <image:loc>{BASE_URL}photos/{esc(name)}</image:loc>')
        out.append(f'      <image:title>{esc(alt)}</image:title>')
        out.append('    </image:image>')
    out += ['  </url>', '</urlset>', '']
    open(SITEMAP_IMG, 'w', encoding='utf-8').write('\n'.join(out))
    return len(items)


if __name__ == '__main__':
    main()
