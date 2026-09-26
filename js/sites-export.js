import {state,save} from './storage.js';
const defaults={font:'Arial',size:'16',accent:'#ad490b',background:'#f4f5f6',ink:'#262d33',name:''};
const fonts={Arial:'Arial,Helvetica,sans-serif',Verdana:'Verdana,Geneva,sans-serif',Georgia:'Georgia,serif'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function options(value={}){const o={...defaults};if(fonts[value.font])o.font=value.font;if(['14','16','18','20'].includes(String(value.size)))o.size=String(value.size);for(const k of ['accent','background','ink'])if(/^#[0-9a-f]{6}$/i.test(value[k]||''))o[k]=value[k];o.name=String(value.name||'').slice(0,100);return o;}
// Export only student work. Never clone theory, instructions, examples or solutions.
export function sitesSnapshot(main){
 const text=node=>node?.textContent.trim()||'';
 const pair=(question,answer)=>`<div class="response-item"><h3 class="response-label">${esc(question)}</h3><p class="student-response">${esc(answer)}</p></div>`;
 const parts=[`<h1>${esc(text(main.querySelector('h1'))||'Les meves activitats')}</h1>`];
 let lastGroup='',count=0;
 function add(group,question,answer){if(!String(answer??'').trim())return;if(group&&group!==lastGroup){parts.push(`<h2>${esc(group)}</h2>`);lastGroup=group;}parts.push(pair(question,answer));count++;}
 const nodes=main.querySelectorAll('textarea,select,input[data-criterion],.question,.notebook-entry,#trials tbody tr');
 for(const node of nodes){
  if(node.closest('.sites-toolbar,#experiment-model,.dossier-filters'))continue;
  if(node.matches('.notebook-entry')){add(text(node.querySelector('h2')),'Apunts i respostes',text(node.querySelector('p')));continue;}
  if(node.matches('#trials tbody tr')){const cells=node.querySelectorAll('td');add('Proves registrades · model simulat','Prova '+text(cells[0]),'Condicions: '+text(cells[1])+'\nResultat del model: '+text(cells[2]));continue;}
  if(node.matches('.question')){add('Qüestionari',text(node.querySelector('h3')),text(node.querySelector('.answer.chosen')));continue;}
  if(node.closest('.question'))continue;
  const value=node.matches('select')?(node.value&&node.value!=='Sense valorar'?text(node.selectedOptions[0]):''):node.type==='checkbox'?(node.checked?'Marcat':'No marcat'):node.value;
  if(!String(value||'').trim())continue;
  let label=text(node.labels?.[0]);
  // Remove option text nested inside a label (notebook rubric).
  if(node.labels?.[0]){const copy=node.labels[0].cloneNode(true);copy.querySelectorAll('input,textarea,select').forEach(n=>n.remove());label=text(copy);}
  const section=node.closest('[data-export-section]');if(section){add(section.dataset.exportSection,label,value);continue;}
  const field=node.closest('.dossier-field');
  if(field){
   const section=field.closest('section'),group=text(section?.querySelector('h2'))||'Activitat';
   const question=text(field.querySelector('legend,label'));
   const cell=node.closest('td');
   if(cell){const row=cell.parentElement;const col=cell.cellIndex;const heading=text(cell.closest('table').querySelector('thead tr')?.children[col]);add(group,`${question} — ${text(row.querySelector('th'))} · ${heading}`,value);}
   else add(group,question,value);
   continue;
  }
  const reasoning=node.closest('.reasoning');
  if(reasoning){add(text(reasoning.querySelector('h2')),node.id==='reasoning-answer'?text(reasoning.querySelector('.device-body > p')):label,value);continue;}
  const rubric=node.closest('.rubric-criterion');if(rubric){add('Rúbrica · '+text(rubric.querySelector('h3')),label,value);continue;}
  const task=node.closest('[data-task]');if(task){add(text(task.closest('.idevice')?.querySelector('h2'))||'Activitat de pràctica',label,value);continue;}
  const group=node.id==='prediction'||node.id==='conclusion'?text(main.querySelector('[data-export-section] h2')):node.hasAttribute('data-rubric')?'Autoavaluació':'Reflexió personal';
  add(group,label||node.getAttribute('aria-label')||'La meva resposta',value);
 }
 if(!count)parts.push('<p>Encara no hi ha respostes escrites o seleccionades per copiar.</p>');
 return parts.join('\n');
}
export function sitesHTML(content,raw={}){
 const o=options(raw);
 return `<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>El meu portafoli · Forces i estructures</title><style>
*{box-sizing:border-box}body{margin:0;background:${o.background};color:${o.ink};font-family:${fonts[o.font]};font-size:${o.size}px;line-height:1.65;overflow-wrap:anywhere}.portfolio{max-width:1000px;margin:auto;padding:24px}h1{font-size:2em;line-height:1.2}h2{font-size:1.35em;margin:1.5em 0 .6em}h3{font-size:1.1em}h1,h2,h3{color:inherit}.eyebrow{color:${o.accent};font-weight:bold;font-size:.8em;letter-spacing:.08em}.article,.notebook-entry,.idevice,.question,.experiment-record,.experiment-question{background:white;border:1px solid #d5d8da;border-radius:10px;padding:22px;margin:18px 0}.student-response{white-space:pre-wrap;background:${o.background};border-left:4px solid ${o.accent};border-radius:4px;padding:12px 16px;margin:8px 0 20px;color:${o.ink};font-weight:normal}.response-label,legend{font-weight:bold}.response-label .student-response{font-weight:normal}.dossier-field{border:0;min-width:0;padding:0;margin:24px 0}.table-wrap{max-width:100%;overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:.95em}th,td{border:1px solid #d5d8da;padding:10px;vertical-align:top;text-align:left}th{background:${o.background}}td .student-response{min-width:110px;margin:0}img{display:block;max-width:100%;height:auto;max-height:600px;object-fit:contain;margin:auto}figure{margin:20px 0}figcaption,small{font-size:.85em}.callout,.dossier-clarification,.dossier-extra,.learning-goals{border-left:4px solid ${o.accent};padding:16px;background:${o.background};margin:20px 0}.notebook-entry p,.dossier-print-answers{white-space:pre-wrap}a{color:${o.accent}}fieldset{min-width:0;border:1px solid #d5d8da;border-radius:6px}.portfolio-byline{font-weight:bold;border-bottom:3px solid ${o.accent};padding-bottom:12px}.portfolio-footer{border-top:1px solid #d5d8da;margin-top:28px;padding-top:14px;font-size:.8em}.tag{display:inline-block;margin:4px;padding:4px 8px;background:${o.background};border-radius:4px}.lab-result{padding:16px;border:1px solid #d5d8da}.cards,.concept-grid{display:block}.card{border:1px solid #d5d8da;padding:14px;margin:12px 0}.lesson-side{display:none}@media(max-width:600px){.portfolio{padding:12px}.article,.idevice,.experiment-record,.question{padding:14px}h1{font-size:1.65em}table{min-width:540px}}@media print{.portfolio{max-width:none;padding:0}.table-wrap{overflow:visible}table{min-width:0}body{background:white}}
</style></head><body><main class="portfolio">${o.name?`<p class="portfolio-byline">${esc(o.name)}</p>`:''}${content}<footer class="portfolio-footer">Portafoli d’aprenentatge · Tecnologia 3r ESO · Forces i estructures.</footer></main></body></html>`;
}
export function installSitesExport(main){
 let prefs=options(state.exportStyle),opener;
 const dialog=document.createElement('dialog');dialog.id='sites-dialog';dialog.setAttribute('aria-labelledby','sites-title');
 dialog.innerHTML=`<div class="sites-dialog-head"><h2 id="sites-title">Prepara el teu Google Site</h2><button type="button" class="btn secondary" id="sites-close">Tanca</button></div><p>A Google Sites: <strong>Insereix → Insereix contingut (Embed) → Codi d’inserció</strong>. Enganxa el codi, revisa la previsualització i insereix-lo. Ajusta l’altura del requadre si cal. És una còpia fixa: torna a copiar-la si canvies les respostes.</p><div class="sites-settings"><label>Nom o títol personal (opcional)<input id="sites-name" maxlength="100" autocomplete="off"></label><label>Lletra<select id="sites-font"><option>Arial</option><option>Verdana</option><option>Georgia</option></select></label><label>Mida<select id="sites-size"><option value="14">14 px</option><option value="16">16 px</option><option value="18">18 px</option><option value="20">20 px</option></select></label><label>Color d’accent<input type="color" id="sites-accent"></label><label>Color de fons<input type="color" id="sites-background"></label><label>Color del text<input type="color" id="sites-ink"></label></div><p>El nom és opcional. Revisa què compartiràs abans d’inserir-ho en un Site públic.</p><div class="sites-actions"><button class="btn" id="sites-copy-dialog">Copia el codi HTML</button><button class="btn secondary" id="sites-download">Descarrega HTML</button><button class="btn secondary" id="sites-defaults">Restaura l’estil</button></div><p id="sites-dialog-status" role="status"></p><h3>Previsualització</h3><iframe id="sites-preview" title="Previsualització del portafoli exportat" sandbox=""></iframe><details><summary>Mostra el codi / còpia manual</summary><label for="sites-code">Selecciona i copia tot aquest codi</label><textarea id="sites-code" readonly spellcheck="false"></textarea><button class="btn secondary" id="sites-select">Selecciona tot el codi</button></details>`;
 document.body.append(dialog);
 const generate=()=>sitesHTML(sitesSnapshot(main),prefs);
 const refresh=()=>{const code=generate();dialog.querySelector('#sites-code').value=code;dialog.querySelector('#sites-preview').srcdoc=code;};
 const fill=()=>{for(const k of Object.keys(defaults))dialog.querySelector('#sites-'+k).value=prefs[k];};
 const open=(button,message='')=>{opener=button;prefs=options(state.exportStyle);fill();refresh();dialog.querySelector('#sites-dialog-status').textContent=message;if(!dialog.open)dialog.showModal();};
 async function copy(button,status){const code=generate();try{if(!navigator.clipboard?.writeText)throw Error('Clipboard');await navigator.clipboard.writeText(code);status.textContent='Codi HTML copiat. A Google Sites, enganxa’l a Insereix → Insereix contingut → Codi d’inserció.';}catch{open(button,'El navegador no ha permès copiar automàticament. Selecciona el codi i copia’l manualment.');const field=dialog.querySelector('#sites-code');field.closest('details').open=true;field.focus();field.select();}}
 dialog.querySelector('#sites-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>opener?.isConnected&&opener.focus());
 for(const k of Object.keys(defaults))dialog.querySelector('#sites-'+k).addEventListener('input',e=>{prefs=options({...prefs,[k]:e.target.value});state.exportStyle=prefs;save();refresh();dialog.querySelector('#sites-dialog-status').textContent='Estil actualitzat. Copia de nou el codi per aplicar-lo al Site.';});
 dialog.querySelector('#sites-defaults').onclick=()=>{prefs={...defaults};state.exportStyle=prefs;save();fill();refresh();};
 dialog.querySelector('#sites-copy-dialog').onclick=e=>copy(e.target,dialog.querySelector('#sites-dialog-status'));
 dialog.querySelector('#sites-select').onclick=()=>{const code=dialog.querySelector('#sites-code');code.focus();code.select();};
 dialog.querySelector('#sites-download').onclick=()=>{const url=URL.createObjectURL(new Blob([generate()],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='portafoli-forces-estructures.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 function mount(){
  if(main.querySelector('.sites-toolbar')||!main.querySelector('textarea,select:not(#dossier-filter),.question,.notebook-entry'))return;
  const bar=document.createElement('section');bar.className='sites-toolbar';bar.setAttribute('aria-label','Exporta les respostes a Google Sites');bar.innerHTML='<div><strong>Porta les teves respostes al portafoli</strong><p>Copia només les activitats respostes: títol, pregunta i resposta. La teoria no s’inclou.</p></div><div class="sites-actions"><button class="btn" data-sites-copy>Copia per a Google Sites</button><button class="btn secondary" data-sites-style>Estil i previsualització</button></div><p class="sites-status" role="status"></p>';
  const head=main.querySelector('.page-head');if(head)head.after(bar);else main.prepend(bar);
  bar.querySelector('[data-sites-copy]').onclick=e=>{prefs=options(state.exportStyle);copy(e.target,bar.querySelector('.sites-status'));};bar.querySelector('[data-sites-style]').onclick=e=>open(e.target);
 }
 new MutationObserver(mount).observe(main,{childList:true,subtree:true});mount();
 window.addEventListener('hashchange',()=>{if(dialog.open)dialog.close();});
}
