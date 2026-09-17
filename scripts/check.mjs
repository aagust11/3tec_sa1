import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const course=json('continguts/curs.json'), activities=json('continguts/activitats.json'), questions=json('continguts/preguntes.json');
for (const entries of [course.temes,activities,questions]) {
 assert.equal(new Set(entries.map(x=>x.id)).size,entries.length,'Identificadors duplicats');
 entries.forEach(x=>assert.match(x.id,/^[a-z0-9-]+$/,'Identificador no vàlid'));
}
for(const item of [...course.temes,...activities]) assert.ok(existsSync(item.fitxer),`Falta ${item.fitxer}`);
for(const q of questions){assert.ok(course.temes.some(t=>t.id===q.tema),`Tema desconegut: ${q.tema}`);assert.ok(Array.isArray(q.opcions)&&q.opcions.length>=2);assert.ok(Number.isInteger(q.correcta)&&q.correcta>=0&&q.correcta<q.opcions.length);assert.ok(q.explicacio);}
for(const a of activities) assert.ok(course.temes.some(t=>t.id===a.tema));
console.log(`${course.temes.length} temes, ${activities.length} activitats i ${questions.length} preguntes: estructura correcta.`);
const sessions=json('continguts/sessions.json'), labs=json('continguts/laboratoris.json'), initial=json('continguts/inici/preguntes.json'), photos=json('continguts/galeria.json');
for(const entries of [sessions,labs,initial,photos]) assert.equal(new Set(entries.map(x=>x.id)).size,entries.length);
for(const s of sessions) assert.ok(existsSync(s.fitxer),`Falta ${s.fitxer}`);
for(const q of initial){assert.ok(q.correcta>=0&&q.correcta<q.opcions.length);assert.ok(!questions.some(x=>x.id===q.id),'Diagnòstic i repàs comparteixen ID');}
for(const p of photos){assert.match(p.src,/^https:\/\//);assert.ok(p.autor&&p.font&&p.urlLlicencia&&p.alt);}
const {beamRatio,springExtension,supportReactions}=await import('../js/laboratoris/models.js');
assert.equal(beamRatio({}),1);
assert.equal(beamRatio({height:20}),.125);
assert.equal(beamRatio({width:20}),.5);
assert.equal(beamRatio({length:200}),8);
assert.equal(springExtension(4,2),2);
for(let x=0;x<=100;x+=10){const {left,right}=supportReactions(60,x);assert.ok(Math.abs(left+right-60)<1e-9);assert.ok(Math.abs(right*100-60*x)<1e-9);}
assert.deepEqual(supportReactions(60,0),{left:60,right:0});
assert.deepEqual(supportReactions(60,100),{left:0,right:60});
console.log(`${sessions.length} sessions, ${labs.length} laboratoris, ${initial.length} preguntes inicials i ${photos.length} fotografies: correctes. Models verificats.`);
