#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
bump.py — 一次過更新全站 ?v= 版本號

以前十幾個檔案嘅 ?v= 要人手逐個改，改漏一個就有人食住舊 cache。
用法：
    python3 bump.py          # 自動 +1
    python3 bump.py 120      # 指定版本
"""
import re, sys, os, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
TARGETS = sorted(glob.glob(os.path.join(ROOT, '*.html'))) + \
          sorted(glob.glob(os.path.join(ROOT, '*/*.html'))) + \
          [os.path.join(ROOT, 'sw.js'),
           os.path.join(ROOT, 'cast', 'manifest.js')]

def main():
    cur = 0
    for f in TARGETS:
        if not os.path.exists(f): continue
        for m in re.finditer(r'\?v=(\d+)', open(f, encoding='utf-8').read()):
            cur = max(cur, int(m.group(1)))
    new = int(sys.argv[1]) if len(sys.argv) > 1 else cur + 1
    if new <= cur and len(sys.argv) == 1:
        new = cur + 1

    touched = []
    for f in TARGETS:
        if not os.path.exists(f): continue
        s = open(f, encoding='utf-8').read()
        n = re.sub(r'\?v=\d+', f'?v={new}', s)
        n = re.sub(r"(CACHE_VERSION\s*=\s*')[^']*(')", rf"\g<1>v{new}\g<2>", n)
        if n != s:
            open(f, 'w', encoding='utf-8').write(n)
            touched.append(os.path.relpath(f, ROOT))

    print(f'v{cur} → v{new}')
    for t in touched: print('  ✓', t)
    if not touched: print('  （冇嘢要改）')

if __name__ == '__main__':
    main()
