// TEACH THE MACHINE — machine learning: the computer learns a rule from examples, then sorts new things.
(function () {
  var FL = window.FunLab;

  var STAGES = [
    { a: { en: "BIG", zh: "大" }, b: { en: "small", zh: "小" },
      ex: { a: ["🐘", "🦁", "🐻"], b: ["🐭", "🐜", "🐝"] },
      tests: [{ x: "🦒", g: "a" }, { x: "🐌", g: "b" }, { x: "🦏", g: "a" }] },
    { a: { en: "Fruit", zh: "水果" }, b: { en: "Veggie", zh: "蔬菜" },
      ex: { a: ["🍎", "🍌", "🍇"], b: ["🥕", "🥦", "🌽"] },
      tests: [{ x: "🍓", g: "a" }, { x: "🥔", g: "b" }, { x: "🍑", g: "a" }] },
    { a: { en: "Animal", zh: "動物" }, b: { en: "Vehicle", zh: "車輛" },
      ex: { a: ["🐶", "🐱", "🐰"], b: ["🚗", "🚌", "✈️"] },
      tests: [{ x: "🐸", g: "a" }, { x: "🚲", g: "b" }, { x: "🦊", g: "a" }] }
  ];

  FL.register("teach", {
    icon: "🧠", color: "#12b886",
    title: { en: "Teach the Machine", zh: "教機器學習" },
    blurb: { en: "Learning from examples.", zh: "從例子中學習。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🧠", title: { en: "Learning from examples", zh: "從例子學習" },
          body: { en: "Show a computer <b>lots</b> of 🐱 and 🐶 pictures, and it figures out the difference <b>by itself</b>. That's <b>machine learning</b>.", zh: "給電腦看<b>很多</b> 🐱 和 🐶 的圖片，它就會<b>自己</b>找出差別。這就是<b>機器學習</b>。" } },
        { emoji: "📊", title: { en: "No rules written", zh: "沒有人寫規則" },
          body: { en: "Nobody typed \"cats have whiskers.\" The machine found the pattern from the <b>examples</b> — we call those examples <b>data</b>.", zh: "沒有人打「貓有鬍鬚」。機器是從<b>例子</b>裡找出規律的 —— 這些例子叫做<b>資料</b>。" } },
        { emoji: "🎓", title: { en: "Be the machine", zh: "當一次機器" },
          body: { en: "Study the examples in each group, then sort the <b>new</b> things into the group they belong to!", zh: "看看每一組的例子，再把<b>新</b>的東西分到正確的組別！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, STAGES.map(function (st) {
        return function (r, done) { stage(r, ctx, st, done); };
      }));
    }
  });

  function stage(root, ctx, st, done) {
    var ti = 0;
    var card = ctx.el("div", { class: "card center" });
    root.appendChild(card);

    function exRow(tag, label, items) {
      return ctx.el("div", { class: "bubble", style: { display: "block", margin: ".3rem auto" } },
        ctx.el("b", { text: tag + " " + label + ":  " }), items.join("  "));
    }

    function draw() {
      card.innerHTML = "";
      card.appendChild(ctx.el("div", { class: "eyebrow", text: ctx.pick({ en: "The robot learned from these examples", zh: "機器人從這些例子學會了" }) }));
      card.appendChild(exRow("🅰️", ctx.pick(st.a), st.ex.a));
      card.appendChild(exRow("🅱️", ctx.pick(st.b), st.ex.b));
      var t = st.tests[ti];
      card.appendChild(ctx.el("div", { class: "bubble", style: { marginTop: ".7rem" } },
        ctx.pick({ en: "Where does this go?  ", zh: "這個該放哪？  " }), ctx.el("b", { style: { fontSize: "2rem" }, text: t.x })));
      var box = ctx.el("div", { class: "choices" });
      var ba = ctx.el("button", { class: "choice", text: "🅰️ " + ctx.pick(st.a) }); ba.addEventListener("click", function () { pick("a", ba); });
      var bb = ctx.el("button", { class: "choice", text: "🅱️ " + ctx.pick(st.b) }); bb.addEventListener("click", function () { pick("b", bb); });
      box.appendChild(ba); box.appendChild(bb);
      card.appendChild(box);
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: "" }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: (ti + 1) + " / " + st.tests.length }));
    }

    function pick(g, b) {
      if (g !== st.tests[ti].g) { FL.sfx && FL.sfx.bad(); FL.pulse(b, "anim-shake"); card.querySelector("#fb").textContent = ctx.pick({ en: "Look at the examples again 🤔", zh: "再看看例子 🤔" }); return; }
      FL.sfx && FL.sfx.good(); FL.pulse(b, "anim-pop");
      ti++;
      if (ti >= st.tests.length) { setTimeout(done, 380); return; }
      setTimeout(draw, 380);
    }
    draw();
  }
})();
