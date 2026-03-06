// ==========================
// KONFIG
// ==========================

// Hvis du vil prøve Power Automate webhook også, så indsæt den her.
// Hvis den fejler pga. CORS/403 osv, falder app'en automatisk tilbage til Netlify Forms.
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbw3rRjDxlh3e7QgvQVdY6E0gGQp6bpx1H8NNFtoaXYJd2Uay_IfXT8b2kh53IlptzKW/exec";
const WEBHOOK_SECRET = "Kaiser-StdKontrol-20260306-a8k3m9q2x1";

// Lokationer
const LOCATIONS = [
  "Café Kaiser Helsingør",
  "Café Kaiser Hillerød",
  "Café Kaiser Farum",
  "Café Kaiser Hørsholm",
  "Café Kaiser Vanløse"
];

// Retter (med kategori)
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

const MEALS = ["Morgenmad", "Frokost", "Aften"];

// ==========================
// STATE
// ==========================
const state = {
  screen: "location",
  location: "",
  meal: "",
  dish: "",

  // Til Power Automate (valgfrit) – base64/komprimeret
  imageBase64: "",

  // Til Netlify Forms (VIGTIGT) – rigtig fil upload
  imageFile: null,

  ratings: {
    taste: 0,
    presentation: 0,
    temperature: 0,
    portion: 0
  },

  comment: "",
  isSubmitting: false
};

// ==========================
// DOM HELPERS
// ==========================
const $ = (id) => document.getElementById(id);

const screens = {
  location: $("screen-location"),
  dish: $("screen-dish"),
  rating: $("screen-rating"),
  confirmation: $("screen-confirmation")
};

function showScreen(name) {
  state.screen = name;
  Object.entries(screens).forEach(([k, el]) => {
    el.classList.toggle("hidden", k !== name);
  });
}

function setText(id, text) {
  $(id).textContent = text;
}

function setHidden(el, hidden) {
  el.classList.toggle("hidden", hidden);
}

// ==========================
// INIT UI
// ==========================
function initLocationSelect() {
  const select = $("locationSelect");
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
  wrap.innerHTML = "";

  MEALS.forEach((meal) => {
    const label = document.createElement("label");
    label.className =
      "flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "meal";
    input.value = meal;
    input.className = "w-6 h-6 accent-indigo-600";
    input.addEventListener("change", () => {
      state.meal = meal;
      updateNextEnabled();
    });

    const span = document.createElement("span");
    span.className = "text-2xl font-semibold text-slate-800";
    span.textContent = meal;

    label.appendChild(input);
    label.appendChild(span);
    wrap.appendChild(label);
  });
}

function updateNextEnabled() {
  const btn = $("btnNextToDish");
  const ok = !!state.location && !!state.meal;
  btn.disabled = !ok;
  btn.classList.toggle("btn-disabled", !ok);
}

function initNavButtons() {
  $("btnNextToDish").addEventListener("click", () => {
    renderDishList();
    showScreen("dish");
    $("dishSearch").value = "";
    $("dishSearch").focus();
  });

  $("btnBackToLocation").addEventListener("click", () => showScreen("location"));
  $("btnBackToDish").addEventListener("click", () => showScreen("dish"));

  $("btnReset").addEventListener("click", () => {
    resetAll();
    showScreen("location");
  });

  $("btnClose").addEventListener("click", () => window.location.reload());
}

// ==========================
// DISH LIST
// ==========================
function matchesDish(dish, search, meal) {
  const s = search.trim().toLowerCase();
  const matchesSearch = !s || dish.name.toLowerCase().includes(s);
  const matchesMeal = !meal || dish.meals.includes(meal);
  return matchesSearch && matchesMeal;
}

function renderDishList() {
  const list = $("dishList");
  const search = $("dishSearch")?.value || "";

  const filtered = DISHES.filter((d) => matchesDish(d, search, state.meal));
  list.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "p-8 text-center text-slate-500 font-semibold";
    empty.textContent = "Ingen retter fundet. Prøv en anden søgning.";
    list.appendChild(empty);
    return;
  }

  filtered.forEach((d) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "w-full text-left px-5 py-5 flex items-center justify-between hover:bg-indigo-50 transition";
    btn.innerHTML = `
      <span class="text-2xl font-semibold text-slate-800">${escapeHtml(d.name)}</span>
      <span class="text-slate-400 text-2xl">→</span>
    `;
    btn.addEventListener("click", () => {
      state.dish = d.name;
      setText("chosenDishName", d.name);
      updateSubmitEnabled();
      renderRatingBlocks();
      showScreen("rating");
    });
    list.appendChild(btn);
  });
}

function initDishSearch() {
  $("dishSearch").addEventListener("input", () => renderDishList());
}

// ==========================
// RATING UI
// ==========================
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

    block.innerHTML = `
      <div class="space-y-2">
        <div class="text-sm font-extrabold text-slate-800 uppercase tracking-wide">${label}</div>
        <div class="flex gap-3" data-stars="${field}"></div>
      </div>
    `;

    const starsWrap = block.querySelector(`[data-stars="${field}"]`);
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "text-4xl leading-none transition active:scale-95";
      b.setAttribute("aria-label", `${label} ${i} stjerner`);
      b.addEventListener("click", () => {
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
        ? "text-4xl leading-none text-yellow-400 transition active:scale-95"
        : "text-4xl leading-none text-slate-300 transition active:scale-95";
    });
  });
}

function updateSubmitEnabled() {
  const btn = $("btnSubmit");
  const allRated =
    state.ratings.taste > 0 &&
    state.ratings.presentation > 0 &&
    state.ratings.temperature > 0 &&
    state.ratings.portion > 0;

  const ok = !!state.dish && allRated && !state.isSubmitting;

  btn.disabled = !ok;
  btn.classList.toggle("btn-disabled", !ok);
}

// ==========================
// IMAGE
// - Gemmer file i state.imageFile (til Netlify)
// - Laver også komprimeret base64 i state.imageBase64 (kun til webhook)
// ==========================
function initImageUpload() {
  const imageBox = $("imageBox");
  const input = $("imageInput");

  imageBox.addEventListener("click", () => input.click());

  input.addEventListener("change", async () => {
    const file = input.files && input.files[0];
    if (!file) return;

    // VIGTIGT: gem filen til Netlify Forms (rigtig fil-upload)
    state.imageFile = file;

    // Preview i app (hurtigt)
    const previewUrl = URL.createObjectURL(file);
    $("imagePreview").src = previewUrl;
    setHidden($("imagePreview"), false);
    setHidden($("imagePlaceholder"), true);

    // Valgfrit: lav komprimeret base64 til Power Automate webhook
    try {
      state.imageBase64 = await fileToCompressedDataUrl(file, 1100, 0.75);
    } catch (e) {
      console.error("Kunne ikke lave base64 (ok hvis du ikke bruger webhook):", e);
      state.imageBase64 = "";
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

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ==========================
// SUBMIT
// ==========================
function initCommentAndSubmit() {
 async function submit() {
  setError("");
  setSubmitting(true);

  try {
    const payload = {
      secret: WEBHOOK_SECRET,
      lokation: state.location,
      maaltid: state.meal,
      ret: state.dish,
      scoreSmag: state.ratings.taste,
      scoreAnretning: state.ratings.presentation,
      scoreTemperatur: state.ratings.temperature,
      scorePortion: state.ratings.portion,
      kommentar: state.comment || "",
      dato: new Date().toLocaleString("da-DK"),
      billedeBase64: state.imageBase64 || ""
    };

    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      // ingen headers = færre CORS-problemer
      body: JSON.stringify(payload)
    });

    showScreen("confirmation");
  } catch (err) {
    console.error(err);
    setError(err?.message || "Kunne ikke sende. Prøv igen.");
  } finally {
    setSubmitting(false);
  }
}

// ==========================
// RESET
// ==========================
function resetAll() {
  state.location = "";
  state.meal = "";
  state.dish = "";

  state.imageBase64 = "";
  state.imageFile = null;

  state.ratings = { taste: 0, presentation: 0, temperature: 0, portion: 0 };
  state.comment = "";
  state.isSubmitting = false;

  // reset UI
  $("locationSelect").value = "";
  document.querySelectorAll('input[name="meal"]').forEach((i) => (i.checked = false));
  $("dishSearch").value = "";
  $("commentInput").value = "";

  setHidden($("imagePreview"), true);
  setHidden($("imagePlaceholder"), false);
  $("imageInput").value = "";

  updateNextEnabled();
  updateSubmitEnabled();
  renderDishList();
  renderRatingBlocks();
  setError("");
}

// ==========================
// UTIL
// ==========================
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

// ==========================
// BOOT
// ==========================
(function boot() {
  initLocationSelect();
  initMealRadios();
  initNavButtons();
  initDishSearch();
  initImageUpload();
  initCommentAndSubmit();

  renderDishList();
  renderRatingBlocks();
  updateNextEnabled();
  updateSubmitEnabled();
  showScreen("location");
})();
