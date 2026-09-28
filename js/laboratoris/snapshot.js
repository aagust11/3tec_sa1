// Each recorded trial owns its image: later control changes cannot alter it.
export function captureTrial(model){
 const source=model.querySelector('.lab-visual svg');if(!source)return '';
 const svg=source.cloneNode(true);
 svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
 svg.setAttribute('width','500');svg.setAttribute('height','320');
 svg.setAttribute('style','background:#f4f5f0;color:#262d33;font-family:Arial,Helvetica,sans-serif');
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));
}
export function trialFigure(image,number,esc){
 if(typeof image!=='string'||!image.startsWith('data:image/svg+xml;charset=utf-8,'))return '<p class="trial-no-image">Aquesta prova antiga no té captura. Repeteix-ne les condicions i registra-la de nou per afegir-hi la visualització.</p>';
 return `<details class="trial-snapshot"><summary>Visualitza la situació de la prova ${number}</summary><figure><img src="${esc(image)}" alt="Representació del simulador en registrar la prova ${number}" width="500" height="320" style="display:block;width:100%;max-width:500px;height:auto;background:#f4f5f0" loading="eager"><figcaption>Situació registrada · prova ${number}</figcaption></figure></details>`;
}
