import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
const root=resolve('.');
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{const pathname=new URL(req.url,'http://local').pathname;const file=resolve(root,'.'+decodeURIComponent(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(root+sep))throw Error('Ruta');const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
let browser;
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1050}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.url());});
 async function go(hash,selector){await page.goto(base+'/#'+hash);await page.locator(selector).first().waitFor();}
 await mkdir('test-output',{recursive:true});
 await go('inici','.hero');await page.screenshot({path:'test-output/inici.png',fullPage:true});
 await page.locator('.hero .btn').click();await page.locator('#entry-quiz').waitFor();
 await page.locator('#note').fill('Penso que una diagonal evita que canviïn els angles.');await page.locator('.answer').first().click();await page.reload();await page.locator('#entry-quiz').waitFor();assert.equal(await page.locator('#entry-quiz .question').count(),5);assert.match(await page.locator('#note').inputValue(),/diagonal/);assert.ok(await page.locator('.answer').first().isDisabled());
 await go('basics','#entry-quiz');assert.equal(await page.locator('#entry-quiz .question').count(),3);
 const sessions=JSON.parse(await readFile('continguts/sessions.json','utf8'));
 await go('sessions','.session-card');assert.equal(await page.locator('.session-card').count(),12);
 for(const s of sessions){await go('sessio/'+s.id,'#session-done');assert.ok((await page.locator('.session-steps li').count())>=4);}
 await page.locator('#session-done').check();await page.locator('#note').fill('Ara puc justificar la meva resposta.');
 for(const id of ['forces','triangulacio','estabilitat','flexio','molles','suports']){
  await go('laboratori/'+id,'#record-trial');await page.locator('#prediction').fill('La variable modificarà el resultat.');await page.locator('#record-trial').click();assert.equal(await page.locator('#trials tbody tr').count(),1);await page.locator('#conclusion').fill('Ho justifico amb la prova registrada.');await page.reload();await page.locator('#record-trial').waitFor();assert.equal(await page.locator('#trials tbody tr').count(),1);assert.match(await page.locator('#prediction').inputValue(),/variable/);
 }
 await go('laboratori/flexio','#height');await page.locator('#height').fill('20');assert.match(await page.locator('.lab-result').textContent(),/0.13/);await page.locator('#record-trial').click();assert.equal(await page.locator('#trials tbody tr').count(),2);await page.locator('#reset-controls').click();assert.equal(await page.locator('#height').inputValue(),'10');assert.equal(await page.locator('#trials tbody tr').count(),2);await page.screenshot({path:'test-output/laboratori.png',fullPage:true});
 await go('laboratori/suports','#position');await page.locator('#position').fill('0');assert.match(await page.locator('.lab-result').textContent(),/60.0 \+ 0.0/);
 await go('quadern','#export');assert.match(await page.locator('main').textContent(),/Ho justifico amb la prova/);const event=page.waitForEvent('download');await page.locator('#export').click();const download=await event;await download.saveAs('test-output/quadern.txt');assert.match(await readFile('test-output/quadern.txt','utf8'),/PROVES \(MODEL SIMULAT\)/);
 await go('repas','#quiz');assert.equal(await page.locator('#quiz .question').count(),24);await page.locator('#retry-all').click();await go('previ','#entry-quiz');assert.ok(await page.locator('.answer').first().isDisabled(),'El repàs no ha d’esborrar el diagnòstic');
 await go('galeria','.photo-card');assert.equal(await page.locator('.photo-card').count(),3);await page.screenshot({path:'test-output/galeria.png',fullPage:true});
 for(const width of [390,768]){
  await page.setViewportSize({width,height:844});
  for(const [route,selector] of [['inici','.hero'],['sessions','.session-card'],['sessio/punt-partida','#note'],['basics','#entry-quiz'],['laboratori/flexio','#height'],['quadern','#export'],['galeria','.photo-card']]){await go(route,selector);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Desbordament ${width}: ${route}`);}
  await go('inici','.hero');await page.screenshot({path:`test-output/inici-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('OK: sessions, diagnòstic preservat, models, registre persistent, exportació i disseny adaptable.');
}finally{await browser?.close();server.close();}
