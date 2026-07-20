const resources = [
  {
    title: "Simple Past",
    description: "Accions acabades, verbs regulars i irregulars i preguntes amb did.",
    category: "grammar",
    categoryLabel: "Grammar",
    level: "A1–A2",
    color: "green",
    icon: "PAST",
    status: "Disponible",
    language: "English",
  },
  {
    title: "Daily Routines",
    description: "Vocabulari visual i frases pràctiques per explicar el teu dia.",
    category: "vocabulary",
    categoryLabel: "Vocabulary",
    level: "A1–A2",
    color: "peach",
    icon: "DAY",
    status: "Properament",
    language: "English",
  },
  {
    title: "Can, Have Got & There Is",
    description: "Preguntes guiades per practicar estructures essencials parlant.",
    category: "speaking",
    categoryLabel: "Speaking",
    level: "A1–A2",
    color: "blue",
    icon: "TALK",
    status: "Properament",
    language: "English",
  },
  {
    title: "Present Tenses Review",
    description: "Present simple i continuous: forma, ús i contrastos clau.",
    category: "grammar",
    categoryLabel: "Grammar",
    level: "B1–B2",
    color: "lilac",
    icon: "NOW",
    status: "En preparació",
    language: "English",
  },
  {
    title: "Word Formation",
    description: "Famílies de paraules, prefixos i sufixos per ampliar vocabulari.",
    category: "vocabulary",
    categoryLabel: "Vocabulary",
    level: "B1–B2",
    color: "peach",
    icon: "WORD",
    status: "En preparació",
    language: "English",
  },
  {
    title: "Reading & Use of English",
    description: "Estratègies visuals i pràctica enfocada a Cambridge.",
    category: "skills",
    categoryLabel: "Reading",
    level: "B1–B2",
    color: "blue",
    icon: "READ",
    status: "Properament",
    language: "English",
  },
  {
    title: "Anar a comprar",
    description: "Vocabulari i frases útils per comprar al mercat, al supermercat i a les botigues.",
    category: "speaking",
    categoryLabel: "Conversa",
    level: "A1–A2",
    color: "lilac",
    icon: "PARLA",
    status: "En preparació",
    language: "Català",
  },
  {
    title: "Perífrasis verbals",
    description: "Estructures habituals per expressar obligació, inici, durada i final d'una acció.",
    category: "grammar",
    categoryLabel: "Gramàtica",
    level: "B1–B2",
    color: "lilac",
    icon: "VERB",
    status: "Properament",
    language: "Català",
  },
  {
    title: "Pretérito indefinido",
    description: "Guía visual de 10 páginas con usos, marcadores temporales, verbos regulares e irregulares, práctica y soluciones.",
    category: "grammar",
    categoryLabel: "Gramática",
    level: "A2",
    color: "blue",
    icon: "AYER",
    status: "Disponible",
    language: "Español",
    keywords: "pasado indefinido pretérito ejercicios respuestas hablar escribir",
    url: "materials/espanol/a2/preterito-indefinido/",
  },
  {
    title: "En el mercado",
    description: "Vocabulario práctico, preguntas y respuestas para comprar con confianza.",
    category: "vocabulary",
    categoryLabel: "Vocabulario",
    level: "A1–A2",
    color: "blue",
    icon: "MERC",
    status: "Properament",
    language: "Español",
  },
];

const resourceGrid = document.querySelector("#resource-grid");
const noResults = document.querySelector("#no-results");
const searchInput = document.querySelector("#resource-search");
const filterButtons = [...document.querySelectorAll(".filter")];
const languageButtons = [...document.querySelectorAll(".language-chip")];
let activeFilter = "all";
let activeLanguage = "all";

function renderResources() {
  const query = searchInput.value.trim().toLocaleLowerCase("ca");
  const filtered = resources.filter((resource) => {
    const matchesCategory = activeFilter === "all" || resource.category === activeFilter;
    const matchesLanguage = activeLanguage === "all" || resource.language === activeLanguage;
    const searchable = `${resource.title} ${resource.description} ${resource.categoryLabel} ${resource.language} ${resource.level} ${resource.keywords || ""}`.toLocaleLowerCase("ca");
    return matchesCategory && matchesLanguage && searchable.includes(query);
  });

  resourceGrid.innerHTML = filtered
    .map((resource) => {
      const action = resource.url
        ? `<a class="text-link resource-action" href="${resource.url}">Veure material <span>→</span></a>`
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

  document.querySelectorAll(".resource-action").forEach((button) => {
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
    renderResources();
  });
});

document.querySelectorAll(".language-filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeLanguage = button.dataset.language;
    activeFilter = "all";
    filterButtons.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
    languageButtons.forEach((item) => item.classList.toggle("active", item.dataset.languageFilter === activeLanguage));
    renderResources();
    document.querySelector("#materials").scrollIntoView({ behavior: "smooth" });
  });
});

searchInput.addEventListener("input", renderResources);
renderResources();

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
