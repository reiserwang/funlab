// SEARCH — guess the secret number with higher/lower. Halving = binary search.
(function () {
  var FL = window.FunLab;

  FL.register("search", {
    icon: "🔍", color: "#8b5cf6",
    title: { en: "Search", zh: "搜尋" },
    blurb: { en: "Find the hidden number, fast.", zh: "快速找到藏起來的數字。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🙈", title: { en: "Find the hidden number", zh: "找出藏起來的數字" },
          body: { en: "I'm thinking of a number. Can you find it?", zh: "我想了一個數字，你能找到嗎？" } },
        { emoji: "✂️", title: { en: "Cut it in half", zh: "對半切" },
          body: { en: "Don't guess 1, 2, 3… Guess the <b>middle</b>! Each guess throws away <b>half</b> the numbers. That's <b>binary search</b>.", zh: "別猜 1、2、3…… 猜<b>中間</b>！每猜一次就丟掉<b>一半</b>的數字，這就是<b>二分搜尋</b>。" } },
        { emoji: "⚡", title: { en: "Bigger each stage", zh: "每關更大" },
          body: { en: "Stage 1 is 1–10, then 1–50, then 1–100. Halving finds any of them in just a few guesses!", zh: "第一關 1–10，再來 1–50，最後 1–100。用對半法幾次就能找到！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, [10, 50, 100].map(function (max) {
        return function (r, done) { stage(r, ctx, max, done); };
      }));
    }
  });

  function stage(root, ctx, MAX, done) {
    var secret = 1 + ((Math.random() * MAX) | 0);
    var lo = 1, hi = MAX, guesses = 0;
    var card = ctx.el("div", { class: "card center" });
    root.appendChild(card);

    function draw(msg) {
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "bubble", html: ctx.pick({ en: "It's somewhere from ", zh: "它在 " }) + "<b>" + lo + "</b> — <b>" + hi + "</b>" }));
      var input = ctx.el("input", { type: "number", min: lo, max: hi, class: "numin" });
      var guessBtn = ctx.el("button", { class: "btn primary big", text: ctx.pick({ en: "Guess!", zh: "猜！" }), onclick: function () { go(parseInt(input.value, 10)); } });
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(parseInt(input.value, 10)); });
      card.appendChild(ctx.el("div", { style: { margin: "1rem 0" } }, input, " ", guessBtn));
      card.appendChild(ctx.el("button", { class: "btn", text: ctx.pick({ en: "🤔 Try the middle (" + (((lo + hi) / 2) | 0) + ")", zh: "🤔 試中間 (" + (((lo + hi) / 2) | 0) + ")" }),
        onclick: function () { input.value = ((lo + hi) / 2) | 0; input.focus(); } }));
      card.appendChild(ctx.el("p", { class: "hint", html: msg || "" }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: ctx.pick({ en: "Guesses: ", zh: "猜了：" }) + guesses }));
      input.focus();
    }

    function go(g) {
      if (!(g >= 1 && g <= MAX)) return;
      guesses++;
      if (g === secret) { if (FL.sfx) FL.sfx.good(); setTimeout(done, 250); return; }
      if (FL.sfx) { var close = 1 - Math.min(1, Math.abs(g - secret) / MAX); FL.sfx.note(320 + close * 560, 0.16); } // hotter = higher
      if (g < secret) { lo = Math.max(lo, g + 1); draw(ctx.pick({ en: "⬆️ Higher!", zh: "⬆️ 更大！" })); }
      else { hi = Math.min(hi, g - 1); draw(ctx.pick({ en: "⬇️ Lower!", zh: "⬇️ 更小！" })); }
    }
    draw(ctx.pick({ en: "Type a number and guess!", zh: "輸入一個數字來猜！" }));
  }
})();
