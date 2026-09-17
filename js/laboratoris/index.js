import {state,save} from '../storage.js';
import {mountLab} from '../labs.js';
import {mount as flexio} from './flexio.js';
import {mount as molles} from './molles.js';
import {mount as suports} from './suports.js';
const mounts={flexio,molles,suports};
export async function laboratoryPage(id,{main,header,esc,get,current}){
 const labs=await get('continguts/laboratoris.json');if(!current())return;
 const selected=labs.find(l=>l.id===id)||labs[0];
 main.innerHTML=header('PREDIU · PROVA · REGISTRA · EXPLICA','Laboratori d’experimentació','Canvia una sola variable cada vegada. Compara almenys tres proves abans d’escriure la conclusió.')+`<nav class="lab-tabs" aria-label="Tria un laboratori">${labs.map(l=>`<a class="btn ${l.id===selected.id?'':'secondary'}" ${l.id===selected.id?'aria-current="page"':''} href="#laboratori/${l.id}">${esc(l.titol)}</a>`).join('')}</nav><section class="experiment-question"><p class="eyebrow">LA PREGUNTA</p><h2>${esc(selected.pregunta)}</h2><label class="note-label" for="prediction">1. Abans de provar: què creus que passarà i per què?</label><textarea id="prediction" rows="3"></textarea></section><div class="section-heading"><h2>2. Experimenta</h2><button class="btn secondary small" id="reset-controls">Restaura els controls</button></div><div id="experiment-model"></div><details open><summary>Proposta d’investigació</summary><ol>${selected.proves.map(p=>`<li>${esc(p)}</li>`).join('')}</ol></details><section class="experiment-record"><div class="section-heading"><h2>3. Registra i compara</h2><button class="btn" id="record-trial">Registra aquesta prova +</button></div><p>El registre captura els controls i el resultat del model. No són mesures d’un experiment real.</p><div id="trials"></div><label class="note-label" for="conclusion">4. Quina conclusió en treus? Quina dada la justifica?</label><textarea id="conclusion" rows="3"></textarea><p class="save-status" id="experiment-save" role="status"></p><div class="callout"><strong>Aplica-ho a una altra situació</strong><p>${esc(selected.transferencia)}</p></div><a class="text-link" href="#quadern">Veure l’informe al quadern →</a></section>`;
 state.experiments ??={};const journal=state.experiments[selected.id]??={prediction:'',conclusion:'',trials:[]};
 const prediction=main.querySelector('#prediction'),conclusion=main.querySelector('#conclusion');prediction.value=journal.prediction;conclusion.value=journal.conclusion;
 function persist(){
  state.notes['laboratori:'+selected.id]=[`LABORATORI: ${selected.titol}`,'PREDICCIÓ',journal.prediction,'PROVES (MODEL SIMULAT)',...journal.trials.map((t,i)=>`${i+1}. ${t.controls}\nResultat: ${t.result}`),'CONCLUSIÓ',journal.conclusion].join('\n');
  main.querySelector('#experiment-save').textContent=save()?'Informe desat al quadern d’aquest navegador.':'No s’ha pogut desar. Exporta el quadern abans de sortir.';
 }
 function table(){main.querySelector('#trials').innerHTML=journal.trials.length?`<div class="table-wrap"><table><thead><tr><th>Prova</th><th>Condicions</th><th>Resultat del model</th><th>Acció</th></tr></thead><tbody>${journal.trials.map((t,i)=>`<tr><td>${i+1}</td><td>${esc(t.controls)}</td><td>${esc(t.result)}</td><td><button class="btn secondary small" data-remove="${i}" aria-label="Elimina la prova ${i+1}">Elimina</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">Encara no has registrat cap prova.</p>';}
 let model=main.querySelector('#experiment-model');function renderModel(){const fresh=document.createElement('div');fresh.id='experiment-model';model.replaceWith(fresh);model=fresh;if(mounts[selected.id])mounts[selected.id](model);else mountLab(model,selected.id);}
 renderModel();table();main.querySelector('#reset-controls').onclick=renderModel;
 prediction.oninput=()=>{journal.prediction=prediction.value;persist();};conclusion.oninput=()=>{journal.conclusion=conclusion.value;persist();};
 main.querySelector('#record-trial').onclick=()=>{
  const controls=[...model.querySelectorAll('input')].map(input=>{
   const label=model.querySelector(`label[for="${input.id}"]`);
   return input.type==='checkbox'?`Diagonal: ${input.checked?'sí':'no'}`:label?label.textContent.trim():`${input.id}: ${input.value}`;
  }).join(' · ');
  journal.trials.push({controls,result:model.querySelector('.lab-result').textContent.trim()});table();persist();
 };
 main.querySelector('#trials').onclick=e=>{const b=e.target.closest('[data-remove]');if(!b)return;journal.trials.splice(+b.dataset.remove,1);table();persist();};
}
