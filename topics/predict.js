// PREDICT THE NEXT — spotting patterns to guess what comes next: how generative AI works.
(function () {
  var FL = window.FunLab;

  var STAGES = [
    [ { seq: ["🔴", "🟡", "🔴", "🟡", "🔴"], opt: ["🟡", "🔴", "🔵"], a: 0 },
      { seq: ["🐶", "🐱", "🐶", "🐱"], opt: ["🐭", "🐶", "🐱"], a: 1 },
      { seq: ["⬆️", "➡️", "⬆️", "➡️"], opt: ["⬆️", "⬇️", "➡️"], a: 0 } ],
    [ { seq: ["2", "4", "6", "8"], opt: ["9", "10", "12"], a: 1 },
      { seq: ["1", "2", "3", "4"], opt: ["5", "6", "4"], a: 0 },
      { seq: ["5", "10", "15"], opt: ["20", "25", "16"], a: 0 } ],
    [ { seq: ["1", "2", "4", "8"], opt: ["10", "16", "12"], a: 1 },
      { seq: ["A", "B", "C", "D"], opt: ["F", "E", "G"], a: 1 },
      { seq: ["🌑", "🌒", "🌓", "🌔"], opt: ["🌕", "🌑", "🌖"], a: 0 } ]
  ];

  FL.register("predict", {
    icon: "🔮", color: "#4263eb",
    title: { en: "Predict the Next", zh: "預測下一個" },
    blurb: { en: "How AI guesses what's next.", zh: "AI 如何猜下一個。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🔮", title: { en: "Spot the pattern", zh: "找出規律" },
          body: { en: "Look at <b>🔴🟡🔴🟡🔴…</b> — what comes next? You spotted the <b>pattern</b> and predicted 🟡.", zh: "看 <b>🔴🟡🔴🟡🔴…</b> —— 下一個是什麼？你發現了<b>規律</b>，預測是 🟡。" } },
        { emoji: "🤖", title: { en: "This is how AI works", zh: "AI 就是這樣運作" },
          body: { en: "A <b>chatbot</b> AI works like this: it reads tons of words and <b>predicts the next word</b>, again and again, to write a sentence.", zh: "<b>聊天機器人</b>就是這樣：讀很多很多字，然後一直<b>預測下一個字</b>，組成句子。" } },
        { emoji: "🎯", title: { en: "Your turn to predict", zh: "換你來預測" },
          body: { en: "Find the pattern and tap what comes next. The patterns get trickier each stage!", zh: "找出規律，點出下一個。每一關規律會更難喔！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, STAGES.map(function (rounds) {
        return function (r, done) { stage(r, ctx, rounds, done); };
      }));
    }
  });

  function stage(root, ctx, rounds, done) {
    var i = 0;
    var card = ctx.el("div", { class: "card center" });
    root.appendChild(card);

    function draw() {
      card.innerHTML = "";
      var rd = rounds[i];
      card.appendChild(ctx.el("div", { class: "bubble", text: ctx.pick({ en: "What comes next?", zh: "下一個是什麼？" }) }));
      var row = ctx.el("div", { class: "slots" });
      rd.seq.forEach(function (x) { row.appendChild(ctx.el("div", { class: "slot full", style: { fontSize: "1.3rem" }, text: x })); });
      row.appendChild(ctx.el("div", { class: "slot", style: { fontWeight: "800" }, text: "?" }));
      card.appendChild(row);
      var box = ctx.el("div", { class: "choices" });
      rd.opt.forEach(function (o, idx) {
        var b = ctx.el("button", { class: "choice", text: o });
        b.addEventListener("click", function () { pick(idx, b); });
        box.appendChild(b);
      });
      card.appendChild(box);
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: "" }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: (i + 1) + " / " + rounds.length }));
    }

    function pick(idx, b) {
      if (idx !== rounds[i].a) { FL.sfx && FL.sfx.bad(); FL.pulse(b, "anim-shake"); card.querySelector("#fb").textContent = ctx.pick({ en: "Not the pattern — look again! 🤗", zh: "不是這個規律 —— 再看看！🤗" }); return; }
      FL.sfx && FL.sfx.good(); FL.pulse(b, "anim-pop");
      i++;
      if (i >= rounds.length) { setTimeout(done, 380); return; }
      setTimeout(draw, 380);
    }
    draw();
  }
})();
