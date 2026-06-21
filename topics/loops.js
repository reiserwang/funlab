// LOOPS — repeat an action N times. Set the loop count to make exactly enough.
(function () {
  var FL = window.FunLab;

  FL.register("loops", {
    icon: "🔁", color: "#ff7a1a",
    title: { en: "Loops", zh: "迴圈" },
    blurb: { en: "Repeat without rewriting.", zh: "重複，不用一直重寫。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🔁", title: { en: "Doing it again", zh: "再做一次" },
          body: { en: "Need 5 cookies? Don't write 🍪 five times. Say <b>repeat 5 times</b> { 🍪 }. That's a <b>loop</b>.", zh: "想要 5 塊餅乾？別寫五次 🍪。說 <b>重複 5 次</b>｛ 🍪 ｝，這就是<b>迴圈</b>。" } },
        { emoji: "🔢", title: { en: "The count", zh: "次數" },
          body: { en: "The number tells the loop <b>how many times</b> to run. Change the number, change how much you get.", zh: "那個數字告訴迴圈要跑<b>幾次</b>。改數字，做出來的數量就不同。" } },
        { emoji: "🍪", title: { en: "Bake exactly enough", zh: "剛好烤夠" },
          body: { en: "Set the loop count to bake <b>exactly</b> the number asked for. Three stages!", zh: "設定迴圈次數，<b>剛好</b>烤出要求的數量。三個關卡！" } }
      ]);
    },

    lab: function (root, ctx) {
      var levels = [{ n: 3, e: "🍪" }, { n: 5, e: "⭐" }, { n: 8, e: "🌸" }];
      FL.stages(root, ctx, levels.map(function (lv) {
        return function (r, done) { stage(r, ctx, lv.n, lv.e, done); };
      }));
    }
  });

  function stage(root, ctx, target, emoji, done) {
    var k = 1;
    var card = ctx.el("div", { class: "card center" });
    var tray = ctx.el("div", { class: "bubble", style: { fontSize: "1.8rem", minHeight: "2.4rem", display: "block" } });
    root.appendChild(card);

    function redraw() {
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "bubble" }, ctx.pick({ en: "Make exactly ", zh: "做出剛好 " }), ctx.el("b", { text: target + " " + emoji })));
      card.appendChild(ctx.el("div", { class: "bubble", style: { marginTop: ".8rem" } },
        ctx.pick({ en: "repeat ", zh: "重複 " }), ctx.el("b", { text: k }), ctx.pick({ en: " times { ", zh: " 次｛ " }), emoji, " }"));
      card.appendChild(ctx.el("div", { class: "scoreline" },
        ctx.el("button", { class: "btn", text: "➖", onclick: function () { if (k > 1) { k--; redraw(); } } }),
        ctx.pick({ en: "  count: ", zh: "  次數：" }), ctx.el("b", { text: k }), "  ",
        ctx.el("button", { class: "btn", text: "➕", onclick: function () { if (k < 12) { k++; redraw(); } } })));
      card.appendChild(ctx.el("div", { class: "btnrow" }, ctx.el("button", { class: "btn primary big", text: ctx.pick({ en: "▶ Run loop", zh: "▶ 執行迴圈" }), onclick: run })));
      tray.textContent = "";
      card.appendChild(tray);
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: "" }));
    }

    function run() {
      var i = 0; tray.textContent = "";
      var t = setInterval(function () {
        if (i >= k) {
          clearInterval(t);
          if (k === target) setTimeout(done, 350);
          else card.querySelector("#fb").textContent = k > target
            ? ctx.pick({ en: "Too many! Lower the count.", zh: "太多了！把次數調小。" })
            : ctx.pick({ en: "Not enough — raise the count.", zh: "不夠 —— 把次數調大。" });
          return;
        }
        if (FL.sfx) FL.sfx.note(420 + i * 70, 0.16); // pitch climbs as the count grows
        tray.textContent += emoji; i++;
        FL.pulse(tray, "anim-pop");
      }, 200);
    }
    redraw();
  }
})();
