import {supportReactions,graph,range,scaffold,labels} from './models.js';
export function mount(root){
 scaffold(root,'Qui suporta més càrrega?',range('bridge-force','Càrrega (N)',10,100,10,60)+range('position','Distància des del suport esquerre (cm)',0,100,10,50),'Biga ideal de 100 cm, recolzada als dos extrems, pes propi negligit i una càrrega puntual vertical. R esquerra = F·(100−x)/100; R dreta = F·x/100. Es compleixen l’equilibri de forces i de moments.');
 function draw(){
  labels(root);const force=+root.querySelector('#bridge-force').value,position=+root.querySelector('#position').value,{left,right}=supportReactions(force,position),x=75+position*3.5;
  root.querySelector('.lab-visual').innerHTML=graph(`<path d="M75 170H425" stroke="#697d5a" stroke-width="10"/><path d="M62 197L75 178 88 197ZM412 197L425 178 438 197Z" fill="#8f9c82"/><path d="M${x} 65V150" stroke="#a52c36" stroke-width="3" marker-end="url(#model-arrow)"/><text x="${Math.min(x+8,420)}" y="55" fill="#87313b" font-size="14">${force} N</text>${[[75,left],[425,right]].map(([cx,f])=>f>0?`<path d="M${cx} ${210+f*.65}V208" stroke="#a52c36" stroke-width="3" marker-end="url(#model-arrow)"/>`:'').join('')}<text x="25" y="305" font-size="14">R esquerra: ${left.toFixed(1)} N</text><text x="305" y="305" font-size="14">R dreta: ${right.toFixed(1)} N</text><text x="160" y="25" font-size="12">Distància entre suports: 100 cm</text>`);
  root.querySelector('.lab-result').innerHTML=`<strong>${left.toFixed(1)} + ${right.toFixed(1)} = ${force} N</strong><p>${left===right?'Al centre, els dos suports reben la mateixa càrrega.':`El suport ${left>right?'esquerre':'dret'} rep més càrrega perquè la força és més a prop seu.`} Aquest resultat no comprova si la biga resisteix o es deforma massa.</p>`;
 }
 root.addEventListener('input',draw);draw();
}
