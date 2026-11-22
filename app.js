// BLTDM Ops Prep. Data (PIS, GROUPS, STAR, EXTRA, CASES) lives in data.js.
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const byCode = Object.fromEntries(PIS.map(p => [p[0], p]));
const rand = n => Math.floor(Math.random() * n);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const icon = id => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ---------- saved progress ---------- */
const S = store.get("bltdm-v2", { done: [], xp: 0, streak: 0, last: null, learned: [], mistakes: [] });
const save = () => store.set("bltdm-v2", S);
const today = () => new Date().toLocaleDateString("en-CA");
function bumpStreak() {
  const t = today();
  if (S.last === t) return;
  const y = new Date(Date.now() - 864e5).toLocaleDateString("en-CA");
  S.streak = S.last === y ? S.streak + 1 : 1;
  S.last = t;
}
function liveStreak() { // a streak dies if you skip a whole day
  const y = new Date(Date.now() - 864e5).toLocaleDateString("en-CA");
  return S.last === today() || S.last === y ? S.streak : 0;
}
function paintStats() {
  const learned = new Set(S.learned).size;
  $$(".js-streak").forEach(e => e.textContent = liveStreak());
  $$(".js-xp").forEach(e => e.textContent = S.xp);
  $$(".js-learned").forEach(e => e.textContent = learned);
  $$(".js-learnbar").forEach(e => e.style.width = (100 * learned / PIS.length) + "%");
  const m = [...new Set(S.mistakes)];
  $("#reviewCard").hidden = m.length === 0;
  $("#mistakeCount").textContent = m.length;
}

/* ---------- units and lessons ---------- */
const UNIT_ORDER = ["basics", "safety", "projects", "purchasing", "quality", "workflow", "supply", "law", "process"];
const UNITS = UNIT_ORDER.map((g, ui) => {
  const pis = PIS.filter(p => p[3] === g).map(p => p[0]);
  const k = Math.ceil(pis.length / 4), lessons = [];
  for (let i = 0; i < k; i++) lessons.push(pis.slice(Math.round(i * pis.length / k), Math.round((i + 1) * pis.length / k)));
  return { g, title: GROUPS[g], n: ui + 1, lessons: lessons.map((codes, li) => ({ id: g + "-" + li, codes })) };
});
const ALL_LESSONS = UNITS.flatMap(u => u.lessons);

function renderPath() {
  const done = new Set(S.done);
  const firstOpen = ALL_LESSONS.findIndex(l => !done.has(l.id));
  let idx = 0;
  $("#path").innerHTML = UNITS.map(u => {
    const unitStart = idx;
    const unitLocked = firstOpen !== -1 && unitStart > firstOpen;
    const got = u.lessons.flatMap(l => l.codes).filter(c => S.learned.includes(c)).length;
    const total = u.lessons.flatMap(l => l.codes).length;
    const nodes = u.lessons.map((l, li) => {
      const i = idx++;
      const state = done.has(l.id) ? "done" : i === firstOpen ? "current" : "locked";
      const x = Math.round(Math.sin((i * Math.PI) / 2.2) * 70);
      const label = l.codes.map(c => byCode[c][4]).join(" · ");
      const short = byCode[l.codes[0]][4] + (l.codes.length > 1 ? " +" + (l.codes.length - 1) + " more" : "");
      const tip = state === "locked" ? "Finish the lesson before this one to unlock it" : (state === "done" ? "Practice again: " : "Start: ") + label;
      return `<button class="node ${state}" style="transform:translateX(${x}px)" data-lesson="${l.id}" aria-label="Lesson ${li + 1} of ${u.title}${state === "locked" ? ", locked" : state === "done" ? ", finished" : ""}" data-tip="${esc(tip)}" ${state === "locked" ? 'aria-disabled="true"' : ""}>
        ${icon(state === "done" ? "check" : state === "locked" ? "lock" : "star")}
        ${state === "current" ? `<span class="startbub">${S.done.length ? "Next up" : "Start here"}</span>` : ""}
        <span class="node-label ${x > 0 ? "l" : "r"}">${esc(short)}</span>
      </button>`;
    }).join("");
    return `<section class="unit"><div class="unit-head ${unitLocked ? "locked" : ""}"><div><p>Unit ${u.n}</p><h2>${esc(u.title)}</h2></div><span class="count">${got}/${total} PIs</span></div><div class="nodes">${nodes}</div></section>`;
  }).join("");
  $$(".node").forEach(b => b.onclick = () => {
    if (b.classList.contains("locked")) return;
    const l = ALL_LESSONS.find(x => x.id === b.dataset.lesson);
    startLesson(l.codes, { id: l.id, teach: !b.classList.contains("done") });
  });
}

/* ---------- question builders ---------- */
const STOP = new Set("the and of in to a an for with that its use their business businesses about between using utilizing employee's".split(" "));
const others = (p, n, sameGroupFirst = true) => {
  const pool = PIS.filter(x => x !== p);
  const same = shuffle(pool.filter(x => x[3] === p[3]));
  const rest = shuffle(pool.filter(x => x[3] !== p[3]));
  return (sameGroupFirst ? [...same, ...rest] : shuffle(pool)).slice(0, n);
};
const shortPI = t => t.replace(/\s*\(e\.g\.,[^)]*\)/, "");
const words = t => shortPI(t).split(" ");

const Q = {
  teach: p => ({ type: "teach", p }),
  pickPI: p => ({ type: "pick", p, title: "Which PI is this person covering?", quote: p[5], opts: shuffle([p, ...others(p, 3)]).map(o => ({ text: shortPI(o[4]), ok: o === p })) }),
  pickSay: p => ({ type: "pick", p, title: "Which line hits this PI?", pi: p, opts: shuffle([p, ...others(p, 3)]).map(o => ({ text: o[5], ok: o === p })) }),
  tf: p => {
    const match = Math.random() < 0.5, o = match ? p : others(p, 1)[0];
    return { type: "pick", p, title: "Does this line cover the PI?", pi: p, quote: o[5], two: true, opts: [{ text: "Yes", ok: match }, { text: "No", ok: !match }] };
  },
  blank: p => {
    const w = words(p[4]);
    const cands = w.map((x, i) => [x.replace(/[^\w'-]/g, ""), i]).filter(([x]) => x.length > 3 && !STOP.has(x.toLowerCase()));
    if (!cands.length) return Q.pickPI(p);
    const [ans, at] = cands[rand(cands.length)];
    const pool = shuffle([...new Set(PIS.flatMap(x => words(x[4])).map(x => x.replace(/[^\w'-]/g, "")).filter(x => x.length > 3 && !STOP.has(x.toLowerCase()) && x.toLowerCase() !== ans.toLowerCase()))]).slice(0, 3);
    return { type: "blank", p, title: "Fill in the missing word", before: w.slice(0, at).join(" "), after: w.slice(at + 1).join(" "), trail: w[at].replace(/[\w'-]/g, ""), ans, chips: shuffle([ans, ...pool]) };
  },
  build: p => {
    const w = words(p[4]);
    if (w.length > 9) return Q.blank(p);
    const extra = shuffle(others(p, 3, false).flatMap(x => words(x[4])).filter(x => !w.includes(x))).slice(0, 3);
    return { type: "build", p, title: "Build the PI", ans: w.join(" "), chips: shuffle([...w, ...extra]) };
  },
};
Q.meaning = p => ({ type: "pick", p, title: "Which PI does this describe?", def: PI_INFO[p[0]][0], opts: shuffle([p, ...others(p, 3)]).map(o => ({ text: shortPI(o[4]), ok: o === p })) });
Q.useIt = p => ({ type: "pick", p, title: "Which PI is this tip for?", def: PI_INFO[p[0]][1], opts: shuffle([p, ...others(p, 3)]).map(o => ({ text: shortPI(o[4]), ok: o === p })) });
const QTYPES = ["pickPI", "pickSay", "tf", "blank", "build", "meaning", "useIt"];

/* vocab questions */
const vothers = (v, n) => shuffle(VOCAB.filter(x => x !== v)).slice(0, n);
const V = {
  teach: v => ({ type: "vteach", v }),
  def: v => ({ type: "pick", v, title: `What does “${v[0]}” mean?`, opts: shuffle([v, ...vothers(v, 3)]).map(o => ({ text: o[1], ok: o === v })) }),
  term: v => ({ type: "pick", v, title: "Which term matches?", def: v[1], opts: shuffle([v, ...vothers(v, 3)]).map(o => ({ text: o[0], ok: o === v })) }),
};
const vq = v => (Math.random() < 0.5 ? V.def : V.term)(v);
const termsFor = codes => shuffle(VOCAB.filter(v => v[2].some(c => codes.includes(c))));

function makeLesson(codes, teach, vocab) {
  if (vocab) { // vocab-only lesson
    const steps = [];
    vocab.forEach(v => { if (teach) steps.push(V.teach(v)); steps.push(vq(v)); });
    return steps.concat(shuffle(vocab).slice(0, 3).map(vq));
  }
  const steps = [], ps = codes.map(c => byCode[c]);
  const qsFor = p => shuffle(QTYPES).slice(0, 2).map(t => Q[t](p));
  for (let i = 0; i < ps.length; i += 2) {
    const pair = ps.slice(i, i + 2);
    if (teach) pair.forEach(p => steps.push(Q.teach(p)));
    steps.push(...shuffle(pair.flatMap(qsFor)));
  }
  termsFor(codes).slice(0, 2).forEach(v => { if (teach) steps.push(V.teach(v)); steps.push(vq(v)); });
  shuffle(ps).slice(0, 2).forEach(p => steps.push(Q[QTYPES[rand(QTYPES.length)]](p)));
  return steps;
}

/* ---------- lesson player ---------- */
const JUDGE = `<svg class="judge" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="var(--goodBg)"/><path d="M12 60c2-12 10-17 20-17s18 5 20 17" fill="var(--mint)"/><path d="M28 43l4 9 4-9z" fill="var(--rose)"/><circle cx="32" cy="27" r="11" fill="#E9B98F"/><path d="M21 25c0-8 5-12 11-12s11 4 11 12c-3-4-7-5-11-5s-8 1-11 5z" fill="var(--ink)"/><circle cx="28" cy="28" r="1.6" fill="var(--ink)"/><circle cx="36" cy="28" r="1.6" fill="var(--ink)"/><path d="M28.5 33c2 1.5 5 1.5 7 0" stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
let L = null;

function startLesson(codes, { id = null, teach = true, review = false, vocab = null } = {}) {
  L = { id, codes, review, vocab, steps: makeLesson(codes, teach, vocab), i: 0, hearts: 3, wrong: 0, answered: 0, requeued: new Set(), sel: null, checked: false, startXp: S.xp };
  L.total = L.steps.length;
  $("#lesson").hidden = false; document.body.style.overflow = "hidden";
  paintHearts(); showStep();
}
function endLesson() { $("#lesson").hidden = true; document.body.style.overflow = ""; L = null; renderPath(); paintStats(); }
function paintHearts() { $("#lHearts").innerHTML = [0, 1, 2].map(i => `<svg class="${i < L.hearts ? "" : "lost"}"><use href="#i-heart"/></svg>`).join(""); $("#lHearts").setAttribute("aria-label", L.hearts + " hearts left"); }
function setFoot(state, html, btn, enabled) {
  $("#lFoot").className = "l-foot" + (state ? " " + state : "");
  $("#lMsg").innerHTML = html || "";
  $("#lBtn").textContent = btn; $("#lBtn").disabled = !enabled;
}
function showStep() {
  $("#lBar").style.width = (100 * L.i / L.total) + "%";
  if (L.i >= L.steps.length) return finish();
  const s = L.steps[L.i], body = $("#lBody");
  L.sel = null; L.checked = false;
  let h = `<div class="l-inner">`;
  if (s.type === "teach") {
    h += `<p class="newtag">${icon("star")} New PI</p><h2 class="q-kind">Learn this one</h2>
      <div class="pibox"><div class="code">${s.p[0]} <span class="lv ${s.p[1] === "SP" ? "sp" : ""}">${s.p[1]}</span></div><div class="txt">${esc(s.p[4])}</div>
      <div class="say"><b>What it means</b>${esc(PI_INFO[s.p[0]][0])}</div>
      <div class="say"><b>How to use it</b>${esc(PI_INFO[s.p[0]][1])}</div>
      <div class="say"><b>Say it like</b>“${esc(s.p[5])}”</div></div>`;
    body.innerHTML = h + `</div>`;
    setFoot("", "", "Got it", true); $("#lBtn").focus(); return;
  }
  if (s.type === "vteach") {
    h += `<p class="newtag">${icon("book")} New word</p><h2 class="q-kind">Learn this term</h2>
      <div class="pibox"><div class="txt">${esc(s.v[0])}</div><div class="say"><b>What it means</b>${esc(s.v[1])}</div>
      <div class="say"><b>Helps you hit</b>${s.v[2].map(c => c + " " + esc(shortPI(byCode[c][4]))).join("<br>")}</div></div>`;
    body.innerHTML = h + `</div>`;
    setFoot("", "", "Got it", true); $("#lBtn").focus(); return;
  }
  h += `<h2 class="q-kind">${esc(s.title)}</h2>`;
  if (s.type === "pick") {
    if (s.pi) h += `<div class="pibox"><div class="code">${s.pi[0]}</div><div class="txt">${esc(shortPI(s.pi[4]))}</div></div>`;
    if (s.def) h += `<div class="pibox"><div class="txt deftxt">${esc(s.def)}</div></div>`;
    if (s.quote) h += `<div class="prompt">${JUDGE}<div class="bubble">“${esc(s.quote)}”</div></div>`;
    h += `<div class="opts ${s.two ? "two" : ""}">${s.opts.map((o, i) => `<button class="opt" data-i="${i}" aria-pressed="false"><span class="k">${i + 1}</span><span>${esc(o.text)}</span></button>`).join("")}</div>`;
  } else if (s.type === "blank") {
    h += `<p class="blankline">${esc(s.before)} <span class="gap" id="gap">&nbsp;</span>${esc(s.trail)} ${esc(s.after)}</p><div class="chips">${s.chips.map((c, i) => `<button class="chip" data-i="${i}" aria-pressed="false">${esc(c)}</button>`).join("")}</div>`;
  } else if (s.type === "build") {
    h += `<div class="prompt">${JUDGE}<div class="bubble">“${esc(s.p[5])}”</div></div><div class="answer" id="ans" aria-label="Your answer"></div><div class="chips" id="bank">${s.chips.map((c, i) => `<button class="chip" data-i="${i}">${esc(c)}</button>`).join("")}</div>`;
    L.sel = [];
  }
  body.innerHTML = h + `</div>`; body.scrollTop = 0;
  setFoot("", "", "Check", false);
  wireStep(s);
}
function wireStep(s) {
  if (s.type === "pick") $$("#lBody .opt").forEach(b => b.onclick = () => pickOpt(+b.dataset.i));
  if (s.type === "blank") $$("#lBody .chip").forEach(b => b.onclick = () => {
    if (L.checked) return;
    L.sel = +b.dataset.i; $$("#lBody .chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    $("#gap").textContent = s.chips[L.sel]; $("#lBtn").disabled = false;
  });
  if (s.type === "build") $$("#bank .chip").forEach(b => b.onclick = () => {
    if (L.checked || b.classList.contains("used")) return;
    b.classList.add("used"); L.sel.push(+b.dataset.i);
    const a = document.createElement("button"); a.className = "chip"; a.textContent = s.chips[+b.dataset.i];
    a.onclick = () => { if (L.checked) return; L.sel.splice(L.sel.indexOf(+b.dataset.i), 1); a.remove(); b.classList.remove("used"); $("#lBtn").disabled = !L.sel.length; };
    $("#ans").append(a); $("#lBtn").disabled = false;
  });
}
function pickOpt(i) {
  if (L.checked) return;
  L.sel = i; $$("#lBody .opt").forEach((b, j) => b.setAttribute("aria-pressed", j === i)); $("#lBtn").disabled = false;
}
function check() {
  const s = L.steps[L.i];
  let ok, right;
  if (s.type === "pick") { ok = s.opts[L.sel].ok; right = s.opts.find(o => o.ok).text; $$("#lBody .opt").forEach((b, j) => { b.disabled = true; if (s.opts[j].ok) b.classList.add("right"); else if (j === L.sel) b.classList.add("wrong"); }); }
  if (s.type === "blank") { ok = s.chips[L.sel] === s.ans; right = s.ans; $$("#lBody .chip").forEach(b => b.disabled = true); $("#gap").textContent = s.ans; }
  if (s.type === "build") { const got = L.sel.map(i => s.chips[i]).join(" "); ok = got === s.ans; right = s.ans; }
  L.checked = true; L.answered++;
  if (ok) {
    const cheers = ["Nice!", "You got it!", "Judge would check that off.", "Clean.", "Correct!"];
    const note = s.v ? `${esc(s.v[0])}: ${esc(s.v[1])}` : s.title.startsWith("Does") ? "" : `${esc(s.p[0])}: ${esc(shortPI(s.p[4]))}`;
    setFoot("good", `<h3><span class="dot">${icon("check")}</span>${cheers[rand(cheers.length)]}</h3>${note ? `<p>${note}</p>` : ""}`, "Continue", true);
    if (s.p) S.mistakes = S.mistakes.filter(c => c !== s.p[0]);
  } else {
    L.wrong++; L.hearts--; paintHearts();
    const key = s.v ? s.v[0] : s.p[0];
    if (s.p && !S.mistakes.includes(s.p[0])) S.mistakes.push(s.p[0]);
    if (!L.requeued.has(key) || L.review) { L.requeued.add(key); L.steps.push(s.v ? vq(s.v) : Q[QTYPES[rand(QTYPES.length)]](s.p)); L.total++; }
    setFoot("bad", `<h3><span class="dot">${icon("x")}</span>${L.hearts ? "Not quite" : "Out of hearts"}</h3><p>Correct answer: ${esc(right)}</p>`, L.hearts ? "Got it" : "Try again", true);
  }
  save();
  $("#lBtn").focus();
}
function next() {
  const s = L.steps[L.i];
  if (s.type !== "teach" && s.type !== "vteach" && !L.checked) return check();
  if (L.hearts <= 0) { const { codes, id, review } = L; return startLesson(codes, { id, teach: false, review }); }
  L.i++; showStep();
}
function finish() {
  const perfect = L.wrong === 0, xp = 10 + (perfect ? 5 : 0);
  const acc = L.answered ? Math.round(100 * (L.answered - L.wrong) / L.answered) : 100;
  S.xp += xp; bumpStreak();
  if (L.id && !S.done.includes(L.id)) S.done.push(L.id);
  L.codes.forEach(c => { if (!S.learned.includes(c)) S.learned.push(c); });
  save();
  $("#lBody").innerHTML = `<div class="l-inner done-screen"><h2>${L.vocab ? "Vocab done" : L.review ? "Mistakes fixed" : perfect ? "Perfect lesson" : "Lesson complete"}</h2><p class="mute">${L.vocab ? L.vocab.length + " terms practiced." : L.codes.length + " PIs locked in."} ${perfect ? "Zero mistakes." : "The ones you missed are saved for review."}</p>
    <div class="tiles"><div class="tile t1"><p>XP earned</p><b>${icon("bolt")}${xp}</b></div><div class="tile t2"><p>Accuracy</p><b>${icon("star")}${acc}%</b></div><div class="tile t3"><p>Streak</p><b>${icon("flame")}${S.streak}</b></div></div></div>`;
  setFoot("", "", "Continue", true);
  L.finished = true;
}
$("#lBtn").onclick = () => { if (!L) return; if (L.finished) return endLesson(); next(); };
$("#lClose").onclick = endLesson;
$("#reviewBtn").onclick = () => { const m = shuffle([...new Set(S.mistakes)]).slice(0, 6); if (m.length) startLesson(m, { teach: false, review: true }); };
addEventListener("keydown", e => {
  if (!L || $("#lesson").hidden) return;
  if (e.key === "Escape") return endLesson();
  if (e.target.matches && e.target.matches("input")) return;
  if (e.key === "Enter" && !$("#lBtn").disabled && document.activeElement?.closest("#lBody") == null) { e.preventDefault(); $("#lBtn").click(); }
  const s = L.steps[L.i];
  if (s && s.type === "pick" && /^[1-4]$/.test(e.key) && +e.key <= s.opts.length) pickOpt(+e.key - 1);
});

/* ---------- theme ---------- */
const setTheme = t => { document.documentElement.dataset.theme = t; store.set("bltdm-theme", t); $("#theme span").textContent = t === "dark" ? "Light mode" : "Dark mode"; document.querySelector('meta[name=theme-color]').content = t === "dark" ? "#12151C" : "#F7FAF9"; };
setTheme(store.get("bltdm-theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

/* ---------- routing ---------- */
const VIEWS = ["learn", "case", "vocab", "pis", "plan"];
function route() {
  const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "learn";
  VIEWS.forEach(n => { $("#v-" + n).hidden = n !== v; });
  $$(".rail a.navlink").forEach(a => a.hash === "#" + v ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  if (v === "pis") renderPis();
  if (v === "vocab") renderVocab();
  if (v === "learn") renderPath();
  scrollTo({ top: 0 });
}
addEventListener("hashchange", route);

/* ---------- practice case ---------- */
let caseIdx = -1;
function drawCase() {
  let i; do { i = rand(CASES.length); } while (i === caseIdx && CASES.length > 1);
  caseIdx = i;
  const c = CASES[i];
  const ops = shuffle(c.op).slice(0, 4 + rand(2));
  const extras = shuffle(c.ex).slice(0, 7 - ops.length);
  $("#cfRole").textContent = c.role; $("#cfCo").textContent = c.co;
  $("#cfNo").textContent = "Case " + (i + 1) + " of " + CASES.length;
  $("#cfSit").textContent = c.sit; $("#cfAsk").textContent = c.ask;
  const list = $("#cfPis"); list.innerHTML = "";
  [...ops.map(k => [k, byCode[k][4], true]), ...extras.map(k => [k, EXTRA[k], false])].forEach(([code, text, isOp]) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="checkbox"><span class="box" aria-hidden="true"><svg viewBox="0 0 30 30"><path d="M5 16l6 7L26 5"/></svg></span><span class="pt">${esc(text)}${isOp ? "" : '<span class="extra">From another area</span>'}</span><span class="pc">${code}</span></label>`;
    li.querySelector("input").addEventListener("change", score);
    if (isOp) li.querySelector("label").dataset.tip = byCode[code][5];
    list.append(li);
  });
  score();
}
function score() {
  const n = $$("#cfPis input").filter(b => b.checked).length;
  $("#cfScore").textContent = n === 0 ? "" : n === 7 ? "All 7 covered. The judge has nothing left to dock." : n + " of 7 covered";
}
$("#newCase").onclick = () => { drawCase(); resetTimer(); };

const PHASES = [["Prep time", 30 * 60], ["With the judge", 15 * 60]];
let phase = 0, left = PHASES[0][1], tick = null;
function paintTimer() {
  $("#tNum").textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
  $("#tNum").classList.toggle("warn", left <= 120);
  $("#tPhase").textContent = PHASES[phase][0];
  $("#tBar").style.width = (100 * (1 - left / PHASES[phase][1])) + "%";
  $("#tStart").textContent = tick ? "Pause" : left === PHASES[phase][1] ? (phase ? "Start presenting" : "Start prep") : "Resume";
}
function toggleTimer() {
  if (tick) { clearInterval(tick); tick = null; }
  else tick = setInterval(() => {
    left--;
    if (left < 0) { clearInterval(tick); tick = null; if (phase === 0) { phase = 1; left = PHASES[1][1]; } else left = 0; }
    paintTimer();
  }, 1000);
  paintTimer();
}
function resetTimer() { clearInterval(tick); tick = null; phase = 0; left = PHASES[0][1]; paintTimer(); }
$("#tStart").onclick = toggleTimer;
$("#tReset").onclick = resetTimer;

/* ---------- PI list ---------- */
function renderPis() {
  const box = $("#pisList"); box.innerHTML = "";
  [[1, "Business Administration Core", "Every DECA event pulls from these."], [2, "Business Management and Administration Cluster", "Specific to your cluster. The most law-heavy ones live here."]].forEach(([t, name, sub]) => {
    box.insertAdjacentHTML("beforeend", `<h2 class="tier">${name}</h2><p class="tier-sub">${sub}</p>`);
    UNIT_ORDER.forEach(g => {
      const rows = PIS.filter(p => p[2] === t && p[3] === g);
      if (!rows.length) return;
      box.insertAdjacentHTML("beforeend", `<h3 class="grp">${GROUPS[g]}</h3>` + rows.map(p =>
        `<details class="pidet"><summary class="pirow ${S.learned.includes(p[0]) ? "got" : ""}">${icon("star")}<span class="c">${p[0]}</span><span class="lv ${p[1] === "SP" ? "sp" : ""}">${p[1]}</span><span class="t">${esc(p[4])}</span></summary>
          <div class="pimore"><p><b>What it means</b>${esc(PI_INFO[p[0]][0])}</p><p><b>How to use it</b>${esc(PI_INFO[p[0]][1])}</p><p><b>Say it like</b>“${esc(p[5])}”</p>${(() => { const t = VOCAB.filter(v => v[2].includes(p[0])).map(v => v[0]); return t.length ? `<p><b>Vocab to drop</b>${t.map(esc).join(", ")}</p>` : ""; })()}</div></details>`).join(""));
    });
  });
}

/* ---------- vocab page ---------- */
function renderVocab() {
  const q = $("#vSearch").value.trim().toLowerCase();
  const list = VOCAB.filter(v => !q || v[0].toLowerCase().includes(q) || v[1].toLowerCase().includes(q)).sort((a, b) => a[0].localeCompare(b[0]));
  $("#vCount").textContent = q ? `${list.length} of ${VOCAB.length} terms` : `${VOCAB.length} terms`;
  $("#vList").innerHTML = list.length ? list.map(v => `<div class="vrow"><dt>${esc(v[0])}</dt><dd>${esc(v[1])}<span class="vpis">${v[2].map(c => `<span class="vpi" data-tip="${esc(byCode[c][4])}">${c}</span>`).join("")}</span></dd></div>`).join("")
    : `<p class="mute">No terms match “${esc(q)}”. Try a shorter word.</p>`;
}
$("#vSearch").addEventListener("input", renderVocab);
$("#vPractice").onclick = () => startLesson([], { vocab: shuffle(VOCAB).slice(0, 8), teach: false });

/* ---------- tooltips (0.5s) ---------- */
const tip = $("#tip"); let tipT = null, tipEl = null;
const hideTip = () => { clearTimeout(tipT); tip.hidden = true; tipEl = null; };
function showTipFor(el) {
  clearTimeout(tipT); tipEl = el;
  tipT = setTimeout(() => {
    if (tipEl !== el || !el.isConnected) return;
    tip.textContent = el.dataset.tip; tip.hidden = false;
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), innerWidth - tw - 8) + "px";
    let y = r.top - th - 8; if (y < 8) y = r.bottom + 8;
    tip.style.top = y + "px";
  }, 500);
}
document.addEventListener("pointerover", e => { if (e.pointerType === "touch") return; const el = e.target.closest("[data-tip]"); if (el && el !== tipEl) showTipFor(el); else if (!el) hideTip(); });
document.addEventListener("focusin", e => { const el = e.target.closest("[data-tip]"); if (el && e.target.matches(":focus-visible")) showTipFor(el); });
["scroll", "pointerdown", "keydown", "focusout"].forEach(ev => addEventListener(ev, hideTip, true));

/* ---------- edge bounce (mouse/trackpad only; phones bounce natively) ---------- */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
  const el = $("#main");
  let raf = null, busy = false, quietT = null;
  const atTop = () => scrollY <= 0, atBot = () => innerHeight + scrollY >= document.documentElement.scrollHeight - 1;
  const animate = target => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / 420);
      el.style.transform = t < 1 ? `translateY(${target * Math.sin(Math.PI * t) * (1 - t * 0.3)}px)` : "";
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  addEventListener("wheel", e => {
    if (L) return;
    clearTimeout(quietT); quietT = setTimeout(() => { busy = false; }, 250);
    if (busy) return;
    if ((e.deltaY < 0 && atTop()) || (e.deltaY > 0 && atBot())) { busy = true; animate(e.deltaY < 0 ? 18 : -18); }
  }, { passive: true });
})();

/* ---------- start ---------- */
drawCase(); paintTimer(); paintStats(); route();
