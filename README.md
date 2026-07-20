# Learn with Meri

Primera versió de la web educativa multilingüe de **Learn with Meri**, preparada com a lloc estàtic per publicar-se gratuïtament amb GitHub Pages.

## Estructura

- `index.html`: contingut i estructura de la pàgina.
- `styles.css`: sistema visual responsive.
- `script.js`: filtres, cerca, menú mòbil i mini quiz.
- `materials/`: fitxes individuals i PDFs descarregables dels materials publicats.
- `content/materials.json`: biblioteca editable de materials.
- `.pages.yml`: formulari visual utilitzat per Pages CMS.

## Edició visual amb Pages CMS

1. Entra a `https://app.pagescms.org/` amb GitHub.
2. Obre el repositori `meritxellteacher/Learn-with-Meri` i la branca `main`.
3. Entra a **Materials de la web** per afegir, editar o ocultar materials.
4. Els PDFs nous es desen a `media/documents/` i les portades a `media/images/`.

## Publicació amb GitHub Pages

1. Puja els fitxers a un repositori públic.
2. Ves a `Settings → Pages`.
3. A `Build and deployment`, selecciona `Deploy from a branch`.
4. Selecciona la branca `main` i la carpeta `/ (root)`.
5. Desa els canvis.

No necessita compilació ni dependències.
