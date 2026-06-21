// GRAPHS — dots (nodes) joined by lines (edges). Walk along edges to reach a friend.
(function () {
  var FL = window.FunLab;
  var NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  var G1 = {
    vb: "0 0 420 300",
    nodes: { A: { x: 70, y: 90, l: "🧒" }, B: { x: 340, y: 70, l: "🐶" }, C: { x: 350, y: 230, l: "🐱" }, D: { x: 90, y: 240, l: "🦊" } },
    adj: { A: ["B", "D"], B: ["A", "C"], C: ["B", "D"], D: ["A", "C"] }
  };
  var G2 = {
    vb: "0 0 500 300",
    nodes: { A: { x: 60, y: 150, l: "🧒" }, B: { x: 190, y: 60, l: "🐶" }, C: { x: 190, y: 245, l: "🐱" }, D: { x: 320, y: 60, l: "🐰" }, E: { x: 320, y: 245, l: "🦊" }, F: { x: 440, y: 150, l: "🦄" } },
    adj: { A: ["B", "C"], B: ["A", "C", "D"], C: ["A", "B", "E"], D: ["B", "F"], E: ["C", "F"], F: ["D", "E"] }
  };

  FL.register("graphs", {
    icon: "🕸️", color: "#21c16b",
    title: { en: "Graphs", zh: "圖與網路" },
    blurb: { en: "Connect the dots in a network.", zh: "在網路裡連起點點。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🕸️", title: { en: "Dots and lines", zh: "點與線" },
          body: { en: "A <b>graph</b> is <b>dots</b> (nodes) joined by <b>lines</b> (edges) — like friends connected to friends.", zh: "<b>圖</b>是用<b>線</b>（邊）把<b>點</b>（節點）連起來 —— 就像朋友連著朋友。" } },
        { emoji: "🔗", title: { en: "Loops are ok", zh: "可以有圈" },
          body: { en: "Unlike a tree, a graph can have <b>loops</b> — many ways to get from one dot to another.", zh: "和樹不一樣，圖可以有<b>圈</b> —— 從一個點到另一個點有很多走法。" } },
        { emoji: "🦄", title: { en: "Find the friend", zh: "找到朋友" },
          body: { en: "Start at 🧒 and hop along the lines to reach the target friend. Three networks!", zh: "從 🧒 出發，沿著線跳到目標朋友。三個網路！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, [
        function (r, done) { stage(r, ctx, G1, "A", "C", done); },
        function (r, done) { stage(r, ctx, G2, "A", "F", done); },
        function (r, done) { stage(r, ctx, G2, "A", "E", done); }
      ]);
    }
  });

  function stage(root, ctx, g, start, target, done) {
    var ids = Object.keys(g.nodes), cur = start, hops = 0;
    var card = ctx.el("div", { class: "card center" });
    var holder = ctx.el("div", { class: "treebox" });
    root.appendChild(card);

    function draw(msg) {
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "bubble" }, ctx.pick({ en: "Reach ", zh: "找到 " }), ctx.el("b", { style: { fontSize: "1.5rem" }, text: g.nodes[target].l })));
      holder.innerHTML = "";
      var s = svg("svg", { viewBox: g.vb, width: "100%", style: "max-width:520px" });
      // edges (draw each undirected pair once)
      ids.forEach(function (a) {
        g.adj[a].forEach(function (b) {
          if (a < b) s.appendChild(svg("line", { x1: g.nodes[a].x, y1: g.nodes[a].y, x2: g.nodes[b].x, y2: g.nodes[b].y, stroke: "#1b2440", "stroke-width": 4, "stroke-linecap": "round", opacity: 0.3 }));
        });
      });
      // nodes
      ids.forEach(function (id) {
        var nd = g.nodes[id], isCur = id === cur, isTarget = id === target;
        var canGo = g.adj[cur].indexOf(id) >= 0;
        var grp = svg("g", { style: canGo ? "cursor:pointer" : "cursor:default" });
        grp.appendChild(svg("circle", { cx: nd.x, cy: nd.y, r: 30,
          fill: isCur ? "#21c16b" : (canGo ? "#bff0d3" : "#fffdf5"),
          stroke: isTarget ? "#ff4d6d" : "#1b2440", "stroke-width": isTarget ? 6 : 4 }));
        var tx = svg("text", { x: nd.x, y: nd.y + 9, "text-anchor": "middle", "font-size": 26 });
        tx.textContent = nd.l;
        grp.appendChild(tx);
        if (canGo) grp.addEventListener("click", function () { hop(id); });
        s.appendChild(grp);
      });
      holder.appendChild(s);
      card.appendChild(holder);
      card.appendChild(ctx.el("div", { class: "scoreline", text: ctx.pick({ en: "Hops: ", zh: "跳了：" }) + hops }));
      card.appendChild(ctx.el("p", { class: "hint", text: msg || ctx.pick({ en: "Tap a green-circled friend joined to you.", zh: "點和你相連、亮綠圈的朋友。" }) }));
    }

    function hop(id) {
      cur = id; hops++;
      if (id === target) { if (FL.sfx) FL.sfx.good(); setTimeout(done, 320); return; }
      if (FL.sfx) FL.sfx.hop();
      draw();
    }
    draw();
  }
})();
