// FUNCTIONS — build a "hop()" function once, then CALL it to reach the apple.
(function () {
  var FL = window.FunLab;

  FL.register("functions", {
    icon: "🐢", color: "#21c16b",
    title: { en: "Functions", zh: "函式" },
    blurb: { en: "Teach a move once, use it again & again.", zh: "教一次動作，重複使用。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "📦", title: { en: "A function is a box of steps", zh: "函式是一盒步驟" },
          body: { en: "Put some steps in a box and give it a name, like <b>hop()</b>. The box remembers them for you.", zh: "把一些步驟放進盒子並取個名字，例如 <b>hop()</b>。盒子會幫你記住它們。" } },
        { emoji: "📞", title: { en: "Call it!", zh: "呼叫它！" },
          body: { en: "Saying the name <b>runs all the steps</b>. That's a <b>function call</b>. Call it again to run them again — no need to rewrite!", zh: "說出名字就會<b>執行全部步驟</b>，這叫<b>函式呼叫</b>。再呼叫一次就再跑一遍 —— 不用重寫！" } },
        { emoji: "🐢", title: { en: "Three apples", zh: "三顆蘋果" },
          body: { en: "Each stage moves the apple 🍎 further. Build <b>hop()</b> and call it the right number of times to land <b>exactly</b> on it.", zh: "每一關蘋果 🍎 都更遠。做出 <b>hop()</b> 並呼叫剛好的次數，<b>剛好</b>停在上面。" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, [4, 6, 9].map(function (target) {
        return function (r, done) { stage(r, ctx, target, done); };
      }));
    }
  });

  function stage(root, ctx, TARGET, done) {
    var body = 1, calls = 1, len = Math.max(TARGET + 2, 9);
    var card = ctx.el("div", { class: "card center" });
    var track = ctx.el("div", { class: "maze", style: { gridTemplateColumns: "repeat(" + (len + 1) + ", minmax(0,1fr))" } });
    root.appendChild(card);

    function drawTrack(pos) {
      track.innerHTML = "";
      for (var i = 0; i <= len; i++) {
        var face = i === pos ? "🐢" : (i === TARGET ? "🍎" : "");
        track.appendChild(ctx.el("div", { class: "cell" + (i === pos && pos > 0 ? " anim-hop" : ""), text: face }));
      }
    }

    function ctrl(label, get, dec, inc, min, max) {
      return ctx.el("div", { class: "scoreline" },
        ctx.el("button", { class: "btn", text: "➖", onclick: function () { if (get() > min) { dec(); redraw(); } } }),
        " " + label + " ", ctx.el("b", { text: String(get()) }), " ",
        ctx.el("button", { class: "btn", text: "➕", onclick: function () { if (get() < max) { inc(); redraw(); } } })
      );
    }

    function redraw() {
      card.innerHTML = "";
      drawTrack(0);
      card.appendChild(track);
      var arrows = ""; for (var k = 0; k < body; k++) arrows += "➡️";
      card.appendChild(ctx.el("div", { class: "bubble" }, ctx.pick({ en: "function ", zh: "函式 " }), ctx.el("b", { text: "hop()" }), " { " + arrows + " }"));
      card.appendChild(ctrl(ctx.pick({ en: "steps in hop():", zh: "hop() 裡的步數：" }), function () { return body; }, function () { body--; }, function () { body++; }, 1, 4));
      card.appendChild(ctrl(ctx.pick({ en: "call hop() ×", zh: "呼叫 hop() ×" }), function () { return calls; }, function () { calls--; }, function () { calls++; }, 1, 5));
      card.appendChild(ctx.el("div", { class: "btnrow" }, ctx.el("button", { class: "btn primary big", text: ctx.pick({ en: "▶ Run", zh: "▶ 執行" }), onclick: run })));
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: ctx.pick({ en: "Land exactly on the apple!", zh: "剛好停在蘋果上！" }) }));
    }

    function run() {
      var total = body * calls, pos = 0;
      var fb = card.querySelector("#fb");
      var timer = setInterval(function () {
        if (pos >= total) {
          clearInterval(timer);
          if (total === TARGET) setTimeout(done, 350);
          else fb.textContent = total > TARGET
            ? ctx.pick({ en: "Too far! 🙀 Fewer steps or calls.", zh: "太遠了！🙀 少一點步數或次數。" })
            : ctx.pick({ en: "Not there yet 🐢 — add more.", zh: "還沒到 🐢 —— 再多一點。" });
          return;
        }
        pos++; if (FL.sfx) FL.sfx.hop(); drawTrack(pos);
      }, 280);
    }
    redraw();
  }
})();
