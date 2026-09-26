import {state,save} from './storage.js';
const defaults={font:'Arial',size:'16',accent:'#ad490b',background:'#f4f5f6',ink:'#262d33',name:''};
const fonts={Arial:'Arial,Helvetica,sans-serif',Verdana:'Verdana,Geneva,sans-serif',Georgia:'Georgia,serif'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function options(value={}){const o={...defaults};if(fonts[value.font])o.font=value.font;if(['14','16','18','20'].includes(String(value.size)))o.size=String(value.size);for(const k of ['accent','background','ink'])if(/^#[0-9a-f]{6}$/i.test(value[k]||''))o[k]=value[k];o.name=String(value.name||'').slice(0,100);return o;}
// Read current properties, not HTML attributes: select/textarea attributes can be stale.
export function sitesSnapshot(main){
 const clone=main.cloneNode(true),original=[...main.querySelectorAll('input,textarea,select')],copied=[...clone.querySelectorAll('input,textarea,select')];
 copied.forEach((el,i)=>{const live=original[i];if(live.closest('.sites-toolbar'))return;const p=document.createElement('p');p.className='student-response';
  if(live.type==='checkbox'||live.type==='radio')p.textContent=live.checked?'☑ Marcat':'☐ No marcat';
  else if(live.tagName==='SELECT')p.textContent=live.value?live.selectedOptions[0]?.textContent||live.value:'Sense respondre';
  else p.textContent=live.value||'Sense respondre';
  el.replaceWith(p);
 });
 clone.querySelectorAll('.question').forEach(q=>{const chosen=q.querySelector('.answer.chosen');const p=document.createElement('p');p.className='student-response';p.textContent=chosen?.textContent||'Sense respondre';q.querySelector('.answers')?.replaceWith(p);});
 clone.querySelectorAll('script,style,iframe,object,embed,svg,canvas,button,nav,details,.sites-toolbar,.back,.save-status,.toolbar,.dossier-toolbar,.lesson-side,.lesson-bottom,.dossier-bridge,.feedback,.task-feedback,.task-score,.entry-recommendation,.quiz-summary,.dossier-print-sheet,.text-link,.photo-fallback').forEach(n=>n.remove());
 // A trial's last column contains only the delete button; do not export it.
 clone.querySelectorAll('#trials tr').forEach(row=>row.lastElementChild?.remove());
 clone.querySelectorAll('*').forEach(el=>{
  for(const attr of [...el.attributes])if(!['class','href','src','alt','colspan','rowspan','scope'].includes(attr.name))el.removeAttribute(attr.name);
  for(const attr of ['href','src'])if(el.hasAttribute(attr)){
   try{const url=new URL(el.getAttribute(attr),location.href);if(!['https:','http:'].includes(url.protocol))el.removeAttribute(attr);else el.setAttribute(attr,url.href);}catch{el.removeAttribute(attr);}
  }
  if(el.tagName==='A'){el.setAttribute('target','_blank');el.setAttribute('rel','noopener noreferrer');}
 });
 clone.querySelectorAll('label').forEach(label=>{const d=document.createElement('div');d.className='response-label';while(label.firstChild)d.append(label.firstChild);label.replaceWith(d);});
 return clone.innerHTML;
}
export function sitesHTML(content,raw={}){
 const o=options(raw);
 return `<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>El meu portafoli · Forces i estructures</title><style>
*{box-sizing:border-box}body{margin:0;background:${o.background};color:${o.ink};font-family:${fonts[o.font]};font-size:${o.size}px;line-height:1.65;overflow-wrap:anywhere}.portfolio{max-width:1000px;margin:auto;padding:24px}h1{font-size:2em;line-height:1.2}h2{font-size:1.35em;margin:1.5em 0 .6em}h3{font-size:1.1em}h1,h2,h3{color:inherit}.eyebrow{color:${o.accent};font-weight:bold;font-size:.8em;letter-spacing:.08em}.article,.notebook-entry,.idevice,.question,.experiment-record,.experiment-question{background:white;border:1px solid #d5d8da;border-radius:10px;padding:22px;margin:18px 0}.student-response{white-space:pre-wrap;background:${o.background};border-left:4px solid ${o.accent};border-radius:4px;padding:12px 16px;margin:8px 0 20px;color:${o.ink};font-weight:normal}.response-label,legend{font-weight:bold}.response-label .student-response{font-weight:normal}.dossier-field{border:0;min-width:0;padding:0;margin:24px 0}.table-wrap{max-width:100%;overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:.95em}th,td{border:1px solid #d5d8da;padding:10px;vertical-align:top;text-align:left}th{background:${o.background}}td .student-response{min-width:110px;margin:0}img{display:block;max-width:100%;height:auto;max-height:600px;object-fit:contain;margin:auto}figure{margin:20px 0}figcaption,small{font-size:.85em}.callout,.dossier-clarification,.dossier-extra,.learning-goals{border-left:4px solid ${o.accent};padding:16px;background:${o.background};margin:20px 0}.notebook-entry p,.dossier-print-answers{white-space:pre-wrap}a{color:${o.accent}}fieldset{min-width:0;border:1px solid #d5d8da;border-radius:6px}.portfolio-byline{font-weight:bold;border-bottom:3px solid ${o.accent};padding-bottom:12px}.portfolio-footer{border-top:1px solid #d5d8da;margin-top:28px;padding-top:14px;font-size:.8em}.tag{display:inline-block;margin:4px;padding:4px 8px;background:${o.background};border-radius:4px}.lab-result{padding:16px;border:1px solid #d5d8da}.cards,.concept-grid{display:block}.card{border:1px solid #d5d8da;padding:14px;margin:12px 0}.lesson-side{display:none}@media(max-width:600px){.portfolio{padding:12px}.article,.idevice,.experiment-record,.question{padding:14px}h1{font-size:1.65em}table{min-width:540px}}@media print{.portfolio{max-width:none;padding:0}.table-wrap{overflow:visible}table{min-width:0}body{background:white}}
</style></head><body><main class="portfolio">${o.name?`<p class="portfolio-byline">${esc(o.name)}</p>`:''}${content}<footer class="portfolio-footer">Portafoli d’aprenentatge · Tecnologia 3r ESO · Forces i estructures.<br>Còpia de les respostes en el moment de l’exportació. Els registres dels laboratoris virtuals són resultats de models simulats.<br>Material de classe: <a href="https://aagust11.github.io/3tec_sa1/" target="_blank" rel="noopener noreferrer">Forces i estructures</a></footer></main></body></html>`;
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
  const bar=document.createElement('section');bar.className='sites-toolbar';bar.setAttribute('aria-label','Exporta les respostes a Google Sites');bar.innerHTML='<div><strong>Porta les teves respostes al portafoli</strong><p>Copia aquesta pàgina amb els textos i les opcions seleccionades.</p></div><div class="sites-actions"><button class="btn" data-sites-copy>Copia per a Google Sites</button><button class="btn secondary" data-sites-style>Estil i previsualització</button></div><p class="sites-status" role="status"></p>';
  const head=main.querySelector('.page-head');if(head)head.after(bar);else main.prepend(bar);
  bar.querySelector('[data-sites-copy]').onclick=e=>{prefs=options(state.exportStyle);copy(e.target,bar.querySelector('.sites-status'));};bar.querySelector('[data-sites-style]').onclick=e=>open(e.target);
 }
 new MutationObserver(mount).observe(main,{childList:true,subtree:true});mount();
 window.addEventListener('hashchange',()=>{if(dialog.open)dialog.close();});
}
