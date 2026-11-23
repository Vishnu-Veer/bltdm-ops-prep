// Practice content: weak response patterns and hand-written "which response is better" items.

// Sounds fine, says nothing the judge can check off.
const VAGUE = [
  "We'd make sure everything runs smoothly and the customers stay happy.",
  "Basically, the company should just try its best and stay positive about the situation.",
  "We'd look into it and probably make some changes going forward.",
  "Our team would definitely focus on improving things across the board.",
  "Honestly, this is a big issue, so we'd work really hard to fix it as soon as possible.",
  "We'd have a meeting with everyone and figure out a good plan together.",
  "Communication is key, so we'd make sure everyone is on the same page.",
  "We think the business should be more efficient and professional overall.",
];

// Ignores the law or ethics: the fastest way to lose a BLTDM judge.
const SHADY = {
  basics: ["Operations is about saving money, so whatever costs least is the right call, even if it's a little risky.", "Customers won't know how things are made, so we don't need to worry about how it looks behind the scenes."],
  safety: ["The injury was minor, so there's no need to write anything down or tell anyone outside the store.", "Safety gear slows workers down, so we'd make it optional during busy hours."],
  projects: ["If we fall behind, we just won't tell the owner until the deadline. No reason to worry them early.", "We'd skip the planning and start right away. Plans always change anyway."],
  purchasing: ["The owner's cousin already has a vendor, so we'd just give them the contract. No need for bids.", "We'd go with the cheapest supplier no matter what. Price is all that matters."],
  quality: ["If a batch fails inspection, we can still sell it at a discount without telling anyone.", "Quality checks take too long, so we'd only do them when a customer complains."],
  workflow: ["Each department should just handle its own stuff and not worry about what others are doing.", "We'd just tell employees to work faster and stay late until it's done."],
  supply: ["Where our supplier gets materials isn't our problem as long as the price is low.", "If the overseas factory has issues, that's on them, not on us."],
  law: ["We only need to tell customers about the data leak if it hits the news.", "Contracts are just paperwork. A handshake deal with the vendor is fine."],
  process: ["The employee made the mistake, so we'd fire them and move on. The process is fine.", "We've always done it this way, so there's no reason to change the process now."],
};

// Hand-written items where both answers sound OK but one is clearly stronger.
const DUELS = [
  { pis: ["OP:339"], sit: "A bakery's new oven keeps tripping the breaker. The owner wants employees to keep using it until the weekend rush is over.",
    opts: [
      ["We'd stop using the oven until an electrician inspects it. OSHA requires a workplace free of known hazards, and if a worker is hurt or a fire starts, the bakery faces fines and negligence lawsuits. Losing one weekend costs less than that.", true, "Names the law (OSHA), the legal risk (negligence) and compares the cost. That's exactly what 'legal considerations in operations' asks for."],
      ["Safety is really important, so we'd tell the employees to be extra careful around the oven this weekend and fix it next week.", false, "Mentions safety but no law, no legal risk, and it leaves a known hazard in use."],
      ["We'd buy a second oven so the rush goes faster.", false, "Doesn't address the hazard or any legal issue at all."]] },
  { pis: ["OP:161", "OP:246"], sit: "A gym chain is choosing a new cleaning-supply vendor. The manager's brother-in-law runs one of the bidding companies.",
    opts: [
      ["We'd have the manager step back from the decision because of the conflict of interest. Then we'd score all bids on the same criteria: price, product safety, delivery reliability and references. The brother-in-law's company can still win, but only on the scorecard.", true, "Spots the conflict of interest (ethics) and gives a fair, specific way to select vendors."],
      ["We'd pick the brother-in-law's company since we already trust him and it's easier to work with family.", false, "That's a conflict of interest. Judges in an ethics event will dock this hard."],
      ["We'd pick whichever vendor is cheapest so the gym saves money.", false, "Fair, but price-only selection ignores quality and safety, and misses the ethics issue."]] },
  { pis: ["OP:518", "OP:441"], sit: "A small online clothing store stores customers' full card numbers in a spreadsheet so they can reorder faster.",
    opts: [
      ["We'd delete the stored card numbers today and switch to a payment processor that tokenizes cards, so the store never holds them. That keeps them PCI compliant, and if there were ever a breach, state law would force them to notify every customer, which would wreck trust.", true, "Specific fix, names PCI rules and breach notification law, and ties it back to customer trust."],
      ["We'd password-protect the spreadsheet so only the owner can open it.", false, "Better than nothing, but storing full card numbers at all breaks PCI rules."],
      ["Customers like fast checkout, so we'd keep the spreadsheet but make a backup copy in case it gets lost.", false, "A backup copy doubles the risk. It ignores privacy and the law."]] },
  { pis: ["OP:652", "OP:162"], sit: "A phone-case brand's main supplier shipped 3 batches in a row with cracked cases. Returns are up 40%.",
    opts: [
      ["We'd put the supplier on a written corrective action plan with a 30-day deadline and track their defect rate weekly on a vendor scorecard. At the same time we'd get a backup supplier qualified so if they miss the deadline, we can switch without running out.", true, "Corrective action plan, a deadline, a measurable scorecard and a backup. That hits both PIs."],
      ["We'd drop the supplier immediately and find a new one.", false, "Decisive, but switching cold with no backup risks running out of stock, and it skips evaluating performance."],
      ["We'd call the supplier and ask them to do better next time.", false, "Too vague. No deadline, no measurement, no consequence."]] },
  { pis: ["OP:009", "OP:004"], sit: "A warehouse worker sprained an ankle tripping over boxes left in an aisle. The supervisor wants to handle it quietly.",
    opts: [
      ["First we make sure the worker gets medical care. Then we write an incident report, find the root cause, which is boxes in walkways, and fix it with a clear-aisle rule and daily checks. If the injury requires treatment beyond first aid, it goes in the OSHA injury log. Hiding it would be illegal and would hurt trust.", true, "Walks through accident procedures in order and names the OSHA recordkeeping rule."],
      ["We'd give the worker a few days off and remind everyone to watch where they walk.", false, "Kind, but there's no report, no root cause and no legal step."],
      ["Since it's just a sprain, we'd keep it off the records so the company's safety rating stays good.", false, "Hiding a recordable injury is illegal. Instant red flag."]] },
  { pis: ["OP:677", "OP:480"], sit: "A sneaker startup can cut costs 25% by moving production to an overseas factory nobody on the team has visited.",
    opts: [
      ["Before signing, we'd do due diligence: a third-party audit of the factory for child labor, safety and wages, plus a supplier code of conduct in the contract. We'd also budget for longer shipping times and tariffs, since the 25% savings might shrink once those are counted.", true, "Covers ethics in the supply chain (audit, code of conduct) and global issues (shipping, tariffs)."],
      ["Saving 25% is huge, so we'd move production right away and check on the factory later.", false, "Checking later means you could already be tied to child labor or unsafe conditions."],
      ["We'd stay with the current factory because overseas is too risky.", false, "Safe, but it doesn't discuss the actual issues. Judges want analysis, not avoidance."]] },
  { pis: ["OP:001", "OP:520"], sit: "A food truck is launching a second truck for a festival in 6 weeks. Nothing has been ordered yet.",
    opts: [
      ["Week 1–2: get the truck inspected and the health permit filed. Week 3: order equipment and hire 2 staff. Week 4: train staff. Week 5: test run. Week 6: festival. We'd check progress every Friday, and if permits are late we'd cut the menu instead of missing the date.", true, "A real plan with milestones, plus how they'll monitor and correct course."],
      ["We'd make a to-do list and start working on everything as soon as possible.", false, "No order, no dates, no check-ins."],
      ["We'd hire a project manager to handle it.", false, "Hands the job off without showing you understand project planning."]] },
  { pis: ["OP:474", "OP:355"], sit: "A pharmacy keeps filling prescriptions late. The manager blames one slow technician.",
    opts: [
      ["We'd map the whole fill process first. If the bottleneck is that one tech handles both phone calls and filling, the fix is moving calls to the front counter, not firing someone. That's process thinking, and it'll speed up every shift.", true, "Uses business process thinking and streamlining with a concrete bottleneck."],
      ["We'd replace the slow technician with someone faster.", false, "Blames a person without checking the process. If the process is the problem, the new hire will be slow too."],
      ["We'd tell all the technicians to work faster during busy hours.", false, "Pushing people harder doesn't fix a broken process."]] },
  { pis: ["OP:337", "OP:241"], sit: "A coffee shop's bean supplier wants to raise prices 15%. The shop has used them for 5 years.",
    opts: [
      ["We'd meet with them, since 5 years of good service matters, and negotiate: accept a smaller increase in exchange for a 1-year price lock and a guaranteed delivery day. We'd bring quotes from 2 other roasters so we know our walk-away point.", true, "Protects the relationship and shows real negotiation: trade-offs, leverage and a walk-away point."],
      ["We'd switch suppliers right away. Nobody gets to raise prices on us.", false, "Burns a 5-year relationship without even negotiating."],
      ["We'd just pay the higher price so we don't upset them.", false, "Keeps the relationship but gives up without negotiating."]] },
  { pis: ["OP:024", "OP:025"], sit: "A print shop's costs went up 30%. The owner wants to cut the safety training budget to save money.",
    opts: [
      ["We wouldn't cut safety training. An injury would cost far more in workers' comp and fines. Instead, we'd cut waste: track reprints, which are mostly setup errors, and reward employees for cost-saving ideas. Workers see the waste first.", true, "Explains operating costs, protects safety for legal reasons, and uses the employee's role in expense control."],
      ["We'd cut the training since the workers already know what they're doing.", false, "Saves a little now and risks a big legal and injury cost later."],
      ["We'd raise prices so the shop can cover the new costs.", false, "Might work, but it doesn't touch operating costs or expense control at all."]] },
  { pis: ["OP:153", "OP:013"], sit: "A hot-sauce company's secret recipe was posted online by a former employee.",
    opts: [
      ["The recipe is a trade secret, so first we'd talk to a lawyer about the former employee's NDA and getting the post taken down. Going forward, only 2 people get the full recipe, it's stored in a locked system, and every new hire signs an NDA.", true, "Names trade secrets and NDAs (law) and gives real security precautions."],
      ["We'd post a statement saying the leaked recipe is fake.", false, "Lying to customers is an ethics problem, and it doesn't protect the recipe."],
      ["There's nothing we can do now that it's online, so we'd make a new recipe.", false, "Gives up on legal options and doesn't stop the next leak."]] },
  { pis: ["OP:478", "OP:191"], sit: "A grocery chain keeps throwing out spoiled produce because stores over-order.",
    opts: [
      ["We'd add inventory software that tracks sales by item and auto-suggests orders based on what actually sells. Add temperature sensors in coolers that text the manager if they warm up. Less spoilage, and it's a food safety win.", true, "Specific technology tied to the exact problem, with a safety bonus."],
      ["We'd get better technology to help with inventory.", false, "Which technology? Doing what? Too vague."],
      ["We'd tell store managers to order less produce.", false, "Could cause empty shelves. It doesn't fix how they decide what to order."]] },
];

// Prompts for the written answers. Each uses a practice case and two of its PIs.
const WRITE_TIPS = [
  "Aim for 4–6 sentences. Name the problem, explain the idea, bring a law, bring the ethics, give a plan.",
  "Say the PI ideas out loud in your answer so a judge could check them off.",
  "Name a real law or agency (OSHA, FTC, EPA) or a contract term. Specifics score.",
];
