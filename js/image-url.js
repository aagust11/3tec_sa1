export function imageURL(value){
 try { const url=new URL(String(value||'').trim());return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:''; } catch { return ''; }
}
