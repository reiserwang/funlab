// FUNCTIONS — teach hop() a few steps, then press Call to run it. Reach the apple.
(function () {
  var FL = window.FunLab;

  FL.register("functions", {
    icon: "🐢", color: "#21c16b",
    title: { en: "Functions", zh: "函式" },
    blurb: { en: "Teach a move once, use it again & again.", zh: "教一次動作，重複使用。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "📦", title: { en: "A function remembers steps", zh: "函式記住步驟" },
          body: { en: "Teach <b>hop()</b> a few steps, like <b>➡️➡️</b>. Give it a name once and it remembers — you don't rewrite the steps.", zh: "教 <b>hop()</b> 幾個步驟，例如 <b>➡️➡️</b>。取一次名字它就記住了 —— 你不用再重寫步驟。" } },
        { emoji: "📞", title: { en: "Press Call to run it", zh: "按呼叫來執行" },
          body: { en: "Press <b>Call hop()</b> and the turtle does those steps. Press it <b>again</b> to do them again — same function, used many times.", zh: "按 <b>呼叫 hop()</b>，烏龜就做那些步驟。再按一次就再做一遍 —— 同一個函式，用很多次。" } },
        { emoji: "🍎", title: { en: "Land on the apple", zh: "停在蘋果上" },
          body: { en: "Pick a hop size, then Call until the turtle lands <b>exactly</b> on 🍎. Too far? Tap <b>Reset</b> and try a different size.", zh: "選一個步數，然後一直呼叫直到烏龜<b>剛好</b>停在 🍎。太遠了？按 <b>重來</b> 換不同的步數。" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, [4, 6, 9].map(function (d) {
        return function (r, done) { stage(r, ctx, d, done); };
      }));
    }
  });

  function stage(root, ctx, D, done) {
    var body = 1, pos = 0, calls = 0, busy = false, len = D + 4; // room to overshoot
    var card = ctx.el("div", { class: "card center" });
    var track = ctx.el("div", { class: "maze", style: { gridTemplateColumns: "repeat(" + (len + 1) + ", minmax(0,1fr))" } });
    root.appendChild(card);

    function drawTrack() {
      track.innerHTML = "";
      for (var i = 0; i <= len; i++) {
        var face = i === pos ? "🐢" : (i === D ? "🍎" : "");
        track.appendChild(ctx.el("div", { class: "cell" + (i === pos && pos > 0 ? " anim-hop" : ""), text: face }));
      }
    }

    function redraw() {
      card.innerHTML = "";
      drawTrack();
      card.appendChild(track);
      var arrows = ""; for (var k = 0; k < body; k++) arrows += "➡️";
      card.appendChild(ctx.el("div", { class: "bubble" }, ctx.pick({ en: "function ", zh: "函式 " }), ctx.el("b", { text: "hop()" }), " { " + arrows + " }"));
      card.appendChild(ctx.el("div", { class: "scoreline" },
        ctx.el("button", { class: "btn", text: "➖", onclick: function () { if (!busy && body > 1) { body--; redraw(); } } }),
        ctx.pick({ en: "  steps in hop(): ", zh: "  hop() 的步數：" }), ctx.el("b", { text: body }), "  ",
        ctx.el("button", { class: "btn", text: "➕", onclick: function () { if (!busy && body < 4) { body++; redraw(); } } })));
      card.appendChild(ctx.el("div", { class: "btnrow" },
        ctx.el("button", { class: "btn primary big", text: ctx.pick({ en: "📞 Call hop()", zh: "📞 呼叫 hop()" }), onclick: call }),
        ctx.el("button", { class: "btn", text: ctx.pick({ en: "↺ Reset", zh: "↺ 重來" }), onclick: function () { if (!busy) { pos = 0; calls = 0; redraw(); } } })));
      card.appendChild(ctx.el("div", { class: "scoreline", text: ctx.pick({ en: "Called hop() ", zh: "呼叫 hop() " }) + calls + ctx.pick({ en: " times", zh: " 次" }) }));
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: ctx.pick({ en: "Press Call hop() to run its steps.", zh: "按「呼叫 hop()」來執行它的步驟。" }) }));
    }

    function call() {
      if (busy) return;
      if (pos >= D) { card.querySelector("#fb").textContent = ctx.pick({ en: "Past the apple — tap Reset.", zh: "超過蘋果了 —— 按重來。" }); return; }
      busy = true; calls++;
      var done2 = pos + body, fb = card.querySelector("#fb");
      var t = setInterval(function () {
        if (pos >= done2) {
          clearInterval(t); busy = false;
          if (pos === D) { if (FL.sfx) FL.sfx.good(); setTimeout(done, 450); }
          else { redraw(); if (pos > D) fb.textContent = ctx.pick({ en: "Too far! Tap Reset and try a smaller hop.", zh: "太遠了！按重來，換小一點的步數。" }); }
          return;
        }
        pos++; if (FL.sfx) FL.sfx.hop(); drawTrack();
      }, 240);
    }
    redraw();
  }
})();
