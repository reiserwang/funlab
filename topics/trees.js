// TREES — number tree (smaller left, bigger right). Walk down to the treasure.
(function () {
  var FL = window.FunLab;
  var NS = "http://www.w3.org/2000/svg";

  var SMALL = {
    a: { v: 30, x: 300, y: 70, kids: ["b", "c"] },
    b: { v: 15, x: 170, y: 230, kids: [] },
    c: { v: 45, x: 430, y: 230, kids: [] }
  };
  var BIG = {
    a: { v: 50, x: 300, y: 45, kids: ["b", "c"] },
    b: { v: 25, x: 150, y: 155, kids: ["d", "e"] },
    c: { v: 75, x: 450, y: 155, kids: ["f", "g"] },
    d: { v: 10, x: 75, y: 265, kids: [] },
    e: { v: 35, x: 225, y: 265, kids: [] },
    f: { v: 60, x: 375, y: 265, kids: [] },
    g: { v: 90, x: 525, y: 265, kids: [] }
  };

  function svg(tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  FL.register("trees", {
    icon: "🌳", color: "#ff4d6d",
    title: { en: "Trees", zh: "樹狀圖" },
    blurb: { en: "Branch down to find treasure.", zh: "順著分支找寶藏。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🌳", title: { en: "A tree of numbers", zh: "數字的樹" },
          body: { en: "A <b>tree</b> starts at the top — the <b>root</b> — and splits into <b>branches</b>. The ends are <b>leaves</b>.", zh: "<b>樹</b>從最上面開始 —— 叫<b>根</b> —— 然後分出<b>樹枝</b>。末端叫<b>葉子</b>。" } },
        { emoji: "⬅️➡️", title: { en: "Smaller left, bigger right", zh: "小的往左，大的往右" },
          body: { en: "In this tree, <b>smaller</b> numbers go <b>left</b> and <b>bigger</b> numbers go <b>right</b>. Handy for searching!", zh: "在這棵樹裡，<b>比較小</b>的往<b>左</b>，<b>比較大</b>的往<b>右</b>。找東西很方便！" } },
        { emoji: "💎", title: { en: "Three trees", zh: "三棵樹" },
          body: { en: "Start small, then grow bigger. Compare your number and step the right way to the treasure!", zh: "從小樹開始，越來越大。比一比你的數字，往對的方向走到寶藏！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, [
        function (r, done) { stage(r, ctx, SMALL, pick([15, 45]), done); },
        function (r, done) { stage(r, ctx, BIG, pick([10, 35, 60, 90]), done); },
        function (r, done) { stage(r, ctx, BIG, pick([25, 75]), done); }
      ]);
    }
  });

  function stage(root, ctx, nodes, target, done) {
    var ids = Object.keys(nodes), cur = "a";
    var card = ctx.el("div", { class: "card center" });
    var holder = ctx.el("div", { class: "treebox" });
    root.appendChild(card);

    function draw(msg) {
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "bubble", html: ctx.pick({ en: "Find treasure number ", zh: "找出寶藏數字 " }) + "<b>💎 " + target + "</b>" }));
      holder.innerHTML = "";
      var s = svg("svg", { viewBox: "0 0 600 320", width: "100%", style: "max-width:600px" });
      ids.forEach(function (id) {
        nodes[id].kids.forEach(function (k) {
          s.appendChild(svg("line", { x1: nodes[id].x, y1: nodes[id].y, x2: nodes[k].x, y2: nodes[k].y, stroke: "#1b2440", "stroke-width": 4, "stroke-linecap": "round", opacity: 0.25 }));
        });
      });
      ids.forEach(function (id) {
        var nd = nodes[id], isCur = id === cur, isChild = nodes[cur].kids.indexOf(id) >= 0;
        var g = svg("g", { class: "tnode", style: isChild ? "cursor:pointer" : "cursor:default" });
        g.appendChild(svg("circle", { cx: nd.x, cy: nd.y, r: 30, fill: isCur ? "#ff4d6d" : (isChild ? "#ffd3db" : "#fffdf5"), stroke: "#1b2440", "stroke-width": 4 }));
        var tx = svg("text", { x: nd.x, y: nd.y + 8, "text-anchor": "middle", "font-size": 22, "font-weight": 800, "font-family": "Fredoka, sans-serif", fill: isCur ? "#fff" : "#1b2440" });
        tx.textContent = nd.v;
        g.appendChild(tx);
        if (isChild) g.addEventListener("click", function () { step(id); });
        s.appendChild(g);
      });
      holder.appendChild(s);
      card.appendChild(holder);
      card.appendChild(ctx.el("p", { class: "hint", html: msg || ctx.pick({ en: "Tap a glowing branch to walk down.", zh: "點亮起來的樹枝往下走。" }) }));
      if (cur !== "a")
        card.appendChild(ctx.el("button", { class: "btn", text: ctx.pick({ en: "↩︎ Back to root", zh: "↩︎ 回到根" }), onclick: function () { cur = "a"; draw(); } }));
    }

    function step(id) {
      cur = id;
      if (nodes[id].v === target) { if (FL.sfx) FL.sfx.good(); setTimeout(done, 320); return; }
      if (FL.sfx) FL.sfx.hop();
      if (nodes[id].kids.length === 0)
        draw(ctx.pick({ en: "Dead end 🍂 — go back to the root and try the other way.", zh: "走到底了 🍂 —— 回到根換另一邊。" }));
      else
        draw(ctx.pick({ en: nodes[id].v < target ? "Treasure is BIGGER — go right ➡️" : "Treasure is SMALLER — go left ⬅️",
                        zh: nodes[id].v < target ? "寶藏比較大 —— 往右 ➡️" : "寶藏比較小 —— 往左 ⬅️" }));
    }
    draw();
  }
})();
