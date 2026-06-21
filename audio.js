// AUDIO — synthesized sound effects (Web Audio) + bilingual dubbing (Web Speech).
// No asset files, fully offline. Voices come from the OS (zh-TW / en-US).
(function () {
  var FL = window.FunLab;
  FL.muted = localStorage.getItem("funlab.muted") === "1";

  // --- Web Audio: tiny synth, lazily created, resumed on first gesture ---
  var ac;
  function actx() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } }
    return ac;
  }
  function blip(freq, at, dur, type, gain) {
    var a = actx(); if (!a || FL.muted) return;
    var t = a.currentTime + at;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.16, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function tune(notes, type, step, gain) {
    notes.forEach(function (f, i) { blip(f, i * step, step + 0.06, type, gain); });
  }
  FL.sfx = {
    click: function () { blip(440, 0, 0.07, "triangle", 0.10); },
    note:  function (freq, dur) { blip(freq, 0, dur || 0.2, "triangle", 0.16); }, // musical tap
    good:  function () { tune([660, 880], "sine", 0.08, 0.16); },
    bad:   function () { blip(180, 0, 0.22, "sawtooth", 0.12); },
    hop:   function () { blip(620, 0, 0.09, "sine", 0.12); },                  // a footstep/hop
    stage: function () { tune([523, 659, 784], "sine", 0.10, 0.16); },        // C-E-G
    win:   function () { tune([523, 659, 784, 1047], "triangle", 0.13, 0.18); } // C-E-G-C
  };
  window.addEventListener("pointerdown", function () {
    var a = actx(); if (a && a.state === "suspended") a.resume();
  });

  // --- Web Speech: dubbing in the current language ---
  function strip(s) { return String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(); }
  if (window.speechSynthesis) { try { speechSynthesis.getVoices(); } catch (e) {} } // warm up

  FL.speak = function (text) {
    if (FL.muted || FL.lang === "zh" || !window.speechSynthesis) return; // English dubbing only
    var msg = strip(text); if (!msg) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(msg);
      u.lang = FL.lang === "zh" ? "zh-TW" : "en-US";
      u.rate = 0.95; u.pitch = 1.12;
      var want = u.lang.toLowerCase().slice(0, 2);
      var v = (speechSynthesis.getVoices() || []).filter(function (x) { return x.lang && x.lang.toLowerCase().indexOf(want) === 0; });
      if (v[0]) u.voice = v[0];
      speechSynthesis.speak(u);
    } catch (e) {}
  };
  FL.stopSpeak = function () { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} };

  FL.toggleMute = function () {
    FL.muted = !FL.muted;
    localStorage.setItem("funlab.muted", FL.muted ? "1" : "0");
    if (FL.muted) FL.stopSpeak();
    FL.render();
  };
})();
