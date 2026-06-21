// Core: tiny DOM helper, router, home page, star/progress tracking.
(function () {
  var FL = window.FunLab;

  // --- tiny element helper: el('div', {class:'x', onclick:fn}, child, child...) ---
  function el(tag, props) {
    var node = document.createElement(tag);
    props = props || {};
    for (var k in props) {
      var v = props[k];
      if (v == null) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "style" && typeof v === "object") { for (var s in v) { if (s.slice(0, 2) === "--") node.style.setProperty(s, v[s]); else node.style[s] = v[s]; } }
      else if (k === "dataset") { for (var d in v) node.dataset[d] = v[d]; }
      else if (k.slice(0, 2) === "on") {
        var evt = k.slice(2).toLowerCase(), fn = v;
        if (evt === "click") node.addEventListener("click", function (e) { if (FL.sfx) FL.sfx.click(); return fn.call(this, e); });
        else node.addEventListener(evt, v);
      }
      else node.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null) continue;
      if (Array.isArray(c)) c.forEach(function (x) { x != null && node.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
      else node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
    return node;
  }
  FL.el = el;

  // restart a CSS animation class on a node (playful feedback)
  FL.pulse = function (node, cls) {
    if (!node) return;
    node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls);
  };

  // --- registration used by topic files ---
  FL.register = function (id, def) {
    def.id = id;
    FL.topics[id] = def;
    FL.order.push(id);
  };

  // --- signature element: a graduated beaker, fluid level = progress ---
  function beakerSVG(color, full, idx, cls) {
    var id = "bk" + idx;
    return '' +
      '<svg class="' + (cls || "beaker") + '" viewBox="0 0 100 108" aria-hidden="true">' +
        '<defs><clipPath id="' + id + '"><path d="M26,26 V78 a8,8 0 0 0 8,8 H66 a8,8 0 0 0 8,-8 V26 Z"/></clipPath></defs>' +
        '<g clip-path="url(#' + id + ')">' +
          '<rect class="fluid" x="26" y="' + (full ? 40 : 66) + '" width="48" height="70" fill="' + color + '"/>' +
          (full
            ? '<circle class="bubble-c" cx="44" cy="56" r="3.6" fill="#fff" opacity=".65"/><circle class="bubble-c" cx="58" cy="66" r="2.6" fill="#fff" opacity=".5"/>'
            : '') +
        '</g>' +
        '<path d="M26,26 V78 a8,8 0 0 0 8,8 H66 a8,8 0 0 0 8,-8 V26" fill="none" stroke="#1b2440" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M18,26 H82" stroke="#1b2440" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M32,44 H40 M32,56 H40 M32,68 H40" stroke="#1b2440" stroke-width="2" opacity=".45" stroke-linecap="round"/>' +
      '</svg>';
  }

  // --- stars ---
  function stars() { try { return JSON.parse(localStorage.getItem("funlab.stars") || "{}"); } catch (e) { return {}; } }
  function hasStar(id) { return !!stars()[id]; }
  function giveStar(id) { var s = stars(); s[id] = true; localStorage.setItem("funlab.stars", JSON.stringify(s)); }
  function starTotal() { return Object.keys(stars()).length; }

  function refreshStarCount() {
    var sc = document.getElementById("starcount");
    if (sc) sc.innerHTML = FL.s("specimens") + " <b>" + starTotal() + "</b>/" + FL.order.length;
  }

  // --- celebration overlay: the beaker fills up ---
  function celebrate(id, isNew) {
    var app = document.getElementById("app");
    var color = (FL.topics[id] && FL.topics[id].color) || "#21c16b";
    var card = el("div", { class: "celebrate" },
      el("div", { html: beakerSVG(color, true, "win", "bigbeaker") }),
      el("h2", { text: FL.s("win") }),
      el("p", { class: "big", text: isNew ? FL.s("starGot") : FL.s("alreadyStar") }),
      el("div", { class: "btnrow" },
        el("button", { class: "btn primary", text: FL.s("home"), onclick: function () { location.hash = "#/"; } }),
        el("button", { class: "btn", text: FL.s("retry"), onclick: function () { FL.render(); } })
      )
    );
    app.appendChild(card);
  }

  // --- the context handed to each topic's tutorial()/lab() ---
  function makeCtx(topic) {
    return {
      el: el,
      pick: FL.pick,
      s: FL.s,
      get lang() { return FL.lang; },
      // call when the kid solves the lab
      win: function () {
        var isNew = !hasStar(topic.id);
        if (isNew) { giveStar(topic.id); refreshStarCount(); }
        if (FL.sfx) FL.sfx.win();
        FL.speak(FL.s("win"));
        celebrate(topic.id, isNew);
      },
      good: function () { if (FL.sfx) FL.sfx.good(); },
      bad: function () { if (FL.sfx) FL.sfx.bad(); },
      speak: function (t) { FL.speak(t); },
      goLab: function () { location.hash = "#/" + topic.id + "/lab"; },
      goHome: function () { location.hash = "#/"; }
    };
  }

  // --- shared tutorial stepper (used by every topic) ---
  // steps: [{emoji, title:{en,zh}, body:{en,zh}}]  — last step offers "to the Lab"
  FL.stepper = function (root, ctx, steps) {
    var i = 0;
    function narration(st) { return (st.title ? ctx.pick(st.title) + ". " : "") + ctx.pick(st.body); }
    function draw() {
      root.innerHTML = "";
      var st = steps[i];
      root.appendChild(el("div", { class: "card center" },
        el("div", { style: { fontSize: "4rem" }, text: st.emoji }),
        st.title ? el("h2", { text: ctx.pick(st.title) }) : null,
        el("p", { class: "steptext", html: ctx.pick(st.body) }),
        FL.lang === "zh" ? null : el("button", { class: "btn listen", text: "🔊", title: "listen", onclick: function () { FL.speak(narration(st)); } })
      ));
      FL.speak(narration(st)); // auto-dub each step (English only)
      var dots = el("div", { class: "center" },
        steps.map(function (_, n) { return el("span", { text: n === i ? "●" : "○", style: { margin: "0 3px", fontSize: "1.1rem" } }); }));
      var last = i === steps.length - 1;
      root.appendChild(dots);
      root.appendChild(el("div", { class: "btnrow" },
        i > 0 ? el("button", { class: "btn", text: "◀", onclick: function () { i--; draw(); } }) : null,
        last
          ? el("button", { class: "btn primary big", text: ctx.s("toLab"), onclick: ctx.goLab })
          : el("button", { class: "btn big", text: ctx.s("next"), onclick: function () { i++; draw(); } })
      ));
    }
    draw();
  };

  // --- multi-stage lab engine: builders run in order, star after the last ---
  // builders: [function(stageRoot, done){ ...call done() when this stage is solved }]
  FL.stages = function (root, ctx, builders) {
    var i = 0, N = builders.length;
    function bar() {
      return el("div", { class: "stagebar" },
        el("span", { class: "eyebrow", text: FL.s("stage") + " " + (i + 1) + " / " + N }),
        el("span", { class: "stagepips" },
          builders.map(function (_, n) { return el("i", { class: n < i ? "done" : (n === i ? "cur" : "") }); }))
      );
    }
    function run() {
      root.innerHTML = "";
      root.appendChild(bar());
      var sr = el("div", {});
      root.appendChild(sr);
      builders[i](sr, function () {
        i++;
        if (i >= N) { ctx.win(); return; }
        clear();
      });
    }
    function clear() {
      if (FL.sfx) FL.sfx.stage();
      FL.speak(FL.s("stageClear"));
      root.innerHTML = "";
      root.appendChild(el("div", { class: "card center" },
        el("div", { style: { fontSize: "3.4rem" }, text: "⚗️" }),
        el("h2", { style: { fontFamily: "var(--display)" }, text: FL.s("stageClear") }),
        el("div", { class: "btnrow" },
          el("button", { class: "btn primary big", text: FL.s("nextStage"), onclick: run }))
      ));
    }
    run();
  };

  // --- views ---
  function header(topic, mode) {
    var n = FL.order.indexOf(topic.id) + 1;
    return el("div", { class: "viewhead", style: { "--c": topic.color } },
      el("button", { class: "ghost", text: "◀ " + FL.s("home"), onclick: function () { location.hash = "#/"; } }),
      el("div", { class: "vh-mid" },
        el("span", { class: "eyebrow", text: FL.s("experiment") + " · " + ("0" + n).slice(-2) }),
        el("h1", {}, topic.icon + " ", FL.pick(topic.title))
      ),
      el("span", { class: "modepill", text: mode === "lab" ? FL.s("lab") : FL.s("tutorial") })
    );
  }

  function renderHome() {
    var app = document.getElementById("app");
    var grid = el("div", { class: "grid" });
    FL.order.forEach(function (id, i) {
      var t = FL.topics[id];
      var done = hasStar(id);
      grid.appendChild(
        el("a", { class: "tile", href: "#/" + id + "/tutorial", style: { "--c": t.color } },
          el("div", { class: "tile-top" },
            el("span", { class: "tile-no", text: "EXP " + ("0" + (i + 1)).slice(-2) }),
            el("span", { class: "tile-status " + (done ? "done" : "ready"), text: done ? FL.s("collected") : FL.s("ready") })
          ),
          el("div", { class: "flask-wrap", html: beakerSVG(t.color, done, i) }),
          el("div", { class: "tile-title", text: FL.pick(t.title) }),
          el("div", { class: "tile-blurb", text: FL.pick(t.blurb) })
        )
      );
    });
    app.appendChild(el("div", { class: "home" },
      el("div", { class: "hero" },
        el("span", { class: "eyebrow", text: FL.s("heroEyebrow") }),
        el("h1", { class: "hero-title" }, "Fun ", el("span", { class: "ink-chip", text: "LAB" })),
        el("p", { class: "hero-sub", text: FL.s("tagline") })
      ),
      el("div", { class: "section-bar" },
        el("h2", { text: FL.s("pickTopic") }),
        el("span", { class: "rule" })
      ),
      grid
    ));
  }

  function renderTopic(id, mode) {
    var t = FL.topics[id];
    if (!t) { location.hash = "#/"; return; }
    var app = document.getElementById("app");
    var ctx = makeCtx(t);
    app.appendChild(header(t, mode));
    var body = el("div", { class: "viewbody" });
    app.appendChild(body);
    if (mode === "lab") t.lab(body, ctx);
    else t.tutorial(body, ctx);
  }

  // --- router ---
  FL.render = function () {
    if (FL.stopSpeak) FL.stopSpeak(); // hush narration when the view changes
    var app = document.getElementById("app");
    app.innerHTML = "";
    var parts = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts.length === 0) renderHome();
    else renderTopic(parts[0], parts[1] === "lab" ? "lab" : "tutorial");
    // refresh chrome
    refreshStarCount();
    var lb = document.getElementById("langbtn");
    if (lb) lb.textContent = FL.lang === "en" ? "中文" : "English";
    var mb = document.getElementById("mutebtn");
    if (mb) mb.textContent = FL.muted ? "🔇" : "🔊";
    document.getElementById("foot").textContent = FL.s("footer");
    window.scrollTo(0, 0);
  };

  FL.start = function () {
    document.documentElement.lang = FL.lang === "zh" ? "zh-TW" : "en";
    document.getElementById("langbtn").addEventListener("click", function () {
      FL.setLang(FL.lang === "en" ? "zh" : "en");
    });
    var mb = document.getElementById("mutebtn");
    if (mb) mb.addEventListener("click", FL.toggleMute);
    window.addEventListener("hashchange", FL.render);
    FL.render();
  };
})();
