/* =====================================================================
   cast/daid.js — 大D（《燈火》邱曉棋）
   場景：一段唔應該存在嘅信號。發射站已經拆卸。
   ===================================================================== */
(function () {
  var C = {
    id: "daid", name: "大D",
    occupation: "newsagent / ex-company", age: "†63", star: "α Orionis", hue: 335,
    script: [
      { speaker: "——", text: "searching... station not found..." },
      { speaker: "——", text: "紅光。定影劑嘅氣味。牆角冷氣機嘅運轉聲。" },
      { text: "我唔知你係邊個。不過部機接通咗，即係有嘢要講。" },
      { speaker: "——", text: "咳咗一下，佢將眼鏡推返上鼻樑。" },
      { type: "choice", text: "紅光入面，長檯上擺住兩樣嘢：一部相機，一把十字弓。", choices: [
        { label: "1, 講下部相機。", jump: "d_cam" },
        { label: "2, 講下把弓。", jump: "d_bow" }
      ] },

      { id: "d_cam", text: "福倫達 ULTRAMATIC。SEPTON 50mm f/2。鋼塊，沉重踏實。" },
      { text: "七枚鏡片。光圈全開、低速快門嗰陣，解析力最強。" },
      { text: "但係手一震——即使極為輕微——銀絲般嘅散光就會化成一團亂麻。" },
      { text: "絕對穩定嘅雙手，係一個菲林攝影師不可缺少嘅條件。" },
      { type: "jump", target: "d_same" },
      { id: "d_bow", text: "港英特警退役型號。改裝過，加入沉重嘅內嵌鋼骨。" },
      { text: "每次保養，先洗手，戴手套。後生嗰陣，仲會加個髮網。" },
      { text: "同維修一部嬌貴嘅德國相機一樣——都係為咗捉住某個唔能夠再發生嘅瞬間。" },
      { text: "弓弦繃緊嗰下，指尖微動，其聲細若線割。同菲林過片嘅咔嗒聲，冇分別。" },
      { type: "jump", target: "d_same" },
      { id: "d_same", text: "對準，定格，判斷。等待，無餘地。" },
      { text: "我從來唔叫佢做武器。佢係工具。" },

      { speaker: "——", text: "信號跳咗一下。紅光入面浮出一張米黃色信紙嘅輪廓。" },
      { text: "信紙唔署名。印刷體打得太深，油墨喺字與字之間留低未乾嘅壓痕。" },
      { text: "左上角夾住目標嘅近照。過曝，但清晰。" },
      { text: "嗰次嘅要求係：必須喺公開場合。" },
      { type: "choice", text: "冷氣機嘅聲音停咗半秒，又繼續。", choices: [
        { label: "1, 你唔鍾意公開？", jump: "d_public" },
        { label: "2, 你冇得揀？", jump: "d_choice" }
      ] },
      { id: "d_public", text: "我對屠戮係反感嘅。我一般揀毒殺。" },
      { text: "死亡應該要乾淨。不拖泥帶水，不嘶吼，不乞求。" },
      { type: "jump", target: "d_van" },
      { id: "d_choice", text: "揀？" },
      { speaker: "——", text: "佢咳咗兩聲。" },
      { text: "……你後生。" },
      { type: "jump", target: "d_van" },

      { id: "d_van", speaker: "——", text: "雜訊入面滲入另一種天氣：晨霧，掛喺電纜同招牌之間。" },
      { text: "九三年，大年初一前。" },
      { text: "航廈晦暗。背景播住唔知名嘅慢板爵士，好似舊錄音帶倒轉，又熟悉又錯置。" },
      { text: "我遞上護照。British National Overseas。冇任何懷疑。" },
      { text: "徑直穿過幾千、幾百個家庭。" },
      { text: "一座徒然嘅城市。一處無人知道我曾經到過嘅地方。" },
      { type: "choice", text: "佢頓咗一頓。", choices: [
        { label: "1, 目標係邊個？", jump: "d_her" },
        { label: "2, 任務順唔順利？", jump: "d_miss" }
      ] },

      { id: "d_miss", text: "第一晚試射。八十米。風速四點二，西北偏西。落葉有二次擺動。" },
      { text: "偏右四公分修正。無風。釋放。" },
      { text: "……箭落處，離開預定三度。" },
      { text: "我唔熟嗰度嘅樓距、氣流、夜間冷暖層。風從不喺預定嘅方向出現。" },
      { text: "嗰枝箭由瀝青拔返出嚟嗰陣，仲有餘溫。" },
      { text: "嗰一刻佢唔係武器。佢係一段尚未解釋嘅錯誤。" },
      { type: "jump", target: "d_her" },

      { id: "d_her", speaker: "——", text: "信號入面有一下快門聲。如同大鐘嘅秒針——逆行嘅秒針。" },
      { text: "我第一次見佢，係透過監控畫面。" },
      { text: "螢幕上嘅佢，同螢幕上映出嘅我，一齊存在於某種不對稱嘅光入面。" },
      { text: "佢行過走廊，纖細嘅身影俾兩側扶手框成無數長方。" },
      { text: "嗰種味唔係香水。係由命運深處滲出嚟嘅甜味。" },
      { text: "成熟過度嘅白桃。盛夏夜嘅無花果。快要溢出瓶口嘅陳釀。" },
      { text: "嗰種係絕美嘅生命。嗰種係腐爛前嘅極致。" },
      { speaker: "——", text: "佢又咳。今次耐啲。" },
      { type: "choice", text: "「我退下戎裝，一步一步，行入個湖度。」", choices: [
        { label: "1, 你殺咗佢？", jump: "d_kill" },
        { label: "2, 你後悔？", jump: "d_regret" }
      ] },
      { id: "d_kill", text: "……相入面嘅人，唔會老。" },
      { type: "jump", target: "d_after" },
      { id: "d_regret", text: "廿三年之後再諗返嗰一刻——" },
      { text: "我仲係冇後悔。" },
      { type: "jump", target: "d_after" },

      { id: "d_after", type: "gate", met: "roger", then: "d_roger", else: "d_macau" },
      { id: "d_roger", speaker: "——", text: "你提起另一段信號。佢靜咗一陣。" },
      { text: "Roger。攞貨，佢一定要收據。" },
      { text: "……佢仲著唔著高踭鞋。" },
      { speaker: "——", text: "一下極短嘅聲音。可能係笑。" },
      { type: "jump", target: "d_macau" },

      { id: "d_macau", speaker: "——", text: "信號開始衰減。雜訊入面有雨聲。" },
      { text: "回歸之後，我喺祐漢賣報紙。廿年。" },
      { text: "冇人揸到我半點把柄。頭條日日喜慶。" },
      { text: "招潮蟹沿住水渠爬上我個檔口。佢出世嘅地方，喺兩百六十公里外嘅泥灘。" },
      { text: "時間嘅流逝，每次每次嘅妥協，一點一點，把尊嚴變成滑稽。" },
      { type: "choice", text: "雨聲越嚟越近。信號得返一格。", choices: [
        { label: "1, 嗰朝發生咗咩事？", jump: "d_end1" },
        { label: "2, 你點解唔避？", jump: "d_end2" }
      ] },
      { id: "d_end1", text: "落好大雨。有個人行埋嚟。" },
      { text: "佢同我講嘢。我聽晒。" },
      { type: "jump", target: "d_final" },
      { id: "d_end2", text: "……" },
      { speaker: "——", text: "一下好長嘅靜。紅光穩定。" },
      { type: "jump", target: "d_final" },
      { id: "d_final", text: "落雨喇。你部機，聽唔聽到雨聲？" },
      { speaker: "YOU", text: "聽到。" },
      { text: "咁就好。" },
      { type: "end", text: "紅光熄滅。菲林過片嘅聲音，喺好遠嘅地方停低。" }
    ]
  };
  (window.CAST = window.CAST || []).push(C);
})();
