import {guidanceHTML,guidanceReport,bindGuidance} from './guidance.js';
import {mountRuler,rulerReport} from './regle.js';
import {mountChallenge,springPlot} from './extensions.js';
import {state,save} from '../storage.js';
import {mountLab} from '../labs.js';
import {mount as flexio} from './flexio.js';
import {mount as molles} from './molles.js';
import {mount as suports} from './suports.js';
const mounts={flexio,molles,suports};
export async function laboratoryPage(id,{main,header,esc,get,current}){
 const [labs,guides]=await Promise.all([get('continguts/laboratoris.json'),get('continguts/guies-laboratori.json')]);if(!current())return;
 const selected=labs.find(l=>l.id===id)||labs[0],guide=guides[selected.id];
 main.innerHTML=header('PREDIU · PROVA · REGISTRA · EXPLICA','Laboratori d’experimentació','Comença comparant les situacions A i B. Segueix els passos i utilitza les dades de les dues proves per revisar la teva previsió.')+`<nav class="lab-tabs" aria-label="Tria un laboratori">${labs.map(l=>`<a class="btn ${l.id===selected.id?'':'secondary'}" ${l.id===selected.id?'aria-current="page"':''} href="#laboratori/${l.id}">${esc(l.titol)}</a>`).join('')}</nav>${guidanceHTML(guide,esc)}<div class="section-heading"><h2>2. Experimenta</h2><button class="btn secondary small" id="reset-controls">Restaura els controls</button></div><div id="experiment-model"></div><details open><summary>Proposta d’investigació</summary><ol>${selected.proves.map(p=>`<li>${esc(p)}</li>`).join('')}</ol></details><section class="experiment-record"><div class="section-heading"><h2>3. Registra i compara</h2><button class="btn" id="record-trial">Registra aquesta prova +</button></div><p>El registre captura els controls i el resultat del model. No són mesures d’un experiment real.</p><div id="trials"></div>${selected.id==='molles'?'<div id="spring-plot"></div>':''}<label class="note-label" for="conclusion">4. ${esc(guide.conclusion)}</label><textarea id="conclusion" rows="3"></textarea><p class="save-status" id="experiment-save" role="status"></p>${selected.id==='flexio'?'<div id="ruler-activity"></div>':`<div class="callout"><strong>Aplica-ho a una altra situació</strong><p>${esc(selected.transferencia)}</p></div>`}<a class="text-link" href="#quadern">Veure l’informe al quadern →</a></section>`;
 state.experiments ??={};const journal=state.experiments[selected.id]??={prediction:'',conclusion:'',trials:[]};
 const prediction=main.querySelector('#prediction'),conclusion=main.querySelector('#conclusion');prediction.value=journal.prediction;conclusion.value=journal.conclusion;
 function persist(){
  state.notes['laboratori:'+selected.id]=[`LABORATORI: ${selected.titol}`,'RAONAMENT GUIAT: '+guide.title,guide.a,guide.b,...guidanceReport(guide,journal),'PREDICCIÓ',guide.prediction,journal.prediction,'PROVES (MODEL SIMULAT)',...journal.trials.map((t,i)=>`${i+1}. ${t.controls}\nResultat: ${t.result}`),'CONCLUSIÓ',journal.conclusion,...(selected.id==='flexio'?rulerReport(journal):[])].join('\n');
  main.querySelector('#experiment-save').textContent=save()?'Informe desat al quadern d’aquest navegador.':'No s’ha pogut desar. Exporta el quadern abans de sortir.';
 }
 function table(){main.querySelector('#trials').innerHTML=journal.trials.length?`<div class="table-wrap"><table><thead><tr><th>Prova</th><th>Condicions</th><th>Resultat del model</th><th>Acció</th></tr></thead><tbody>${journal.trials.map((t,i)=>`<tr><td>${i+1}</td><td>${esc(t.controls)}</td><td>${esc(t.result)}</td><td><button class="btn secondary small" data-remove="${i}" aria-label="Elimina la prova ${i+1}">Elimina</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">Encara no has registrat cap prova.</p>';if(selected.id==='molles')springPlot(main.querySelector('#spring-plot'),journal.trials);}
 let model=main.querySelector('#experiment-model');function renderModel(){const fresh=document.createElement('div');fresh.id='experiment-model';model.replaceWith(fresh);model=fresh;if(mounts[selected.id])mounts[selected.id](model);else mountLab(model,selected.id);mountChallenge(model,selected.id);}
 renderModel();table();bindGuidance(main,guide,journal,persist);if(selected.id==='flexio')mountRuler(main.querySelector('#ruler-activity'),journal,esc,persist);main.querySelector('#reset-controls').onclick=renderModel;
 prediction.oninput=()=>{journal.prediction=prediction.value;persist();};conclusion.oninput=()=>{journal.conclusion=conclusion.value;persist();};
 main.querySelector('#record-trial').onclick=()=>{
  const controls=[...model.querySelectorAll('input,select')].map(input=>{
   const label=model.querySelector(`label[for="${input.id}"]`);
   if(input.type==='checkbox')return `${label?.textContent.trim()||input.parentElement.textContent.trim()}: ${input.checked?'sí':'no'}`;if(input.tagName==='SELECT')return `${label?.textContent.trim()||input.id}: ${input.selectedOptions[0].textContent}`;return label?label.textContent.trim():`${input.id}: ${input.value}`;
  }).join(' · ');
  journal.trials.push({controls,result:model.querySelector('.lab-result').textContent.trim(),...(selected.id==='molles'?{numeric:{force:+model.querySelector('#spring-force').value,k:+model.querySelector('#stiffness').value}}:{})});table();persist();
 };
 main.querySelector('#trials').onclick=e=>{const b=e.target.closest('[data-remove]');if(!b)return;journal.trials.splice(+b.dataset.remove,1);table();persist();};
}
