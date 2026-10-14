import {createServer} from 'node:http';
import {readFile,readdir} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('.'),types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg'};
createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://local').pathname);if(path==='/llistat-exercicis.json'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify((await readdir('exercicis')).filter(f=>f.endsWith('.json')).map(f=>'exercicis/'+f)));return;}const f=resolve(root,'.'+(path.endsWith('/')?path+'index.html':path));if(!f.startsWith(root+sep))throw Error();res.setHeader('Content-Type',types[extname(f)]||'application/octet-stream');res.end(await readFile(f));}catch{res.writeHead(404);res.end('Not found');}}).listen(8000,()=>console.log('http://localhost:8000'));
