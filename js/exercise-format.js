export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function cleanHTML(value){
 const t=document.createElement('template');t.innerHTML=String(value||'');
 const allowed=new Set(['P','DIV','BR','STRONG','B','EM','I','U','UL','OL','LI','H2','H3','BLOCKQUOTE','A','SUB','SUP']);
 function clean(parent){for(const el of [...parent.children]){if(['SCRIPT','STYLE','IFRAME','OBJECT','SVG','MATH','FORM','INPUT','TEXTAREA','SELECT','BUTTON'].includes(el.tagName)){el.remove();continue;}clean(el);if(!allowed.has(el.tagName)){el.replaceWith(...el.childNodes);continue;}const href=el.getAttribute('href');for(const a of [...el.attributes])el.removeAttribute(a.name);if(el.tagName==='A'&&/^(https?:\/\/|mailto:|#)/i.test(href||'')){el.setAttribute('href',href);el.setAttribute('target','_blank');el.setAttribute('rel','noopener');}}}
 clean(t.content);return t.innerHTML;
}
export function normalizeExercise(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('El fitxer no conté un exercici.');
 const id=String(raw.id||'').trim().toUpperCase();if(!/^[A-Z][A-Z0-9_-]{1,39}$/.test(id))throw Error('Identificador: entre 2 i 40 caràcters, començant amb una lletra; lletres, números, guions o guions baixos.');
 const enunciat=cleanHTML(raw.enunciat);const t=document.createElement('div');t.innerHTML=enunciat;if(!t.textContent.trim())throw Error('Escriu un enunciat.');
 const image=raw.imatge||{};if(image.src&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image.src))throw Error('La imatge ha de ser PNG, JPEG o WebP incorporada al fitxer.');
 if((image.src||'').length>4000000)throw Error('La imatge és massa gran. Torna-la a seleccionar a l’editor.');
 return {version:1,id,titol:String(raw.titol||'').trim().slice(0,160),enunciat,solucio:cleanHTML(raw.solucio),mostrarSolucio:raw.mostrarSolucio===true,imatge:image.src?{src:image.src,alt:String(image.alt||'').slice(0,400),width:Math.max(20,Math.min(100,Number(image.width)||70))}:null};
}
export function exerciseBody(e){return `<div class="exercise-statement">${cleanHTML(e.enunciat)}</div>${e.imatge?`<figure class="exercise-image" style="width:${e.imatge.width}%;max-width:100%;margin:20px auto"><img src="${esc(e.imatge.src)}" alt="${esc(e.imatge.alt)}" style="width:100%;height:auto"></figure>`:''}${e.mostrarSolucio===true&&e.solucio&&e.solucio.replace(/<[^>]*>/g,'').trim()?`<details class="exercise-solution"><summary>Consulta la solució</summary><div>${cleanHTML(e.solucio)}</div></details>`:''}`;}
export async function loadExercises(){
 const response=await fetch('llistat-exercicis.json',{cache:'no-cache'});if(!response.ok)throw Error('No s’ha pogut carregar el llistat d’exercicis.');const paths=await response.json();
 const results=await Promise.all(paths.map(async path=>{try{if(!/^exercicis\/[A-Za-z0-9_-]+\.json$/.test(path))throw Error('Nom de fitxer no vàlid.');const r=await fetch(path,{cache:'no-cache'});if(!r.ok)throw Error('No s’ha pogut obrir.');return {...normalizeExercise(await r.json()),file:path};}catch(error){return {file:path,error:error.message};}}));
 const seen=new Set();return results.map(e=>{if(e.error)return e;if(seen.has(e.id))return {file:e.file,error:'Identificador duplicat: '+e.id};seen.add(e.id);return e;}).sort((a,b)=>(a.id||a.file).localeCompare(b.id||b.file,'ca',{numeric:true}));
}

// Keep the existing session and zero padding; advance beyond the largest suffix.
export function nextExerciseID(entries, reference=''){
 const ids=entries.filter(e=>!e.error).map(e=>typeof e==='string'?e:e.id).filter(Boolean);
 const parsed=ids.map(id=>id.match(/^(S\d+E)(\d+)$/i)).filter(Boolean);
 const ref=reference.match(/^(S\d+E)(\d+)$/i);
 parsed.sort((a,b)=>Number(a[1].slice(1,-1))-Number(b[1].slice(1,-1))||Number(a[2])-Number(b[2]));
 const prefix=(ref?.[1]||parsed.at(-1)?.[1]||'S1E').toUpperCase();
 const series=parsed.filter(m=>m[1].toUpperCase()===prefix);
 const width=Math.max(2,...series.map(m=>m[2].length),ref?.[2].length||0);
 let number=Math.max(0,...series.map(m=>Number(m[2])),ref?Number(ref[2]):0)+1;
 let candidate;do{candidate=prefix+String(number++).padStart(width,'0');}while(ids.includes(candidate));
 return candidate;
}
