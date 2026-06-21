// STACKS & QUEUES — what comes out first? Stack = last-in-first-out, Queue = first-in-first-out.
(function () {
  var FL = window.FunLab;

  // each round: items listed in the order they went IN
  var STAGES = [
    [ // stacks: a pile of pancakes, take the TOP
      { type: "stack", items: ["🥞", "🧇", "🍞"] },
      { type: "stack", items: ["🔴", "🟡", "🟢", "🔵"] }
    ],
    [ // queues: a line, serve the FRONT
      { type: "queue", items: ["🐶", "🐱", "🐰"] },
      { type: "queue", items: ["1️⃣", "2️⃣", "3️⃣", "4️⃣"] }
    ],
    [ // mixed
      { type: "queue", items: ["🍎", "🍌", "🍇"] },
      { type: "stack", items: ["📕", "📗", "📘"] }
    ]
  ];

  FL.register("stacks", {
    icon: "🥞", color: "#2bb3ff",
    title: { en: "Stacks & Queues", zh: "堆疊與佇列" },
    blurb: { en: "Who comes out first?", zh: "誰先出來？" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🥞", title: { en: "A stack", zh: "堆疊" },
          body: { en: "Pancakes pile up. You take the <b>top</b> one — the <b>last</b> one added comes out <b>first</b>. (LIFO)", zh: "鬆餅一層層疊起來。你拿<b>最上面</b>的 —— <b>最後</b>放的<b>最先</b>拿走。（後進先出）" } },
        { emoji: "🚌", title: { en: "A queue", zh: "佇列" },
          body: { en: "A line for the bus. The person at the <b>front</b> — the <b>first</b> to arrive — goes <b>first</b>. (FIFO)", zh: "排隊等公車。<b>最前面</b>的人 —— <b>最先</b>來的 —— <b>最先</b>走。（先進先出）" } },
        { emoji: "❓", title: { en: "Who's first?", zh: "誰先？" },
          body: { en: "Each round, tap who comes out first. Stacks, then queues, then mixed!", zh: "每一回合，點出誰先出來。先堆疊、再佇列、最後混合！" } }
      ]);
    },

    lab: function (root, ctx) {
      FL.stages(root, ctx, STAGES.map(function (rounds) {
        return function (r, done) { stage(r, ctx, rounds, done); };
      }));
    }
  });

  function stage(root, ctx, rounds, done) {
    var i = 0;
    var card = ctx.el("div", { class: "card center" });
    root.appendChild(card);

    function draw() {
      card.innerHTML = "";
      var rd = rounds[i], isStack = rd.type === "stack";
      card.appendChild(ctx.el("div", { class: "bubble" },
        isStack ? ctx.pick({ en: "STACK 🥞 — take the top", zh: "堆疊 🥞 — 拿最上面" })
                : ctx.pick({ en: "QUEUE 🚌 — serve the front", zh: "佇列 🚌 — 服務最前面" })));

      // visual: stack = vertical (top first), queue = horizontal (front left)
      var view = ctx.el("div", { style: isStack
        ? { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", margin: "1rem 0" }
        : { display: "flex", justifyContent: "center", gap: "8px", margin: "1rem 0", alignItems: "center" } });
      var shown = isStack ? rd.items.slice().reverse() : rd.items.slice(); // stack shows top first
      shown.forEach(function (it, n) {
        var tag = (isStack && n === 0) ? ctx.pick({ en: "TOP→", zh: "上→" })
                : (!isStack && n === 0) ? ctx.pick({ en: "FRONT→", zh: "前→" }) : "";
        view.appendChild(ctx.el("div", { style: { display: "flex", alignItems: "center", gap: "4px" } },
          ctx.el("span", { class: "eyebrow", text: tag }),
          ctx.el("span", { style: { fontSize: "2.2rem" }, text: it })));
      });
      card.appendChild(view);

      card.appendChild(ctx.el("p", { class: "hint", text: ctx.pick({ en: "Who comes out FIRST?", zh: "誰先出來？" }) }));
      var box = ctx.el("div", { class: "choices" });
      rd.items.forEach(function (it, idx) {
        var b = ctx.el("button", { class: "choice", text: it });
        b.addEventListener("click", function () { pick(idx, rd, b); });
        box.appendChild(b);
      });
      card.appendChild(box);
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: "" }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: (i + 1) + " / " + rounds.length }));
    }

    function pick(idx, rd, b) {
      var correct = rd.type === "stack" ? rd.items.length - 1 : 0;
      if (idx !== correct) { FL.sfx && FL.sfx.bad(); FL.pulse(b, "anim-shake"); card.querySelector("#fb").textContent = ctx.pick({ en: "Not that one — try again! 🤗", zh: "不是這個 —— 再試一次！🤗" }); return; }
      FL.sfx && FL.sfx.good(); FL.pulse(b, "anim-pop");
      i++;
      if (i >= rounds.length) { setTimeout(done, 380); return; }
      setTimeout(draw, 380);
    }
    draw();
  }
})();
