/* =========================================================
   KONFIGURATION – ret her
   ========================================================= */

const FORMSUBMIT_EMAIL = "Stefan@cafekaiser.dk";

const LOCATIONS = [
  "Café Kaiser Helsingør",
  "Café Kaiser Hillerød",
  "Café Kaiser Farum",
  "Café Kaiser Hørsholm",
  "Café Kaiser Vanløse",
  "Café Kaiser Enghave Brygge"
];

const MEALS = ["Morgenmad", "Frokost", "Aften"];

const DISHES = [
  { name: "Byg selv brunch", meals: ["Morgenmad"] },
  { name: "Ostemad", meals: ["Morgenmad", "Frokost"] },
  { name: "Fiskefilet smørrebrød", meals: ["Frokost"] },
  { name: "Hønsesalat smørrebrød", meals: ["Frokost"] },
  { name: "Æg & Rejer smørrebrød", meals: ["Frokost"] },
  { name: "Hakkebøf smørrebrød", meals: ["Frokost"] },
  { name: "Roastbeef smørrebrød", meals: ["Frokost"] },
  { name: "Kylling wrap", meals: ["Frokost", "Aften"] },
  { name: "Pariserbøf", meals: ["Frokost", "Aften"] },
  { name: "Fish'n'chips", meals: ["Frokost", "Aften"] },
  { name: "Stjerneskud", meals: ["Frokost", "Aften"] },
  { name: "Kaiser burger", meals: ["Frokost", "Aften"] },
  { name: "Signatur burger", meals: ["Frokost", "Aften"] },
  { name: "Mexicansk burger", meals: ["Frokost", "Aften"] },
  { name: "Bearnaise burger", meals: ["Frokost", "Aften"] },
  { name: "Kylling sandwich", meals: ["Frokost", "Aften"] },
  { name: "Kaiser sandwich", meals: ["Frokost", "Aften"] },
  { name: "Tunmousse sandwich", meals: ["Frokost", "Aften"] },
  { name: "Serrano sandwich", meals: ["Frokost", "Aften"] },
  { name: "Cæsar salat", meals: ["Frokost", "Aften"] },
  { name: "Pokebowl", meals: ["Frokost", "Aften"] },
  { name: "Varmrøget lakse salat", meals: ["Frokost", "Aften"] },
  { name: "Pommes frites", meals: ["Frokost", "Aften"] },
  { name: "Snack kurv", meals: ["Frokost", "Aften"] },
  { name: "Nachos deluxe", meals: ["Frokost", "Aften"] },
  { name: "Kaiser børneburger", meals: ["Frokost", "Aften"] },
  { name: "Kaiser børnefiskefilet", meals: ["Frokost", "Aften"] },
  { name: "Kaiser børnenuggets", meals: ["Frokost", "Aften"] },
  { name: "Stegt flæsk", meals: ["Aften"] },
  { name: "Wienerschitzel", meals: ["Aften"] },
  { name: "Oksemørbrad", meals: ["Aften"] },
  { name: "Chili con carne", meals: ["Aften"] },
  { name: "Ærte pasta", meals: ["Aften"] },
  { name: "Pandekager med is", meals: ["Frokost", "Aften"] },
  { name: "Chokolade kage", meals: ["Frokost", "Aften"] },
  { name: "Rabarber crumble", meals: ["Frokost", "Aften"] },
  { name: "Hindbær dome", meals: ["Frokost", "Aften"] },
  { name: "Æble-Karameltærte", meals: ["Frokost", "Aften"] },
  { name: "Trøffelkugle med salt karamel", meals: ["Frokost", "Aften"] }
];

const DISH_REFERENCE_IMAGES = {
  "Fiskefilet smørrebrød": "/Kaiser-standartkontrol/images/fiskefilet-smorrebrod.jpg"
};

const QUOTES = [
  "Små forbedringer hver dag bliver til store resultater.",
  "Kvalitet er ikke en handling – det er en vane.",
  "Detaljer skaber helheden.",
  "Konsekvens slår inspiration.",
  "Standarder giver frihed i driften.",
  "Vi rammer samme kvalitet – hver gang.",
  "Godt arbejde. Næste ret.",
  "Fokus på detaljen. Gæsten mærker det."
];

/* =========================================================
   APP – normalt ingen grund til at rette herunder
   ========================================================= */

const STORE_REVIEWER = "kaiser_eftersyn_navn";
const STORE_LOCATION = "kaiser_eftersyn_lokation";

const state = {
  screen: "location",
  reviewer: "",
  location: "",
  meal: "",
  dish: "",
  imageFile: null,
  tasted: false,
  ratings: { taste: 0, presentation: 0, temperature: 0, portion: 0 },
  comment: "",
  isSubmitting: false
};

const $ = (id) => document.getElementById(id);

function lsGet(key) {
  try { return localStorage.getItem(key) || ""; } catch (e) { return ""; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch (e) { /* ignorer */ }
}

const screens = {
  location: $("screen-location"),
  dish: $("screen-dish"),
  rating: $("screen-rating"),
  confirmation: $("screen-confirmation")
};

function showScreen(name) {
  state.screen = name;
  Object.entries(screens).forEach(([k, el]) => {
    if (el) el.classList.toggle("hidden", k !== name);
  });

  if (name === "confirmation") {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setText("quoteText", `“${q}”`);
  }
  window.scrollTo(0, 0);
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function setHidden(el, hidden) {
  if (el) el.classList.toggle("hidden", hidden);
}

/* ---------- Skærm 1 ---------- */

function initReviewerInput() {
  const input = $("reviewerInput");
  if (!input) return;

  state.reviewer = lsGet(STORE_REVIEWER);
  input.value = state.reviewer;

  input.addEventListener("input", () => {
    state.reviewer = input.value.trim();
    lsSet(STORE_REVIEWER, state.reviewer);
    updateNextEnabled();
  });
}

function initLocationSelect() {
  const select = $("locationSelect");
  if (!select) return;

  select.innerHTML = `<option value="">Vælg lokation…</option>`;
  LOCATIONS.forEach((loc) => {
    const opt = document.createElement("option");
    opt.value = loc;
    opt.textContent = loc;
    select.appendChild(opt);
  });

  const saved = lsGet(STORE_LOCATION);
  if (saved && LOCATIONS.includes(saved)) {
    select.value = saved;
    state.location = saved;
  }

  select.addEventListener("change", () => {
    state.location = select.value;
    lsSet(STORE_LOCATION, state.location);
    updateNextEnabled();
  });
}

function initMealRadios() {
  const wrap = $("mealRadios");
  if (!wrap) return;

  wrap.innerHTML = "";
  MEALS.forEach((meal) => {
    const label = document.createElement("label");
    label.className = "pill";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "meal";
    input.value = meal;
    input.addEventListener("change", () => {
      state.meal = meal;
      paintMealPills();
      updateNextEnabled();
    });

    const span = document.createElement("span");
    span.textContent = meal;

    label.appendChild(input);
    label.appendChild(span);
    wrap.appendChild(label);
  });
}

function paintMealPills() {
  document.querySelectorAll("#mealRadios .pill").forEach((pill) => {
    const input = pill.querySelector("input");
    pill.classList.toggle("on", !!input && input.value === state.meal);
  });
}

function updateNextEnabled() {
  const btn = $("btnNextToDish");
  if (!btn) return;
  btn.disabled = !(state.reviewer && state.location && state.meal);
}

/* ---------- Skærm 2 ---------- */

function initDishSelect() {
  const select = $("dishSelect");
  if (!select) return;

  select.addEventListener("change", () => {
    const val = select.value;
    if (!val) return;
    state.dish = val;
    setText("chosenDishName", val);

    resetRatingScreenState();
    renderRatingBlocks();
    updateReferenceImage();
    updateSubmitEnabled();
    showScreen("rating");
  });
}

function populateDishSelect() {
  const select = $("dishSelect");
  if (!select) return;

  select.innerHTML = `<option value="">Vælg ret…</option>`;
  DISHES
    .filter((d) => !state.meal || d.meals.includes(state.meal))
    .forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.name;
      opt.textContent = d.name;
      select.appendChild(opt);
    });
  select.value = "";
}

/* ---------- Skærm 3 ---------- */

function updateReferenceImage() {
  const img = $("referenceImage");
  const wrap = $("referenceWrap");
  const empty = $("referenceEmpty");
  if (!img || !wrap || !empty) return;

  const src = DISH_REFERENCE_IMAGES[state.dish];
  if (src) {
    img.src = src;
    img.alt = `Referencebillede af ${state.dish}`;
    setHidden(wrap, false);
    setHidden(empty, true);
  } else {
    img.removeAttribute("src");
    img.alt = "";
    setHidden(wrap, true);
    setHidden(empty, false);
  }
}

const ratingLabels = {
  presentation: "Anretning",
  portion: "Portion",
  taste: "Smag",
  temperature: "Temperatur"
};

function renderRatingBlocks() {
  document.querySelectorAll(".ratingBlock").forEach((block) => {
    const field = block.getAttribute("data-field");
    const label = ratingLabels[field];
    if (!label) return;

    block.innerHTML = `
      <div class="rate">
        <div class="rate-lbl">${label}</div>
        <div class="rate-lead"></div>
        <div class="stars" data-stars="${field}"></div>
      </div>
    `;

    const starsWrap = block.querySelector(`[data-stars="${field}"]`);
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "star";
      b.textContent = "★";
      b.setAttribute("aria-label", `${label}: ${i} af 5`);
      b.addEventListener("click", () => {
        if ((field === "taste" || field === "temperature") && !state.tasted) return;
        state.ratings[field] = i;
        paintStars();
        updateSubmitEnabled();
      });
      starsWrap.appendChild(b);
    }
  });

  paintStars();
}

function paintStars() {
  document.querySelectorAll("[data-stars]").forEach((wrap) => {
    const field = wrap.getAttribute("data-stars");
    const value = state.ratings[field] || 0;
    wrap.querySelectorAll(".star").forEach((b, idx) => {
      b.classList.toggle("on", idx + 1 <= value);
    });
  });
}

function initTastedToggle() {
  const check = $("tastedCheck");
  const wrap = $("afterTasteWrap");
  if (!check || !wrap) return;

  check.addEventListener("change", () => {
    state.tasted = !!check.checked;
    setHidden(wrap, !state.tasted);

    if (!state.tasted) {
      state.ratings.taste = 0;
      state.ratings.temperature = 0;
      paintStars();
    }
    updateSubmitEnabled();
  });
}

function allRated() {
  return (
    state.ratings.presentation > 0 &&
    state.ratings.portion > 0 &&
    state.tasted &&
    state.ratings.taste > 0 &&
    state.ratings.temperature > 0
  );
}

function updateSubmitEnabled() {
  const btn = $("btnSubmit");
  if (!btn) return;
  btn.disabled = !(state.imageFile && allRated() && !state.isSubmitting);
}

function initImageUpload() {
  const imageBox = $("imageBox");
  const input = $("imageInput");
  if (!imageBox || !input) return;

  imageBox.addEventListener("click", () => input.click());
  imageBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
  });

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) return;

    state.imageFile = file;

    const img = $("imagePreview");
    if (img) img.src = URL.createObjectURL(file);
    setHidden(img, false);
    setHidden($("imagePlaceholder"), true);
    imageBox.classList.add("solid");

    updateSubmitEnabled();
  });
}

function initCommentAndSubmit() {
  const comment = $("commentInput");
  if (comment) {
    comment.addEventListener("input", (e) => { state.comment = e.target.value; });
  }
  const btn = $("btnSubmit");
  if (btn) btn.addEventListener("click", submit);
}

/* ---------- Indsendelse (FormSubmit → mail) ---------- */

function setSubmitting(submitting) {
  state.isSubmitting = submitting;
  setText("submitLabel", submitting ? "Sender…" : "Indsend");
  updateSubmitEnabled();
}

function setError(msg) {
  const el = $("submitError");
  if (!el) return;
  el.textContent = msg || "";
  setHidden(el, !msg);
}

function createHiddenInput(name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  return input;
}

function submit() {
  setError("");

  try {
    if (!FORMSUBMIT_EMAIL) throw new Error("FORMSUBMIT_EMAIL mangler i app-v4.js");
    if (!state.reviewer) throw new Error("Navn / initialer mangler.");
    if (!state.location) throw new Error("Lokation mangler.");
    if (!state.meal) throw new Error("Måltid mangler.");
    if (!state.dish) throw new Error("Ret mangler.");
    if (!state.imageFile) throw new Error("Billede mangler (krav).");
    if (!allRated()) throw new Error("Udfyld alle vurderinger før du sender.");

    const form = $("hiddenSubmitForm");
    const originalFileInput = $("imageInput");

    if (!form) throw new Error("hiddenSubmitForm mangler i HTML.");
    if (!originalFileInput || !originalFileInput.files || !originalFileInput.files[0]) {
      throw new Error("Billedfilen kunne ikke findes.");
    }

    setSubmitting(true);

    form.innerHTML = "";
    form.action = `https://formsubmit.co/${FORMSUBMIT_EMAIL}`;
    form.method = "POST";
    form.enctype = "multipart/form-data";

    form.appendChild(createHiddenInput("_subject", `Ny rating – ${state.location} – ${state.dish}`));
    form.appendChild(createHiddenInput("_captcha", "false"));
    form.appendChild(createHiddenInput("_template", "table"));
    form.appendChild(createHiddenInput("_next", window.location.href));

    form.appendChild(createHiddenInput("Lokation", state.location));
    form.appendChild(createHiddenInput("Måltid", state.meal));
    form.appendChild(createHiddenInput("Ret", state.dish));
    form.appendChild(createHiddenInput("Anretning", String(state.ratings.presentation)));
    form.appendChild(createHiddenInput("Portion", String(state.ratings.portion)));
    form.appendChild(createHiddenInput("Smag", String(state.ratings.taste)));
    form.appendChild(createHiddenInput("Temperatur", String(state.ratings.temperature)));
    form.appendChild(createHiddenInput("Kommentar", state.comment || ""));
    form.appendChild(createHiddenInput("Navn", state.reviewer));
    form.appendChild(createHiddenInput("Dato", new Date().toLocaleString("da-DK")));

    const fileClone = originalFileInput.cloneNode();
    fileClone.name = "attachment";
    fileClone.className = "hidden";
    form.appendChild(fileClone);

    const dt = new DataTransfer();
    dt.items.add(originalFileInput.files[0]);
    fileClone.files = dt.files;

    sessionStorage.setItem("kaiser_formsubmitted", "1");
    form.submit();
  } catch (err) {
    console.error(err);
    setSubmitting(false);
    setError(err?.message || "Kunne ikke sende. Prøv igen.");
  }
}

/* ---------- Navigation & reset ---------- */

function initNavButtons() {
  const next = $("btnNextToDish");
  if (next) next.addEventListener("click", () => { populateDishSelect(); showScreen("dish"); });

  const back1 = $("btnBackToLocation");
  if (back1) back1.addEventListener("click", () => showScreen("location"));

  const back2 = $("btnBackToDish");
  if (back2) back2.addEventListener("click", () => showScreen("dish"));

  const reset = $("btnReset");
  if (reset) reset.addEventListener("click", () => { resetAll(); showScreen("location"); });

  const close = $("btnClose");
  if (close) close.addEventListener("click", () => window.location.reload());
}

function resetRatingScreenState() {
  state.imageFile = null;
  state.tasted = false;
  state.ratings = { taste: 0, presentation: 0, temperature: 0, portion: 0 };
  state.comment = "";

  const check = $("tastedCheck");
  if (check) check.checked = false;
  setHidden($("afterTasteWrap"), true);

  const img = $("imagePreview");
  if (img) img.removeAttribute("src");
  setHidden(img, true);
  setHidden($("imagePlaceholder"), false);
  const box = $("imageBox");
  if (box) box.classList.remove("solid");

  const file = $("imageInput");
  if (file) file.value = "";

  const comment = $("commentInput");
  if (comment) comment.value = "";

  setError("");
  updateSubmitEnabled();
}

// Navn og lokation huskes – kun måltid og ret nulstilles
function resetAll() {
  state.meal = "";
  state.dish = "";
  resetRatingScreenState();

  document.querySelectorAll('input[name="meal"]').forEach((i) => { i.checked = false; });
  paintMealPills();

  const dishSelect = $("dishSelect");
  if (dishSelect) dishSelect.value = "";

  updateNextEnabled();
  setError("");
}

function handleReturnFromFormSubmit() {
  if (sessionStorage.getItem("kaiser_formsubmitted") === "1") {
    sessionStorage.removeItem("kaiser_formsubmitted");
    showScreen("confirmation");
  }
}

/* ---------- Start ---------- */

function boot() {
  initReviewerInput();
  initLocationSelect();
  initMealRadios();
  initDishSelect();
  initTastedToggle();
  initNavButtons();
  initImageUpload();
  initCommentAndSubmit();

  updateNextEnabled();
  renderRatingBlocks();
  updateSubmitEnabled();
  showScreen("location");
  handleReturnFromFormSubmit();
}

document.addEventListener("DOMContentLoaded", boot);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => console.error("SW fejl:", err));
  });
}
