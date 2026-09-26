# Forces i estructures · 3r ESO

Web d'aprenentatge estàtica en català, preparada per a GitHub Pages. No requereix instal·lar llibreries, compilar ni disposar d'un servidor de dades.

## Què inclou

- Diagnòstic inicial, repàs de conceptes bàsics i 12 sessions essencials i 3 ampliacions opcionals, amb recursos i evidències seleccionades.
- Galeria de 3 fotografies amb autoria, pistes i preguntes d’observació.
- 12 temes desenvolupats amb objectius, explicacions, exemples resolts i pràctiques autocorrectives.
- Sis models visuals: vectors, triangulació, estabilitat, flexió, molles i repartiment de càrregues.
- 15 activitats, incloent experiments, lectures, síntesi, anàlisi de l’entorn i un repte de construcció.
- 41 preguntes amb retorn explicatiu, seguiment local i autoavaluació.
- 18 esquemes SVG propis, glossari cercable de 40 conceptes, amb definició, exemple i confusió habitual i 11 exercicis de relació amb retorn.
- Presentació pedagògica tipus eXeLearning en taronja i gris fosc.
- 12 situacions de raonament obert amb pistes, models de resposta i autorevisió.
- Plec de construcció editable i rúbrica del projecte amb evidències exportables.
- Laboratoris amb àrea constant, gràfics de molles, base inclinada, cable diagonal i reptes d’objectiu.
- Quadern amb desat local, exportació de text i impressió a PDF.
- Disseny adaptable a mòbil, navegació per teclat. Les fotografies es carreguen des de Wikimedia Commons.

## Publicar a GitHub Pages

Al repositori: **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**.

Adreça prevista: https://aagust11.github.io/3tec_sa1/ (disponible després d'activar Pages i completar el desplegament).

## Editar

Consulta [la guia d'edició](docs/GUIA_EDICIO.md). El contingut és a `continguts/`; el disseny, a `assets/styles.css` i `assets/unit.css`; el funcionament, a `js/`.

## Provar en local

Amb Python 3: `python3 -m http.server 8000`, des de la carpeta del projecte. Obre http://localhost:8000. No obris `index.html` amb doble clic: els navegadors bloquegen la càrrega de fitxers locals via fetch.

Amb Node instal·lat: `npm run check` valida els índexs, fitxers i preguntes. No cal executar `npm install`.

## Dades de l'alumnat

Tot es desa a `localStorage`, en aquest navegador i origen. No hi ha comptes, sincronització ni enviament al professorat. Un ordinador compartit comparteix el quadern si s'utilitza el mateix perfil de navegador. L'alumne pot exportar el text o imprimir-lo i després esborrar les dades. L'exportació de text és una còpia llegible, no un fitxer d'importació automàtica.

Les respostes de pràctica són visibles al codi font. No utilitzeu aquest qüestionari com una prova secreta o com a registre oficial de qualificacions.

## Continguts de partida

Estructura temàtica basada en el dossier «Forces i estructures · Tecnologia i Digitalització 3r ESO. 2026–2027» facilitat pel docent, amb el document de Casals com a referència complementària. Les explicacions, preguntes, esquemes i models de la web s'han redactat o creat per a aquesta implementació. No es publiquen els PDFs ni s'hi incorporen les pàgines escanejades.

Aquesta és una base ampliable, no una transcripció íntegra dels dossiers. Les dinàmiques i els llocs d'entrega són una proposta editable. Les durades de lectura són orientatives. Els models són didàctics, no eines de càlcul estructural.

Els nous laboratoris permeten escriure prediccions, registrar proves, comparar condicions i desar conclusions. Els models de flexió, molles i suports expliciten les hipòtesis i no representen comprovacions de seguretat.

## Tasques del dossier original

`#dossier` agrupa 32 pàgines: S1A1–S1A2, 14 activitats de teoria, síntesi, 3 Aplica, 2 experiments, Organitza, 2 lectures, 3 experiències S1A3, 3 activitats finals i autoavaluació. Cada tasca és un JSON independent a `continguts/dossier/`; les dades es desen amb identificadors estables sense substituir activitats ni apunts anteriors.

La correspondència amb les pàgines del PDF, els aclariments editorials i les instruccions d’edició són a [docs/CORRESPONDENCIA_DOSSIER.md](docs/CORRESPONDENCIA_DOSSIER.md). Les respostes es poden descarregar per tasca, imprimir completes o exportar conjuntament des del quadern. Les fotografies de l’alumnat es documenten amb una referència o enllaç; no es pugen fitxers.

## Copiar a Google Sites

Totes les pàgines amb respostes tenen «Copia per a Google Sites» i «Estil i previsualització». El codi inclou els valors actuals dels camps i desplegables, les opcions de qüestionari triades i els registres visibles; no exporta formularis actius ni solucions desplegables. El menú permet canviar font, mida, accent, fons, text i títol personal opcional. Les preferències es desen al navegador.

A Google Sites: Insereix → Insereix contingut (Embed) → Codi d’inserció. Enganxa el codi copiat i ajusta l’altura del requadre. És una còpia fixa: les edicions posteriors s’han de tornar a copiar. No es copien les imatges ni les explicacions de teoria. Si el navegador denega el porta-retalls, s’ofereix selecció manual i descàrrega HTML. Les dades només s’envien a Google Sites quan l’alumne les hi enganxa.

Implementació central: `js/sites-export.js` i `assets/sites-export.css`; detecta també els formularis que es tornen a renderitzar. Referència del flux d’inserció: https://support.google.com/sites/answer/90569 .

L’exportació HTML conté exclusivament treball de l’alumnat: títol, pregunta i resposta a sota. S’ometen els camps buits, la teoria, materials, procediments, exemples, pistes i solucionaris. Les proves registrades dels laboratoris es conserven com a evidències. Els desplegables s’exporten amb el text de l’opció seleccionada, sota l’enunciat i la identificació de l’element.

El laboratori de flexió calcula la fletxa central en mm amb δ = FL³/(48EI), I = bh³/12 i E fix de 200 GPa (material ideal assumit). Converteix cm a mm i GPa a N/mm². Biga simplement recolzada, càrrega central, sense pes propi i petites deformacions. La representació gràfica és exagerada i limitada, però el valor calculat i les proves registrades no es retallen. Referència de la fórmula: https://engineering.purdue.edu/~ce474/Docs/DA6-BeamFormulas.pdf .
