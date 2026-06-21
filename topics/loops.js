// LOOPS — a loop repeats an action. Fill every jar by repeating the right number of times.
(function () {
  var FL = window.FunLab;

  FL.register("loops", {
    icon: "🔁", color: "#ff7a1a",
    title: { en: "Loops", zh: "迴圈" },
    blurb: { en: "Repeat without rewriting.", zh: "重複，不用一直重寫。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🔁", title: { en: "Do it again, and again", zh: "一次又一次" },
          body: { en: "A <b>loop</b> repeats an action. <b>repeat 3 times { 🍪 }</b> bakes 🍪 🍪 🍪 — three cookies, from one short line.", zh: "<b>迴圈</b>會重複一個動作。<b>重複 3 次 { 🍪 }</b> 會做出 🍪 🍪 🍪 —— 一行就做三個。" } },
        { emoji: "🔢", title: { en: "Count the jars", zh: "數一數罐子" },
          body: { en: "See the empty jars? <b>Count them.</b> Set the loop to repeat <b>that many</b> times to fill every one — no more, no less.", zh: "看到空罐子了嗎？<b>數一數</b>。把迴圈設成重複<b>那麼多</b>次，剛好把每個裝滿 —— 不多也不少。" } },
        { emoji: "✅", title: { en: "One number, lots of work", zh: "一個數字，很多工作" },
          body: { en: "That's the magic of a loop: change <b>one number</b> and you do the job 3, 8, or 100 times. Try three jar sets!", zh: "這就是迴圈的魔法：改<b>一個數字</b>，就能做 3 次、8 次、甚至 100 次。試試三組罐子！" } }
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
    var n = 1;
    var card = ctx.el("div", { class: "card center" });
    root.appendChild(card);

    function slotRow(filled) {
      var row = ctx.el("div", { class: "slots" });
      for (var i = 0; i < target; i++) row.appendChild(ctx.el("div", { class: "slot" + (i < filled ? " full" : ""), text: i < filled ? emoji : "" }));
      for (var j = target; j < filled; j++) row.appendChild(ctx.el("div", { class: "slot spill", text: emoji })); // overflow
      return row;
    }

    function redraw(filled) {
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "bubble" }, ctx.pick({ en: "Fill all ", zh: "裝滿全部 " }), ctx.el("b", { text: target }), ctx.pick({ en: " jars!", zh: " 個罐子！" })));
      card.appendChild(slotRow(filled || 0));
      card.appendChild(ctx.el("div", { class: "bubble", style: { marginTop: ".6rem" } },
        ctx.pick({ en: "repeat ", zh: "重複 " }), ctx.el("b", { text: n }), ctx.pick({ en: " times { ", zh: " 次 { " }), emoji, " }"));
      card.appendChild(ctx.el("div", { class: "scoreline" },
        ctx.el("button", { class: "btn", text: "➖", onclick: function () { if (n > 1) { n--; redraw(); } } }),
        ctx.pick({ en: "  repeat: ", zh: "  重複：" }), ctx.el("b", { text: n }), "  ",
        ctx.el("button", { class: "btn", text: "➕", onclick: function () { if (n < 12) { n++; redraw(); } } })));
      card.appendChild(ctx.el("div", { class: "btnrow" }, ctx.el("button", { class: "btn primary big", text: ctx.pick({ en: "▶ Run loop", zh: "▶ 執行迴圈" }), onclick: run })));
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: ctx.pick({ en: "How many jars are there? Repeat that many times.", zh: "有幾個罐子？就重複幾次。" }) }));
    }

    function run() {
      var i = 0;
      var t = setInterval(function () {
        if (i >= n) {
          clearInterval(t);
          if (n === target) { if (FL.sfx) FL.sfx.good(); setTimeout(done, 450); }
          else card.querySelector("#fb").textContent = n > target
            ? ctx.pick({ en: "Too many — some spilled! Repeat fewer times.", zh: "太多了 —— 溢出來了！重複少一點。" })
            : ctx.pick({ en: "Some jars are still empty. Repeat more times.", zh: "還有空罐子。重複多一點。" });
          return;
        }
        i++;
        if (FL.sfx) FL.sfx.note(420 + i * 70, 0.16);
        var row = card.querySelector(".slots"), nw = slotRow(i);
        row.parentNode.replaceChild(nw, row);
        FL.pulse(nw.children[i - 1], "anim-pop");
      }, 230);
    }
    redraw();
  }
})();
