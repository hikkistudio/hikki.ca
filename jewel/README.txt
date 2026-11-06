蠟模相放呢度
=============

jewel-gallery.html 右上角嘅「WAX MODEL」掣會開一個蠟模 gallery，
相喺 jewel/wax/ 入面，檔名係固定嘅：

    jewel/wax/w1-640.webp   jewel/wax/w1-1400.webp
    jewel/wax/w2-640.webp   jewel/wax/w2-1400.webp
    ...                     ...
    jewel/wax/w20-640.webp  jewel/wax/w20-1400.webp

  · -640  ＝ 格仔入面嗰張（四欄兩行，正方形裁切）
  · -1400 ＝ 撳落去放大嗰張

蠟模相唔分戒指、唔上名——一撳就係成個 gallery。

換相／加相
----------
由原圖（最好係正方形）直接出兩個尺寸：

    cwebp -q 80 -resize 640 640  -m 6 -sharp_yuv 原圖.jpg -o jewel/wax/w21-640.webp
    cwebp -q 82 -resize 1400 1400 -m 6 -sharp_yuv 原圖.jpg -o jewel/wax/w21-1400.webp

跟住喺 jewel-gallery.html 嘅 WAX 陣列加一行 ['w21', '一句描述畀讀屏軟件用']。
電腦版格仔係五欄、手機兩欄，所以張數最好係 10 嘅倍數（而家 20 張 ＝ 5×4，
啱啱一屏唔使捲）。記得順手喺 sitemap-images.xml 嗰個 jewel-gallery.html
區塊加返條 image——嗰度係爬蟲唯一見到蠟模相嘅地方。

WAX 陣列嘅次序就係畫面次序，唔使跟檔名號碼；而家係新舊相間排。

圖片要求：
  · 正方形構圖（格仔係 1:1，唔係會 crop 走邊）
  · 底色淺／暖都得——gallery 底色係淡紫 #d2cae6，唔使夾硬配黑底
  · 原圖長邊 1400px 以上就夠
