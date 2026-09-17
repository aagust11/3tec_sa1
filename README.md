# Forces i estructures · 3r ESO

Web d'aprenentatge estàtica en català, preparada per a GitHub Pages. No requereix instal·lar llibreries, compilar ni disposar d'un servidor de dades.

## Què inclou

- Sis temes amb explicacions, exemples i preguntes de comprovació.
- Tres models visuals: vectors de força, triangulació i estabilitat.
- Sis activitats, incloent experiments, anàlisi de l'entorn i un repte de construcció.
- Dotze preguntes amb retorn explicatiu, seguiment local i autoavaluació.
- Quadern amb desat local, exportació de text i impressió a PDF.
- Disseny adaptable a mòbil, navegació per teclat i sense recursos externs.

## Publicar a GitHub Pages

Al repositori: **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**.

Adreça prevista: https://aagust11.github.io/3tec_sa1/ (disponible després d'activar Pages i completar el desplegament).

## Editar

Consulta [la guia d'edició](docs/GUIA_EDICIO.md). El contingut és a `continguts/`; el disseny, a `assets/styles.css`; el funcionament, a `js/`.

## Provar en local

Amb Python 3: `python3 -m http.server 8000`, des de la carpeta del projecte. Obre http://localhost:8000. No obris `index.html` amb doble clic: els navegadors bloquegen la càrrega de fitxers locals via fetch.

Amb Node instal·lat: `npm run check` valida els índexs, fitxers i preguntes. No cal executar `npm install`.

## Dades de l'alumnat

Tot es desa a `localStorage`, en aquest navegador i origen. No hi ha comptes, sincronització ni enviament al professorat. Un ordinador compartit comparteix el quadern si s'utilitza el mateix perfil de navegador. L'alumne pot exportar el text o imprimir-lo i després esborrar les dades. L'exportació de text és una còpia llegible, no un fitxer d'importació automàtica.

Les respostes de pràctica són visibles al codi font. No utilitzeu aquest qüestionari com una prova secreta o com a registre oficial de qualificacions.

## Continguts de partida

Estructura temàtica basada en el dossier «Forces i estructures · Tecnologia i Digitalització 3r ESO. 2026–2027» facilitat pel docent, amb el document de Casals com a referència complementària. Les explicacions, preguntes, esquemes i models de la web s'han redactat o creat per a aquesta implementació. No es publiquen els PDFs ni s'hi incorporen les pàgines escanejades.

Aquesta és una base ampliable, no una transcripció íntegra dels dossiers. Les dinàmiques i els llocs d'entrega són una proposta editable. Les durades de lectura són orientatives. Els models són didàctics, no eines de càlcul estructural.
