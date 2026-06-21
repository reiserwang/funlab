// NP-COMPLETE — map coloring. Easy to CHECK, hard to SOLVE: try colors until none clash.
(function () {
  var FL = window.FunLab;
  var NS = "http://www.w3.org/2000/svg";
  function svg(tag, a) { var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); return n; }
  var PAL = ["#ff6b6b", "#ffd43b", "#4dabf7"]; // 3 crayons

  var GRAPHS = [
    { vb: "0 0 460 270", nodes: { A: { x: 230, y: 55 }, B: { x: 120, y: 215 }, C: { x: 340, y: 215 } },
      edges: [["A", "B"], ["B", "C"], ["C", "A"]] },                                              // triangle
    { vb: "0 0 460 270", nodes: { A: { x: 230, y: 35 }, B: { x: 330, y: 108 }, C: { x: 292, y: 225 }, D: { x: 168, y: 225 }, E: { x: 130, y: 108 } },
      edges: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "A"]] },                       // pentagon (odd cycle)
    { vb: "0 0 460 270", nodes: { A: { x: 230, y: 40 }, B: { x: 80, y: 235 }, C: { x: 380, y: 235 }, D: { x: 230, y: 120 }, E: { x: 165, y: 200 }, F: { x: 295, y: 200 } },
      edges: [["A", "B"], ["B", "C"], ["C", "A"], ["D", "E"], ["E", "F"], ["F", "D"], ["A", "D"], ["B", "E"], ["C", "F"]] } // prism
  ];

  FL.register("np", {
    icon: "🎨", color: "#f76707",
    title: { en: "Hard Puzzles", zh: "困難謎題" },
    blurb: { en: "Easy to check, hard to solve.", zh: "容易檢查，難解開。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🕵️", title: { en: "Easy to check…", zh: "檢查很簡單…" },
          body: { en: "Some puzzles are quick to <b>check</b> but slow to <b>solve</b>. Color a map so no two <b>touching</b> regions share a color — checking is easy: just look!", zh: "有些謎題很快能<b>檢查</b>，卻很難<b>解開</b>。把地圖塗色，讓相<b>連</b>的區域不同色 —— 檢查很簡單：看一眼就知道！" } },
        { emoji: "🤯", title: { en: "…hard to solve", zh: "…卻很難解" },
          body: { en: "But to <b>find</b> the colors you must try combinations. With more regions the combinations <b>explode</b>. Puzzles like this are called <b>NP-complete</b>.", zh: "但要<b>找出</b>顏色，你得試很多組合。區域越多，組合就<b>爆炸性</b>增加。這類謎題叫做 <b>NP-complete（NP 完全）</b>。" } },
        { emoji: "🎨", title: { en: "Color the map", zh: "幫地圖塗色" },
          body: { en: "Tap a dot to change its color. Make every <b>connected</b> pair <b>different</b>. Red lines show a clash. Three maps await!", zh: "點一個圓點換顏色。讓每一對相<b>連</b>的點都<b>不一樣</b>。紅線代表撞色。三張地圖等你！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, GRAPHS.map(function (g) {
        return function (r, done) { stage(r, ctx, g, done); };
      }));
    }
  });

  function stage(root, ctx, g, done) {
    var ids = Object.keys(g.nodes), color = {};
    ids.forEach(function (id) { color[id] = 0; });
    var card = ctx.el("div", { class: "card center" });
    var holder = ctx.el("div", { class: "treebox" });
    root.appendChild(card);

    function clashes() { return g.edges.filter(function (e) { return color[e[0]] === color[e[1]]; }); }

    function draw() {
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "bubble", text: ctx.pick({ en: "No two connected dots may match!", zh: "相連的點不能同色！" }) }));
      holder.innerHTML = "";
      var bad = clashes(), badset = {};
      bad.forEach(function (e) { badset[e[0] + e[1]] = 1; });
      var s = svg("svg", { viewBox: g.vb, width: "100%", style: "max-width:460px" });
      g.edges.forEach(function (e) {
        var clash = badset[e[0] + e[1]];
        s.appendChild(svg("line", { x1: g.nodes[e[0]].x, y1: g.nodes[e[0]].y, x2: g.nodes[e[1]].x, y2: g.nodes[e[1]].y,
          stroke: clash ? "#ff1f1f" : "#1b2440", "stroke-width": clash ? 6 : 4, "stroke-linecap": "round", opacity: clash ? 0.95 : 0.25 }));
      });
      ids.forEach(function (id) {
        var nd = g.nodes[id];
        var grp = svg("g", { style: "cursor:pointer" });
        grp.appendChild(svg("circle", { cx: nd.x, cy: nd.y, r: 30, fill: PAL[color[id]], stroke: "#1b2440", "stroke-width": 4 }));
        grp.addEventListener("click", function () { tap(id); });
        s.appendChild(grp);
      });
      holder.appendChild(s);
      card.appendChild(holder);
      var n = clashes().length;
      card.appendChild(ctx.el("p", { class: "hint", text: n
        ? (ctx.pick({ en: "Clashes left: ", zh: "還有撞色：" }) + n)
        : ctx.pick({ en: "No clashes — nice!", zh: "沒有撞色 —— 太棒了！" }) }));
    }

    function tap(id) {
      color[id] = (color[id] + 1) % 3;
      if (FL.sfx) FL.sfx.note(360 + color[id] * 140, 0.16);
      draw();
      if (clashes().length === 0) { if (FL.sfx) FL.sfx.good(); setTimeout(done, 450); }
    }
    draw();
  }
})();
