const FORMSUBMIT_EMAIL = "Stefan@cafekaiser.dk";

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

const state = {
  screen: "location",
  location: "",
  meal: "",
  dish: "",
  imageFile: null,
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
    img.src = "";
    img.alt = "";
    setHidden(wrap, true);
    setHidden(empty, false);
  }
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
    updateReferenceImage();
    updateSubmitEnabled();
    showScreen("rating");
  });
}

function populateDishSelect() {
  const select = $("dishSelect");
  if (!select) return;

  select.innerHTML = `<option value="">Vælg ret...</option>`;

  const filtered = DISHES.filter((d) => !state.meal || d.meals.includes(state.meal));
  filtered.forEach((d) => {
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

  const hasImage = !!state.imageFile;
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

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) return;

    state.imageFile = file;

    const previewUrl = URL.createObjectURL(file);
    const img = $("imagePreview");
    const placeholder = $("imagePlaceholder");

    if (img) img.src = previewUrl;
    setHidden(img, false);
    setHidden(placeholder, true);

    updateSubmitEnabled();
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
    if (!FORMSUBMIT_EMAIL || FORMSUBMIT_EMAIL.includes("dinmail")) {
      throw new Error("FORMSUBMIT_EMAIL mangler i app-v3.js");
    }

    if (!state.location) throw new Error("Lokation mangler.");
    if (!state.meal) throw new Error("Måltid mangler.");
    if (!state.dish) throw new Error("Ret mangler.");
    if (!state.imageFile) throw new Error("Billede mangler (krav).");

    const allRated =
      state.ratings.presentation > 0 &&
      state.ratings.portion > 0 &&
      state.tasted &&
      state.ratings.taste > 0 &&
      state.ratings.temperature > 0;

    if (!allRated) {
      throw new Error("Udfyld alle vurderinger før du sender.");
    }

    const form = $("hiddenSubmitForm");
    const originalFileInput = $("imageInput");

    if (!form) {
      throw new Error("hiddenSubmitForm mangler i HTML.");
    }

    if (!originalFileInput || !originalFileInput.files || !originalFileInput.files[0]) {
      throw new Error("Bildefilen kunne ikke findes.");
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
    form.appendChild(createHiddenInput("Smag", String(state.ratings.taste)));
    form.appendChild(createHiddenInput("Anretning", String(state.ratings.presentation)));
    form.appendChild(createHiddenInput("Temperatur", String(state.ratings.temperature)));
    form.appendChild(createHiddenInput("Portion", String(state.ratings.portion)));
    form.appendChild(createHiddenInput("Kommentar", state.comment || ""));
    form.appendChild(createHiddenInput("Dato", new Date().toLocaleString("da-DK")));

    const fileClone = originalFileInput.cloneNode();
    fileClone.name = "attachment";
    fileClone.className = "hidden";
    form.appendChild(fileClone);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(originalFileInput.files[0]);
    fileClone.files = dataTransfer.files;

    sessionStorage.setItem("kaiser_formsubmitted", "1");
    form.submit();
  } catch (err) {
    console.error(err);
    setSubmitting(false);
    setError(err?.message || "Kunne ikke sende. Prøv igen.");
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
  if (reset) {
    reset.addEventListener("click", () => {
      resetAll();
      showScreen("location");
    });
  }

  const close = $("btnClose");
  if (close) close.addEventListener("click", () => window.location.reload());
}

function resetRatingScreenState() {
  state.imageFile = null;
  state.tasted = false;
  state.ratings = {
    taste: 0,
    presentation: 0,
    temperature: 0,
    portion: 0
  };
  state.comment = "";

  const check = $("tastedCheck");
  const wrap = $("afterTasteWrap");
  if (check) check.checked = false;
  if (wrap) wrap.classList.add("hidden");

  const img = $("imagePreview");
  const placeholder = $("imagePlaceholder");
  if (img) img.src = "";
  setHidden(img, true);
  setHidden(placeholder, false);

  const file = $("imageInput");
  if (file) file.value = "";

  const comment = $("commentInput");
  if (comment) comment.value = "";

  const refImg = $("referenceImage");
  if (refImg) refImg.alt = "";

  setError("");
  updateSubmitEnabled();
}

function resetAll() {
  state.location = "";
  state.meal = "";
  state.dish = "";
  resetRatingScreenState();

  const locationSelect = $("locationSelect");
  if (locationSelect) locationSelect.value = "";

  document.querySelectorAll('input[name="meal"]').forEach((i) => {
    i.checked = false;
  });

  const dishSelect = $("dishSelect");
  if (dishSelect) dishSelect.value = "";

  updateNextEnabled();
  setError("");
}

function handleReturnFromFormSubmit() {
  const submitted = sessionStorage.getItem("kaiser_formsubmitted");
  if (submitted === "1") {
    sessionStorage.removeItem("kaiser_formsubmitted");
    showScreen("confirmation");
  }
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
  handleReturnFromFormSubmit();
}

document.addEventListener("DOMContentLoaded", boot);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("Service worker registreret"))
      .catch((err) => console.error("SW fejl:", err));
  });
}
