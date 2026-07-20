const params = new URLSearchParams(window.location.search);

const copy = {
  English: {
    lang: "en",
    all: "All materials",
    home: "Home",
    back: "← Back to materials",
    format: "digital format",
    level: "recommended level",
    access: "view or download",
    view: "View the material",
    download: "Download PDF",
    eyebrow: "HOW WOULD YOU LIKE TO USE IT?",
    infoTitle: "View it online or download it",
    infoText: "Open the material in your browser to use it in class, or save the PDF to your device.",
    ctaTitle: "Shall we start?",
    ctaText: "Open the PDF and work at your own pace.",
    open: "Open the material",
    footer: "Visual language material designed for clear and confident learning.",
    more: "More materials ↑",
  },
  "Català": {
    lang: "ca",
    all: "Tots els materials",
    home: "Inici",
    back: "← Tornar als materials",
    format: "format digital",
    level: "nivell recomanat",
    access: "consulta o descàrrega",
    view: "Veure el material",
    download: "Descarregar PDF",
    eyebrow: "COM EL VOLS UTILITZAR?",
    infoTitle: "Consulta’l en línia o descarrega’l",
    infoText: "Pots obrir el material al navegador per treballar-lo a classe o guardar el PDF al teu dispositiu.",
    ctaTitle: "Comencem?",
    ctaText: "Obre el PDF i treballa al teu ritme.",
    open: "Obrir el material",
    footer: "Material visual per aprendre amb claredat i confiança.",
    more: "Més materials ↑",
  },
  "Español": {
    lang: "es",
    all: "Todos los materiales",
    home: "Inicio",
    back: "← Volver a los materiales",
    format: "formato digital",
    level: "nivel recomendado",
    access: "consulta o descarga",
    view: "Ver el material",
    download: "Descargar PDF",
    eyebrow: "¿CÓMO QUIERES UTILIZARLO?",
    infoTitle: "Consúltalo en línea o descárgalo",
    infoText: "Puedes abrir el material en el navegador para utilizarlo en clase o guardar el PDF en tu dispositivo.",
    ctaTitle: "¿Empezamos?",
    ctaText: "Abre el PDF y trabaja a tu ritmo.",
    open: "Abrir el material",
    footer: "Material visual para aprender con claridad y confianza.",
    more: "Más materiales ↑",
  },
};

function normalizeLanguage(value) {
  if ((value || "").startsWith("Espa") || (value || "").startsWith("Spa")) return "Español";
  if ((value || "").startsWith("Catal")) return "Català";
  return "English";
}

const material = {
  title: params.get("title") || "Material",
  description: params.get("description") || "",
  language: normalizeLanguage(params.get("language")),
  category: params.get("category") || "",
  level: params.get("level") || "",
  file: params.get("file") || "",
  cover: params.get("cover") || "",
  icon: params.get("icon") || "PDF",
};

const labels = copy[material.language];
document.documentElement.lang = labels.lang;
document.body.dataset.language = material.language;
document.title = `${material.title} | Learn with Meri`;

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
};

setText("nav-materials", labels.all);
setText("nav-home", labels.home);
setText("material-back", labels.back);
setText("material-language", material.language);
setText("material-category", material.category);
setText("material-level", material.level);
setText("material-title", material.title);
setText("material-description", material.description);
setText("stat-format", labels.format);
setText("stat-level", material.level || "—");
setText("stat-level-label", labels.level);
setText("stat-access", labels.access);
setText("view-pdf", labels.view);
setText("download-pdf", labels.download);
setText("info-eyebrow", labels.eyebrow);
setText("info-title", labels.infoTitle);
setText("info-text", labels.infoText);
setText("cta-title", labels.ctaTitle);
setText("cta-text", labels.ctaText);
setText("cta-open", labels.open);
setText("footer-description", labels.footer);
setText("footer-materials", labels.more);
setText("material-icon", material.icon);
setText("placeholder-title", material.title);

const pdfLinks = ["view-pdf", "download-pdf", "cta-open"].map((id) => document.getElementById(id));
if (material.file) {
  pdfLinks.forEach((link) => { link.href = material.file; });
} else {
  pdfLinks.forEach((link) => { link.hidden = true; });
}

if (material.cover) {
  const cover = document.getElementById("material-cover");
  cover.src = material.cover;
  cover.alt = `${material.title} — Learn with Meri`;
  cover.hidden = false;
  document.getElementById("material-placeholder").hidden = true;
}

window.addEventListener("scroll", () => {
  document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 15);
}, { passive: true });
