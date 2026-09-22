# Guia d'edició

## On es modifica cada cosa?

| Què vols canviar? | Fitxer |
|---|---|
| Títols, ordre, durada i índex de temes | `continguts/curs.json` |
| Text d'un tema | `continguts/temes/ID.html` |
| Activitats, dinàmica i lloc d'entrega | `continguts/activitats.json` |
| Instruccions d'una activitat | `continguts/activitats/ID.html` |
| Preguntes, opcions i explicacions | `continguts/preguntes.json` |
| Colors, tipografia i espais | `assets/styles.css` |
| Menú i nom de la capçalera | `index.html` |
| Portada i composició de les vistes | `js/app.js` |
| Interaccions dels laboratoris | `js/labs.js` |
| Correcció dels qüestionaris | `js/quiz.js` |
| Desat local | `js/storage.js` |

Pots editar cada fitxer a GitHub amb la icona del llapis i desar el canvi. Quan Pages estigui activat sobre `main`, els canvis es publicaran automàticament després del desplegament.

## Canviar una explicació

Obre, per exemple, `continguts/temes/materials.html`. Són fragments HTML senzills, sense capçalera de document:

```html
<h2>Un nou apartat</h2>
<p>Una explicació amb un <strong>concepte important</strong>.</p>
<div class="callout"><strong>Recorda</strong><p>Una idea clau.</p></div>
<details><summary>Una pregunta per pensar</summary><p>Una explicació desplegable.</p></details>
```

Per afegir una imatge pròpia, puja-la a `assets/` i utilitza una ruta relativa des de l'arrel:

```html
<img src="assets/el-meu-pont.jpg" alt="Pont de paper amb tres barres diagonals" style="max-width:100%;height:auto">
```

## Afegir un tema

1. Crea `continguts/temes/unions.html` amb el text.
2. Afegeix a la llista `temes` de `continguts/curs.json`:

```json
{
  "id": "unions",
  "titol": "Unions que resisteixen",
  "resum": "Com connectem les peces?",
  "icona": "◇",
  "durada": "10 min",
  "fitxer": "continguts/temes/unions.html"
}
```

3. Afegeix preguntes amb `"tema": "unions"` a `continguts/preguntes.json`.

La targeta, l'ordre de navegació i el recompte de progrés s'actualitzen a partir de l'índex.

## Afegir una activitat

1. Duplica un fragment de `continguts/activitats/` amb un nom nou.
2. Afegeix una entrada a `continguts/activitats.json`:

```json
{
  "id": "nou-repte",
  "codi": "S1A4",
  "titol": "El meu nou repte",
  "dinamica": "Parelles",
  "entrega": "Classroom",
  "resum": "Una frase que explica el repte.",
  "tema": "elements",
  "fitxer": "continguts/activitats/nou-repte.html"
}
```

Apareixerà a la llista i al quadern, amb esborrany i casella de seguiment propis. `entrega` és una indicació de text: la web no envia fitxers ni es connecta a Classroom.

## Afegir una pregunta

```json
{
  "id": "q13",
  "tema": "elements",
  "enunciat": "Quin element treballa principalment a tracció?",
  "opcions": ["Un cable tibant", "Un pilar comprimit", "Un fonament"],
  "correcta": 0,
  "explicacio": "El cable sosté la càrrega estirant: treballa a tracció."
}
```

`correcta` comença a comptar des de zero: 0 és la primera opció, 1 la segona. Els identificadors han de ser únics i estables: s'utilitzen per desar el progrés. Si canvies el sentit o l'ordre de les respostes d'una pregunta, dona-li un identificador nou perquè una resposta antiga no s'atribueixi a la nova pregunta.

## Afegir altres apartats

Per a nous continguts de teoria o activitats no cal modificar JavaScript. Un nou tipus d'interacció sí que requereix editar o afegir un mòdul a `js/` i connectar-lo des de `app.js`.

## Evitar errors

- Conserva les cometes dobles i les comes dels fitxers JSON. No hi afegeixis comentaris.
- Fes servir identificadors en minúscules, sense espais ni accents, per exemple `ponts-romans`.
- Mantén les rutes relatives, sense `/` inicial, perquè funcioni dins de `/3tec_sa1/`.
- Executa `npm run check` si tens Node, i revisa la pàgina després del desplegament.
- Si afegeixes vídeos o imatges externes, comprova la disponibilitat, els permisos d'ús i el text alternatiu.
- Els fragments HTML són contingut de confiança del docent: no hi enganxis scripts de procedència desconeguda.

## Ampliació: sessions, diagnòstic, fotografies i laboratoris

| Contingut nou | On s'edita |
|---|---|
| Ordre, títols i objectius de les 12 sessions | `continguts/sessions.json` |
| Activitats i temps d'una sessió | `continguts/sessions/ID.html` |
| Repàs previ | `continguts/inici/basics.html` |
| Preguntes de diagnòstic i de repàs inicial | `continguts/inici/preguntes.json` |
| Fotografies, autoria, preguntes i pistes | `continguts/galeria.json` |
| Preguntes guia dels laboratoris | `continguts/laboratoris.json` |
| Flexió, molles i suports | `js/laboratoris/flexio.js`, `molles.js`, `suports.js` |
| Fórmules i dibuix compartit | `js/laboratoris/models.js` |
| Registre de proves i informe | `js/laboratoris/index.js` |
| Vistes de sessions, diagnòstic i galeria | `js/expanded.js` |

Per afegir una sessió, crea el seu HTML i una entrada a `sessions.json`, amb `id`, `numero`, `titol`, `objectiu`, `durada`, `dinamica` i `fitxer`. El temps de 55 minuts i la proposta de 12 sessions són orientatius. Si canvies el nombre total, actualitza les frases de presentació a `expanded.js` i a la portada d'`app.js`.

Les fotografies s'enllacen a Wikimedia Commons i necessiten connexió. Cada entrada indica l'autor, la font, la llicència i el text alternatiu. Per utilitzar una foto pròpia, puja-la a `assets/`, canvia `src` a la ruta local i indica'n l'autoria. Si una foto externa falla, apareix un text alternatiu amb l'enllaç a l'original.

Les respostes `previ-*` es conserven quan es reinicia el qüestionari de repàs. Les `basics-*` es poden tornar a practicar. Es conserven les dades de la versió anterior; els informes dels nous laboratoris apareixen també al quadern exportable. El registre d'una prova desa els controls i el resultat calculat, no una mesura real.

La comprovació de GitHub Actions `Valida continguts i interaccions` és només una prova: **la publicació continua sent Deploy from a branch, main, / (root)**. Aquesta comprovació instal·la Playwright al runner, prova la web amb Chromium i guarda captures durant 7 dies. La web pública no necessita Playwright ni cap instal·lació.

## Ampliació de la unitat

- `continguts/temes/`: un HTML independent per tema. Els blocs `idevice` separen objectius, explicació, exemple, lectura, experiment i pràctica.
- `continguts/exercicis.json`: enunciats, respostes i explicacions dels exercicis de relació. Per inserir-ne un: `<div class="interactive-task" data-task="IDENTIFICADOR"></div>`.
- `continguts/glossari.json`: termes i definicions.
- `assets/esquemes/`: 15 imatges SVG editables, independents del text.
- `assets/unit.css`: paleta taronja/gris i presentació pedagògica.
- `js/learning-devices.js`: funcionament dels exercicis autocorrectius.

Per afegir un tema, crea el seu HTML, afegeix-lo a `curs.json` i incorpora preguntes amb identificadors nous a `preguntes.json`. Evita canviar els identificadors existents: mantenen el progrés dels alumnes. No canviïs la clau `3tec-sa1-v1` de persistència.

Els sis laboratoris, les 12 sessions i les activitats originals continuen disponibles amb les mateixes rutes. GitHub Pages continua amb **Deploy from a branch / main / root**; Actions comprova continguts, models i navegador, però no substitueix aquesta configuració de publicació.
