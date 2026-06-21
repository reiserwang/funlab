// CHECK THE ROBOT — AI is fast but not always right. The new human job: verify its work.
(function () {
  var FL = window.FunLab;

  var STAGES = [
    [ { c: { en: "2 + 2 = 4", zh: "2 + 2 = 4" }, ok: true },
      { c: { en: "5 + 1 = 7", zh: "5 + 1 = 7" }, ok: false },
      { c: { en: "3 + 4 = 7", zh: "3 + 4 = 7" }, ok: true },
      { c: { en: "10 − 2 = 9", zh: "10 − 2 = 9" }, ok: false } ],
    [ { c: { en: "Sorted small→big: 1 2 3 5", zh: "由小到大排好：1 2 3 5" }, ok: true },
      { c: { en: "Sorted small→big: 1 3 2 4", zh: "由小到大排好：1 3 2 4" }, ok: false },
      { c: { en: "Sorted small→big: 2 4 6 8", zh: "由小到大排好：2 4 6 8" }, ok: true },
      { c: { en: "Sorted small→big: 5 4 3 2", zh: "由小到大排好：5 4 3 2" }, ok: false } ],
    [ { c: { en: "A triangle has 3 sides", zh: "三角形有 3 個邊" }, ok: true },
      { c: { en: "7 is bigger than 9", zh: "7 比 9 大" }, ok: false },
      { c: { en: "repeat 3 times makes 3 stars", zh: "重複 3 次會做出 3 顆星" }, ok: true },
      { c: { en: "All birds can swim underwater", zh: "所有的鳥都能潛水" }, ok: false } ]
  ];

  FL.register("check", {
    icon: "✅", color: "#fa5252",
    title: { en: "Check the Robot", zh: "檢查機器人" },
    blurb: { en: "AI can be wrong — verify it!", zh: "AI 也會錯 —— 要檢查！" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🤖", title: { en: "AI can be wrong", zh: "AI 也會出錯" },
          body: { en: "AI and robots are <b>super fast</b>, but they sometimes make <b>mistakes</b> — and say them very confidently!", zh: "AI 和機器人<b>非常快</b>，但有時候會<b>出錯</b> —— 而且講得很有自信！" } },
        { emoji: "🕵️", title: { en: "The new superpower", zh: "新的超能力" },
          body: { en: "So the big skill now isn't only writing code — it's <b>checking</b> the computer's answer. Don't just trust it, <b>verify</b> it.", zh: "所以現在最重要的能力，不只是寫程式 —— 而是<b>檢查</b>電腦的答案。別只是相信，要<b>驗證</b>。" } },
        { emoji: "⚖️", title: { en: "Right or wrong?", zh: "對還是錯？" },
          body: { en: "Read what the robot says. Tap <b>✅</b> if it's right, <b>❌</b> if it's wrong. Catch every mistake!", zh: "讀機器人說的話。對的點 <b>✅</b>，錯的點 <b>❌</b>。把每個錯誤都抓出來！" } }
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
      card.appendChild(ctx.el("div", { class: "eyebrow", text: ctx.pick({ en: "🤖 The robot says:", zh: "🤖 機器人說：" }) }));
      card.appendChild(ctx.el("div", { class: "bubble", style: { fontSize: "1.4rem", margin: ".6rem auto" }, text: ctx.pick(rounds[i].c) }));
      var box = ctx.el("div", { class: "choices" });
      var yes = ctx.el("button", { class: "choice", text: "✅" }); yes.addEventListener("click", function () { pick(true, yes); });
      var no = ctx.el("button", { class: "choice", text: "❌" }); no.addEventListener("click", function () { pick(false, no); });
      box.appendChild(yes); box.appendChild(no);
      card.appendChild(box);
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: ctx.pick({ en: "Is the robot right? ✅  or wrong? ❌", zh: "機器人對 ✅ 還是錯 ❌？" }) }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: (i + 1) + " / " + rounds.length }));
    }

    function pick(said, b) {
      if (said !== rounds[i].ok) { FL.sfx && FL.sfx.bad(); FL.pulse(b, "anim-shake"); card.querySelector("#fb").textContent = ctx.pick({ en: "Check again carefully… 🔎", zh: "再仔細檢查一次… 🔎" }); return; }
      FL.sfx && FL.sfx.good(); FL.pulse(b, "anim-pop");
      i++;
      if (i >= rounds.length) { setTimeout(done, 380); return; }
      setTimeout(draw, 380);
    }
    draw();
  }
})();
