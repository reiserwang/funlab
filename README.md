# 🧪 Fun Lab

A playful, colorful local app that teaches **programming & algorithm fundamentals**
to kids aged **7–12**. Bilingual: **English (en-us)** and **繁體中文 (zh-tw)**.

## Run it

**Just double-click `index.html`** — it opens in any web browser. No install, no
internet, no build step. Works fully offline. (Tap **中文 / English** top-right to switch language.)

## What's inside

Ten **Experiments**, each with a **Tutorial** (learn it) and a **Lab** (play it).
Every Lab has **3 stages** of rising difficulty — clear all three to earn the ⭐ specimen.

| | Experiment | Lab (3 stages) |
|---|---|---|
| 📊 | **Sorting** / 排序 | Swap bars to sort short→tall (bubble sort) — 4, 5, 6 bars |
| 🚦 | **If / Else** / 條件判斷 | Pick the right action — IF → IF/ELSE → comparisons |
| 🔁 | **Loops** / 迴圈 | Set a `repeat N times` count to make exactly enough |
| 🐢 | **Functions** / 函式 | Build `hop()`, call it to land on the apple — targets 4, 6, 9 |
| 🪆 | **Recursion** / 遞迴 | Open nesting dolls until the base case — 3, 4, 5 deep |
| 🔍 | **Search** / 搜尋 | Higher/lower guessing (binary search) — 1–10, 1–50, 1–100 |
| 🥞 | **Stacks & Queues** / 堆疊與佇列 | Who comes out first? LIFO → FIFO → mixed |
| 🌳 | **Trees** / 樹狀圖 | Walk a number tree to the treasure — mini → full → inner node |
| 🕸️ | **Graphs** / 圖與網路 | Hop along edges to reach a friend — 3 networks |
| 🗺️ | **Paths** / 找路 | Steer through a maze to the flag — 3 mazes |

Stars, chosen language, and sound on/off are saved in the browser (`localStorage`).

## Sound & input

- **Sound effects** — synthesized live with the Web Audio API (tap, wrong-buzz, stage chime, win fanfare). No audio files.
- **Dubbing (en-us + zh-tw)** — tutorial steps are read aloud with the browser's built-in Web Speech voices; tap 🔊 on any step to replay. Narration follows the current language.
- **🔊 / 🔇** in the top bar mutes/unmutes everything.
- **Mouse + touch** — every control is tap/click driven with big targets; grids scale to fit phones. Works on desktop and tablets/phones alike.

(Voices come from the operating system — macOS, Windows, iOS and Android all ship en-US and zh-TW voices.)

## How it's built

Plain HTML + CSS + vanilla JS. No framework, no dependencies, no bundler — so it
runs straight from `file://`. Each topic is one self-registering script in `topics/`;
emoji are used for all graphics (no image assets). To add a topic, copy any file in
`topics/`, call `FunLab.register(...)`, and add one `<script>` tag in `index.html`.
