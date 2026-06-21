// LOGIC GATES — true/false in, light out. AND needs both, OR needs one, NOT flips.
(function () {
  var FL = window.FunLab;
  function gate(g, a, b) { return g === "AND" ? (a && b) : g === "OR" ? (a || b) : g === "XOR" ? (a !== b) : !a; }

  var STAGES = [
    [{ g: "AND", t: true }, { g: "AND", t: false }],
    [{ g: "OR", t: true }, { g: "OR", t: false }],
    [{ g: "NOT", t: true }, { g: "NOT", t: false }],
    [{ g: "XOR", t: true }, { g: "XOR", t: false }, { g: "AND", t: true }]
  ];

  FL.register("logic", {
    icon: "💡", color: "#e64980",
    title: { en: "Logic Gates", zh: "邏輯閘" },
    blurb: { en: "True, false, and the light.", zh: "真、假，與燈泡。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "💡", title: { en: "On or off", zh: "開或關" },
          body: { en: "Computers think in <b>true</b> / <b>false</b> (on / off, 1 / 0). A switch is on or off — nothing in between.", zh: "電腦用 <b>真</b> / <b>假</b>（開 / 關，1 / 0）思考。開關只有開或關，沒有中間。" } },
        { emoji: "🔀", title: { en: "AND / OR", zh: "AND / OR" },
          body: { en: "<b>AND</b> is true only when <b>both</b> switches are on. <b>OR</b> is true when <b>at least one</b> is on.", zh: "<b>AND</b> 只有<b>兩個</b>開關都開才是真。<b>OR</b> 只要<b>至少一個</b>開就是真。" } },
        { emoji: "🙃", title: { en: "NOT flips · XOR differs", zh: "NOT 反轉 · XOR 不同" },
          body: { en: "<b>NOT</b> flips one switch: on↔off. <b>XOR</b> is true only when the two switches are <b>different</b> (one on, one off). Make the light do what's asked!", zh: "<b>NOT</b> 把一個開關反過來：開↔關。<b>XOR</b> 只有兩個開關<b>不一樣</b>（一開一關）才是真。讓燈泡照要求亮或暗！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, STAGES.map(function (rounds) {
        return function (r, done) { stage(r, ctx, rounds, done); };
      }));
    }
  });

  function stage(root, ctx, rounds, done) {
    var i = 0, a = false, b = false;
    var card = ctx.el("div", { class: "card center" });
    root.appendChild(card);

    function out() { return gate(rounds[i].g, a, b); }

    function sw(label, on, toggle) {
      return ctx.el("button", { class: "choice", style: { minWidth: "104px" },
        html: "<b>" + label + "</b><br>" + (on ? "🟢 ON" : "⚪ OFF"), onclick: toggle });
    }

    function draw() {
      var rd = rounds[i];
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "bubble" }, rd.t
        ? ctx.pick({ en: "Make the light turn ON 💡", zh: "讓燈泡亮起來 💡" })
        : ctx.pick({ en: "Make the light turn OFF ⚫", zh: "讓燈泡關掉 ⚫" })));
      var box = ctx.el("div", { class: "choices" });
      box.appendChild(sw("A", a, function () { a = !a; check(); }));
      if (rd.g !== "NOT") box.appendChild(sw("B", b, function () { b = !b; check(); }));
      card.appendChild(box);
      card.appendChild(ctx.el("div", { class: "bubble", style: { marginTop: ".3rem" } }, ctx.el("b", { text: rd.g }), " ", ctx.pick({ en: "gate", zh: "閘" })));
      card.appendChild(ctx.el("div", { id: "bulb", class: "anim-pop", style: { fontSize: "3.6rem", margin: ".3rem" }, text: out() ? "💡" : "⚫" }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: (i + 1) + " / " + rounds.length }));
    }

    function startRound() { a = !rounds[i].t; b = !rounds[i].t; draw(); }

    function check() {
      draw();
      if (out() === rounds[i].t) {
        if (FL.sfx) FL.sfx.good();
        i++;
        if (i >= rounds.length) { setTimeout(done, 500); }
        else setTimeout(startRound, 550);
      }
    }
    startRound();
  }
})();
