import {state,save} from './storage.js';
export async function mountDevices(root,esc){
 const nodes=[...root.querySelectorAll('[data-task]')];if(!nodes.length)return;
 const response=await fetch('continguts/exercicis.json');if(!response.ok)throw Error('No s’han pogut carregar els exercicis.');const tasks=await response.json();
 for(const [n,node] of nodes.entries()){
  const id=node.dataset.task,t=tasks[id];if(!t)throw Error('Exercici desconegut: '+id);
  const options=[...new Set(t.files.map(r=>r.resposta))].sort((a,b)=>a.localeCompare(b,'ca'));
  const stored=state.practice[id]||{};
  node.innerHTML=`<p>${esc(t.instruccio)}</p><div class="task-rows">${t.files.map((r,i)=>`<div class="task-row"><label for="task-${n}-${i}">${i+1}. ${esc(r.text)}</label><select id="task-${n}-${i}" data-row="${i}"><option value="">Tria una resposta…</option>${options.map(v=>`<option ${stored.values?.[i]===v?'selected':''}>${esc(v)}</option>`).join('')}</select><p class="task-feedback" hidden></p></div>`).join('')}</div><div class="toolbar"><button class="btn check-task">Comprova</button><button class="btn secondary retry-task">Torna a intentar-ho</button></div><p class="task-score" role="status"></p>`;
  const fields=[...node.querySelectorAll('select')];
  function persist(checked=false){state.practice[id]={values:fields.map(f=>f.value),checked};save();}
  function feedback(){let count=0;node.querySelectorAll('.task-row').forEach((row,i)=>{const correct=fields[i].value===t.files[i].resposta;count+=Number(correct);const p=row.querySelector('.task-feedback');p.hidden=false;p.textContent=(correct?'✓ Correcte. ':fields[i].value?'Revisa-ho. ':'Falta respondre. ')+t.files[i].explicacio;row.classList.toggle('task-correct',correct);});node.querySelector('.task-score').textContent=`${count} de ${fields.length} relacions correctes. Pots revisar les respostes i tornar a comprovar-les.`;}
  fields.forEach(f=>f.onchange=()=>{persist(false);node.querySelectorAll('.task-feedback').forEach(p=>p.hidden=true);node.querySelectorAll('.task-row').forEach(r=>r.classList.remove('task-correct'));node.querySelector('.task-score').textContent='Resposta desada. Comprova quan estiguis a punt.';});
  node.querySelector('.check-task').onclick=()=>{persist(true);feedback();};
  node.querySelector('.retry-task').onclick=()=>{fields.forEach(f=>f.value='');persist(false);node.querySelectorAll('.task-feedback').forEach(p=>p.hidden=true);node.querySelectorAll('.task-row').forEach(r=>r.classList.remove('task-correct'));node.querySelector('.task-score').textContent='Pots tornar a començar.';fields[0].focus();};
  if(stored.checked)feedback();
 }
}
