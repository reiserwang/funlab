// AST — how code becomes a tree. Evaluate an expression tree from the bottom up.
(function () {
  var FL = window.FunLab;
  var NS = "http://www.w3.org/2000/svg";
  function svg(tag, a) { var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); return n; }

  function leaf(t) { return t.n !== undefined; }
  function ready(t) { return !leaf(t) && leaf(t.l) && leaf(t.r); }
  function calc(op, a, b) { return op === "+" ? a + b : op === "−" ? a - b : a * b; }
  function infix(t) { return leaf(t) ? String(t.n) : "(" + infix(t.l) + " " + t.op + " " + infix(t.r) + ")"; }

  // fresh tree per stage (so re-tries reset)
  var BUILDERS = [
    function () { return { op: "+", l: { n: 3 }, r: { n: 4 } }; },                                   // 3 + 4
    function () { return { op: "×", l: { op: "+", l: { n: 2 }, r: { n: 3 } }, r: { n: 4 } }; },        // (2 + 3) × 4
    function () { return { op: "+", l: { n: 2 }, r: { op: "×", l: { n: 3 }, r: { n: 4 } } }; }         // 2 + (3 × 4)
  ];

  FL.register("ast", {
    icon: "🌲", color: "#0fb5ba",
    title: { en: "Code Trees", zh: "程式樹" },
    blurb: { en: "How code becomes a tree.", zh: "程式如何變成一棵樹。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🌲", title: { en: "Code is a tree", zh: "程式是一棵樹" },
          body: { en: "Computers turn <b>3 + 4</b> into a <b>tree</b>: the <b>+</b> sits on top, with <b>3</b> and <b>4</b> below. This is an <b>AST</b> — an abstract syntax tree.", zh: "電腦把 <b>3 + 4</b> 變成一棵<b>樹</b>：<b>+</b> 在最上面，<b>3</b> 和 <b>4</b> 在下面。這就是 <b>AST（抽象語法樹）</b>。" } },
        { emoji: "⬆️", title: { en: "Solve from the bottom", zh: "從底部往上算" },
          body: { en: "Find a <b>+</b> or <b>×</b> whose two children are both <b>numbers</b>, and solve it. It becomes one number. Keep going up to the top!", zh: "找一個 <b>+</b> 或 <b>×</b>，它的兩個小孩都是<b>數字</b>，先算它，算完變成一個數字。一直往上算到頂端！" } },
        { emoji: "🧮", title: { en: "Order is built in", zh: "順序藏在樹裡" },
          body: { en: "In <b>2 + 3 × 4</b>, the <b>×</b> sits <b>lower</b>, so it happens first → 2 + 12 = <b>14</b>. The tree's shape decides the order!", zh: "在 <b>2 + 3 × 4</b> 裡，<b>×</b> 在<b>比較低</b>的位置，所以先算 → 2 + 12 = <b>14</b>。樹的形狀決定了順序！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, BUILDERS.map(function (make) {
        return function (r, done) { stage(r, ctx, make(), done); };
      }));
    }
  });

  function stage(root, ctx, tree, done) {
    var card = ctx.el("div", { class: "card center" });
    var holder = ctx.el("div", { class: "treebox" });
    var hint = ctx.el("p", { class: "hint", id: "fb", text: ctx.pick({ en: "Tap a circle that has two numbers under it.", zh: "點一個下面有兩個數字的圈圈。" }) });
    root.appendChild(card);
    card.appendChild(ctx.el("div", { class: "bubble", html: ctx.pick({ en: "Solve: ", zh: "算出：" }) + "<b>" + infix(tree).replace(/^\(|\)$/g, "") + "</b>" }));
    card.appendChild(holder);
    card.appendChild(hint);

    function render() {
      holder.innerHTML = "";
      var idx = 0, list = [];
      (function walk(n, d) { if (!leaf(n)) walk(n.l, d + 1); n._c = idx++; n._d = d; list.push(n); if (!leaf(n)) walk(n.r, d + 1); })(tree, 0);
      var cols = idx, W = 460;
      list.forEach(function (n) { n._x = (n._c + 0.5) / cols * W; n._y = 38 + n._d * 90; });
      var s = svg("svg", { viewBox: "0 0 460 260", width: "100%", style: "max-width:460px" });
      list.forEach(function (n) {
        if (!leaf(n)) [n.l, n.r].forEach(function (c) {
          s.appendChild(svg("line", { x1: n._x, y1: n._y, x2: c._x, y2: c._y, stroke: "#1b2440", "stroke-width": 4, "stroke-linecap": "round", opacity: 0.25 }));
        });
      });
      list.forEach(function (n) {
        var isNum = leaf(n), rdy = ready(n);
        var g = svg("g", { style: rdy ? "cursor:pointer" : "cursor:default" });
        g.appendChild(svg("circle", { cx: n._x, cy: n._y, r: 26,
          fill: isNum ? "#fffdf5" : (rdy ? "#0fb5ba" : "#cdeef0"), stroke: "#1b2440", "stroke-width": rdy ? 6 : 4 }));
        var tx = svg("text", { x: n._x, y: n._y + 8, "text-anchor": "middle", "font-size": 24, "font-weight": 800, "font-family": "Fredoka, sans-serif", fill: (rdy && !isNum) ? "#fff" : "#1b2440" });
        tx.textContent = isNum ? n.n : n.op;
        g.appendChild(tx);
        if (rdy) g.addEventListener("click", function () { solve(n); });
        else if (!isNum) g.addEventListener("click", function () { FL.sfx && FL.sfx.bad(); hint.textContent = ctx.pick({ en: "Solve the lower parts first!", zh: "先算下面的部分！" }); });
        s.appendChild(g);
      });
      holder.appendChild(s);
    }

    function solve(n) {
      n.n = calc(n.op, n.l.n, n.r.n); delete n.op; delete n.l; delete n.r;
      if (FL.sfx) FL.sfx.good();
      render();
      if (leaf(tree)) { hint.innerHTML = ctx.pick({ en: "Answer = ", zh: "答案 = " }) + "<b>" + tree.n + "</b> 🎉"; setTimeout(done, 600); }
    }
    render();
  }
})();
