const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwzgmmKMzilTzD9bWoEoO6zjyZhRx48ydAgrwMSqqW5fOAOoHeQEJ5dLpcbjZduv0_9sg/exec";

const LOCATIONS = [
  "Café Kaiser Helsingør",
  "Café Kaiser Hillerød",
  "Café Kaiser Farum",
  "Café Kaiser Hørsholm",
  "Café Kaiser Vanløse"
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

const state = {
  screen: "location",
  location: "",
  meal: "",
  dish: "",
  imageBase64: "",
  tasted: false,
  ratings: {
    taste: 0,
    presentation: 0,
    temperature: 0,
    portion: 0
  },
  comment: "",
  isSubmitting: false
};

const $ = (id) => document.getElementById(id);

const screens = {
  location: $("screen-location"),
  dish: $("screen-dish"),
  rating: $("screen-rating"),
  confirmation: $("screen-confirmation")
};

function showScreen(name) {
  state.screen = name;

  const header = $("topHeader");
  if (header) header.classList.toggle("hidden", name !== "location");

  Object.entries(screens).forEach(([k, el]) => {
    if (!el) return;
    el.classList.toggle("hidden", k !== name);
  });

  if (name === "confirmation") {
    const quoteEl = $("quoteText");
    if (quoteEl) {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      quoteEl.textContent = `"${q}"`;
    }
  }
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("hidden", hidden);
}

function initLocationSelect() {
  const select = $("locationSelect");
  if (!select) return;

  select.innerHTML = `<option value="">Vælg lokation...</option>`;
  LOCATIONS.forEach((loc) => {
    const opt = document.createElement("option");
    opt.value = loc;
    opt.textContent = loc;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    state.location = select.value;
    updateNextEnabled();
  });
}

function initMealRadios() {
  const wrap = $("mealRadios");
  if (!wrap) return;

  wrap.innerHTML = "";
  MEALS.forEach((meal) => {
    const label = document.createElement("label");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "meal";
    input.value = meal;
    input.className = "w-6 h-6";
    input.addEventListener("change", () => {
      state.meal = meal;
      updateNextEnabled();
    });

    const span = document.createElement("span");
    span.className = "text-xl font-semibold";
    span.textContent = meal;

    label.appendChild(input);
    label.appendChild(span);
    wrap.appendChild(label);
  });
}

function updateNextEnabled() {
  const btn = $("btnNextToDish");
  if (!btn) return;
  const ok = !!state.location && !!state.meal;
  btn.disabled = !ok;
  btn.classList.toggle("btn-disabled", !ok);
}

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
    updateSubmitEnabled();
    showScreen("rating");
  });
}

function populateDishSelect() {
  const select = $("dishSelect");
  if (!select) return;

  select.innerHTML = `<option value="">Vælg ret...</option>`;

  const filtered = DISHES.filter(d => !state.meal || d.meals.includes(state.meal));
  filtered.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.name;
    opt.textContent = d.name;
    select.appendChild(opt);
  });

  select.value = "";
}

const ratingLabels = {
  taste: "SMAG",
  presentation: "ANRETNING",
  temperature: "TEMPERATUR",
  portion: "PORTION"
};

function renderRatingBlocks() {
  document.querySelectorAll(".ratingBlock").forEach((block) => {
    const field = block.getAttribute("data-field");
    const label = ratingLabels[field];
    if (!label) return;

    block.innerHTML = `
      <div class="space-y-2">
        <div class="text-sm font-bold uppercase tracking-wide">${label}</div>
        <div class="flex gap-3" data-stars="${field}"></div>
      </div>
    `;

    const starsWrap = block.querySelector(`[data-stars="${field}"]`);
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "text-4xl leading-none";
      b.textContent = "☆";
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
    const buttons = Array.from(wrap.querySelectorAll("button"));

    buttons.forEach((b, idx) => {
      const starNum = idx + 1;
      const active = starNum <= value;
      b.textContent = active ? "★" : "☆";
      b.className = active
        ? "text-4xl leading-none text-yellow-400"
        : "text-4xl leading-none text-slate-300";
    });
  });
}

function initTastedToggle() {
  const check = $("tastedCheck");
  const wrap = $("afterTasteWrap");
  if (!check || !wrap) return;

  check.addEventListener("change", () => {
    state.tasted = !!check.checked;
    wrap.classList.toggle("hidden", !state.tasted);

    if (!state.tasted) {
      state.ratings.taste = 0;
      state.ratings.temperature = 0;
      paintStars();
    }
    updateSubmitEnabled();
  });
}

function updateSubmitEnabled() {
  const btn = $("btnSubmit");
  if (!btn) return;

  const hasImage = !!state.imageBase64;
  const allRated =
    state.ratings.presentation > 0 &&
    state.ratings.portion > 0 &&
    state.tasted &&
    state.ratings.taste > 0 &&
    state.ratings.temperature > 0;

  const ok = hasImage && allRated && !state.isSubmitting;

  btn.disabled = !ok;
  btn.classList.toggle("btn-disabled", !ok);
}

function initImageUpload() {
  const imageBox = $("imageBox");
  const input = $("imageInput");
  if (!imageBox || !input) return;

  imageBox.addEventListener("click", () => input.click());

  input.addEventListener("change", async () => {
    const file = input.files && input.files[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      const img = $("imagePreview");
      const placeholder = $("imagePlaceholder");
      if (img) img.src = previewUrl;
      setHidden(img, false);
      setHidden(placeholder, true);

      state.imageBase64 = await fileToCompressedDataUrl(file, 900, 0.60);
      updateSubmitEnabled();
    } catch (e) {
      console.error(e);
      state.imageBase64 = "";
      alert("Kunne ikke læse billedet. Prøv igen.");
      updateSubmitEnabled();
    }
  });
}

function fileToCompressedDataUrl(file, maxW, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function initCommentAndSubmit() {
  const comment = $("commentInput");
  if (comment) {
    comment.addEventListener("input", (e) => {
      state.comment = e.target.value;
    });
  }

  const btn = $("btnSubmit");
  if (btn) btn.addEventListener("click", submit);
}

function setSubmitting(submitting) {
  state.isSubmitting = submitting;
  const label = $("submitLabel");
  if (label) label.textContent = submitting ? "SENDER..." : "Indsend";
  updateSubmitEnabled();
}

function setError(msg) {
  const el = $("submitError");
  if (!el) return;
  if (!msg) {
    setHidden(el, true);
    el.textContent = "";
    return;
  }
  el.textContent = msg;
  setHidden(el, false);
}

async function submit() {
  setError("");
  setSubmitting(true);

  try {
    if (!WEBHOOK_URL) throw new Error("WEBHOOK_URL mangler i app-v3.js");
    if (!state.imageBase64) throw new Error("Billede mangler (krav).");

    const params = new URLSearchParams();
    params.append("action", "addFoodRatingViaGet");
    params.append("lokation", state.location);
    params.append("maaltid", state.meal);
    params.append("ret", state.dish);
    params.append("scoreSmag", String(state.ratings.taste));
    params.append("scoreAnretning", String(state.ratings.presentation));
    params.append("scoreTemperatur", String(state.ratings.temperature));
    params.append("scorePortion", String(state.ratings.portion));
    params.append("kommentar", state.comment || "");
    params.append("dato", new Date().toLocaleString("da-DK"));

    const url = `${WEBHOOK_URL}?${params.toString()}`;

    console.log("Sender GET:", url);

    await fetch(url, {
      method: "GET",
      mode: "no-cors"
    });

    showScreen("confirmation");
  } catch (err) {
    console.error(err);
    setError(err?.message || "Kunne ikke sende. Prøv igen.");
  } finally {
    setSubmitting(false);
  }
}

function initNavButtons() {
  const next = $("btnNextToDish");
  if (next) {
    next.addEventListener("click", () => {
      populateDishSelect();
      showScreen("dish");
    });
  }

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
  state.imageBase64 = "";
  state.tasted = false;
  state.ratings = { taste: 0, presentation: 0, temperature: 0, portion: 0 };
  state.comment = "";

  const check = $("tastedCheck");
  const wrap = $("afterTasteWrap");
  if (check) check.checked = false;
  if (wrap) wrap.classList.add("hidden");

  const img = $("imagePreview");
  const placeholder = $("imagePlaceholder");
  setHidden(img, true);
  setHidden(placeholder, false);

  const file = $("imageInput");
  if (file) file.value = "";

  const comment = $("commentInput");
  if (comment) comment.value = "";
}

function resetAll() {
  state.location = "";
  state.meal = "";
  state.dish = "";
  resetRatingScreenState();

  const locationSelect = $("locationSelect");
  if (locationSelect) locationSelect.value = "";

  document.querySelectorAll('input[name="meal"]').forEach((i) => (i.checked = false));

  updateNextEnabled();
  setError("");
}

function boot() {
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
}

document.addEventListener("DOMContentLoaded", boot);
