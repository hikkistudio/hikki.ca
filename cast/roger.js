/* =====================================================================
   cast/roger.js — Roger（《燈火》邱曉棋）
   場景：長途電話。（jeweldesign 頁嘅 ask roger for detail——就係佢。）
   ===================================================================== */
(function () {
  var C = {
    id: "roger", name: "Roger",
    occupation: "goldsmith / ELITE LINK", age: "71", star: "α Aurigae", hue: 48,
    script: [
      { speaker: "——", text: "撥號音。兩聲。三聲。接通嗰下，背景有打磨機由高轉慢嘅呼聲。" },
      { text: "喂——邊位？" },
      { speaker: "YOU", text: "……" },
      { text: "唔出聲。一係查數，一係舊朋友。" },
      { text: "呼吸聱咁後生，唔似查數。講啦兄弟。" },
      { speaker: "——", text: "聲音清朗，音節略帶鼻音。笑容隔住電話線都聽得出。" },
      { type: "choice", text: "打磨機停低。佢等緊。", choices: [
        { label: "1, 想整一件金器。", jump: "r_gold" },
        { label: "2, 想問啲舊事。", jump: "r_old" }
      ] },
      { id: "r_gold", text: "啱嚟。呢行而家冇乜人用手做喇。" },
      { type: "jump", target: "r_receipt" },
      { id: "r_old", text: "舊事好貴㗎兄弟。" },
      { text: "不過你打得嚟，即係有人畀咗個號碼你。慢慢傾。" },
      { type: "jump", target: "r_receipt" },

      { id: "r_receipt", text: "規矩先講——取貨一定要收據。無人可以例外。" },
      { speaker: "YOU", text: "點解？" },
      { text: "冇點解。規矩。" },
      { speaker: "——", text: "佢吃吃地笑。笑聲後面，有隻杯放落瓷碟嘅輕響。" },

      { text: "我間舖以前喺唐人街外圍。牙醫、珠寶、鐘錶維修。白底紅字。" },
      { text: "門口有盆嘢，枝葉好似水管咁蔓延，永遠呈現一種貪婪下流嘅生命力。" },
      { text: "但係我從來未見過佢長大一分。" },
      { text: "室內有氨水味。人人話似牙科診所。我幾鍾意。" },
      { type: "choice", text: "電話入面傳嚟開抽屜聲。", choices: [
        { label: "1, 間舖仲喺度？", jump: "r_shop" },
        { label: "2, 你以前做過啲咩生意？", jump: "r_biz" }
      ] },
      { id: "r_shop", text: "唐人街唔再係一個地名。係一組緩慢死亡嘅場景。" },
      { text: "老移民用唔再通電嘅霓虹招牌，守住一種無聲嘅失敗。" },
      { text: "無人會為假貨嘅覆滅感到半點可惜。……我把口係咁，你咪介意。" },
      { type: "jump", target: "r_casino" },
      { id: "r_biz", text: "金器。器材。——運輸。" },
      { text: "有啲箱，執得好過人體胸腔。每一件擺喺邊，我閉住眼都知。" },
      { text: "工具啫。" },
      { type: "jump", target: "r_casino" },

      { id: "r_casino", type: "choice", text: "打磨機又開返，低速。", choices: [
        { label: "1, 你好似心情幾好。", jump: "r_win" },
        { label: "2, （等佢講落去）", jump: "r_wait" }
      ] },
      { id: "r_win", text: "梗係。九三年大年初一，我喺賭莊連過五關。" },
      { text: "成地瓜子殼。我對高踭鞋咁樣「咯咯咯」踩過去。" },
      { speaker: "YOU", text: "高踭鞋？" },
      { text: "係呀。你聽個聲——全場靜晒，得你一個人喺度響。" },
      { text: "嗰晚我個 call 機響。021。……跟住嘅嘢，唔講喇。" },
      { type: "jump", target: "r_daid" },
      { id: "r_wait", text: "……你幾識做。" },
      { text: "九三年大年初一，我連過五關。嗰晚我個 call 機響。021。" },
      { text: "跟住嘅嘢，唔講喇。" },
      { type: "jump", target: "r_daid" },

      { id: "r_daid", type: "gate", met: "daid", then: "r_daid_met", else: "r_daid_no" },
      { id: "r_daid_met", speaker: "——", text: "你提起另一段信號。電話嗰邊靜晒。打磨機都停埋。" },
      { text: "……佢仲咳唔咳？" },
      { speaker: "YOU", text: "咳。" },
      { text: "……嘻。廿三年。仲咳。" },
      { text: "佢嗰時嚟攞貨，我話：聽晚唔郁手就搵我食飯囉。佢含糊應咗一聲。" },
      { text: "佢冇嚟。" },
      { text: "我仲留住個位。" },
      { type: "jump", target: "r_ring" },
      { id: "r_daid_no", text: "有個舊朋友，高瘦，戴眼鏡。嚟我度攞過一箱攝影器材。" },
      { text: "臨走我話：得閒就嚟食飯。" },
      { text: "佢冇嚟。呢行啲人唔嚟食飯，唔係唔畀面。係嚟唔到。" },
      { type: "jump", target: "r_ring" },

      { id: "r_ring", speaker: "——", text: "佢清一清喉嚨。聲音返返嚟做生意嘅光澤。" },
      { text: "而家？幫人鑄下戒指。九二五銀，made to order。" },
      { text: "有個設計師畫嘅嘢幾靚。山茶一隻，圖章一隻。開蠟鑄銀，全部呢對手。" },
      { speaker: "YOU", text: "詳情呢？" },
      { text: "詳情？——咪就係咁問囉。嘻嘻。" },
      { text: "好喇兄弟，長途電話好貴。雖然係你畀錢。" },
      { text: "落嚟呢邊，嚟搵我食飯。帶埋收據。" },
      { type: "end", text: "電話收線。最後一下笑聲後面，有一下好輕嘅咳——唔知係佢，定係電話線老化嘅雜音。" }
    ]
  };
  (window.CAST = window.CAST || []).push(C);
})();
