蠟模相放呢度
=============

jewel-gallery.html 右上角嘅「WAX MODEL」掣會開一個蠟模 gallery，
相喺 jewel/wax/ 入面，檔名係固定嘅：

    jewel/wax/w1-640.webp   jewel/wax/w1-1400.webp
    jewel/wax/w2-640.webp   jewel/wax/w2-1400.webp
    ...                     ...
    jewel/wax/w8-640.webp   jewel/wax/w8-1400.webp

  · -640  ＝ 格仔入面嗰張（四欄兩行，正方形裁切）
  · -1400 ＝ 撳落去放大嗰張

蠟模相唔分戒指、唔上名——一撳就係成個 gallery。

換相／加相
----------
由原圖（最好係正方形）直接出兩個尺寸：

    cwebp -q 80 -resize 640 640  -m 6 -sharp_yuv 原圖.jpg -o jewel/wax/w9-640.webp
    cwebp -q 82 -resize 1400 1400 -m 6 -sharp_yuv 原圖.jpg -o jewel/wax/w9-1400.webp

跟住喺 jewel-gallery.html 嘅 WAX 陣列加一行 ['w9', '一句描述畀讀屏軟件用']。
格仔係四欄，所以張數最好係 4 嘅倍數，唔係就會尾行唔齊。
記得順手喺 sitemap-images.xml 嗰個 jewel-gallery.html 區塊加返條 image。

圖片要求：
  · 正方形構圖（格仔係 1:1，唔係會 crop 走邊）
  · 底色淺／暖都得——gallery 底色係淡紫 #d2cae6，唔使夾硬配黑底
  · 原圖長邊 1400px 以上就夠
