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
