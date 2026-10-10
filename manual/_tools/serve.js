// 공용: 저장소를 로컬 서버로 띄우고 CDN·구글폰트를 로컬 파일로 대체
const http=require('http'),fs=require('fs'),path=require('path');
const V='/home/claude/epi/vendor';
const MAP={'react.production.min.js':V+'/react-18.2.0/umd/react.production.min.js','react-dom.production.min.js':V+'/react-dom-18.2.0/umd/react-dom.production.min.js','babel.min.js':V+'/babel-standalone-7.23.5/babel.min.js','html2canvas.min.js':V+'/html2canvas-1.4.1/dist/html2canvas.min.js'};
const F=(p)=>'data:font/woff2;base64,'+fs.readFileSync(p).toString('base64');
const fo=(pkg,f)=>V+'/'+fs.readdirSync(V).find(d=>d.startsWith('fontsource-'+pkg+'-')&&!d.endsWith('.tgz'))+'/files/'+f;
function fontCSS(repo){return `@font-face{font-family:'Noto Sans KR';src:url(${F(repo+'/assets/fonts/NotoSansKR-var.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:'Orbitron';src:url(${F(fo('orbitron','orbitron-latin-700-normal.woff2'))});font-weight:700}
@font-face{font-family:'Orbitron';src:url(${F(fo('orbitron','orbitron-latin-900-normal.woff2'))});font-weight:900}
@font-face{font-family:'JetBrains Mono';src:url(${F(fo('jetbrains-mono','jetbrains-mono-latin-400-normal.woff2'))});font-weight:400}
@font-face{font-family:'JetBrains Mono';src:url(${F(fo('jetbrains-mono','jetbrains-mono-latin-600-normal.woff2'))});font-weight:600}
@font-face{font-family:'JetBrains Mono';src:url(${F(fo('jetbrains-mono','jetbrains-mono-latin-700-normal.woff2'))});font-weight:700}
@font-face{font-family:'DM Mono';src:url(${F(fo('dm-mono','dm-mono-latin-400-normal.woff2'))});font-weight:400}
@font-face{font-family:'DM Mono';src:url(${F(fo('dm-mono','dm-mono-latin-500-normal.woff2'))});font-weight:500}`;}
async function setup(ctx,repo){
  const css=fontCSS(repo);
  await ctx.route(/fonts\.googleapis\.com\/css/, r=>r.fulfill({status:200,contentType:'text/css',body:css}));
  await ctx.route(/cdnjs\.cloudflare\.com/, r=>{const n=r.request().url().split('/').pop();const f=MAP[n];f?r.fulfill({status:200,contentType:'application/javascript',body:fs.readFileSync(f)}):r.abort();});
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)(?!cdnjs)(?!fonts\.googleapis)/, r=>r.abort());
}
function server(repo,port){return new Promise(res=>{const s=http.createServer((q,w)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';
 fs.readFile(path.join(repo,p),(e,d)=>{if(e){w.writeHead(404);w.end();return;}const ext=path.extname(p);const ct={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.pdf':'application/pdf'}[ext]||'application/octet-stream';w.writeHead(200,{'Content-Type':ct});w.end(d);});});s.listen(port,()=>res(s));});}
module.exports={setup,server};
