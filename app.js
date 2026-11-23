// BLTDM Ops Prep. Data: data.js (PIS, GROUPS, STAR, EXTRA, CASES), guide.js (PI_INFO, VOCAB), practice.js (VAGUE, SHADY, DUELS, WRITE_TIPS).
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const byCode = Object.fromEntries(PIS.map(p => [p[0], p]));
const rand = n => Math.floor(Math.random() * n);
const pick = a => a[rand(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shortPI = t => t.replace(/\s*\(e\.g\.,[^)]*\)/, "");
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
const UNIT_ORDER = ["basics", "safety", "projects", "purchasing", "quality", "workflow", "supply", "law", "process"];

/* ---------- theme ---------- */
const setTheme = t => { document.documentElement.dataset.theme = t; store.set("bltdm-theme", t); document.querySelector("meta[name=theme-color]").content = t === "dark" ? "#11141A" : "#F4F8F7"; };
setTheme(store.get("bltdm-theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

/* ---------- routing ---------- */
const VIEWS = ["defs", "pis", "practice"];
let openCode = null;
function route() {
  const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "practice";
  VIEWS.forEach(n => { $("#v-" + n).hidden = n !== v; });
  $$(".tabs a").forEach(a => a.hash === "#" + v ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  if (v === "defs") renderDefs();
  if (v === "pis") renderPis();
  if (v === "practice" && !Q) nextQ();
  if (!openCode) scrollTo({ top: 0 });
}
addEventListener("hashchange", route);

/* ---------- definitions ---------- */
const ABC = [...new Set(VOCAB.map(v => v[0][0].toUpperCase()))].sort();
$("#az").innerHTML = ABC.map(l => `<a href="#defs" data-l="${l}" data-tip="Jump to ${l}">${l}</a>`).join("");
$("#az").onclick = e => { const a = e.target.closest("a"); if (!a) return; e.preventDefault(); $("#dSearch").value = ""; renderDefs(); document.getElementById("L-" + a.dataset.l)?.scrollIntoView({ behavior: "smooth" }); };
function renderDefs() {
  const q = $("#dSearch").value.trim().toLowerCase();
  const list = VOCAB.filter(v => !q || (v[0] + " " + v[1]).toLowerCase().includes(q)).sort((a, b) => a[0].localeCompare(b[0]));
  $("#dCount").textContent = q ? `${list.length} of ${VOCAB.length} terms` : `${VOCAB.length} terms`;
  $("#az").hidden = !!q;
  if (!list.length) { $("#dList").innerHTML = `<p class="empty">Nothing matches “${esc(q)}”. Try a shorter word.</p>`; return; }
  const groups = {};
  list.forEach(v => (groups[v[0][0].toUpperCase()] ||= []).push(v));
  $("#dList").innerHTML = Object.entries(groups).map(([l, vs]) => `<section class="letter" id="L-${l}"><h2>${l}</h2><div class="terms">${vs.map(v => `
    <article class="term"><h3>${esc(v[0])}</h3><p>${esc(v[1])}</p><div class="pis">${v[2].map(c => `<a class="pi-mini" href="#pis" data-open="${c}" data-tip="${esc(shortPI(byCode[c][4]))}">${c}</a>`).join("")}</div></article>`).join("")}</div></section>`).join("");
}
$("#dSearch").addEventListener("input", renderDefs);
document.addEventListener("click", e => {
  const a = e.target.closest("[data-open]");
  if (a) { openCode = a.dataset.open; piFilter = "all"; }
  const t = e.target.closest("[data-term]");
  if (t) { e.preventDefault(); $("#dSearch").value = t.dataset.term; location.hash = "#defs"; renderDefs(); }
});

/* ---------- PIs ---------- */
let piFilter = "all";
const FILTERS = [["all", "All 64"], ["star", "Law + ethics"], ...UNIT_ORDER.map(g => [g, GROUPS[g]])];
$("#piFilters").innerHTML = FILTERS.map(([k, l]) => `<button class="chip" data-f="${k}" aria-pressed="${k === piFilter}" data-tip="${k === "all" ? "Show every Operations PI" : k === "star" ? "The PIs that mix operations with law and ethics" : "Only " + l.toLowerCase()}">${l}</button>`).join("");
$("#piFilters").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; piFilter = b.dataset.f; openCode = null; renderPis(); };
function renderPis() {
  $$("#piFilters .chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.f === piFilter));
  const list = PIS.filter(p => piFilter === "all" || (piFilter === "star" ? STAR.has(p[0]) : p[3] === piFilter));
  $("#piGrid").innerHTML = list.map(p => {
    const open = p[0] === openCode, info = PI_INFO[p[0]];
    const terms = VOCAB.filter(v => v[2].includes(p[0]));
    return `<article class="ptag ${open ? "open" : ""}" data-code="${p[0]}" ${open ? "" : `role="button" tabindex="0" aria-expanded="false" data-tip="Open ${p[0]}"`}>
      <div class="meta"><span class="code">${p[0]}</span><span class="lv ${p[1] === "SP" ? "sp" : ""}">${p[1]}</span>${STAR.has(p[0]) ? '<span class="sticker rose">law + ethics</span>' : ""}</div>
      <span class="t">${esc(p[4])}</span>
      ${open ? `<button class="closex" data-close aria-label="Close ${p[0]}">Close</button>
      <div class="pdetail"><div><h4>What it means</h4><p>${esc(info[0])}</p></div><div><h4>How to use it</h4><p>${esc(info[1])}</p></div><div><h4>Say it like</h4><p>“${esc(p[5])}”</p></div>
      ${terms.length ? `<div class="vocab"><h4>Vocab to drop</h4>${terms.map(v => `<a class="vlink" href="#defs" data-term="${esc(v[0])}" data-tip="${esc(v[1])}">${esc(v[0])}</a>`).join("")}</div>` : ""}</div>`
      : `<span class="grp">${GROUPS[p[3]]}${p[2] === 2 ? " · cluster" : " · core"}</span>`}
    </article>`;
  }).join("");
  if (openCode) requestAnimationFrame(() => document.querySelector(`.ptag[data-code="${openCode}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
}
$("#piGrid").addEventListener("click", e => {
  if (e.target.closest("[data-close]")) { openCode = null; renderPis(); return; }
  if (e.target.closest("a")) return;
  const t = e.target.closest(".ptag"); if (!t || t.classList.contains("open")) return;
  openCode = t.dataset.code; renderPis();
});
$("#piGrid").addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches(".ptag:not(.open)")) { e.preventDefault(); e.target.click(); } });

/* ---------- practice ---------- */
let Q = null, n = 0;
const tally = store.get("bltdm-tally", { right: 0, total: 0, writes: 0, writeSum: 0 });
function paintScore() {
  const pct = tally.total ? Math.round(100 * tally.right / tally.total) : 0;
  $("#pScore").innerHTML = `<b>${tally.right}</b>/${tally.total} picked right${tally.total ? ` (${pct}%)` : ""}${tally.writes ? ` · writing avg <b>${(tally.writeSum / tally.writes).toFixed(1)}</b>/10` : ""}`;
}
const caseFor = code => pick(CASES.filter(c => c.op.includes(code)).concat(CASES.filter(c => c.op.includes(code)).length ? [] : CASES));
function makeAuto() {
  const p = pick(PIS), c = caseFor(p[0]);
  const offPI = pick(PIS.filter(x => x[3] !== p[3]));
  const opts = shuffle([
    [p[5], true, "Hits it. " + PI_INFO[p[0]][1]],
    [pick(VAGUE), false, "Too vague. There's nothing specific the judge can check off."],
    [pick(SHADY[p[3]]), false, "Red flag. It ignores the law or ethics, which is the whole point of BLTDM."],
    [offPI[5], false, `Solid line, wrong PI. It covers ${offPI[0]} (${shortPI(offPI[4])}).`],
  ]).slice(0, 3);
  if (!opts.some(o => o[1])) opts[rand(3)] = [p[5], true, "Hits it. " + PI_INFO[p[0]][1]];
  return { kind: "pick", c, pis: [p[0]], sit: c.sit, ask: "Which response hits this PI best?", opts };
}
function makeDuel() {
  const d = pick(DUELS);
  return { kind: "pick", c: null, pis: d.pis, sit: d.sit, ask: "Which response would score higher?", opts: shuffle(d.opts) };
}
function makeWrite() {
  const c = pick(CASES), pis = shuffle(c.op).slice(0, 2);
  return { kind: "write", c, pis, sit: c.sit, ask: "Write your response. Hit both PIs." };
}
function nextQ() {
  n++;
  Q = n % 4 === 0 ? makeWrite() : Math.random() < 0.45 ? makeDuel() : makeAuto();
  renderQ(); paintScore(); scrollTo({ top: 0 });
}
function caseCard(q) {
  return `<div class="casecard">
    ${q.c ? `<p class="who">${esc(q.c.role)}</p><h2>${esc(q.c.co)}</h2>` : `<p class="who">The situation</p>`}
    <p>${esc(q.sit)}</p>
    <div class="pilist">${q.pis.map(c => `<div><b>${c}</b><span>${esc(byCode[c][4])}</span></div>`).join("")}</div>
  </div>`;
}
function renderQ() {
  const q = Q, L = "ABCD";
  let h = `<div class="q-top"><span class="sticker ${q.kind === "write" ? "rose" : "mint"}">${q.kind === "write" ? "Write it" : "Pick one"}</span><span class="sticker">${q.pis.length > 1 ? q.pis.length + " PIs" : "1 PI"}</span></div>` + caseCard(q) + `<h3 class="ask">${q.ask}</h3>`;
  if (q.kind === "pick") {
    h += `<div class="resps">${q.opts.map((o, i) => `<button class="resp" data-i="${i}"><span class="L">${L[i]}</span><span><span class="rt">“${esc(o[0])}”</span><span class="why" hidden>${esc(o[2])}</span></span></button>`).join("")}</div><div id="after"></div>`;
  } else {
    h += `<textarea class="write" id="wr" placeholder="Talk to the judge like you would in the room. Name the problem, use both PIs, bring a law and the ethics, give a plan." aria-label="Your response"></textarea>
      <div class="writebar"><span class="mute">${esc(pick(WRITE_TIPS))}</span><span><button class="btn ghost" id="skipW" data-tip="Skip this one and get a new question">Skip</button> <button class="btn primary" id="gradeW" disabled data-tip="${keyNow() ? "Gemini grades your answer like a judge" : "Quick offline check. Add a Gemini key for real AI grading"}">Grade my answer</button></span></div><div id="after"></div>`;
  }
  $("#stage").innerHTML = h;
  if (q.kind === "pick") $$(".resp").forEach(b => b.onclick = () => answerPick(+b.dataset.i));
  else {
    const wr = $("#wr"); wr.value = store.get("bltdm-draft", "");
    const sync = () => { $("#gradeW").disabled = wr.value.trim().split(/\s+/).length < 12; store.set("bltdm-draft", wr.value); };
    wr.oninput = sync; sync();
    $("#gradeW").onclick = gradeWrite;
    $("#skipW").onclick = () => { store.del("bltdm-draft"); nextQ(); };
  }
}
function answerPick(i) {
  const q = Q, ok = q.opts[i][1];
  tally.total++; if (ok) tally.right++; store.set("bltdm-tally", tally); paintScore();
  $$(".resp").forEach((b, j) => {
    b.disabled = true;
    const o = q.opts[j];
    if (o[1]) b.classList.add("best");
    if (j === i && !o[1]) b.classList.add("picked-wrong");
    if (o[1] || j === i) b.querySelector(".why").hidden = false;
  });
  $("#after").innerHTML = `<div class="verdict ${ok ? "good" : "bad"}"><div><h3>${ok ? "That's the one." : "Not that one."}</h3><p>${ok ? "The judge could check this PI off." : "Read why the green one scores higher, then try the next."}</p></div><button class="btn primary" id="nextB">Next question</button></div>`;
  $("#nextB").onclick = nextQ; $("#nextB").focus();
}

/* ---------- grading ---------- */
const keyNow = () => store.get("bltdm-key", "") || window.BUILT_IN_KEY || "";
const MODELS = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
async function gemini(prompt) {
  const key = keyNow(); let last = "";
  for (const m of MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.3 } }),
      });
      if (r.status === 400 || r.status === 401 || r.status === 403) throw Object.assign(new Error("key"), { fatal: true });
      if (!r.ok) { last = "HTTP " + r.status; continue; }
      const d = await r.json();
      const txt = d.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
      return JSON.parse(txt.replace(/^```json\s*|```$/g, ""));
    } catch (e) { if (e.fatal) throw e; last = e.message; }
  }
  throw new Error(last || "no model answered");
}
function aiPrompt(q, answer) {
  return `You are a strict but encouraging DECA judge for Business Law and Ethics Team Decision Making (BLTDM), grading a high school student's spoken-style response.
Case: ${q.c.co}. ${q.sit} Task: ${q.c.ask}
Performance indicators to hit:
${q.pis.map(c => `- ${c}: ${byCode[c][4]} (meaning: ${PI_INFO[c][0]})`).join("\n")}
Student response:
"""${answer.slice(0, 3000)}"""
Grade it. A 10 hits every PI clearly, names specific laws or legal risks, addresses ethics, and gives a concrete plan with how to measure it. Vague or off-topic answers score low. Ignore spelling.
Return only JSON: {"score": integer 0-10, "summary": "one sentence verdict to the student", "pis": [{"code": "OP:xxx", "hit": true|false, "note": "short reason"}], "strengths": ["..."], "fixes": ["specific thing to add or change"], "better": "a 4-6 sentence stronger version of their answer, in a student's voice"}`;
}
function offlineGrade(q, answer) {
  const a = answer.toLowerCase();
  const stop = new Set("the and for with that this from into about their them they your what when which while there have has had were been being will would should could business businesses explain describe discuss nature".split(" "));
  const kw = c => [...new Set((byCode[c][4] + " " + PI_INFO[c][0]).toLowerCase().match(/[a-z]{5,}/g).filter(w => !stop.has(w)))];
  const pis = q.pis.map(c => {
    const words = kw(c), hits = words.filter(w => a.includes(w.slice(0, Math.max(5, w.length - 2))));
    const terms = VOCAB.filter(v => v[2].includes(c) && a.includes(v[0].toLowerCase().split(" (")[0].split(" / ")[0]));
    const hit = hits.length >= 2 || terms.length > 0;
    return { code: c, hit, note: hit ? `You used ${[...terms.map(t => t[0]), ...hits.slice(0, 3)].slice(0, 3).join(", ")}.` : PI_INFO[c][1] };
  });
  const laws = ["osha", "contract", "liability", "negligence", "lawsuit", "law", "legal", "regulation", "ftc", "epa", "compliance", "pci", "nda"].filter(w => a.includes(w));
  const ethics = ["ethic", "fair", "honest", "trust", "transparen", "right thing", "responsib"].filter(w => a.includes(w));
  const plan = ["week", "month", "deadline", "measure", "track", "kpi", "rate", "first", "then", "budget", "by "].filter(w => a.includes(w));
  const hitN = pis.filter(p => p.hit).length, cap = hitN === 0 ? 4 : hitN < pis.length ? 7 : 10; // can't score high without hitting the PIs
  const score = Math.min(cap, Math.round(hitN / pis.length * 4 + Math.min(laws.length, 2) + Math.min(ethics.length, 2) + Math.min(plan.length, 2)));
  const fixes = [];
  pis.filter(p => !p.hit).forEach(p => fixes.push(`Hit ${p.code}: ${PI_INFO[p.code][1]}`));
  if (!laws.length) fixes.push("Name a specific law, agency or legal risk, like OSHA, a contract or product liability.");
  if (!ethics.length) fixes.push("Say why your plan is the ethical choice, not just the legal one.");
  if (!plan.length) fixes.push("Give a timeline or a number you'd track to prove it worked.");
  return { score, summary: score >= 8 ? "Strong. A judge would check off most of this." : score >= 5 ? "Decent start. Add the missing pieces below." : "Too thin for a judge. Use the fixes below.", pis,
    strengths: [laws.length && "You brought in the law.", ethics.length && "You addressed ethics.", plan.length && "You gave a plan or a measure."].filter(Boolean), fixes, better: q.pis.map(c => byCode[c][5]).join(" "), offline: true };
}
async function gradeWrite() {
  const q = Q, answer = $("#wr").value.trim();
  $("#gradeW").disabled = true; $("#wr").readOnly = true;
  let g, note = "";
  if (keyNow()) {
    $("#after").innerHTML = `<p class="loading"><i></i>The judge is reading your answer…</p>`;
    try { g = await gemini(aiPrompt(q, answer)); note = "Graded by Gemini AI."; }
    catch (e) { g = offlineGrade(q, answer); note = e.fatal ? "Your Gemini key didn't work, so this is the offline check. Fix the key in AI grading." : "Gemini didn't answer (it may be busy or out of free uses), so this is the offline check."; }
  } else { g = offlineGrade(q, answer); note = "Offline check. Add a Gemini key in AI grading for a real judge-style grade."; }
  const score = Math.max(0, Math.min(10, Math.round(+g.score || 0)));
  tally.writes++; tally.writeSum += score; store.set("bltdm-tally", tally); store.del("bltdm-draft"); paintScore();
  const pis = (g.pis || []).filter(p => byCode[p.code]);
  $("#after").innerHTML = `<div class="grade">
    <div class="grade-head"><p class="big">${score}<small>/10</small></p><p>${esc(g.summary || "")}</p></div>
    <div class="pichk">${pis.map(p => `<div><span class="${p.hit ? "ok" : "no"}">${p.hit ? "Hit" : "Missed"} ${p.code}</span><span>${esc(p.note || "")}</span></div>`).join("")}</div>
    ${g.strengths?.length ? `<h4>What worked</h4><ul>${g.strengths.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
    ${g.fixes?.length ? `<h4>Fix this</h4><ul>${g.fixes.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
    ${g.better ? `<h4>${g.offline ? "Lines that hit these PIs" : "A stronger version"}</h4><p class="better">${esc(g.better)}</p>` : ""}
    <p class="source">${esc(note)}</p>
    <div class="writebar"><button class="btn" id="retryW" data-tip="Edit your answer and grade it again">Try again</button><button class="btn primary" id="nextW">Next question</button></div>
  </div>`;
  $("#nextW").onclick = nextQ;
  $("#retryW").onclick = () => { $("#wr").readOnly = false; $("#after").innerHTML = ""; $("#gradeW").disabled = false; $("#wr").focus(); };
}

/* ---------- key sheet ---------- */
function paintKey() {
  const on = !!keyNow();
  $("#keyBtn").className = "keybtn" + (on ? " on" : "");
  $("#keyBtn").innerHTML = `<span class="dot"></span>${on ? "AI grading on" : "AI grading off"}`;
}
$("#keyBtn").onclick = () => { $("#keyInput").value = store.get("bltdm-key", ""); $("#keyClear").hidden = !store.get("bltdm-key", ""); $("#keySheet").showModal(); };
$("#keyForm").onsubmit = e => { e.preventDefault(); const v = $("#keyInput").value.trim(); v ? store.set("bltdm-key", v) : store.del("bltdm-key"); $("#keySheet").close(); paintKey(); };
$("#keyCancel").onclick = () => $("#keySheet").close();
$("#keyClear").onclick = () => { store.del("bltdm-key"); $("#keySheet").close(); paintKey(); };

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
    clearTimeout(quietT); quietT = setTimeout(() => { busy = false; }, 250);
    if (busy) return;
    if ((e.deltaY < 0 && atTop()) || (e.deltaY > 0 && atBot())) { busy = true; animate(e.deltaY < 0 ? 18 : -18); }
  }, { passive: true });
})();

/* ---------- start ---------- */
paintKey(); paintScore(); route();
