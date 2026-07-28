/* ==========================================================================
   Kewal Jewellers — Review Assistant
   Vanilla JS, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * CONFIG — edit these to customise the app
   * ------------------------------------------------------------------ */
  const CONFIG = {
    businessName: "Kewal Jewellers",
    googleReviewUrl: "https://g.page/r/CWSPqeqCFgtDEBE/review",
    locationMentionChance: 0.13, // ~13% of generated reviews naturally mention the area
    loadingDelayMs: 700          // small pause so the loading screen feels intentional, not broken
  };

  /* ------------------------------------------------------------------ *
   * PRODUCT / SERVICE DATA
   * ------------------------------------------------------------------ */
  const CATEGORIES = [
    {
      key: "gold",
      label: "Gold Jewellery",
      genericPhrase: "gold jewellery",
      subs: [
        { key: "Ring", phrase: "a gold ring" },
        { key: "Chain", phrase: "a gold chain" },
        { key: "Pendant", phrase: "a gold pendant" },
        { key: "Necklace", phrase: "a gold necklace" },
        { key: "Bracelet", phrase: "a gold bracelet" },
        { key: "Bangle", phrase: "gold bangles" },
        { key: "Coin", phrase: "a gold coin" },
        { key: "Kada", phrase: "a gold kada" },
        { key: "Mangalsutra", phrase: "a mangalsutra" },
        { key: "Earrings", phrase: "gold earrings" },
        { key: "Nose Pin", phrase: "a gold nose pin" },
        { key: "Other", phrase: "gold jewellery" }
      ]
    },
    {
      key: "silver",
      label: "Silver Jewellery",
      genericPhrase: "silver jewellery",
      subs: [
        { key: "Ring", phrase: "a silver ring" },
        { key: "Chain", phrase: "a silver chain" },
        { key: "Pendant", phrase: "a silver pendant" },
        { key: "Bracelet", phrase: "a silver bracelet" },
        { key: "Anklet", phrase: "silver anklets" },
        { key: "Toe Ring", phrase: "silver toe rings" },
        { key: "Coin", phrase: "a silver coin" },
        { key: "Idol", phrase: "a silver idol" },
        { key: "Rakhi", phrase: "a silver rakhi" },
        { key: "Bangle", phrase: "silver bangles" },
        { key: "Earrings", phrase: "silver earrings" },
        { key: "Other", phrase: "silver jewellery" }
      ]
    },
    {
      key: "diamond",
      label: "Diamond Jewellery",
      genericPhrase: "diamond jewellery",
      subs: [
        { key: "Ring", phrase: "a diamond ring" },
        { key: "Pendant", phrase: "a diamond pendant" },
        { key: "Bracelet", phrase: "a diamond bracelet" },
        { key: "Necklace", phrase: "a diamond necklace" },
        { key: "Earrings", phrase: "diamond earrings" },
        { key: "Other", phrase: "diamond jewellery" }
      ]
    },
    {
      key: "services",
      label: "Services",
      genericPhrase: "their service",
      isService: true,
      subs: [
        { key: "Repair", phrase: "a repair service" },
        { key: "Cleaning", phrase: "a cleaning service" },
        { key: "Exchange", phrase: "an exchange" },
        { key: "Polishing", phrase: "a polishing service" },
        { key: "Custom Order", phrase: "a custom order" },
        { key: "Other", phrase: "a service" }
      ]
    }
  ];

  const IMPRESSED_OPTIONS = [
    { key: "Friendly Staff", phrase: "the friendly staff" },
    { key: "Honest Guidance", phrase: "the honest guidance" },
    { key: "Fair Pricing", phrase: "the fair pricing" },
    { key: "Beautiful Collection", phrase: "the beautiful collection" },
    { key: "Designs", phrase: "the beautiful designs" },
    { key: "Hallmarked Jewellery", phrase: "the hallmarked jewellery" },
    { key: "Quick Service", phrase: "the quick service" },
    { key: "Trust", phrase: "how much trust they build with customers" },
    { key: "Behaviour", phrase: "their courteous behaviour" },
    { key: "Store Ambience", phrase: "the store ambience" },
    { key: "Customisation", phrase: "the customisation options" },
    { key: "Overall Experience", phrase: "the overall experience" }
  ];

  /* ------------------------------------------------------------------ *
   * GRAMMAR ENGINE — sentence pools
   * {items} = natural joined list of purchased products/services
   * {impressed} = natural joined list of what impressed the customer
   * ------------------------------------------------------------------ */

  const INTROS = [
    "I recently visited {biz} and had a wonderful experience.",
    "We visited {biz} a few days ago and it turned out to be a great decision.",
    "Recently, my family and I stopped by {biz}, and I'm glad we did.",
    "My family has trusted {biz} for a while now, and this visit was no different.",
    "I walked into {biz} without knowing exactly what I wanted, and left very happy.",
    "We had a lovely shopping experience at {biz} this week.",
    "I had a genuinely pleasant visit to {biz} recently.",
    "My family and I visited {biz} for a small family occasion.",
    "Recently, I decided to check out {biz}, and it was worth it.",
    "We've been customers of {biz} for some time, and they continue to impress us.",
    "I dropped by {biz} on a friend's recommendation and had a great experience.",
    "My mother suggested {biz}, and our visit went really well.",
    "We spent a good hour at {biz} and enjoyed every bit of it.",
    "I recently made a purchase at {biz} and wanted to share how it went.",
    "It was our first time at {biz}, and it left a strong impression.",
    "My family has been visiting {biz} for years, and this trip was equally satisfying.",
    "Recently, I was looking for something special and found it at {biz}.",
    "We walked into {biz} on a whim and ended up thoroughly impressed.",
    "I had heard good things about {biz} before visiting, and they held true.",
    "My sister recommended {biz}, so we decided to visit together.",
    "I stopped by {biz} while shopping in the area and had a smooth experience.",
    "We recently celebrated a small occasion with a purchase from {biz}.",
    "My family and I have shopped at {biz} more than once now.",
    "I wasn't sure what to expect at {biz}, but it exceeded expectations.",
    "Recently, {biz} came highly recommended, and I decided to give it a try.",
    "We took some time out to visit {biz} last week.",
    "My father has been a long-time customer of {biz}, and I now understand why.",
    "I've shopped at a few jewellery stores before, but {biz} stood out.",
    "We were looking for a reliable jeweller and found {biz}.",
    "My family recently visited {biz} for an upcoming celebration.",
    "It's always a pleasure visiting {biz}, and this time was no exception.",
    "I recently completed a purchase at {biz} and thought I'd share my experience.",
    "We planned our visit to {biz} carefully, and it paid off.",
    "My wife and I visited {biz} together over the weekend.",
    "I've been meaning to visit {biz} for a while, and I'm glad I finally did.",
    "Recently, our whole family made a trip to {biz}.",
    "We were referred to {biz} by a relative, and the visit went smoothly.",
    "I had a specific piece in mind, and {biz} helped me find exactly that.",
    "My family often turns to {biz} for our jewellery needs.",
    "It had been a while since our last visit to {biz}, and it was worth the wait."
  ];

  const PURCHASE_SENTENCES = [
    "I purchased {items}, and I'm very happy with the choice.",
    "We ended up choosing {items} after looking around a bit.",
    "I went for {items}, and it was exactly what I had in mind.",
    "We picked out {items} for the occasion.",
    "My family opted for {items} during this visit.",
    "I chose {items}, and the whole process was smooth.",
    "We finally settled on {items} after some thought.",
    "I selected {items}, and it turned out beautifully.",
    "We got {items}, and the quality really stood out.",
    "My mother picked out {items} for herself.",
    "I went in for {items} specifically.",
    "We came away with {items} that day.",
    "I decided on {items} after browsing a few options.",
    "My family purchased {items} for an upcoming function.",
    "We opted for {items}, and it was a good decision.",
    "I ended up with {items}, which I'm quite pleased about.",
    "We chose {items} in the end.",
    "My sister picked {items} during our visit.",
    "I went ahead with {items} that day.",
    "We settled on {items} without much back and forth.",
    "My wife chose {items}, and she couldn't be happier.",
    "I got {items} made specially.",
    "We picked {items} as a small family purchase.",
    "My father bought {items} during the visit.",
    "I finalised {items} after trying out a few designs.",
    "We took home {items} that day.",
    "My family decided on {items} together.",
    "I picked {items}, and it fit the occasion perfectly.",
    "We ended up buying {items}.",
    "I chose to go with {items} in the end.",
    "My mother-in-law suggested {items}, and we agreed.",
    "We narrowed it down to {items} after some discussion.",
    "I opted for {items} without a second thought.",
    "My family went with {items} for the celebration.",
    "We were happy to settle on {items}.",
    "I finally picked {items} after weeks of thinking about it.",
    "My husband and I chose {items} together.",
    "We decided on {items}, and it was well worth it.",
    "I got {items}, and it turned out even better than expected.",
    "My daughter picked out {items} for herself."
  ];

  const APPRECIATION_SENTENCES = [
    "What stood out to me was {impressed}.",
    "What impressed us most was {impressed}.",
    "I particularly appreciated {impressed}.",
    "We were especially happy with {impressed}.",
    "One thing that really stood out was {impressed}.",
    "I was genuinely impressed by {impressed}.",
    "What made the experience special was {impressed}.",
    "We noticed and appreciated {impressed} right away.",
    "I was pleasantly surprised by {impressed}.",
    "My family and I really valued {impressed}.",
    "The thing I remember most is {impressed}.",
    "We came away impressed by {impressed}.",
    "I have to mention {impressed}, which really made a difference.",
    "What I liked most about the visit was {impressed}.",
    "We felt {impressed} really set the visit apart.",
    "I was struck by {impressed} throughout the visit.",
    "My mother mentioned how much she appreciated {impressed}.",
    "We left with a strong impression of {impressed}.",
    "It's worth mentioning {impressed}, which added to the experience.",
    "I found {impressed} to be a real highlight.",
    "We were genuinely happy about {impressed}.",
    "One aspect I really valued was {impressed}.",
    "My family appreciated {impressed} throughout the process.",
    "I noticed {impressed} right from the start.",
    "We were pleased with {impressed} in particular.",
    "The part that stood out to us was {impressed}.",
    "I appreciated {impressed} more than I expected to.",
    "We were happy to experience {impressed} firsthand.",
    "My father commented on {impressed} as well.",
    "It was clear from the start that {impressed} mattered to the team.",
    "We felt genuinely taken care of, especially given {impressed}.",
    "I walked away thinking about {impressed}.",
    "My sister also noticed {impressed} during our visit.",
    "We were reassured by {impressed} throughout.",
    "I'd say {impressed} made the biggest impression on me.",
    "We really valued {impressed} during our time there.",
    "It left a mark on us, particularly {impressed}.",
    "My wife pointed out {impressed}, and I agreed completely.",
    "We appreciated {impressed} more than a typical showroom visit.",
    "I can confidently say {impressed} made all the difference."
  ];

  // Endings — `loc:true` items are eligible for the small % that mention the area.
  const ENDINGS = [
    { text: "Overall, it was a lovely experience.", loc: false },
    { text: "I'd happily visit again for future purchases.", loc: false },
    { text: "We'll definitely be back.", loc: false },
    { text: "It was a smooth and pleasant visit from start to finish.", loc: false },
    { text: "I'm glad we chose to visit them.", loc: false },
    { text: "My family plans to return for future occasions.", loc: false },
    { text: "It was a memorable visit overall.", loc: false },
    { text: "I left feeling genuinely satisfied.", loc: false },
    { text: "We're already thinking about our next visit.", loc: false },
    { text: "It was time well spent.", loc: false },
    { text: "I'd suggest others give them a try too.", loc: false },
    { text: "We walked away happy with the whole experience.", loc: false },
    { text: "It made for a pleasant afternoon overall.", loc: false },
    { text: "I appreciated the whole experience from start to finish.", loc: false },
    { text: "We're glad we made the trip.", loc: false },
    { text: "It turned out to be a good decision.", loc: false },
    { text: "My family left with a smile.", loc: false },
    { text: "I'll be back for sure.", loc: false },
    { text: "Overall, a very satisfying visit.", loc: false },
    { text: "It's the kind of experience that stays with you.", loc: false },
    { text: "If you're in Vishnu Garden, it's worth a visit.", loc: true },
    { text: "For anyone in West Delhi looking for jewellery, this is a good option.", loc: true },
    { text: "It's a nice option if you happen to be in Vishnu Garden.", loc: true },
    { text: "Anyone shopping around West Delhi should consider stopping by.", loc: true },
    { text: "Being located in Vishnu Garden makes it convenient too.", loc: true },
    { text: "Worth checking out if you're anywhere near Vishnu Garden.", loc: true },
    { text: "A good find for anyone based in West Delhi.", loc: true },
    { text: "Handy to know about if you live around Vishnu Garden.", loc: true },
    { text: "We were glad to have found them right in Vishnu Garden.", loc: true },
    { text: "A reliable choice for jewellery shopping in West Delhi.", loc: true }
  ];

  /* ------------------------------------------------------------------ *
   * STATE
   * ------------------------------------------------------------------ */
  const state = {
    sentiment: null,
    selectedCategories: {},   // { gold: Set(['Ring','Chain']), services: Set([]) ... }
    selectedImpressed: new Set(),
    note: "",
    currentReview: ""
  };

  /* ------------------------------------------------------------------ *
   * UTILITIES
   * ------------------------------------------------------------------ */
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function joinNaturally(list) {
    const items = list.slice();
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + " and " + items[1];
    return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
  }

  function wordCount(str) {
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  /* ------------------------------------------------------------------ *
   * REVIEW ENGINE
   * ------------------------------------------------------------------ */
  function buildItemsPhrase() {
    const phrases = [];
    CATEGORIES.forEach((cat) => {
      const chosen = state.selectedCategories[cat.key];
      if (!chosen) return;
      if (chosen.size === 0) {
        phrases.push(cat.genericPhrase);
      } else {
        chosen.forEach((subKey) => {
          const sub = cat.subs.find((s) => s.key === subKey);
          if (sub) phrases.push(sub.phrase);
        });
      }
    });
    return phrases;
  }

  function buildImpressedPhrase() {
    return Array.from(state.selectedImpressed).map((key) => {
      const found = IMPRESSED_OPTIONS.find((o) => o.key === key);
      return found ? found.phrase : key.toLowerCase();
    });
  }

  function generateReviewText() {
    const itemPhrases = buildItemsPhrase();
    const impressedPhrases = buildImpressedPhrase();

    const itemsStr = joinNaturally(itemPhrases) || "their jewellery";
    const impressedStr = joinNaturally(impressedPhrases) || "the overall experience";

    let best = null;

    for (let attempt = 0; attempt < 10; attempt++) {
      const wantLocation = Math.random() < CONFIG.locationMentionChance;
      const endingPool = ENDINGS.filter((e) => e.loc === wantLocation);
      const ending = pick(endingPool.length ? endingPool : ENDINGS);

      const intro = pick(INTROS).replace(/{biz}/g, CONFIG.businessName);
      const purchase = pick(PURCHASE_SENTENCES).replace(/{items}/g, itemsStr);
      const appreciation = pick(APPRECIATION_SENTENCES).replace(/{impressed}/g, impressedStr);

      let sentence = [intro, purchase, appreciation, ending.text].join(" ");

      if (state.note && state.note.trim().length > 0) {
        let note = state.note.trim();
        note = note.charAt(0).toUpperCase() + note.slice(1);
        if (!/[.!?]$/.test(note)) note += ".";
        sentence += " " + note;
      }

      const wc = wordCount(sentence);

      if (wc >= 40 && wc <= 80) {
        return sentence;
      }
      if (!best || Math.abs(wc - 60) < Math.abs(wordCount(best) - 60)) {
        best = sentence;
      }
    }
    return best;
  }

  /* ------------------------------------------------------------------ *
   * NAVIGATION
   * ------------------------------------------------------------------ */
  const SCREEN_ORDER_MAIN = ["screen-purchase", "screen-impressed"];
  const screens = {};
  document.querySelectorAll(".screen").forEach((el) => (screens[el.id] = el));

  function showScreen(id) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[id].classList.add("active");
    updateProgress(id);
    screens[id].scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progressShell = document.getElementById("progressShell");
  const progressFill = document.getElementById("progressFill");
  const stepDots = document.getElementById("stepDots");
  stepDots.innerHTML = SCREEN_ORDER_MAIN.map(() => '<span></span>').join("");
  const dotEls = stepDots.querySelectorAll("span");

  function updateProgress(currentId) {
    const idx = SCREEN_ORDER_MAIN.indexOf(currentId);
    if (idx === -1) {
      progressShell.style.visibility = "hidden";
      return;
    }
    progressShell.style.visibility = "visible";
    const pct = ((idx + 1) / SCREEN_ORDER_MAIN.length) * 100;
    progressFill.style.width = pct + "%";
    dotEls.forEach((d, i) => d.classList.toggle("filled", i <= idx));
  }

  /* ------------------------------------------------------------------ *
   * STEP 0 — Sentiment check (one tap, auto-advances)
   * Deliberately NOT a 5-star picker — Google's own star rating is the
   * only one that counts publicly, so asking for a star rating here
   * would just be the customer rating twice for no reason. This is a
   * quick happy/not-happy check purely to route unhappy visits to
   * private feedback instead of the public review flow.
   * ------------------------------------------------------------------ */
  const sentimentGoodBtn = document.getElementById("sentimentGood");
  const sentimentBadBtn = document.getElementById("sentimentBad");

  function handleSentiment(isGood, chosenBtn) {
    state.sentiment = isGood ? "good" : "bad";
    chosenBtn.classList.add("chosen");

    setTimeout(() => {
      if (isGood) {
        buildCategoryUI();
        showScreen("screen-purchase");
      } else {
        showScreen("screen-lowrating");
      }
    }, 250);
  }

  sentimentGoodBtn.addEventListener("click", () => handleSentiment(true, sentimentGoodBtn));
  sentimentBadBtn.addEventListener("click", () => handleSentiment(false, sentimentBadBtn));

  /* ------------------------------------------------------------------ *
   * LOW RATING FLOW
   * ------------------------------------------------------------------ */
  document.getElementById("submitLowRating").addEventListener("click", () => {
    // No backend — captured client-side only, as specified.
    showScreen("screen-lowthanks");
  });

  document.getElementById("restartFromLow").addEventListener("click", () => {
    resetApp();
  });

  /* ------------------------------------------------------------------ *
   * STEP 1 — Purchase categories
   * ------------------------------------------------------------------ */
  const categoryListEl = document.getElementById("categoryList");
  const toImpressedBtn = document.getElementById("toImpressed");

  function buildCategoryUI() {
    categoryListEl.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const card = document.createElement("div");
      card.className = "category-card";
      card.dataset.cat = cat.key;

      const head = document.createElement("div");
      head.className = "category-head";
      head.tabIndex = 0;
      head.setAttribute("role", "checkbox");
      head.setAttribute("aria-checked", "false");
      head.innerHTML = '<span class="cat-name">' + cat.label + '</span><span class="cat-check">\u2713</span>';

      const panel = document.createElement("div");
      panel.className = "subcat-panel";
      const inner = document.createElement("div");
      inner.className = "subcat-inner";
      cat.subs.forEach((sub) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "subchip";
        chip.textContent = sub.key;
        chip.dataset.sub = sub.key;
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleSub(cat.key, sub.key, chip);
        });
        inner.appendChild(chip);
      });
      panel.appendChild(inner);

      head.addEventListener("click", () => toggleCategory(cat.key, card, head));
      head.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCategory(cat.key, card, head);
        }
      });

      card.appendChild(head);
      card.appendChild(panel);
      categoryListEl.appendChild(card);
    });
  }

  function toggleCategory(catKey, card, head) {
    const isSelected = card.classList.toggle("selected");
    head.setAttribute("aria-checked", String(isSelected));
    if (isSelected) {
      state.selectedCategories[catKey] = new Set();
    } else {
      delete state.selectedCategories[catKey];
    }
    refreshContinueButtons();
  }

  function toggleSub(catKey, subKey, chipEl) {
    if (!state.selectedCategories[catKey]) state.selectedCategories[catKey] = new Set();
    const set = state.selectedCategories[catKey];
    if (set.has(subKey)) {
      set.delete(subKey);
      chipEl.classList.remove("on");
    } else {
      set.add(subKey);
      chipEl.classList.add("on");
    }
  }

  function refreshContinueButtons() {
    toImpressedBtn.disabled = Object.keys(state.selectedCategories).length === 0;
  }

  toImpressedBtn.addEventListener("click", () => {
    buildImpressedUI();
    showScreen("screen-impressed");
  });

  /* ------------------------------------------------------------------ *
   * STEP 2 — Impressed chips + optional note + generate
   * ------------------------------------------------------------------ */
  const chipGridEl = document.getElementById("chipGrid");
  const generateBtn = document.getElementById("generateBtn");
  const noteToggle = document.getElementById("noteToggle");
  const notePanel = document.getElementById("notePanel");
  const noteTextEl = document.getElementById("noteText");

  function buildImpressedUI() {
    chipGridEl.innerHTML = "";
    IMPRESSED_OPTIONS.forEach((opt) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = opt.key;
      if (state.selectedImpressed.has(opt.key)) chip.classList.add("on");
      chip.addEventListener("click", () => {
        if (state.selectedImpressed.has(opt.key)) {
          state.selectedImpressed.delete(opt.key);
          chip.classList.remove("on");
        } else {
          state.selectedImpressed.add(opt.key);
          chip.classList.add("on");
        }
        generateBtn.disabled = state.selectedImpressed.size === 0;
      });
      chipGridEl.appendChild(chip);
    });
  }

  noteToggle.addEventListener("click", () => {
    const isOpen = notePanel.classList.toggle("open");
    noteToggle.setAttribute("aria-expanded", String(isOpen));
    noteToggle.querySelector("span").textContent = isOpen ? "\u2212 Personal note" : "\uFF0B Add a personal note";
    if (isOpen) noteTextEl.focus();
  });

  /* ------------------------------------------------------------------ *
   * STEP 3/4 — Generate, copy, open Google, loading, success
   * (Combined into one tap: generate -> copy -> open review link ->
   *  short loading beat -> success screen with the review shown.)
   * ------------------------------------------------------------------ */
  const reviewCardEl = document.getElementById("reviewCard");
  const successSubtext = document.getElementById("successSubtext");
  let reviewWindowRef = null;

  // Synchronous, deterministic copy — completes fully in this tick, so it
  // can never be interrupted by the tab-switch that window.open() causes.
  // This is the PRIMARY copy method (not just a fallback), because the
  // async Clipboard API can be cut short on mobile once focus moves to a
  // newly opened tab, which is what was causing partial/truncated copies.
  function copyToClipboardSync(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    // Deliberately NOT zero-size/opacity:0 — some mobile browsers (notably
    // iOS Safari) only reliably select() text inside an element that has
    // real, non-zero dimensions. Off-screen instead of invisible.
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "-9999px";
    ta.style.width = "300px";
    ta.style.height = "80px";
    ta.style.fontSize = "16px"; // avoids iOS auto-zoom on focus
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    // .select() alone can leave only part of a long string selected on
    // iOS Safari — setSelectionRange forces the FULL string every time.
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  // Best-effort upgrade via the modern async API, fired after the
  // synchronous copy above has already guaranteed a full copy. If this
  // succeeds it simply re-confirms the same text; if it's blocked (many
  // in-app browsers like Instagram/WhatsApp restrict it) the sync copy
  // above already has it covered.
  function copyToClipboardAsync(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => { /* sync copy already covered it */ });
    }
  }

  function copyReviewText(text) {
    const ok = copyToClipboardSync(text);
    copyToClipboardAsync(text);
    return ok;
  }

  generateBtn.addEventListener("click", () => {
    state.note = noteTextEl.value;
    state.currentReview = generateReviewText();

    // Copy FIRST, synchronously, then open the review link — in that
    // order, every time. Opening the tab first (the old order) was the
    // bug: it can shift focus before the copy finishes.
    copyReviewText(state.currentReview);
    reviewWindowRef = window.open(CONFIG.googleReviewUrl, "_blank", "noopener");

    showScreen("screen-loading");
    setTimeout(() => {
      reviewCardEl.textContent = state.currentReview;
      successSubtext.textContent = "Opening Google Reviews — simply paste it in.";
      showScreen("screen-success");
      launchConfetti();
    }, CONFIG.loadingDelayMs);
  });

  document.getElementById("regenerateBtn").addEventListener("click", () => {
    state.currentReview = generateReviewText();
    reviewCardEl.textContent = state.currentReview;
    copyReviewText(state.currentReview);
    showSnackbar("Updated version copied to clipboard.");
  });

  document.getElementById("copyAgainBtn").addEventListener("click", () => {
    copyReviewText(state.currentReview);
    showSnackbar("Review copied. Paste it into Google Reviews.");
  });

  document.getElementById("reopenBtn").addEventListener("click", () => {
    copyReviewText(state.currentReview);
    window.open(CONFIG.googleReviewUrl, "_blank", "noopener");
    showSnackbar("Review copied again. Simply paste it into Google Reviews.");
  });

  document.getElementById("newReviewBtn").addEventListener("click", () => {
    resetApp();
  });

  /* ------------------------------------------------------------------ *
   * Snackbar
   * ------------------------------------------------------------------ */
  const snackbarEl = document.getElementById("snackbar");
  let snackbarTimer = null;
  function showSnackbar(msg) {
    snackbarEl.textContent = msg;
    snackbarEl.classList.add("show");
    clearTimeout(snackbarTimer);
    snackbarTimer = setTimeout(() => snackbarEl.classList.remove("show"), 3600);
  }

  /* ------------------------------------------------------------------ *
   * Confetti (lightweight, DOM-based)
   * ------------------------------------------------------------------ */
  const confettiLayer = document.getElementById("confettiLayer");
  const CONFETTI_COLORS = ["#cda44e", "#e8c877", "#ffffff", "#8a6f34"];

  function launchConfetti() {
    confettiLayer.innerHTML = "";
    const count = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 26;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = pick(CONFETTI_COLORS);
      piece.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
      piece.style.animationDelay = (Math.random() * 0.4) + "s";
      confettiLayer.appendChild(piece);
    }
    setTimeout(() => { confettiLayer.innerHTML = ""; }, 3200);
  }

  /* ------------------------------------------------------------------ *
   * Reset — ready for the next customer
   * ------------------------------------------------------------------ */
  function resetApp() {
    state.sentiment = null;
    state.selectedCategories = {};
    state.selectedImpressed = new Set();
    state.note = "";
    state.currentReview = "";
    sentimentGoodBtn.classList.remove("chosen");
    sentimentBadBtn.classList.remove("chosen");
    document.getElementById("lowRatingText").value = "";
    noteTextEl.value = "";
    notePanel.classList.remove("open");
    noteToggle.setAttribute("aria-expanded", "false");
    noteToggle.querySelector("span").textContent = "\uFF0B Add a personal note";
    generateBtn.disabled = true;
    toImpressedBtn.disabled = true;
    showScreen("screen-welcome");
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  showScreen("screen-welcome");
})();
