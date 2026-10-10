// EPI 매뉴얼 화면 캡처 — usage: node capture_epi.js <repoDir> <outDir>
// RTS 매뉴얼 capture.js 와 같은 규격: 1440×900 · DSF 1.25 · _marks.json(번호 배지 % 좌표)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const VW=1440,VH=900,DSF=1.25,PORT=8893;

/* 예제 — 약식: 67점(목표 65) · 1천㎡↑ 의무 5항목 충족 */
const BRIEF=['w1','w2','w3','win1','win2','win4','r1','r2','r3','s1','s2','s3','h1','h2','h3','v1','hv1','hv2','l1','l2','l3','p1','p3','p4','rn1','en2','en3'];
/* 예제 — 정식(별지 제1호서식): [부문, 항목번호, 배점 b] */
const FORMAL=[['arch',1,0.9],['arch',2,0.9],['arch',3,0.8],['arch',5,0.9],['arch',6,1],['arch',7,0.8],
 ['mech',1,0.9],['mech',2,0.8],['mech',4,0.8],['mech',7,1],['mech',13,1],['mech',15,0.8],
 ['elec',1,0.8],['elec',2,1],['elec',4,1],['elec',5,1],['elec',6,1],['elec',8,0.8],['elec',10,0.8],
 ['renew',1,1]];

const SHOTS=[
 {id:'s01_overview',tab:'main',clip:'viewport',m:[['.tab-bar-inner','작업 탭'],['.sum-bar','요약 스트립'],['#scorePanelCard','EPI 총점 패널'],['#projName','공사 정보'],['#selBldType','기본 설정'],['#sectionTabs','부문 탭'],['.help-fab','이용안내']]},
 {id:'s02_tabs',tab:'main',clip:'.app-header',m:[['.tb:nth-child(1)','EPI 점수 산정'],['.tb:nth-child(2)','정식 산정'],['.tb:nth-child(3)','A4 검토서'],['.tb-win','별지서식 산정서'],['.tb-manual','매뉴얼'],['.hdr-right','근거 고시']]},
 {id:'s03_config',tab:'main',clip:'.main-wrap',cropTo:['#projName','#regionInfo'],pad:16,m:[['#projName','공사명'],['#projAuthor','작성자'],['#projDate','작성일'],['#selBldType','건물 용도'],['#selRegion','기후대'],['#selOrgType','기관 구분'],['#floorArea','연면적'],['#targetBanner','목표점 배너']]},
 {id:'s04_items',tab:'main',clip:'.main-wrap',cropTo:['#sectionTabs','#item-s2'],pad:16,maxH:1500,m:[['#sectionTabs','부문 탭'],['#item-w1','항목 체크'],['#item-w1 .pts-badge','배점'],['#item-s2 .mand-badge','의무 배지']]},
 {id:'s05_score',tab:'main',clip:'#scorePanelCard',m:[['#totalScore','EPI 총점'],['#verdict','판정'],['#bdBreak','부문별 점수'],['#mandatoryList','의무항목 현황']]},
 {id:'s06_mech',tab:'main',pre:"document.querySelector('.stab[data-sec=mech]').click()",clip:'.main-wrap',cropTo:['#sectionTabs','#sec-mech'],pad:16,maxH:1100,m:[['.stab[data-sec=mech]','기계설비'],['#item-h1','기계 1번'],['#item-v1','기계 6번']]},
 {id:'s07_formal_top',tab:'formal',clip:'#epi6-root',maxH:1200,m:[['#epi6-root .f6-no-print','이용방법'],['#epi6-root select','기본배점 구분'],['text:지역 (별표1 기후지역)','지역'],['text:연면적 합계','연면적'],['text:공공기관 건축물','적용 조건']]},
 {id:'s08_formal_result',tab:'formal',clip:'box:EPI 산정 결과',m:[['text~EPI 평점 합계','평점 합계'],['text~건축부문','부문별 소계'],['text~의무사항','의무사항'],['th','의무 판정표']]},
 {id:'s09_formal_items',tab:'formal',clip:'box:건축부문 — 배점',maxH:980,m:[['.f6-epi-a','기본배점 a'],['.f6-epi-sel select','배점 b 선택'],['.f6-epi-pt','평점 a×b'],['.f6-mand-badge','의무 표시']]},
 {id:'s10_print',tab:'print',clip:'viewport',m:[['.mm-btn-print','약식 검토서 출력'],['.mm-btn-formal','별지서식 산정서 출력'],['#btn-jpg','JPG 저장'],['#a4Sheet,.a4-page','A4 미리보기']]},
 {id:'s11_help',tab:'main',clip:'viewport',pre:'toggleModal()',post:'toggleModal()',m:[]},
];

srv0();
async function srv0(){
 const s=await server(repo,PORT);
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block'});await setup(ctx,repo);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(()=>{window.alert=()=>{};window.confirm=()=>true;try{localStorage.clear()}catch(e){}});
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(2500);
 // 공사 정보·작성일 고정(결과 재현성)
 await pg.evaluate(()=>{const d=document.getElementById('projDate');if(d){d.value='2026-10-10';d.dispatchEvent(new Event('input',{bubbles:true}));d.dispatchEvent(new Event('change',{bubbles:true}));}});
 await pg.evaluate(ids=>{ids.forEach(id=>toggleItem(id));},BRIEF);
 await pg.waitForTimeout(400);
 const brief=await pg.evaluate(()=>({score:document.getElementById('totalScore').textContent,verdict:document.getElementById('sb-verdict').textContent,mand:document.getElementById('mandatoryList').innerText}));
 // 정식 탭 배점 입력 (React select — native setter + change)
 await pg.evaluate(()=>goTab('formal'));await pg.waitForTimeout(1200);
 const fset=await pg.evaluate(F=>{
   const SEC=['arch','mech','elec','renew'];const rows=[...document.querySelectorAll('#epi6-root .f6-epi-row')];
   let si=-1,prev=99;const map={};rows.forEach(r=>{const no=+r.querySelector('.f6-epi-no').textContent;if(no<=prev&&no===1)si++;prev=no;map[SEC[si]+'-'+no]=r;});
   const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;const log=[];
   F.forEach(([s,no,b])=>{const r=map[s+'-'+no];const el=r&&r.querySelector('select');if(!el){log.push('x '+s+no);return;}
     const opt=[...el.options].find(o=>Math.abs(parseFloat(o.textContent)-b)<1e-6&&o.textContent.includes('점'))||[...el.options].find(o=>o.value===String(b));
     if(!opt){log.push('noopt '+s+no+' '+[...el.options].map(o=>o.value).join('|'));return;}
     setter.call(el,opt.value);el.dispatchEvent(new Event('change',{bubbles:true}));});
   return log;},FORMAL);
 await pg.waitForTimeout(800);
 const formal=await pg.evaluate(()=>{const t=document.querySelector('#epi6-root').innerText;const m=t.match(/EPI 평점 합계[\s\S]{0,80}/);return m?m[0].replace(/\s+/g,' '):'';});
 const meta={};
 for(const S of SHOTS){
  await pg.evaluate(t=>{goTab(t);window.scrollTo(0,0);},S.tab);await pg.waitForTimeout(700);
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||500);
  const info=await pg.evaluate(({S,VW,VH})=>{
   const vis=e=>e&&e.getClientRects().length>0;
   const find=sel=>{if(sel.startsWith('text~')){const t=sel.slice(5);const els=[...document.querySelectorAll('div,span,b,strong,td,th,label')].filter(e=>vis(e)&&e.textContent.includes(t));return els.sort((a,b)=>a.textContent.length-b.textContent.length)[0]||null;}
     if(sel.startsWith('box:')){const t=sel.slice(4);const h=[...document.querySelectorAll('.f6-box-hd')].find(e=>e.textContent.includes(t));return h?h.parentElement:null;}
     if(sel.startsWith('text:')){const t=sel.slice(5);const els=[...document.querySelectorAll('button,label,span,div,th,td,a,b,strong,h2,h3,p')].filter(e=>vis(e)&&e.textContent.trim().startsWith(t));return els.sort((a,b)=>a.textContent.length-b.textContent.length)[0]||null;}
     for(const s of sel.split(',')){const e=document.querySelector(s);if(vis(e))return e;}return null;};
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=find(S.clip);if(!el)return {err:'clip '+S.clip};const a=abs(el);clip={x:a.x,y:a.y,width:a.w,height:a.h};
     if(S.cropTo){const e1=find(S.cropTo[0]),e2=find(S.cropTo[1]);if(e1&&e2){const a1=abs(e1),a2=abs(e2);const p=S.pad||0;
       const top=Math.min(a1.y,a2.y)-p-60;const bot=Math.max(a1.y+a1.h,a2.y+a2.h)+p;clip.y=Math.max(clip.y,top);clip.height=bot-clip.y;
       const cardOf=e=>e.closest('.card,.f6-card,section')||e;const c1=abs(cardOf(e1));clip.x=Math.max(clip.x,c1.x-p);clip.width=Math.min(a.x+a.w,c1.x+c1.w+p)-clip.x;}}
     if(S.maxH&&clip.height>S.maxH)clip.height=S.maxH;}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=find(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(a.w/clip.width*100).toFixed(2),h:+(a.h/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);continue;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(cl.height),marks:info.marks};
  if(S.post){try{await pg.evaluate(S.post);}catch(e){}}
 }
 // 별지서식 산정서 별도창 (?view=formal — 스냅샷 공유)
 const p2=await ctx.newPage();await p2.goto(`http://127.0.0.1:${PORT}/index.html?view=formal`);await p2.waitForTimeout(2500);
 await p2.screenshot({path:path.join(out,'s12_formal_win.png'),clip:{x:0,y:0,width:VW,height:VH}});meta['s12_formal_win']={w:VW,h:VH,marks:[]};
 // 모바일 2장
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true});await setup(mctx,repo);
 const mp=await mctx.newPage();await mp.addInitScript(()=>{window.alert=()=>{};window.confirm=()=>true;});
 await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForTimeout(2500);await mp.evaluate(ids=>{ids.forEach(id=>toggleItem(id));},BRIEF);await mp.waitForTimeout(400);
 await mp.screenshot({path:path.join(out,'s13_mobile_main.png')});meta['s13_mobile_main']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{const el=document.getElementById('sectionTabs');window.scrollTo(0,el.getBoundingClientRect().top+scrollY-120);});await mp.waitForTimeout(500);
 await mp.screenshot({path:path.join(out,'s14_mobile_items.png')});meta['s14_mobile_items']={w:390,h:844,marks:[]};
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(meta,null,1));
 fs.writeFileSync(path.join(out,'_example.json'),JSON.stringify({brief,formal,fset},null,1));
 console.log(JSON.stringify({brief,formal,fset,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
}
