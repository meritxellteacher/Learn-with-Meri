let resources = [];

const languageColors = {
  English: "green",
  Català: "lilac",
  Español: "blue",
};

const categoryLabels = {
  English: { grammar: "Grammar", vocabulary: "Vocabulary", speaking: "Speaking", skills: "Skills" },
  Català: { grammar: "Gramàtica", vocabulary: "Vocabulari", speaking: "Conversa", skills: "Habilitats" },
  Español: { grammar: "Gramática", vocabulary: "Vocabulario", speaking: "Conversación", skills: "Destrezas" },
};

function repairText(value) {
  if (typeof value !== "string" || !/[ÃÂâ]/.test(value)) return value;
  try {
    const bytes = Uint8Array.from([...value].map((character) => character.charCodeAt(0)));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

function normalizeLanguage(language) {
  const repaired = repairText(language || "").trim();
  if (repaired.startsWith("Espa")) return "Español";
  if (repaired.startsWith("Catal")) return "Català";
  if (repaired.startsWith("Eng")) return "English";
  return repaired || "English";
}

function materialPageUrl(resource) {
  if (resource.url) return resource.url;
  if (!resource.file) return "";

  const params = new URLSearchParams({
    title: resource.title,
    description: resource.description,
    language: resource.language,
    category: resource.categoryLabel,
    level: resource.level,
    file: resource.file,
    icon: resource.icon,
  });
  if (resource.cover) params.set("cover", resource.cover);
  return `material.html?${params.toString()}`;
}

function prepareResource(resource) {
  const repaired = Object.fromEntries(
    Object.entries(resource).map(([key, value]) => [key, repairText(value)])
  );
  repaired.language = normalizeLanguage(repaired.language);
  const fallbackIcon = repaired.title.replace(/[^A-Za-zÀ-ÿ0-9]/g, "").slice(0, 5).toUpperCase();
  return {
    ...repaired,
    color: languageColors[repaired.language] || "green",
    categoryLabel: categoryLabels[repaired.language]?.[repaired.category] || repaired.category,
    icon: repaired.icon || fallbackIcon || "MATERIAL",
    status: repaired.status || (repaired.file ? "Disponible" : "Properament"),
  };
}

const resourceGrid = document.querySelector("#resource-grid");
const noResults = document.querySelector("#no-results");
const searchInput = document.querySelector("#resource-search");
const filterButtons = [...document.querySelectorAll(".filter")];
const languageButtons = [...document.querySelectorAll(".language-chip")];
const levelButtons = [...document.querySelectorAll(".level-chip")];
const librarySection = document.querySelector("#materials");
let activeFilter = "all";
let activeLanguage = "all";
let activeLevel = "all";

function updateFilterTheme() {
  librarySection.dataset.filterLanguage = activeLanguage;
}

function renderResources() {
  const query = searchInput.value.trim().toLocaleLowerCase("ca");
  const filtered = resources.filter((resource) => {
    const matchesCategory = activeFilter === "all" || resource.category === activeFilter;
    const matchesLanguage = activeLanguage === "all" || resource.language === activeLanguage;
    const matchesLevel = activeLevel === "all" || resource.level.includes(activeLevel);
    const searchable = `${resource.title} ${resource.description} ${resource.categoryLabel} ${resource.language} ${resource.level} ${resource.keywords || ""}`.toLocaleLowerCase("ca");
    return matchesCategory && matchesLanguage && matchesLevel && searchable.includes(query);
  });

  resourceGrid.innerHTML = filtered
    .map((resource) => {
      const resourceUrl = materialPageUrl(resource);
      const action = resourceUrl
        ? `<a class="text-link resource-action" href="${resourceUrl}">Veure material <span>→</span></a>`
        : `<button class="text-link resource-action" type="button" data-title="${resource.title}" data-status="${resource.status}">
            ${resource.status === "Disponible" ? "Obre la lliçó" : resource.status} <span>→</span>
          </button>`;

      return `
      <article class="resource-card ${resource.color}">
        <div class="resource-icon" aria-hidden="true">${resource.icon}</div>
        <div class="resource-meta"><span>${resource.language} · ${resource.categoryLabel}</span><span>${resource.level}</span></div>
        <h3>${resource.title}</h3>
        <p>${resource.description}</p>
        ${action}
      </article>`;
    })
    .join("");

  noResults.hidden = filtered.length > 0;

  document.querySelectorAll("button.resource-action").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.status === "Disponible") {
        document.querySelector("#featured").scrollIntoView({ behavior: "smooth" });
      } else {
        button.textContent = "Ho estem preparant amb cura ✓";
      }
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderResources();
  });
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeLanguage = button.dataset.languageFilter;
    languageButtons.forEach((item) => item.classList.toggle("active", item === button));
    updateFilterTheme();
    renderResources();
  });
});

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeLevel = button.dataset.levelFilter;
    levelButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderResources();
  });
});

document.querySelectorAll(".language-filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeLanguage = button.dataset.language;
    activeFilter = "all";
    activeLevel = "all";
    filterButtons.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
    languageButtons.forEach((item) => item.classList.toggle("active", item.dataset.languageFilter === activeLanguage));
    levelButtons.forEach((item) => item.classList.toggle("active", item.dataset.levelFilter === "all"));
    updateFilterTheme();
    renderResources();
    document.querySelector("#materials").scrollIntoView({ behavior: "smooth" });
  });
});

async function loadResources() {
  try {
    const response = await fetch("content/materials.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("El fitxer de materials no és una llista.");
    resources = data.filter((resource) => resource.published !== false).map(prepareResource);
    renderResources();
  } catch (error) {
    noResults.hidden = false;
    noResults.textContent = "No s'han pogut carregar els materials. Torna-ho a provar d'aquí a uns minuts.";
    console.error("Error carregant els materials:", error);
  }
}

searchInput.addEventListener("input", renderResources);
updateFilterTheme();
loadResources();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 15), { passive: true });

const quizDialog = document.querySelector("#quiz-dialog");
const quizForm = document.querySelector("#quiz-form");
const quizResult = document.querySelector("#quiz-result");
document.querySelector("#open-quiz").addEventListener("click", () => quizDialog.showModal());
document.querySelector("#close-quiz").addEventListener("click", () => quizDialog.close());
quizDialog.addEventListener("click", (event) => {
  if (event.target === quizDialog) quizDialog.close();
});
quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answers = new FormData(quizForm);
  const score = [answers.get("q1") === "went", answers.get("q2") === "watched", answers.get("q3") === "did"].filter(Boolean).length;
  quizResult.textContent = score === 3 ? "Perfecte! 3/3 — ja controles la base del Simple Past." : `${score}/3 — torna a mirar els exemples i prova-ho una vegada més.`;
  quizResult.style.color = score === 3 ? "#436b4e" : "#8a5e46";
});
