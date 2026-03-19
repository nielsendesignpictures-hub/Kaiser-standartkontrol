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
  { name: "Pariserbøf", meals: ["Frokost", "Aften"] },
  { name: "Kaiser burger", meals: ["Frokost", "Aften"] },
  { name: "Stegt flæsk", meals: ["Aften"] },
  { name: "Wienerschitzel", meals: ["Aften"] }
];

const state = {
  location: "",
  meal: "",
  dish: "",
  imageBase64: "",
  tasted: false,
  ratings: {
    presentation: 0,
    portion: 0,
    taste: 0,
    temperature: 0
  },
  comment: ""
};

const $ = (id) => document.getElementById(id);

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("hidden", hidden);
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function showScreen(name) {
  const screens = {
    location: $("screen-location"),
    dish: $("screen-dish"),
    rating: $("screen-rating"),
    confirmation: $("screen-confirmation")
  };

  Object.entries(screens).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle("hidden", key !== name);
  });

  const header = $("topHeader");
  if (header) header.classList.toggle("hidden", name !== "location");
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

  select.value = "";
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
      const starNum = idx + 1;
      const active = starNum <= value;
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

function initImageUpload() {
  const imageBox = $("imageBox");
  const input = $("imageInput");
  if (!imageBox || !input) return;

  imageBox.addEventListener("click", () => input.click());

  input.addEventListener("change", async () => {
    const file = input.files && input.files[0];
    if (!file) return;

    try {
      const img = $("imagePreview");
      const placeholder = $("imagePlaceholder");

      img.src = URL.createObjectURL(file);
      setHidden(img, false);
      setHidden(placeholder, true);

      state.imageBase64 = await fileToCompressedDataUrl(file, 900, 0.60);
      updateSubmitEnabled();
    } catch (err) {
      console.error(err);
      alert("Kunne ikke læse billede");
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

function updateSubmitEnabled() {
  const btn = $("btnSubmit");
  if (!btn) return;

  const ok =
    !!state.imageBase64 &&
    state.ratings.presentation > 0 &&
    state.ratings.portion > 0 &&
    state.tasted &&
    state.ratings.taste > 0 &&
    state.ratings.temperature > 0;

  btn.disabled = !ok;
  btn.classList.toggle("btn-disabled", !ok);
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
  const label = $("submitLabel");
  if (label) label.textContent = submitting ? "SENDER..." : "Indsend";
}

function setError(msg) {
  const el = $("submitError");
  if (!el) return;

  if (!msg) {
    el.textContent = "";
    el.classList.add("hidden");
    return;
  }

  el.textContent = msg;
  el.classList.remove("hidden");
}

async function submit() {
  setError("");
  setSubmitting(true);

  try {
    if (!state.imageBase64) throw new Error("Billede mangler");

    const payload = {
      lokation: state.location,
      maaltid: state.meal,
      ret: state.dish,
      scoreSmag: state.ratings.taste,
      scoreAnretning: state.ratings.presentation,
      scoreTemperatur: state.ratings.temperature,
      scorePortion: state.ratings.portion,
      kommentar: state.comment || "",
      dato: new Date().toLocaleString("da-DK"),
      billedeBase64: state.imageBase64
    };

    console.log("Sender payload:", payload);

    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    showScreen("confirmation");
  } catch (err) {
    console.error(err);
    setError(err.message || "Kunne ikke sende");
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
  if (reset) {
    reset.addEventListener("click", () => {
      window.location.reload();
    });
  }

  const close = $("btnClose");
  if (close) {
    close.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

function boot() {
  console.log("boot starter");
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
  console.log("boot færdig");
}

document.addEventListener("DOMContentLoaded", boot);
