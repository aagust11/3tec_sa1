import {beamRatio,graph,range,scaffold,labels} from './models.js';
export function mount(root){
 scaffold(root,'La biga: amplada o alçada?',range('load','Càrrega (N)',5,20,5,10)+range('span','Distància entre suports (cm)',50,150,10,100)+range('width','Amplada del perfil (mm)',5,20,5,10)+range('height','Alçada del perfil (mm)',5,20,5,10),'Biga rectangular simplement recolzada, càrrega central i mateix material. La teoria de petites deformacions dona δ proporcional a F·L³/(b·h³). Es compara amb una biga de 100 cm, 10 × 10 mm i 10 N.');
 function draw(){
  labels(root);const force=+root.querySelector('#load').value,length=+root.querySelector('#span').value,width=+root.querySelector('#width').value,height=+root.querySelector('#height').value;
  const ratio=beamRatio({force,length,width,height}),delta=Math.min(100,ratio*12),left=250-length,right=250+length;
  root.querySelector('.lab-visual').innerHTML=graph(`<path d="M${left} 185H${right}" stroke="#adb7a0" stroke-dasharray="5 5"/><path d="M${left} 185Q250 ${185+2*delta} ${right} 185" stroke="#647455" stroke-width="8" fill="none"/><path d="M${left-12} 209L${left} 190 ${left+12} 209ZM${right-12} 209L${right} 190 ${right+12} 209Z" fill="#88947e"/><path d="M250 95V${177+delta}" stroke="#a52c36" stroke-width="3" marker-end="url(#model-arrow)"/><text x="266" y="120" font-size="14" fill="#87313b">${force} N</text><rect x="35" y="35" width="${width*3}" height="${height*3}" fill="#e7d9ba" stroke="#8e7c50"/><text x="30" y="115" font-size="12">Secció: ${width} × ${height} mm</text><text x="30" y="303" font-size="12">Deformació exagerada i limitada al dibuix</text>`);
  root.querySelector('.lab-result').innerHTML=`<strong>Deformació relativa: ${ratio.toFixed(2)} ×</strong><p>1 × és la deformació de referència. No és una deformació en mm ni una càrrega de ruptura. ${ratio>8?'En aquest extrem cal revisar especialment la validesa de petites deformacions.':''}</p>`;
 }
 root.addEventListener('input',draw);draw();
}
