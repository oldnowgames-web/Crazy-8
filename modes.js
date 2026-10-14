(()=>{
const $=id=>document.getElementById(id);
const ORD=[0,6,12,10,11,5,4,3,2,1],PT={0:11,6:10,12:4,10:3,11:2};
let RUN=0;
const CW=()=>Math.max(46,Math.min(innerWidth*.15,innerHeight*.125,118));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const z=async(id,ms)=>{await sleep(ms);if(id!==RUN)throw 'stop'};
const deck40=()=>{const d=[];for(let r=0;r<13;r++){if(r>6&&r<10)continue;for(const u of SUITS)d.push({r,u})}return shuffle(d)};
const srt=(h,o)=>h.sort((a,b)=>SUITS.indexOf(a.u)-SUITS.indexOf(b.u)||(o?ORD.indexOf(a.r)-ORD.indexOf(b.r):a.r-b.r));
const img=(c,w)=>{const i=new Image();i.src=c?src(c):IMG[back+'_backing'];i.style.cssText=`width:${w}px;border-radius:6px;filter:drop-shadow(0 3px 4px #000a)`;return i};
const set=(id,els)=>{const e=$(id);e.innerHTML='';[].concat(els).forEach(x=>e.appendChild(x))};
const banner=(t,k)=>{const b=$('tgb');b.textContent=t;b.className='bn '+(k||'me')};
const btns=l=>set('tgx',l.map(([t,f])=>{const b=document.createElement('button');b.textContent=t;b.onclick=f;return b}));
const menu=()=>{RUN++;stopConfetti();$('tg').hidden=true;showModes()};
function hand(el,cs,pick,ok){
  const n=cs.length,w=Math.min(CW(),(innerWidth-40)/(1+(n-1)*.55));
  set(el,cs.map((c,i)=>{const m=img(c,w);if(i)m.style.marginLeft=-w*.45+'px';
    if(pick){if(!ok||ok(c)){m.style.cursor='pointer';m.style.filter='drop-shadow(0 0 7px #ffd24a) drop-shadow(0 3px 4px #000a)';m.onclick=()=>pick(c)}else m.style.filter='brightness(.55)'}
    return m}));
}
function opps(list){set('tgo',list.map(([n,k])=>{const d=document.createElement('div');d.className='opp2';d.innerHTML=`<div class="label">${n}</div>`;
  const r=document.createElement('div');r.className='row';const w=Math.max(18,Math.min(CW()*.55,(innerWidth/list.length-24)/(1+(k-1)*.45)));
  for(let i=0;i<k;i++){const m=img(null,w);if(i)m.style.marginLeft=-w*.55+'px';r.appendChild(m)}d.appendChild(r);return d}))}
function fig(label,c,w,fn){const f=document.createElement('div');f.className='fg';if(c){const m=img(c,w);if(fn){m.style.cursor='pointer';m.style.filter='drop-shadow(0 0 8px #ffd24a)';m.onclick=fn}f.appendChild(m)}else if(fn){const m=img(null,w);m.style.cursor='pointer';m.style.filter='drop-shadow(0 0 8px #ffd24a)';m.onclick=fn;f.appendChild(m)}
  f.appendChild(document.createTextNode(label));return f}
async function run(title,again,fn){
  RUN++;const id=RUN;stopConfetti();hideAll();$('tg').hidden=false;$('tgt').textContent=title;$('tgf').dataset.t=title.toUpperCase();$('tgr').onclick=again;
  set('tgo',[]);set('tgc',[]);set('tgx',[]);set('tgp',[]);$('tgs').textContent='';
  try{await fn(id)}catch(e){if(e!=='stop')throw e}
}
$('tgm').onclick=menu;
function over(win,txt,again){banner(txt,win?'me':'cpu');snd(win?'win':'lose');if(win)confetti();btns([['Jogar de novo',again],['Menu',menu]])}

// ---------- Bisca e Sueca
let S;
const str=(c,lu)=>c.u===S.trump.u?200-ORD.indexOf(c.r):c.u===lu?100-ORD.indexOf(c.r):0;
const winner=t=>{const lu=t[0].c.u;return t.reduce((b,x)=>str(x.c,lu)>str(b.c,lu)?x:b).s};
const legal=s=>{const h=S.H[s];if(S.mode==='sueca'&&S.tab.length){const lu=S.tab[0].c.u,f=h.filter(c=>c.u===lu);if(f.length)return f}return h};
function sDraw(){
  const nm=S.n===4?['Adversário 1','Parceiro','Adversário 2']:['CPU'];
  opps(nm.map((n,i)=>[n,S.H[i+1].length]));
  set('tgc',S.tab.map(x=>fig(x.s?nm[x.s-1]:'Você',x.c,CW())));
  set('tgx',[fig('Trunfo '+SYM[S.trump.u]+(S.mode==='bisca'?' · monte '+S.deck.length:''),S.mode==='sueca'||S.deck.length?S.trump:null,CW()*.8)]);
  hand('tgp',S.H[0],null);
  $('tgs').textContent=S.n===4?`Sua dupla ${S.pts[0]} x ${S.pts[1]}`:`Você ${S.pts[0]} x ${S.pts[1]} CPU`;
}
function cpuPick(s){
  const L=legal(s),lu=S.tab[0]&&S.tab[0].c.u,tr=S.trump.u;
  const cost=c=>(c.u===tr?100:0)+(PT[c.r]||0)*3+(10-ORD.indexOf(c.r))*.1;
  const cs=[...L].sort((a,b)=>cost(a)-cost(b));
  if(!S.tab.length)return cs[0];
  const w=winner(S.tab),best=S.tab.find(x=>x.s===w).c,tp=S.tab.reduce((a,x)=>a+(PT[x.c.r]||0),0);
  if(S.n===4&&w%2===s%2){const nt=L.filter(c=>c.u!==tr);return[...(nt.length?nt:L)].sort((a,b)=>(PT[b.r]||0)-(PT[a.r]||0))[0]}
  const win=cs.filter(c=>str(c,lu)>str(best,lu));
  return win.length&&(tp>0||(cost(win[0])<100&&Math.random()<.5))?win[0]:cs[0];
}
function trick(mode){
  const n=mode==='sueca'?4:2;
  return run(mode==='sueca'?'Sueca':'Bisca',()=>trick(mode),async id=>{
    const d=deck40(),per=mode==='sueca'?10:3;
    S={mode,n,H:Array.from({length:n},()=>d.splice(0,per)),deck:d,tab:[],pts:[0,0]};
    S.trump=mode==='sueca'?S.H[n-1][per-1]:d[0];
    S.H.forEach(h=>srt(h,true));snd('shuffle');sDraw();
    let lead=0;
    while(S.H.some(h=>h.length)){
      S.tab=[];
      for(let k=0;k<n;k++){
        const s=(lead+k)%n;let c;
        if(s){banner(S.n===4?'Vez de '+(s===2?'seu parceiro':'um adversário'):'Vez da CPU','cpu');await z(id,800);c=cpuPick(s)}
        else{banner('Sua vez','me');const L=legal(0);c=await new Promise(r=>hand('tgp',S.H[0],r,x=>L.includes(x)))}
        S.H[s].splice(S.H[s].indexOf(c),1);S.tab.push({s,c});snd('card');sDraw();await z(id,600);
      }
      const w=winner(S.tab);S.pts[w%2]+=S.tab.reduce((a,x)=>a+(PT[x.c.r]||0),0);
      banner(w===0?'Você levou a vaza':(n===4&&w===2?'Seu parceiro levou a vaza':'Vaza para '+(n===4?'os adversários':'a CPU')),w%2?'cpu':'me');
      sDraw();await z(id,1200);lead=w;S.tab=[];
      if(mode==='bisca')for(let k=0;k<n;k++){const c=S.deck.pop();if(c){S.H[(w+k)%n].push(c);if((w+k)%n===0)srt(S.H[0],true)}}
      sDraw();
    }
    const a=S.pts[0],b=S.pts[1];
    over(a>b,a>b?`Você venceu por ${a} a ${b}!`:a===b?'Empate em 60 a 60':`Você perdeu por ${a} a ${b}`,()=>trick(mode));
  });
}

// ---------- Truco
const NM={1:'TRUCO',3:'SEIS',6:'NOVE',9:'DOZE'};
const TP=c=>c.r===3&&c.u==='clubs'?14:c.r===6&&c.u==='hearts'?13:c.r===0&&c.u==='spades'?12:c.r===6&&c.u==='diamonds'?11:({2:10,1:9,0:8,12:7,10:6,11:5,6:4,5:3,4:2,3:1})[c.r];
let T;
function hw(r){
  const n=r.length,c=s=>r.filter(x=>x===s).length;
  if(c(0)>1)return 0;if(c(1)>1)return 1;
  if(n===2&&r[0]<0&&r[1]>=0)return r[1];
  if(n===2&&r[1]<0&&r[0]>=0)return r[0];
  if(n===3)return r[2]>=0?r[2]:r[0]>=0?r[0]:0;
  return -1;
}
function tDraw(){
  opps([['CPU',T.H[1].length]]);
  set('tgc',[T.tab[1]&&fig('CPU',T.tab[1],CW()),T.tab[0]&&fig('Você',T.tab[0],CW())].filter(Boolean));
  hand('tgp',T.H[0],null);
  $('tgs').textContent=`Você ${T.sc[0]} x ${T.sc[1]} CPU · vale ${T.val}`;
}
const ask=(msg,labels)=>{banner(msg,'draw');return new Promise(r=>btns(labels.map((l,i)=>[l,()=>{btns([]);r(i)}])))};
async function raise(by,id){
  const nv=T.val===1?3:T.val+3,o=by^1;T.last=by;btns([]);
  banner((by?'CPU pede ':'Você pede ')+NM[T.val]+'!','draw');await z(id,900);
  let r;
  if(o){const s=T.H[1].reduce((a,c)=>a+TP(c),0)/T.H[1].length;r=s>=10.5&&nv<12&&Math.random()<.5?2:(s>=6.5||Math.random()<.2)?0:1}
  else r=await ask('CPU pede '+NM[T.val]+'! O que você faz?',['Aceitar','Correr',...(nv<12?['Pedir '+NM[nv]]:[])]);
  if(r===1){T.done=by;banner(o?'CPU correu':'Você correu','draw');await z(id,1100);return}
  T.val=nv;tDraw();banner((o?'CPU aceitou':'Você aceitou')+' · vale '+nv,'draw');await z(id,900);
  if(r===2)await raise(o,id);
}
function meT(id){return new Promise(res=>{
  const show=()=>{banner('Sua vez','me');hand('tgp',T.H[0],res);
    btns(T.last!==0&&T.val<12?[[NM[T.val]+'!',async()=>{await raise(0,id);if(T.done>=0)return res(null);show()}]]:[])};
  show()})}
async function cpuT(id){
  await z(id,800);const h=T.H[1],s=h.reduce((a,c)=>a+TP(c),0)/h.length;
  if(T.last!==1&&T.val<12&&s>=9&&Math.random()<.35){await raise(1,id);if(T.done>=0)return null}
  const so=[...h].sort((a,b)=>TP(a)-TP(b)),o=T.tab[0];
  if(!o)return s>=8?so[so.length-1]:so[0];
  return so.find(c=>TP(c)>TP(o))||so[0];
}
async function tHand(id){
  const d=deck40();T.H=[d.splice(0,3),d.splice(0,3)];T.val=1;T.last=-1;T.done=-1;T.tab=[];
  let lead=T.mao;T.mao^=1;const res=[];snd('shuffle');tDraw();
  for(let v=0;v<3&&T.done<0;v++){
    T.tab=[];
    for(let k=0;k<2&&T.done<0;k++){
      const s=(lead+k)%2;if(s)banner('Vez da CPU','cpu');
      const c=s?await cpuT(id):await meT(id);if(T.done>=0)break;
      T.H[s].splice(T.H[s].indexOf(c),1);T.tab[s]=c;snd('card');btns([]);tDraw();await z(id,700);
    }
    if(T.done>=0)break;
    const a=TP(T.tab[0]),b=TP(T.tab[1]),r=a>b?0:b>a?1:-1;res.push(r);
    banner(r<0?'Vaza empatada':r?'CPU levou a vaza':'Você levou a vaza',r===0?'me':'cpu');await z(id,1200);
    const w=hw(res);if(w!==-1){T.done=w;break}
    if(r>=0)lead=r;
  }
  T.sc[T.done]=Math.min(12,T.sc[T.done]+T.val);btns([]);tDraw();
  banner((T.done?'CPU fez ':'Você fez ')+T.val+(T.val>1?' pontos':' ponto'),T.done?'cpu':'me');await z(id,1700);
}
function truco(){
  return run('Truco',truco,async id=>{
    T={sc:[0,0],mao:0,val:1,H:[[],[]],tab:[]};
    while(T.sc[0]<12&&T.sc[1]<12)await tHand(id);
    over(T.sc[0]>=12,T.sc[0]>=12?'Você venceu o Truco!':'A CPU venceu o Truco',truco);
  });
}

// ---------- Pife
function melds(cs){
  const f=cs[0],out=[],idx=cs.map((_,i)=>i);
  const o=idx.filter(i=>i&&cs[i].r===f.r&&cs[i].u!==f.u);
  for(let m=1;m<(1<<o.length);m++){const p=o.filter((_,b)=>m>>b&1);
    if(p.length>=2&&p.length<=3&&new Set([f.u,...p.map(i=>cs[i].u)]).size===p.length+1)out.push([0,...p])}
  for(let s=1;s<=12;s++)for(let L=3;s+L-1<=14;L++){
    const used=[];let ok=true;
    for(let v=s;v<s+L;v++){const i=idx.find(i=>cs[i].u===f.u&&!used.includes(i)&&(cs[i].r+1===v||(v===14&&cs[i].r===0)));if(i===undefined){ok=false;break}used.push(i)}
    if(ok&&used.includes(0))out.push(used);
  }
  return out;
}
const can=cs=>!cs.length||melds(cs).some(m=>can(cs.filter((_,i)=>!m.includes(i))));
const wins=h=>h.some((_,i)=>can(h.filter((_,j)=>j!==i)));
const use=(c,h)=>h.reduce((a,o)=>o===c?a:a+(o.r===c.r&&o.u!==c.u?2:o.u===c.u&&Math.abs(o.r-c.r)<=2?(Math.abs(o.r-c.r)===1?2:1):0),0);
function pife(){
  return run('Pife',pife,async id=>{
    const d=[];for(let k=0;k<2;k++)for(let r=0;r<13;r++)for(const u of SUITS)d.push({r,u});shuffle(d);
    const P={H:[d.splice(0,9),d.splice(0,9)],deck:d,disc:[d.pop()]};
    const dr=()=>{if(!P.deck.length){const t=P.disc.pop();P.deck=shuffle(P.disc);P.disc=[t]}return P.deck.pop()};
    const draw=act=>{opps([['CPU',P.H[1].length]]);
      set('tgc',[fig('Monte',null,CW(),act&&(()=>act(0))),fig('Mesa',P.disc[P.disc.length-1],CW(),act&&(()=>act(1)))]);hand('tgp',P.H[0],null)};
    srt(P.H[0]);snd('shuffle');draw(null);
    for(;;){
      banner('Sua vez: compre do monte ou da mesa','me');
      const t=await new Promise(r=>draw(r));
      P.H[0].push(t?P.disc.pop():dr());srt(P.H[0]);snd('draw');draw(null);
      if(wins(P.H[0]))return over(true,'Você bateu! Todas as cartas em jogos.',pife);
      banner('Descarte uma carta','me');
      const x=await new Promise(r=>hand('tgp',P.H[0],r));
      P.H[0].splice(P.H[0].indexOf(x),1);P.disc.push(x);snd('card');draw(null);
      banner('Vez da CPU','cpu');await z(id,1000);
      const h=P.H[1],tk=use(P.disc[P.disc.length-1],h)>=3;
      h.push(tk?P.disc.pop():dr());snd('draw');banner('CPU comprou '+(tk?'da mesa':'do monte'),'cpu');draw(null);await z(id,900);
      if(wins(h))return over(false,'A CPU bateu!',pife);
      const dc=h.reduce((b,c)=>use(c,h)<use(b,h)?c:b);
      h.splice(h.indexOf(dc),1);P.disc.push(dc);snd('card');draw(null);await z(id,600);
    }
  });
}

// ---------- Buraco
const cp=c=>c.r===0?15:c.r===1?20:c.r<=6?5:10;
const bv=c=>c.r+1;
function vSeq(cs){
  if(cs.length<3)return null;
  for(const u of SUITS){
    const nat=cs.filter(c=>c.u===u),oth=cs.filter(c=>c.u!==u);
    if(!nat.length||oth.length>1||oth.some(c=>c.r!==1))continue;
    for(const hi of [0,1]){
      const val=c=>c.r===0&&hi?14:c.r+1,ns=[...nat].sort((a,b)=>val(a)-val(b)),vs=ns.map(val);
      if(new Set(vs).size!==vs.length)continue;
      let gaps=0;for(let i=1;i<vs.length;i++)gaps+=vs[i]-vs[i-1]-1;
      const w=oth.length;if(gaps>w||w-gaps>(vs[0]-1)+(14-vs[vs.length-1]))continue;
      const arr=[];let left=[...oth];
      ns.forEach((c,i)=>{arr.push(c);if(i<ns.length-1&&vs[i+1]-vs[i]>1&&left.length)arr.push(left.pop())});
      if(left.length){if(14-vs[vs.length-1]>0)arr.push(left.pop());else arr.unshift(left.pop())}
      return{cards:arr,type:'seq',wild:w};
    }
  }
  return null;
}
const vSet=cs=>cs.length>=3&&cs.every(c=>c.r===cs[0].r)?{cards:cs,type:'set',wild:0}:null;
const vald=cs=>vSeq(cs)||vSet(cs);
const bpts=(B,i)=>B.mel[i].reduce((a,m)=>a+m.cards.reduce((x,c)=>x+cp(c),0)+(m.cards.length>=7?(m.wild?100:200):0),0);
function findNew(h){
  const out=[],used=new Set();
  const g={};h.filter(c=>c.r!==1).forEach(c=>(g[c.r]=g[c.r]||[]).push(c));
  Object.values(g).forEach(a=>{if(a.length>=3){out.push(a);a.forEach(c=>used.add(c))}});
  for(const u of SUITS){
    const cs=h.filter(c=>c.u===u&&!used.has(c)),seen=new Set(),list=[];
    cs.sort((a,b)=>a.r-b.r).forEach(c=>{if(!seen.has(c.r)){seen.add(c.r);list.push(c)}});
    let run=[];const flush=()=>{if(run.length>=3){out.push(run);run.forEach(c=>used.add(c))}run=[]};
    list.forEach(c=>{if(run.length&&bv(c)!==bv(run[run.length-1])+1)flush();run.push(c)});flush();
  }
  return out.filter(a=>vald(a));
}
function buraco(){
  return run('Buraco',buraco,async id=>{
    const d=[];for(let k=0;k<2;k++)for(let r=0;r<13;r++)for(const u of SUITS)d.push({r,u});shuffle(d);
    const B={H:[d.splice(0,11),d.splice(0,11)],morto:[d.splice(0,11),d.splice(0,11)],took:[false,false],mel:[[],[]],deck:d,disc:[d.pop()],sel:new Set()};
    const meldEl=(m,fn)=>{const f=document.createElement('div');f.className='fg';const r=document.createElement('div');
      r.style.cssText='display:flex;padding:3px;border-radius:8px;border:2px solid '+(fn?'#ffd24a99':'transparent')+(fn?';cursor:pointer':'');
      const w=CW()*.4;m.cards.forEach((c,i)=>{const e=img(c,w);if(i)e.style.marginLeft=-w*.5+'px';r.appendChild(e)});
      if(fn)r.onclick=fn;f.appendChild(r);if(m.cards.length>=7)f.appendChild(document.createTextNode(m.wild?'Canastra suja':'Canastra limpa'));return f};
    const row=ms=>{const r=document.createElement('div');r.style.cssText='display:flex;flex-wrap:wrap;justify-content:center;gap:8px;width:100%';ms.forEach(x=>r.appendChild(x));return r};
    const bDraw=(ad,ap)=>{
      const h=srt(B.H[0]),n=h.length,per=n>14?Math.ceil(n/2):n,w=Math.min(CW(),(innerWidth-30)/(1+(per-1)*.5));
      opps([['CPU · '+B.H[1].length+' cartas',Math.min(B.H[1].length,12)]]);
      const piles=row([fig('Monte '+B.deck.length,null,CW()*.8,ad&&(()=>ad(0))),fig('Mesa '+B.disc.length,B.disc[B.disc.length-1],CW()*.8,ad&&B.disc.length?()=>ad(1):null)]);
      const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:8px;align-items:center;width:100%';
      wrap.append(row(B.mel[1].map(m=>meldEl(m,null))),piles,row(B.mel[0].map((m,i)=>meldEl(m,ap?()=>ap(i):null))));
      set('tgc',wrap);
      const rows=[];for(let i=0;i<n;i+=per){const r=document.createElement('div');r.style.cssText='display:flex;justify-content:center;width:100%';
        h.slice(i,i+per).forEach((c,j)=>{const e=img(c,w);if(j)e.style.marginLeft=-w*.5+'px';
          if(ap||ad){e.style.cursor='pointer';e.onclick=()=>{B.sel.has(c)?B.sel.delete(c):B.sel.add(c);bDraw(ad,ap)}}
          if(B.sel.has(c)){e.style.transform='translateY(-14px)';e.style.filter='drop-shadow(0 0 8px #ffd24a)'}
          r.appendChild(e)});rows.push(r)}
      set('tgp',rows);
      if(ap)btns([['Baixar jogo',()=>ap('new')],['Descartar',()=>ap('disc')]]);else btns([]);
      const t=document.createElement('span');t.className='fg';t.textContent='Seu morto: '+(B.took[0]?'pego':'11 cartas');$('tgx').appendChild(t);
      $('tgs').textContent=`Você ${bpts(B,0)} x ${bpts(B,1)} CPU`;
    };
    const finish=async(by)=>{
      const sc=[0,1].map(i=>bpts(B,i)-B.H[i].reduce((a,c)=>a+cp(c),0)-(B.took[i]?0:100)+(by===i?100:0));
      B.sel.clear();bDraw(null,null);const a=sc[0],b=sc[1];
      over(a>b,`${a>b?'Você venceu':a===b?'Empate':'Você perdeu'}: ${a} a ${b}${by>=0?' · '+(by?'CPU':'você')+' bateu':''}`,buraco);
    };
    const empty=i=>{if(B.H[i].length)return 0;if(!B.took[i]){B.H[i]=B.morto[i];B.took[i]=true;return 1}return 2};
    srt(B.H[0]);snd('shuffle');
    for(;;){
      // vez do jogador
      if(!B.deck.length){return finish(-1)}
      B.sel.clear();banner('Sua vez: compre do monte ou pegue a mesa','me');
      const t=await new Promise(r=>bDraw(r,null));
      if(t)B.H[0].push(...B.disc.splice(0));else B.H[0].push(B.deck.pop());
      snd('draw');B.sel.clear();
      let done=false;
      while(!done){
        banner('Selecione cartas: baixe um jogo ou descarte uma','me');
        const a=await new Promise(r=>bDraw(null,r)),cs=[...B.sel];
        if(a==='disc'){
          if(cs.length!==1){banner('Selecione 1 carta para descartar','draw');await z(id,900);continue}
          B.H[0].splice(B.H[0].indexOf(cs[0]),1);B.disc.push(cs[0]);B.sel.clear();snd('card');done=true;
          if(empty(0)===2)return finish(0);
        }else{
          const base=a==='new'?[]:B.mel[0][a].cards,v=vald([...base,...cs]);
          if(!cs.length||!v||(a!=='new'&&v.type!==B.mel[0][a].type)){banner('Jogo inválido','cpu');await z(id,900);continue}
          cs.forEach(c=>B.H[0].splice(B.H[0].indexOf(c),1));B.sel.clear();snd('card');
          if(a==='new')B.mel[0].push(v);else B.mel[0][a]=v;
          const e=empty(0);if(e===2)return finish(0);if(e===1){banner('Você pegou o morto!','draw');await z(id,1000)}
        }
      }
      // vez da CPU
      bDraw(null,null);banner('Vez da CPU','cpu');await z(id,1000);
      const h=B.H[1],top=B.disc[B.disc.length-1];
      if(!B.deck.length)return finish(-1);
      const useTop=top&&(B.mel[1].some(m=>vald([...m.cards,top])&&top.r!==1)||findNew([...h,top]).some(a=>a.includes(top)));
      if(useTop){h.push(...B.disc.splice(0))}else h.push(B.deck.pop());
      snd('draw');banner('CPU '+(useTop?'pegou a mesa':'comprou do monte'),'cpu');bDraw(null,null);await z(id,1000);
      for(let again=true;again;){
        again=false;
        for(const a of findNew(h)){if(a.every(c=>h.includes(c))){const v=vald(a);a.forEach(c=>h.splice(h.indexOf(c),1));B.mel[1].push(v);again=true;snd('card');bDraw(null,null);await z(id,700)}}
        for(const c of [...h]){if(c.r===1)continue;
          const k=B.mel[1].findIndex(m=>{const v=vald([...m.cards,c]);return v&&v.type===m.type});
          if(k>=0){B.mel[1][k]=vald([...B.mel[1][k].cards,c]);h.splice(h.indexOf(c),1);again=true;snd('card');bDraw(null,null);await z(id,600)}}
        const e=empty(1);if(e===2)return finish(1);if(e===1){banner('CPU pegou o morto','cpu');again=true;await z(id,900)}
      }
      const dc=h.reduce((b,c)=>(use(c,h)+(c.r===1?9:0)+(c.r===0?3:0))<(use(b,h)+(b.r===1?9:0)+(b.r===0?3:0))?c:b);
      h.splice(h.indexOf(dc),1);B.disc.push(dc);snd('card');bDraw(null,null);await z(id,600);
      if(empty(1)===2)return finish(1);
    }
  });
}

window.NEWG={buraco,truco,bisca:()=>trick('bisca'),sueca:()=>trick('sueca'),pife,_t:{can,hw,TP,vSeq,vald,findNew}};
})();
