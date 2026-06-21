// RECURSION — a function that calls itself with a smaller problem, until the base case.
(function () {
  var FL = window.FunLab;
  var SIZES = ["", "🟢", "🔵", "🟣", "🟠", "🔴", "🟤"]; // doll by number, biggest = highest

  FL.register("recursion", {
    icon: "🪆", color: "#8b5cf6",
    title: { en: "Recursion", zh: "遞迴" },
    blurb: { en: "A function that calls itself.", zh: "會呼叫自己的函式。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🪆", title: { en: "Dolls inside dolls", zh: "娃娃裡的娃娃" },
          body: { en: "Open a nesting doll and there's a <b>smaller</b> doll inside. To open it, you do the <b>same thing again</b>.", zh: "打開一個俄羅斯娃娃，裡面有<b>更小</b>的娃娃。要打開它，你做<b>一樣的事</b>。" } },
        { emoji: "🔁", title: { en: "Calling itself", zh: "呼叫自己" },
          body: { en: "<b>open(5)</b> opens a doll, then calls <b>open(4)</b>, which calls <b>open(3)</b>… each time a bit <b>smaller</b>.", zh: "<b>open(5)</b> 打開一個娃娃，然後呼叫 <b>open(4)</b>，再呼叫 <b>open(3)</b>…… 每次都<b>更小</b>一點。" } },
        { emoji: "🛑", title: { en: "The base case", zh: "基本情況" },
          body: { en: "The smallest doll has nothing inside — that's the <b>base case</b>. You <b>stop</b>. Without it, recursion never ends!", zh: "最小的娃娃裡面沒有東西 —— 那就是<b>基本情況</b>，你要<b>停下來</b>。沒有它，遞迴永遠停不了！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, [3, 4, 5].map(function (n) {
        return function (r, done) { stage(r, ctx, n, done); };
      }));
    }
  });

  function stage(root, ctx, n, done) {
    var cur = n, frames = [];
    var card = ctx.el("div", { class: "card center" });
    root.appendChild(card);

    function draw(msg) {
      card.innerHTML = "";
      // the doll right now
      card.appendChild(ctx.el("div", { class: "anim-wiggle", style: { fontSize: "3rem" }, text: SIZES[cur] || "⚪" }));
      card.appendChild(ctx.el("div", { class: "bubble" }, ctx.pick({ en: "Now running ", zh: "正在執行 " }), ctx.el("b", { text: "open(" + cur + ")" })));

      // the call stack so far
      if (frames.length) {
        var stack = ctx.el("div", { style: { margin: ".8rem 0", lineHeight: "1.8" } });
        frames.forEach(function (f) { stack.appendChild(ctx.el("div", { class: "eyebrow", text: "open(" + f + ") →" })); });
        stack.appendChild(ctx.el("div", { class: "eyebrow", style: { color: "var(--ink)" }, text: "open(" + cur + ")" }));
        card.appendChild(stack);
      }

      if (cur > 1) {
        card.appendChild(ctx.el("div", { class: "btnrow" }, ctx.el("button", { class: "btn primary big",
          text: ctx.pick({ en: "Open → call open(" + (cur - 1) + ")", zh: "打開 → 呼叫 open(" + (cur - 1) + ")" }),
          onclick: function () { if (FL.sfx) FL.sfx.note(700 - cur * 60, 0.16); frames.push(cur); cur--; draw(); } })));
      } else {
        card.appendChild(ctx.el("div", { class: "bubble", style: { borderStyle: "dashed", marginTop: ".6rem" },
          html: ctx.pick({ en: "<b>open(1)</b> is the smallest — nothing inside. BASE CASE!", zh: "<b>open(1)</b> 最小 —— 裡面沒東西。基本情況！" }) }));
        card.appendChild(ctx.el("div", { class: "btnrow" }, ctx.el("button", { class: "btn primary big",
          text: ctx.pick({ en: "🛑 Stop (base case)", zh: "🛑 停止（基本情況）" }), onclick: function () { setTimeout(done, 300); } })));
      }
      card.appendChild(ctx.el("p", { class: "hint", text: msg || ctx.pick({ en: "Keep opening until you reach the smallest doll.", zh: "一直打開，直到最小的娃娃。" }) }));
    }
    draw();
  }
})();
