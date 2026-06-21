// SORTING — click two bars to swap them; sort short → tall.
(function () {
  var FL = window.FunLab;
  var COLORS = ["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4dabf7", "#9775fa"];

  function shuffled(n) {
    var a = []; for (var k = 1; k <= n; k++) a.push(k);
    for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0; var t = a[i]; a[i] = a[j]; a[j] = t; }
    // make sure it isn't accidentally already sorted
    var sorted = a.every(function (v, k) { return k === 0 || a[k - 1] <= v; });
    return sorted ? shuffled(n) : a;
  }

  FL.register("sorting", {
    icon: "📊", color: "#ff7a1a",
    title: { en: "Sorting", zh: "排序" },
    blurb: { en: "Put things in order, small to big.", zh: "把東西從小排到大。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "📊", title: { en: "What is sorting?", zh: "什麼是排序？" },
          body: { en: "Sorting means putting things <b>in order</b> — like lining up from <b>shortest to tallest</b>.", zh: "排序就是把東西<b>排好順序</b> —— 像是從<b>矮排到高</b>。" } },
        { emoji: "🔁", title: { en: "Compare two", zh: "比較兩個" },
          body: { en: "Look at <b>two</b> bars. If the left one is taller, they're in the wrong place.", zh: "看<b>兩根</b>柱子。如果左邊比較高，它們就站錯位置了。" } },
        { emoji: "↔️", title: { en: "Swap!", zh: "交換！" },
          body: { en: "<b>Swap</b> them so the smaller one goes first. Keep swapping until every bar is in order. That's <b>bubble sort</b>!", zh: "把它們<b>交換</b>，讓小的排前面。一直換到全部排好 —— 這就是<b>泡泡排序</b>！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, [4, 5, 6].map(function (n) {
        return function (r, done) { stage(r, ctx, n, done); };
      }));
    }
  });

  function stage(root, ctx, count, done) {
      var vals = shuffled(count);
      var sel = -1, swaps = 0;
      var barsBox = ctx.el("div", { class: "bars" });
      var score = ctx.el("div", { class: "scoreline" });
      var hint = ctx.el("p", { class: "hint", text: ctx.pick({ en: "Tap two bars to swap them.", zh: "點兩根柱子來交換它們。" }) });

      function isSorted() { return vals.every(function (v, i) { return i === 0 || vals[i - 1] <= v; }); }

      function markSel() {
        [].forEach.call(barsBox.children, function (b, n) { b.classList.toggle("sel", n === sel); });
      }
      function draw() {
        barsBox.innerHTML = "";
        vals.forEach(function (v, i) {
          barsBox.appendChild(ctx.el("div", {
            class: "bar" + (i === sel ? " sel" : ""),
            style: { height: (v * 30 + 20) + "px", background: COLORS[v - 1] },
            text: v,
            onclick: function () { tap(i); }
          }));
        });
        score.textContent = ctx.pick({ en: "Swaps: ", zh: "交換次數：" }) + swaps;
      }

      function tap(i) {
        // each bar sings a note pitched to its height (xylophone) + a little bounce
        if (window.FunLab.sfx) window.FunLab.sfx.note(280 + vals[i] * 95, 0.22);
        window.FunLab.pulse(barsBox.children[i], "anim-pop");
        if (sel === -1) { sel = i; markSel(); return; }      // select: no rebuild, just glow + bounce
        if (sel === i) { sel = -1; markSel(); return; }
        var t = vals[sel]; vals[sel] = vals[i]; vals[i] = t; // swap: rebuild → whole row springs in
        swaps++; sel = -1; draw();
        if (isSorted()) { if (window.FunLab.sfx) window.FunLab.sfx.good(); setTimeout(done, 420); }
      }

      draw();
      root.appendChild(ctx.el("div", { class: "card center" }, barsBox, score, hint));
  }
})();
