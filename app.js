// BLTDM Operations study site. PI wording is from DECA's 2026-27 HS BMA list.
const PIS = [
  // [code, level, tier, group, PI, what you'd say]
  ["OP:189","CS",1,"basics","Explain the nature of operations","Operations is everything that keeps the business running day to day: making the product, buying supplies, keeping people safe and getting orders out on time."],
  ["OP:190","SP",1,"basics","Discuss the role of ethics in operations","Running operations ethically means we don't cut corners on safety or quality just to save money, even when no one is watching."],
  ["OP:191","SP",1,"basics","Describe the use of technology in operations","We'd use inventory software and sensors so we catch problems early instead of after a customer complains."],
  ["OP:004","PQ",1,"safety","Describe health and safety regulations in business","OSHA sets the rules for a safe workplace, like training, protective gear and reporting serious injuries."],
  ["OP:005","PQ",1,"safety","Report noncompliance with business health and safety regulations","If an employee sees a safety violation, there should be a clear, no-punishment way to report it to a manager."],
  ["OP:006","PQ",1,"safety","Follow instructions for use of equipment, tools, and machinery","Every worker gets trained on the machine's manual before they use it, and we keep a record of that training."],
  ["OP:007","PQ",1,"safety","Follow safety precautions","Simple precautions like gloves, guards on machines and clear walkways prevent most accidents."],
  ["OP:008","CS",1,"safety","Maintain a safe work environment","We'd do weekly safety walk-throughs and fix hazards right away, not just once a year."],
  ["OP:009","CS",1,"safety","Explain procedures for handling accidents","When someone gets hurt: give first aid, call for help, write an incident report and find out what caused it."],
  ["OP:010","CS",1,"safety","Handle and report emergency situations","We need an emergency plan everyone knows, with exits, a meeting spot and who calls 911."],
  ["OP:013","CS",1,"safety","Explain routine security precautions","Routine security means locked doors, ID badges and cameras so only the right people get in."],
  ["OP:152","CS",1,"safety","Follow established security procedures/policies","The policy only works if everyone follows it, so we'd train staff and check it's being used."],
  ["OP:153","CS",1,"safety","Protect company information and intangibles","Recipes, customer lists and the brand are valuable too, so we protect them with NDAs and access limits."],
  ["OP:441","CS",1,"safety","Explain information privacy, security, and confidentiality considerations in business","Customers trust us with their info, so we only collect what we need and keep it private."],
  ["OP:064","CS",1,"safety","Maintain data security","Strong passwords, two-factor login and regular backups keep our data safe."],
  ["OP:158","SP",1,"projects","Explain the nature of project management","Project management is planning a one-time job with a clear goal, budget and deadline, then tracking it to the finish."],
  ["OP:675","SP",1,"projects","Describe the role of ethics in project management","An ethical project manager is honest about delays and costs instead of hiding problems from the owner."],
  ["OP:519","CS",1,"projects","Plan project","Our plan has a goal, steps, who owns each step and a deadline."],
  ["OP:520","CS",1,"projects","Monitor projects and take corrective actions","We'd check progress every week, and if we fall behind, we move people or adjust the timeline."],
  ["OP:521","CS",1,"projects","Evaluate project success","At the end we compare results to the goal: did we hit the deadline, the budget and the quality target?"],
  ["OP:003","SP",1,"projects","Identify resources needed for project","To do this we need three things: money, people and the right equipment, and here's roughly how much of each."],
  ["OP:001","SP",1,"projects","Develop project plan","Month one we fix the safety issue, month two we rebid vendors, month three we review the numbers."],
  ["OP:002","SP",1,"projects","Apply project-management tools to monitor and communicate project progress","A simple Gantt chart or shared tracker shows everyone where the project stands."],
  ["OP:159","SP",1,"projects","Evaluate project results","We'd look at what worked and what didn't so the next project goes smoother."],
  ["OP:015","CS",1,"purchasing","Explain the nature and scope of purchasing","Purchasing is buying the right things, in the right amount, at the right price, at the right time."],
  ["OP:016","CS",1,"purchasing","Place orders/reorders","We'd set a reorder point so we order more before we run out, not after."],
  ["OP:031","CS",1,"purchasing","Maintain inventory of supplies","Tracking inventory tells us what we have, so we don't overbuy or run out."],
  ["OP:246","SP",1,"purchasing","Discuss the importance of utilizing ethical purchasing methods","Ethical purchasing means no kickbacks, fair bidding and not buying from suppliers who abuse workers."],
  ["OP:247","SP",1,"purchasing","Explain the impact of the purchasing process on productivity","If supplies show up late or broken, the whole line stops, so good purchasing keeps us productive."],
  ["OP:160","SP",1,"purchasing","Manage the bid process in purchasing","We'd send the same request to at least three vendors and compare their bids fairly."],
  ["OP:161","SP",1,"purchasing","Select vendors","We pick vendors on quality, reliability, price and ethics, not price alone."],
  ["OP:162","SP",1,"purchasing","Evaluate vendor performance","A vendor scorecard tracks on-time delivery, defect rate and price so the choice is based on facts."],
  ["OP:017","CS",1,"quality","Explain the concept of production","Production is turning raw materials into the finished product the customer buys."],
  ["OP:163","SP",1,"quality","Identify quality-control measures","Quality control means checking samples, setting standards and catching defects before they ship."],
  ["OP:164","SP",1,"quality","Utilize quality control methods at work","We'd inspect a sample from every batch and stop the line if it fails."],
  ["OP:019","SP",1,"quality","Describe crucial elements of a quality culture","A quality culture means every employee owns quality and feels safe pointing out problems."],
  ["OP:652","SP",1,"quality","Resolve problems with suppliers' quality issues","We'd give the supplier a written corrective action plan with a deadline, and switch if they miss it."],
  ["OP:024","SP",1,"quality","Explain the nature of overhead/operating costs","Overhead is what it costs just to stay open, like rent, utilities and insurance, even if we sell nothing."],
  ["OP:025","SP",1,"quality","Explain employee's role in expense control","Employees save money too, by cutting waste, taking care of equipment and pointing out cheaper ways to work."],
  ["OP:228","CS",1,"workflow","Organize and prioritize work","We'd fix the safety risk first because it's urgent, then work on the cost savings."],
  ["OP:230","CS",1,"workflow","Coordinate work with that of team members","Each person knows their part and we check in so no one's work blocks someone else's."],
  ["OP:196","SP",1,"workflow","Coordinate activities with those of other departments","Purchasing, production and legal all need to agree on the new vendor contract."],
  ["OP:354","SP",1,"workflow","Monitor and ensure completion of delegated tasks","When the manager hands off a task, they set a due date and follow up."],
  ["OP:355","SP",1,"workflow","Streamline work processes","We'd map out the process, cut steps that don't add value and save time."],
  ["OP:442","CS",1,"workflow","Comply with policies and procedures for use of property and equipment","Company equipment is used the right way and only for work, which protects it and keeps people safe."],
  ["OP:443","CS",1,"supply","Explain the concept of supply chain","The supply chain is every step from raw materials to the customer: suppliers, factory, shipping and stores."],
  ["OP:444","SP",1,"supply","Explain the benefits of supply chain collaboration","If we share forecasts with our suppliers, they can plan ahead and we get fewer late shipments."],
  ["OP:339","SP",2,"law","Discuss legal considerations in operations","Legally we have to think about OSHA safety rules, our vendor contracts and product liability if something we sell hurts someone."],
  ["OP:517","SP",2,"law","Comply with strategies for protecting business' digital assets (e.g., website, social media, email, etc.)","We'd lock down our website, social accounts and email with two-factor login and limit who has admin access."],
  ["OP:518","SP",2,"law","Comply with strategies to protect digital customer data (e.g., information about customers, customers' credit-card numbers, passwords, customer transactions)","Card numbers and passwords get encrypted, and if there's ever a breach the law says we must tell customers."],
  ["OP:250","CS",2,"purchasing","Describe types of purchase orders","A standard PO is a one-time buy. A blanket PO covers repeat orders from the same vendor over time."],
  ["OP:336","CS",2,"purchasing","Discuss types of inventory","Inventory comes in raw materials, work in progress and finished goods, plus supplies like packaging."],
  ["OP:327","SP",2,"process","Discuss the nature of business analysis","Business analysis means studying how things work now, finding the problem and recommending a fix."],
  ["OP:474","SP",2,"process","Discuss business process thinking and its impact","Instead of blaming one person, we look at the whole process that caused the mistake."],
  ["OP:475","SP",2,"process","Describe the factors that influence business process design","How we design a process depends on cost, the law, technology, customer needs and our staff."],
  ["OP:476","SP",2,"process","Explain the causes of business process changes","Processes change because of new laws, new technology, growth or a problem like this one."],
  ["OP:477","SP",2,"supply","Explain the impact of supply chains on business performance","A slow or unreliable supply chain means empty shelves and angry customers, so it hits sales directly."],
  ["OP:479","SP",2,"supply","Describe supply chain networks","A supply chain network is all the suppliers, warehouses and shippers connected to us."],
  ["OP:480","SP",2,"supply","Discuss global supply chain issues","Buying overseas can be cheaper, but it brings shipping delays, tariffs and less control over working conditions."],
  ["OP:303","SP",2,"supply","Discuss the nature of supply chain management","Supply chain management is coordinating every link so products flow smoothly at the lowest total cost."],
  ["OP:677","SP",2,"supply","Discuss ethical considerations in supply chain management","We're responsible for who we buy from, so we'd check suppliers for child labor, unsafe factories and pollution."],
  ["OP:478","SP",2,"supply","Describe the impact of technology on supply chain management","Tracking software and barcodes show us where every shipment is in real time."],
  ["OP:241","SP",2,"purchasing","Maintain vendor/supplier relationships","Good relationships with suppliers mean they'll help us out when we're in a jam."],
  ["OP:337","SP",2,"purchasing","Negotiate terms with vendors in business","We'd negotiate price, delivery dates and a quality clause into the contract, and know our walk-away point."],
];
const GROUPS = {basics:"What operations is",safety:"Safety and security",projects:"Project management",purchasing:"Purchasing and vendors",quality:"Production, quality and costs",workflow:"Workflow and equipment",supply:"Supply chain",law:"Law and digital data",process:"Business process"};
const STAR = new Set(["OP:339","OP:190","OP:246","OP:677","OP:518"]); // most "law + ethics" flavored

// Non-OP PIs that can fill the other 3 slots (from the same official list)
const EXTRA = {
  "BL:002":"Describe the nature of legally binding contracts",
  "BL:001":"Describe legal issues affecting businesses",
  "BL:069":"Identify the basic torts relating to business enterprises",
  "BL:073":"Discuss the nature of environmental law",
  "BL:145":"Explain the nature of import/export law",
  "BL:051":"Describe methods used to protect intellectual property",
  "BL:163":"Comply with the spirit and intent of laws and regulations",
  "EI:125":"Recognize and respond to ethical dilemmas",
  "EI:124":"Explain reasons for ethical dilemmas",
  "EI:128":"Build trust in relationships",
  "CO:061":"Defend ideas objectively",
  "CO:202":"Explain how digital communications (e.g., email, text messages, chats) exposes business to risk",
};

const CASES = [
  {co:"GreenLeaf Snacks",role:"You're consultants for the owner of",sit:"GreenLeaf's cheapest packaging vendor keeps shipping late, and two batches failed quality checks. Last week a worker cut their hand on an old sealing machine. The owner wants to keep the cheap vendor to save money.",ask:"Recommend what to do about the vendor and the injury, and explain the legal and ethical risks.",op:["OP:162","OP:652","OP:339","OP:009","OP:246","OP:161","OP:024","OP:008"],ex:["BL:002","EI:125","BL:069"]},
  {co:"Velo Bikes",role:"You're the operations team at",sit:"Velo makes electric scooters. A cheaper overseas battery supplier would cut costs 20%, but reports say its factory has unsafe working conditions and its batteries have overheated before.",ask:"Decide whether to switch suppliers and present your reasoning to the CEO.",op:["OP:677","OP:480","OP:161","OP:339","OP:163","OP:303","OP:246","OP:477"],ex:["BL:145","EI:124","BL:069"]},
  {co:"Brightside Dental",role:"You're advisors to the office manager at",sit:"A staff member at a chain of dental offices clicked a phishing email, and patient names and card numbers may have been exposed. Patients don't know yet.",ask:"Explain what the business must do now and how to stop it happening again.",op:["OP:518","OP:441","OP:064","OP:517","OP:339","OP:152","OP:190","OP:520"],ex:["CO:202","BL:001","EI:125"]},
  {co:"Harbor Coffee Co.",role:"You're consultants for the founders of",sit:"Harbor Coffee is opening a second café in 8 weeks. The build-out is over budget, the espresso machine supplier is delayed and the founders want to skip a fire inspection to open on time.",ask:"Build a plan to open safely and legally without blowing the budget.",op:["OP:001","OP:003","OP:520","OP:339","OP:004","OP:228","OP:002","OP:675"],ex:["BL:163","EI:125","CO:061"]},
  {co:"Tidewater Furniture",role:"You're the new operations managers at",sit:"Tidewater's warehouse keeps running out of popular items while unpopular ones pile up. Workers are rushing to catch up and near-misses with forklifts have doubled.",ask:"Fix the inventory problem and the safety problem together.",op:["OP:031","OP:016","OP:336","OP:355","OP:008","OP:005","OP:191","OP:339"],ex:["BL:001","EI:128","CO:061"]},
  {co:"Peak Apparel",role:"You're consultants hired by",sit:"Peak sells athletic wear online. An influencer posted that one of Peak's factories dumps dye into a river. Peak didn't know. Sales dropped 15% in a week.",ask:"Advise Peak on handling its supplier and rebuilding trust.",op:["OP:677","OP:162","OP:444","OP:241","OP:339","OP:190","OP:477","OP:479"],ex:["BL:073","EI:128","EI:124"]},
  {co:"Northgate Print Shop",role:"You're advisors to the owner of",sit:"Northgate's costs went up 30% this year. Employees waste paper and ink, jobs get redone because of mistakes, and the owner's nephew got a vendor contract without any bids.",ask:"Cut costs and fix the vendor situation fairly.",op:["OP:024","OP:025","OP:160","OP:246","OP:164","OP:355","OP:337","OP:339"],ex:["BL:002","EI:125","CO:061"]},
  {co:"Summit Grocers",role:"You're the operations team at",sit:"Summit is moving to new inventory software. Store managers hate it, data entry errors are up, and a cooler failed overnight because the alert went to an old email.",ask:"Recommend how to roll out the system and stop food safety risks.",op:["OP:478","OP:476","OP:475","OP:196","OP:004","OP:339","OP:521","OP:191"],ex:["BL:163","EI:128","CO:202"]},
];

const $ = s => document.querySelector(s);
const byCode = Object.fromEntries(PIS.map(p => [p[0], p]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
let known = new Set(store.get("bltdm-known", []));
const saveKnown = () => store.set("bltdm-known", [...known]);

/* ---------- theme ---------- */
const setTheme = t => { document.documentElement.dataset.theme = t; store.set("bltdm-theme", t); };
setTheme(store.get("bltdm-theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

/* ---------- routing ---------- */
const VIEWS = ["case", "cards", "quiz", "pis", "plan"];
function route() {
  const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "case";
  VIEWS.forEach(n => { $("#v-" + n).hidden = n !== v; });
  document.querySelectorAll(".tabs a").forEach(a => { if (a.hash === "#" + v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  if (v === "pis") renderPis();
  if (v === "quiz" && !quiz) startQuiz();
  scrollTo({ top: 0 });
}
addEventListener("hashchange", route);

/* ---------- practice case ---------- */
let caseIdx = -1;
function drawCase() {
  let i; do { i = Math.floor(Math.random() * CASES.length); } while (i === caseIdx && CASES.length > 1);
  caseIdx = i;
  const c = CASES[i];
  const ops = shuffle(c.op).slice(0, 4 + Math.floor(Math.random() * 2)); // 4 or 5 from Operations
  const extras = shuffle(c.ex).slice(0, 7 - ops.length);
  $("#cfRole").textContent = c.role;
  $("#cfCo").textContent = c.co;
  $("#cfNo").textContent = "Case " + (i + 1) + " of " + CASES.length;
  $("#cfSit").textContent = c.sit;
  $("#cfAsk").textContent = c.ask;
  const list = $("#cfPis"); list.innerHTML = "";
  [...ops.map(k => [k, byCode[k][4], true]), ...extras.map(k => [k, EXTRA[k], false])].forEach(([code, text, isOp]) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="checkbox"><span class="box" aria-hidden="true"><svg viewBox="0 0 30 30"><path d="M5 16l6 7L26 5"/></svg></span><span class="pt">${text}${isOp ? "" : '<span class="extra">From another area</span>'}</span><span class="pc">${code}</span></label>`;
    li.querySelector("input").addEventListener("change", score);
    if (isOp) li.querySelector("label").dataset.tip = byCode[code][5];
    list.append(li);
  });
  score();
}
function score() {
  const boxes = [...document.querySelectorAll("#cfPis input")];
  const n = boxes.filter(b => b.checked).length;
  $("#cfScore").textContent = n === 0 ? "" : n === 7 ? "All 7 covered. The judge has nothing left to dock." : n + " of 7 covered";
}
$("#newCase").onclick = () => { drawCase(); resetTimer(); };

/* ---------- timer ---------- */
const PHASES = [["Prep time", 30 * 60], ["With the judge", 15 * 60]];
let phase = 0, left = PHASES[0][1], tick = null;
function paintTimer() {
  const m = Math.floor(left / 60), s = left % 60;
  $("#tNum").textContent = m + ":" + String(s).padStart(2, "0");
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

/* ---------- flashcards ---------- */
let cardFilter = "all", deck = [], ci = 0;
const FILTERS = [["all", "All 64"], ["star", "Law + ethics picks"], ["unknown", "Still learning"], ...Object.entries(GROUPS)];
function buildFilters() {
  const box = $("#cardFilters");
  FILTERS.forEach(([k, label]) => {
    const b = document.createElement("button");
    b.className = "chip"; b.textContent = label; b.setAttribute("aria-pressed", k === cardFilter);
    b.dataset.tip = k === "all" ? "Show every Operations PI" : k === "star" ? "The PIs that mix operations with law and ethics" : k === "unknown" ? "Only cards you haven't marked as known" : "Only " + label.toLowerCase() + " PIs";
    b.onclick = () => { cardFilter = k; box.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b)); makeDeck(); };
    box.append(b);
  });
}
function makeDeck() {
  deck = PIS.filter(p => cardFilter === "all" || (cardFilter === "star" ? STAR.has(p[0]) : cardFilter === "unknown" ? !known.has(p[0]) : p[3] === cardFilter));
  deck = shuffle(deck); ci = 0; showCard();
}
function showCard() {
  const f = $("#flash"); f.classList.remove("flipped");
  if (!deck.length) {
    $("#fCode").textContent = ""; $("#fText").textContent = "You know every card in this set. Pick another filter or reset one in the checklist."; $("#fSay").textContent = ""; $("#fCount").textContent = "0 cards";
    $("#fKnow").disabled = true; return;
  }
  $("#fKnow").disabled = false;
  const p = deck[ci];
  $("#fCode").textContent = p[0] + "  ·  " + p[1] + "  ·  " + GROUPS[p[3]];
  $("#fText").textContent = p[4];
  $("#fSay").textContent = "“" + p[5] + "”";
  $("#fCount").textContent = (ci + 1) + " of " + deck.length;
  $("#fKnow").setAttribute("aria-pressed", known.has(p[0]));
  $("#fKnow").textContent = known.has(p[0]) ? "Known" : "I know this";
}
$("#flash").onclick = () => deck.length && $("#flash").classList.toggle("flipped");
$("#fNext").onclick = () => { if (deck.length) { ci = (ci + 1) % deck.length; showCard(); } };
$("#fPrev").onclick = () => { if (deck.length) { ci = (ci - 1 + deck.length) % deck.length; showCard(); } };
$("#fKnow").onclick = () => { const c = deck[ci][0]; known.has(c) ? known.delete(c) : known.add(c); saveKnown(); showCard(); };
addEventListener("keydown", e => {
  if ($("#v-cards").hidden || e.target.closest("input,textarea")) return;
  if (e.key === "ArrowRight") $("#fNext").click();
  if (e.key === "ArrowLeft") $("#fPrev").click();
});

/* ---------- quiz ---------- */
let quiz = null;
function startQuiz() {
  quiz = { qs: shuffle(PIS).slice(0, 10), i: 0, right: 0 };
  askQ();
}
function askQ() {
  const box = $("#quizBox");
  if (quiz.i >= quiz.qs.length) {
    box.innerHTML = `<p class="q-end">${quiz.right}/10</p><p class="q-end-l">${quiz.right >= 8 ? "Judge-ready. Go draw a practice case." : quiz.right >= 5 ? "Solid. Hit the flashcards on the ones you missed." : "Run the flashcards once, then try again."}</p><button class="btn primary" id="qAgain" data-tip="Start a new set of 10 questions">Try 10 more</button>`;
    $("#qAgain").onclick = startQuiz; return;
  }
  const q = quiz.qs[quiz.i];
  const sameGroup = PIS.filter(p => p !== q && p[3] === q[3]);
  const others = shuffle(sameGroup.length >= 3 ? sameGroup : PIS.filter(p => p !== q)).slice(0, 3);
  const opts = shuffle([q, ...others]);
  box.innerHTML = `<p class="q-meta">Question ${quiz.i + 1} of 10</p><p class="q-say">“${q[5]}”</p><div class="q-opts">${opts.map(o => `<button class="q-opt" data-c="${o[0]}"><small>${o[0]}</small>${o[4]}</button>`).join("")}</div><p class="q-fb" aria-live="polite"></p>`;
  box.querySelectorAll(".q-opt").forEach(b => b.onclick = () => {
    const ok = b.dataset.c === q[0];
    if (ok) quiz.right++;
    box.querySelectorAll(".q-opt").forEach(x => { x.disabled = true; if (x.dataset.c === q[0]) x.classList.add("right"); });
    if (!ok) b.classList.add("wrong");
    box.querySelector(".q-fb").innerHTML = (ok ? "Correct." : "Not quite. It was " + q[0] + ".") + ` <button class="btn primary" id="qNext" style="margin-left:10px">${quiz.i === 9 ? "See score" : "Next question"}</button>`;
    $("#qNext").onclick = () => { quiz.i++; askQ(); };
    $("#qNext").focus();
  });
}

/* ---------- PI checklist ---------- */
function renderPis() {
  const box = $("#pisList"); box.innerHTML = "";
  [[1, "Business Administration Core", "Every DECA event pulls from these."], [2, "Business Management and Administration Cluster", "Specific to your cluster. The most law-heavy ones live here."]].forEach(([t, name, sub]) => {
    box.insertAdjacentHTML("beforeend", `<h2 class="tier">${name}</h2><p class="tier-sub">${sub}</p>`);
    Object.entries(GROUPS).forEach(([g, gname]) => {
      const rows = PIS.filter(p => p[2] === t && p[3] === g);
      if (!rows.length) return;
      box.insertAdjacentHTML("beforeend", `<h3 class="grp">${gname}</h3>`);
      rows.forEach(p => {
        const l = document.createElement("label");
        l.className = "pirow" + (STAR.has(p[0]) ? " star" : "");
        l.dataset.tip = p[5];
        l.innerHTML = `<input type="checkbox" ${known.has(p[0]) ? "checked" : ""} aria-label="I know ${p[0]}"><span class="c">${p[0]}</span><span class="lv ${p[1] === "SP" ? "sp" : ""}">${p[1]}</span><span class="t">${p[4]}</span>`;
        l.querySelector("input").onchange = e => { e.target.checked ? known.add(p[0]) : known.delete(p[0]); saveKnown(); paintProg(); };
        box.append(l);
      });
    });
  });
  paintProg();
}
function paintProg() {
  $("#pisProg").textContent = known.size + " of " + PIS.length + " known";
  $("#pisBar").style.width = (100 * known.size / PIS.length) + "%";
}

/* ---------- tooltips (0.5s) ---------- */
const tip = $("#tip"); let tipT = null, tipEl = null;
const hideTip = () => { clearTimeout(tipT); tip.hidden = true; tipEl = null; };
function showTipFor(el) {
  clearTimeout(tipT); tipEl = el;
  tipT = setTimeout(() => {
    if (tipEl !== el || !el.isConnected) return;
    tip.textContent = el.dataset.tip; tip.hidden = false;
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), innerWidth - tw - 8);
    let y = r.top - th - 8; if (y < 8) y = r.bottom + 8;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }, 500);
}
document.addEventListener("pointerover", e => { if (e.pointerType === "touch") return; const el = e.target.closest("[data-tip]"); if (el && el !== tipEl) showTipFor(el); else if (!el) hideTip(); });
document.addEventListener("focusin", e => { const el = e.target.closest("[data-tip]"); if (el) showTipFor(el); });
["scroll", "pointerdown", "keydown", "focusout"].forEach(ev => addEventListener(ev, hideTip, true));

/* ---------- edge bounce ----------
   Mouse/trackpad only: phones already bounce natively, and doing both made the page shake.
   One bounce per scroll gesture, so trackpad momentum can't keep re-triggering it. */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
  const els = [$("#main"), document.querySelector(".foot")];
  let off = 0, raf = null, busy = false, quietT = null;
  const atTop = () => scrollY <= 0, atBot = () => innerHeight + scrollY >= document.documentElement.scrollHeight - 1;
  const paint = () => els.forEach(e => e.style.transform = off ? `translateY(${off}px)` : "");
  const animate = target => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / 420);
      off = target * Math.sin(Math.PI * t) * (1 - t * 0.3);
      if (t >= 1) off = 0;
      paint();
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
buildFilters(); makeDeck(); drawCase(); paintTimer(); route();
