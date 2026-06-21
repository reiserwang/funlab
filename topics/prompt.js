// CLEAR INSTRUCTIONS — prompting: computers & AI do exactly what you say. Be specific.
(function () {
  var FL = window.FunLab;

  var STAGES = [
    [ { goal: { en: "Get the RED ball 🔴", zh: "拿紅色的球 🔴" },
        opt: [{ t: { en: "Get a ball", zh: "拿一個球" }, ok: 0 }, { t: { en: "Get the red ball", zh: "拿紅色的球" }, ok: 1 }, { t: { en: "Get something", zh: "拿東西" }, ok: 0 }] },
      { goal: { en: "Pick the BIG box 📦", zh: "選大的箱子 📦" },
        opt: [{ t: { en: "Pick a box", zh: "選一個箱子" }, ok: 0 }, { t: { en: "Pick it", zh: "選那個" }, ok: 0 }, { t: { en: "Pick the big box", zh: "選大的箱子" }, ok: 1 }] } ],
    [ { goal: { en: "Make exactly 3 stars ⭐⭐⭐", zh: "做出剛好 3 顆星 ⭐⭐⭐" },
        opt: [{ t: { en: "Make some stars", zh: "做一些星星" }, ok: 0 }, { t: { en: "Make 3 stars", zh: "做 3 顆星" }, ok: 1 }, { t: { en: "Make stars", zh: "做星星" }, ok: 0 }] },
      { goal: { en: "Give me 2 cookies 🍪🍪", zh: "給我 2 塊餅乾 🍪🍪" },
        opt: [{ t: { en: "Give cookies", zh: "給餅乾" }, ok: 0 }, { t: { en: "Give me 2 cookies", zh: "給我 2 塊餅乾" }, ok: 1 }, { t: { en: "Give a lot", zh: "給很多" }, ok: 0 }] } ],
    [ { goal: { en: "Move 2 steps right ➡️➡️", zh: "向右走 2 步 ➡️➡️" },
        opt: [{ t: { en: "Move", zh: "移動" }, ok: 0 }, { t: { en: "Move right", zh: "向右移" }, ok: 0 }, { t: { en: "Move 2 steps right", zh: "向右走 2 步" }, ok: 1 }] },
      { goal: { en: "Color the circle blue 🔵", zh: "把圓圈塗藍色 🔵" },
        opt: [{ t: { en: "Color it", zh: "塗顏色" }, ok: 0 }, { t: { en: "Color the circle blue", zh: "把圓圈塗藍色" }, ok: 1 }, { t: { en: "Make it nice", zh: "弄漂亮一點" }, ok: 0 }] } ]
  ];

  FL.register("prompt", {
    icon: "💬", color: "#ae3ec9",
    title: { en: "Clear Instructions", zh: "清楚的指令" },
    blurb: { en: "Tell AI exactly what you mean.", zh: "把意思講清楚給 AI。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "💬", title: { en: "Say what you mean", zh: "把意思說清楚" },
          body: { en: "Computers and AI do <b>exactly</b> what you say — not what you're <b>thinking</b>. So your words have to be clear.", zh: "電腦和 AI 做的是你<b>說</b>的，不是你<b>想</b>的。所以你的話要很清楚。" } },
        { emoji: "🎯", title: { en: "Vague vs specific", zh: "模糊 vs 明確" },
          body: { en: "\"Get a ball\" could grab <b>any</b> ball. \"Get the <b>red</b> ball\" is clear. Giving clear instructions to AI is called <b>prompting</b>.", zh: "「拿一個球」可能拿到<b>任何</b>球。「拿<b>紅色</b>的球」才清楚。給 AI 清楚的指令叫做 <b>prompting（下提示）</b>。" } },
        { emoji: "✅", title: { en: "Pick the best one", zh: "選最好的那個" },
          body: { en: "For each goal, choose the <b>clearest, most specific</b> instruction so the robot does exactly the right thing!", zh: "每個目標，選<b>最清楚、最明確</b>的指令，讓機器人剛好做對！" } }
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
      card.appendChild(ctx.el("div", { class: "eyebrow", text: ctx.pick({ en: "🎯 Goal", zh: "🎯 目標" }) }));
      card.appendChild(ctx.el("div", { class: "bubble", style: { fontSize: "1.3rem", margin: ".5rem auto" }, text: ctx.pick(rounds[i].goal) }));
      card.appendChild(ctx.el("p", { class: "hint", text: ctx.pick({ en: "Which instruction is clearest?", zh: "哪一個指令最清楚？" }) }));
      var box = ctx.el("div", { class: "choices", style: { flexDirection: "column", alignItems: "stretch" } });
      rounds[i].opt.forEach(function (o) {
        var b = ctx.el("button", { class: "choice", style: { fontSize: "1.1rem" }, text: "“" + ctx.pick(o.t) + "”" });
        b.addEventListener("click", function () { pick(o, b); });
        box.appendChild(b);
      });
      card.appendChild(box);
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: "" }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: (i + 1) + " / " + rounds.length }));
    }

    function pick(o, b) {
      if (!o.ok) { FL.sfx && FL.sfx.bad(); FL.pulse(b, "anim-shake"); card.querySelector("#fb").textContent = ctx.pick({ en: "Too vague — the robot got confused! 🤖", zh: "太模糊了 —— 機器人搞混了！🤖" }); return; }
      FL.sfx && FL.sfx.good(); FL.pulse(b, "anim-pop");
      i++;
      if (i >= rounds.length) { setTimeout(done, 380); return; }
      setTimeout(draw, 380);
    }
    draw();
  }
})();
