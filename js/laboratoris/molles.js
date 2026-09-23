import {springExtension,graph,range,scaffold,labels} from './models.js';
export function mount(root){
 scaffold(root,'Com respon una molla?',range('spring-force','Força (N)',0,10,1,4)+range('stiffness','Constant elàstica k (N/cm)',1,5,1,2),'Molla ideal en règim elàstic lineal: F = k · x. L’allargament x es mesura des de la longitud sense càrrega. El model no representa deformació permanent ni ruptura.');
 function draw(){
  labels(root);const force=+root.querySelector('#spring-force').value,k=+root.querySelector('#stiffness').value,x=springExtension(force,k),bottom=170+x*9;
  let points='250,60 ';for(let i=0;i<15;i++)points+=`${i%2?270:230},${70+i*(bottom-80)/14} `;points+=`250,${bottom}`;
  root.querySelector('.lab-visual').innerHTML=graph(`<path d="M170 50H330" stroke="#697d5a" stroke-width="9"/><path d="M200 170H380" stroke="#8d9881" stroke-dasharray="5 5"/><polyline points="${points}" fill="none" stroke="#667b58" stroke-width="4"/><rect x="232" y="${bottom}" width="36" height="24" rx="4" fill="#d1dcbf" stroke="#667b58"/>${force>0?`<path d="M250 ${bottom+25}v25" stroke="#ad490b" stroke-width="3" marker-end="url(#model-arrow)"/>`:''}<path d="M345 170V${bottom}" stroke="#ad490b" stroke-width="2"/><text x="360" y="${180+x*4}" fill="#91400d" font-size="14">x = ${x.toFixed(1)} cm</text><text x="28" y="306" font-size="12">Línia discontínua: extrem sense càrrega</text>`);
  root.querySelector('.lab-result').innerHTML=`<strong>Allargament: ${x.toFixed(2)} cm</strong><p>${force} N ÷ ${k} N/cm = ${x.toFixed(2)} cm. Una k més gran significa una molla més rígida.</p>`;
 }
 root.addEventListener('input',draw);draw();
}
