// Shared UI strings. Topic content carries its own {en,zh} objects inline.
window.FunLab = window.FunLab || { topics: {}, order: [] };

FunLab.strings = {
  heroEyebrow:  { en: "ALGORITHM EXPERIMENTS · 演算法實驗室", zh: "演算法實驗室 · ALGORITHM EXPERIMENTS" },
  tagline:      { en: "Run experiments with code & algorithms. Fill a beaker, earn a specimen!", zh: "用程式和演算法做實驗。裝滿一瓶，收集一個標本！" },
  pickTopic:    { en: "Choose an experiment", zh: "選一個實驗" },
  specimens:    { en: "SPECIMENS", zh: "標本" },
  experiment:   { en: "EXPERIMENT", zh: "實驗" },
  ready:        { en: "Ready", zh: "待做" },
  collected:    { en: "Done ✓", zh: "完成 ✓" },
  tutorial:     { en: "Tutorial", zh: "教學" },
  lab:          { en: "Lab", zh: "實驗室" },
  stage:        { en: "STAGE", zh: "關卡" },
  stageClear:   { en: "Stage clear!", zh: "過關！" },
  nextStage:    { en: "Next stage ▶", zh: "下一關 ▶" },
  home:         { en: "Home", zh: "首頁" },
  next:         { en: "Next ▶", zh: "下一步 ▶" },
  toLab:        { en: "I'm ready — to the Lab! 🚀", zh: "我準備好了 — 去實驗室！🚀" },
  retry:        { en: "Run it again 🔁", zh: "再做一次 🔁" },
  win:          { en: "Experiment complete! 🎉", zh: "實驗成功！🎉" },
  starGot:      { en: "NEW SPECIMEN COLLECTED", zh: "收集到新標本" },
  alreadyStar:  { en: "SPECIMEN ALREADY ON THE SHELF", zh: "這個標本已經收集過了" },
  footer:       { en: "FUN LAB · RUNS OFFLINE · NO INTERNET NEEDED", zh: "FUN LAB · 離線執行 · 不需網路" }
};

// current language: 'en' or 'zh', persisted
FunLab.lang = localStorage.getItem("funlab.lang") || "en";

FunLab.pick = function (obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[FunLab.lang] != null ? obj[FunLab.lang] : obj.en;
};

FunLab.s = function (key) { return FunLab.pick(FunLab.strings[key]); };

FunLab.setLang = function (lang) {
  FunLab.lang = lang;
  localStorage.setItem("funlab.lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-TW" : "en";
  FunLab.render();
};
