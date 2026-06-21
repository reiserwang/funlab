// CONDITIONALS — IF this THEN that. Three stages: basic IF, ELSE, comparisons.
(function () {
  var FL = window.FunLab;

  var STAGES = [
    [ // basic IF
      { cond: { en: "IF it is raining 🌧", zh: "如果下雨了 🌧" }, opts: [{ e: "☔", ok: 1 }, { e: "😎", ok: 0 }] },
      { cond: { en: "IF the light is red 🔴", zh: "如果是紅燈 🔴" }, opts: [{ e: "🏃", ok: 0 }, { e: "🛑", ok: 1 }] },
      { cond: { en: "IF you are hungry 😋", zh: "如果你肚子餓 😋" }, opts: [{ e: "🍎", ok: 1 }, { e: "😴", ok: 0 }] }
    ],
    [ // IF / ELSE — pick the matching branch
      { cond: { en: "IF sunny ☀️ ELSE umbrella", zh: "如果晴天 ☀️ 否則帶傘" }, opts: [{ e: "😎", ok: 1 }, { e: "☔", ok: 0 }] },
      { cond: { en: "IF cold 🥶 ELSE t-shirt", zh: "如果很冷 🥶 否則穿短袖" }, opts: [{ e: "🧥", ok: 1 }, { e: "👕", ok: 0 }] },
      { cond: { en: "IF bedtime 🌙 ELSE play", zh: "如果睡覺時間 🌙 否則玩耍" }, opts: [{ e: "🏊", ok: 0 }, { e: "🛏️", ok: 1 }] }
    ],
    [ // comparisons
      { cond: { en: "IF 9 is BIGGER than 5", zh: "如果 9 比 5 大" }, opts: [{ e: "9", ok: 1 }, { e: "5", ok: 0 }] },
      { cond: { en: "IF 3 is SMALLER than 8", zh: "如果 3 比 8 小" }, opts: [{ e: "8", ok: 0 }, { e: "3", ok: 1 }] },
      { cond: { en: "IF the number is EVEN", zh: "如果是偶數" }, opts: [{ e: "7", ok: 0 }, { e: "4", ok: 1 }] }
    ]
  ];

  FL.register("conditionals", {
    icon: "🚦", color: "#2bb3ff",
    title: { en: "If / Else", zh: "條件判斷" },
    blurb: { en: "Choose what to do, when.", zh: "依情況決定要做什麼。" },

    tutorial: function (root, ctx) {
      FL.stepper(root, ctx, [
        { emoji: "🤔", title: { en: "Making choices", zh: "做選擇" },
          body: { en: "Computers make choices with <b>IF</b>. <br><b>IF</b> it rains 🌧 <b>THEN</b> take an umbrella ☔.", zh: "電腦用 <b>IF（如果）</b>做選擇。<br><b>如果</b>下雨 🌧 <b>就</b>帶雨傘 ☔。" } },
        { emoji: "🔀", title: { en: "Else = otherwise", zh: "Else＝否則" },
          body: { en: "<b>ELSE</b> means \"otherwise\".<br>IF sunny ☀️ THEN sunglasses 😎 <b>ELSE</b> umbrella ☔.", zh: "<b>ELSE（否則）</b>是另一種情況。<br>如果晴天 ☀️ 就戴墨鏡 😎，<b>否則</b>帶雨傘 ☔。" } },
        { emoji: "🚦", title: { en: "Three stages", zh: "三個關卡" },
          body: { en: "Read each rule and pick the right action. Clear all <b>3 stages</b> to win the star!", zh: "讀每條規則並選出正確的動作。通過全部 <b>3 關</b>就能拿到星星！" } }
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
      var rd = rounds[i];
      card.appendChild(ctx.el("div", { class: "bubble", html: ctx.pick(rd.cond) + " <b>" + ctx.pick({ en: "THEN…?", zh: "就…？" }) + "</b>" }));
      card.appendChild(ctx.el("div", { class: "scoreline", text: (i + 1) + " / " + rounds.length }));
      var box = ctx.el("div", { class: "choices" });
      rd.opts.forEach(function (o) {
        var b = ctx.el("button", { class: "choice", text: o.e });
        b.addEventListener("click", function () { pick(o, b); });
        box.appendChild(b);
      });
      card.appendChild(box);
      card.appendChild(ctx.el("p", { class: "hint", id: "fb", text: "" }));
    }

    function pick(o, b) {
      if (!o.ok) { FL.sfx && FL.sfx.bad(); FL.pulse(b, "anim-shake"); card.querySelector("#fb").textContent = ctx.pick({ en: "Not quite — try again! 🤗", zh: "還不對 —— 再試一次！🤗" }); return; }
      FL.sfx && FL.sfx.good(); FL.pulse(b, "anim-pop");
      i++;
      if (i >= rounds.length) { setTimeout(done, 380); return; }
      setTimeout(draw, 380);
    }
    draw();
  }
})();
