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
  { name: "Pariserbøf", meals: ["Frokost", "Aften"] },
  { name: "Kaiser burger", meals: ["Frokost", "Aften"] },
  { name: "Stegt flæsk", meals: ["Aften"] },
  { name: "Wienerschitzel", meals: ["Aften"] }
];

const QUOTES = [
  "Små forbedringer hver dag bliver til store resultater.",
  "Kvalitet er ikke en handling – det er en vane.",
  "Detaljer skaber helheden."
];

const state = {
  screen: "location",
  location: "",
  meal: "",
  dish: "",
  tasted: false,
  ratings: {
    taste: 0,
    presentation: 0,
    temperature: 0,
    portion: 0
  }
};

const $ = (id) => document.getElementById(id);

const screens = {
  location: null,
  dish: null,
  rating: null,
  confirmation: null
};

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("hidden", hidden);
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle("hidden", key !== name);
  });

  const header = $("topHeader");
  if (header) header.classList.toggle("hidden", name !== "location");

  if (name === "confirmation") {
    const quoteEl = $("quoteText");
    if (quoteEl) {
      quoteEl.textContent = `"${QUOTES[Math.floor(Math.random() * QUOTES.length)]}"`;
    }
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
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.justifyContent = "center";
    label.style.gap = "10px";
    label.style.minHeight = "56px";
    label.style.padding = "14px 12px";
    label.style.border = "1px solid rgba(255,255,255,0.10)";
    label.style.background = "rgba(255,255,255,0.03)";
    label.style.borderRadius = "16px";
    label.style.cursor = "pointer";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "meal";
    input.value = meal;

    input.addEventListener("change", () => {
      state.meal = meal;
      updateNextEnabled();
    });

    const span = document.createElement("span");
    span.textContent = meal;
    span.style.fontSize = "16px";
    span.style.fontWeight = "700";

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
    renderRatingBlocks();
    updateSubmitEnabled();
    showScreen("rating");
  });
}

function populateDishSelect() {
  const select = $("dishSelect");
  if (!select) return;

  select.innerHTML = `<option value="">Vælg ret...</option>`;

  DISHES
    .filter(d => d.meals.includes(state.meal))
    .forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.name;
      opt.textContent = d.name;
      select.appendChild(opt);
    });
}

const ratingLabels = {
  presentation: "ANRETNING",
  portion: "PORTION",
  taste: "SMAG",
  temperature: "TEMPERATUR"
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
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "☆";
      btn.className = "text-4xl leading-none";

      btn.addEventListener("click", () => {
        if ((field === "taste" || field === "temperature") && !state.tasted) return;
        state.ratings[field] = i;
        paintStars();
        updateSubmitEnabled();
      });

      starsWrap.appendChild(btn);
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
      const active = idx + 1 <= value;
      b.textContent = active ? "★" : "☆";
      b.style.color = active ? "#d6b24a" : "rgba(255,255,255,0.25)";
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

  const ok =
    state.ratings.presentation > 0 &&
    state.ratings.portion > 0 &&
    state.tasted &&
    state.ratings.taste > 0 &&
    state.ratings.temperature > 0;

  btn.disabled = !ok;
  btn.classList.toggle("btn-disabled", !ok);
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

  const btnSubmit = $("btnSubmit");
  if (btnSubmit) {
    btnSubmit.addEventListener("click", () => {
      showScreen("confirmation");
    });
  }

  const btnReset = $("btnReset");
  if (btnReset) btnReset.addEventListener("click", () => window.location.reload());

  const btnClose = $("btnClose");
  if (btnClose) btnClose.addEventListener("click", () => window.location.reload());
}

function boot() {
  screens.location = $("screen-location");
  screens.dish = $("screen-dish");
  screens.rating = $("screen-rating");
  screens.confirmation = $("screen-confirmation");

  initLocationSelect();
  initMealRadios();
  initDishSelect();
  initTastedToggle();
  initNavButtons();
  updateNextEnabled();
  renderRatingBlocks();
  updateSubmitEnabled();
  showScreen("location");

  console.log("UI boot OK");
}

document.addEventListener("DOMContentLoaded", boot);
