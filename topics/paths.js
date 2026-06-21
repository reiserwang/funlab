// PATHS — walk the explorer from start to flag through the maze. Three mazes.
(function () {
  var FL = window.FunLab;
  // S=start G=goal #=wall .=open
  var MAZES = [
    ["S..#", ".#..", "...#", "#..G"],
    ["S.#..", "..#.#", "#....", "###.#", "G...."],
    ["S.....", "#####.", "......", ".#####", "......", "#####G"]
  ].map(function (m) { return m.map(function (r) { return r.split(""); }); });

  function find(grid, ch) {
    for (var r = 0; r < grid.length; r++) for (var c = 0; c < grid[0].length; c++) if (grid[r][c] === ch) return { r: r, c: c };
  }

  FL.register("paths", {
    icon: "🗺️", color: "#ffb01f",
    title: { en: "Paths", zh: "找路" },
    blurb: { en: "Find a way through the maze.", zh: "在迷宮中找到出路。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🗺️", title: { en: "Getting from A to B", zh: "從 A 走到 B" },
          body: { en: "A <b>path</b> is the route from <b>start</b> 🧒 to <b>goal</b> 🏁. Computers solve mazes by trying steps one at a time.", zh: "<b>路徑</b>就是從<b>起點</b> 🧒 到<b>終點</b> 🏁 的走法。電腦會一步一步試著走出迷宮。" } },
        { emoji: "🧱", title: { en: "Walls block you", zh: "牆會擋住你" },
          body: { en: "You can step <b>up, down, left or right</b> — but never through a dark <b>wall</b> 🧱.", zh: "你可以往<b>上下左右</b>走 —— 但不能穿過深色的<b>牆</b> 🧱。" } },
        { emoji: "🏁", title: { en: "Three mazes", zh: "三座迷宮" },
          body: { en: "Each maze gets bigger. Tap a neighbour cell to move and wind your way to the flag!", zh: "每座迷宮越來越大。點旁邊的格子移動，繞到旗子那裡！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, MAZES.map(function (maze) {
        return function (r, done) { stage(r, ctx, maze, done); };
      }));
    }
  });

  function stage(root, ctx, MAZE, done) {
    var R = MAZE.length, C = MAZE[0].length;
    var start = find(MAZE, "S"), goal = find(MAZE, "G");
    var cur = { r: start.r, c: start.c }, steps = 0;
    var visited = {}; visited[start.r + "," + start.c] = true;
    var card = ctx.el("div", { class: "card center" });
    var grid = ctx.el("div", { class: "maze", style: { gridTemplateColumns: "repeat(" + C + ", minmax(0,1fr))" } });
    root.appendChild(card);

    function adj(r, c) { return Math.abs(r - cur.r) + Math.abs(c - cur.c) === 1; }

    function draw() {
      grid.innerHTML = "";
      for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) {
        (function (r, c) {
          var ch = MAZE[r][c], wall = ch === "#";
          var isCur = r === cur.r && c === cur.c, isGoal = r === goal.r && c === goal.c;
          var cls = "cell" + (wall ? " wall" : "") + (visited[r + "," + c] && !wall ? " path" : "") + (isCur ? " cur" : "");
          var face = isCur ? "🧒" : (isGoal ? "🏁" : (wall ? "🧱" : ""));
          grid.appendChild(ctx.el("div", { class: cls, text: face, onclick: function () { if (!wall && adj(r, c)) move(r, c); } }));
        })(r, c);
      }
    }

    function move(r, c) {
      cur = { r: r, c: c }; steps++;
      visited[r + "," + c] = true;
      draw();
      if (FL.sfx) FL.sfx.hop();
      FL.pulse(grid.children[r * C + c], "anim-hop");
      card.querySelector("#sc").textContent = ctx.pick({ en: "Steps: ", zh: "步數：" }) + steps;
      if (r === goal.r && c === goal.c) setTimeout(done, 320);
    }

    draw();
    card.appendChild(ctx.el("div", { class: "bubble", html: "🧒 ➜ 🏁" }));
    card.appendChild(grid);
    card.appendChild(ctx.el("div", { class: "scoreline", id: "sc", text: ctx.pick({ en: "Steps: 0", zh: "步數：0" }) }));
    card.appendChild(ctx.el("p", { class: "hint", text: ctx.pick({ en: "Tap a cell next to you to move.", zh: "點你旁邊的格子來移動。" }) }));
  }
})();
