const IMG = {"ace_of_clubs": "assets/ace_of_clubs.png", "ace_of_diamonds": "assets/ace_of_diamonds.png", "ace_of_hearts": "assets/ace_of_hearts.png", "ace_of_spades": "assets/ace_of_spades.png", "two_of_clubs": "assets/two_of_clubs.png", "two_of_diamonds": "assets/two_of_diamonds.png", "two_of_hearts": "assets/two_of_hearts.png", "two_of_spades": "assets/two_of_spades.png", "three_of_clubs": "assets/three_of_clubs.png", "three_of_diamonds": "assets/three_of_diamonds.png", "three_of_hearts": "assets/three_of_hearts.png", "three_of_spades": "assets/three_of_spades.png", "four_of_clubs": "assets/four_of_clubs.png", "four_of_diamonds": "assets/four_of_diamonds.png", "four_of_hearts": "assets/four_of_hearts.png", "four_of_spades": "assets/four_of_spades.png", "five_of_clubs": "assets/five_of_clubs.png", "five_of_diamonds": "assets/five_of_diamonds.png", "five_of_hearts": "assets/five_of_hearts.png", "five_of_spades": "assets/five_of_spades.png", "six_of_clubs": "assets/six_of_clubs.png", "six_of_diamonds": "assets/six_of_diamonds.png", "six_of_hearts": "assets/six_of_hearts.png", "six_of_spades": "assets/six_of_spades.png", "seven_of_clubs": "assets/seven_of_clubs.png", "seven_of_diamonds": "assets/seven_of_diamonds.png", "seven_of_hearts": "assets/seven_of_hearts.png", "seven_of_spades": "assets/seven_of_spades.png", "eight_of_clubs": "assets/eight_of_clubs.png", "eight_of_diamonds": "assets/eight_of_diamonds.png", "eight_of_hearts": "assets/eight_of_hearts.png", "eight_of_spades": "assets/eight_of_spades.png", "nine_of_clubs": "assets/nine_of_clubs.png", "nine_of_diamonds": "assets/nine_of_diamonds.png", "nine_of_hearts": "assets/nine_of_hearts.png", "nine_of_spades": "assets/nine_of_spades.png", "ten_of_clubs": "assets/ten_of_clubs.png", "ten_of_diamonds": "assets/ten_of_diamonds.png", "ten_of_hearts": "assets/ten_of_hearts.png", "ten_of_spades": "assets/ten_of_spades.png", "jack_of_clubs": "assets/jack_of_clubs.png", "jack_of_diamonds": "assets/jack_of_diamonds.png", "jack_of_hearts": "assets/jack_of_hearts.png", "jack_of_spades": "assets/jack_of_spades.png", "queen_of_clubs": "assets/queen_of_clubs.png", "queen_of_diamonds": "assets/queen_of_diamonds.png", "queen_of_hearts": "assets/queen_of_hearts.png", "queen_of_spades": "assets/queen_of_spades.png", "king_of_clubs": "assets/king_of_clubs.png", "king_of_diamonds": "assets/king_of_diamonds.png", "king_of_hearts": "assets/king_of_hearts.png", "king_of_spades": "assets/king_of_spades.png", "1_backing": "assets/1_backing.png", "2_backing": "assets/2_backing.png", "3_backing": "assets/3_backing.png", "4_backing": "assets/4_backing.png", "5_backing": "assets/5_backing.png", "6_backing": "assets/6_backing.png", "7_backing": "assets/7_backing.png", "8_backing": "assets/8_backing.png"};
const $=id=>document.getElementById(id);
const RANKS=['ace','two','three','four','five','six','seven','eight','nine','ten','jack','queen','king'];
const SUITS=['clubs','diamonds','hearts','spades'];
const SYM={clubs:'♣',diamonds:'♦',hearts:'♥',spades:'♠'};
const RED={diamonds:1,hearts:1};
const BACKS=['1','2','3','4','5','6','7','8'];
let G={}, back='1', score={p:0,c:0};
try{const k=localStorage.getItem('po_back');if(BACKS.includes(k))back=k;const s=JSON.parse(localStorage.getItem('po_score'));if(s&&+s.p>=0&&+s.c>=0)score=s}catch(e){}
const save=()=>{try{localStorage.setItem('po_back',back);localStorage.setItem('po_score',JSON.stringify(score))}catch(e){}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const src=c=>IMG[`${RANKS[c.r]}_of_${c.u}`];
const say=t=>$('msg').textContent=t;
const ok=c=>c.r===7||c.u===G.suit||c.r===G.top.r;

// ---------- opções, temas, som
let NOPP=1,theme='green';
const THEMES={green:'6',blue:'1',wine:'4'};
try{const n=+localStorage.getItem('c8_opp');if(n>=1&&n<=3)NOPP=n;const t=localStorage.getItem('c8_theme');if(THEMES[t])theme=t;if(!localStorage.getItem('po_back'))back=THEMES[theme]}catch(e){}
const sv=()=>{try{localStorage.setItem('c8_opp',NOPP);localStorage.setItem('c8_theme',theme)}catch(e){}save()};
function applyTheme(){document.body.dataset.theme=theme;if(G.top)render()}
function buildOpts(){
  const mk=(box,items)=>{$(box).innerHTML='';items.forEach(([l,sel,css,fn])=>{const b=document.createElement('button');b.textContent=l;b.className='alt'+(sel?' sel':'');if(css)b.style.cssText=css;b.onclick=fn;$(box).appendChild(b)})};
  mk('optopp',[1,2,3].map(n=>[n+(n>1?' CPUs':' CPU'),n===NOPP,'',()=>{NOPP=n;sv();buildOpts()}]));
  mk('opttheme',[['green','Verde','#2f9560'],['blue','Azul','#2f6fa5'],['wine','Vinho','#8a2a3c']].map(([k,l,c])=>[l,k===theme,`background:${c};color:#fff;text-shadow:0 1px 0 #0007`,()=>{theme=k;back=THEMES[k];applyTheme();sv();buildOpts()}]));
  $('optback').innerHTML='';
  BACKS.forEach(k=>{const b=document.createElement('button');b.className='bk'+(k===back?' sel':'');b.innerHTML=`<img src="${IMG[k+'_backing']}" alt="">`;b.onclick=()=>{back=k;save();if(G.top)render();buildOpts()};$('optback').appendChild(b)});
}
let AC=null,muted=false;try{muted=localStorage.getItem('c8_mute')==='1'}catch(e){}
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function noise(t,dur,f,v){const a=ac();if(!a)return;const n=a.sampleRate*dur|0,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
  const s=a.createBufferSource();s.buffer=b;const fl=a.createBiquadFilter();fl.type='bandpass';fl.frequency.value=f;fl.Q.value=.9;
  const g=a.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(fl);fl.connect(g);g.connect(a.destination);s.start(t)}
function tone(t,f,dur,v,type){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.05)}
function snd(k){if(muted)return;const a=ac();if(!a)return;const t=a.currentTime;
  if(k==='card')noise(t,.09,2200+Math.random()*800,.6);
  else if(k==='draw'){noise(t,.07,1500,.5);noise(t+.07,.07,2600,.35)}
  else if(k==='shuffle'){for(let i=0;i<12;i++)noise(t+i*.04,.06,1400+Math.random()*2200,.35)}
  else if(k==='win'){[523,659,784,1047].forEach((f,i)=>tone(t+i*.14,f,.4,.25,'triangle'));tone(t+.6,1319,.8,.22,'triangle')}
  else if(k==='lose')[392,349,311,262].forEach((f,i)=>tone(t+i*.22,f,.45,.2,'sawtooth'))}
function setSnd(){$('snd').textContent=muted?'🔇':'🔊';$('snd').title=muted?'Ligar som':'Silenciar'}
$('snd').onclick=()=>{muted=!muted;try{localStorage.setItem('c8_mute',muted?'1':'0')}catch(e){}setSnd();if(!muted)snd('card')};

// ---------- animação e confete
function fly(from,toEl,c){
  return new Promise(res=>{
    try{
      const to=toEl.getBoundingClientRect(),pw=to.width,ph=to.height,im=new Image();im.src=src(c);
      im.style.cssText=`position:fixed;left:0;top:0;width:${pw}px;height:${ph}px;z-index:50;pointer-events:none;border-radius:${pw*.07}px;filter:drop-shadow(0 8px 8px #000a);transform-origin:center`;
      document.body.appendChild(im);
      const k=from.width/pw,sx=from.left+from.width/2-pw/2,sy=from.top+from.height/2-ph/2;
      const an=im.animate([{transform:`translate(${sx}px,${sy}px) scale(${k}) rotate(0deg)`},{transform:`translate(${to.left}px,${to.top}px) scale(1) rotate(${c.rot||0}deg)`}],{duration:380,easing:'cubic-bezier(.2,.7,.3,1)'});
      an.onfinish=()=>{im.remove();res()};
    }catch(e){res()}
  });
}
const revealTop=()=>{G.hideTop=false;const l=$('pile').lastElementChild;if(l)l.style.opacity=1};
let cfid=0;
function stopConfetti(){cancelAnimationFrame(cfid);$('cf').hidden=true}
function confetti(){
  const cv=$('cf'),x=cv.getContext('2d');cv.hidden=false;cv.width=innerWidth;cv.height=innerHeight;
  const cols=['#e74c3c','#f1c40f','#2ecc71','#3498db','#9b59b6','#ffffff'],ps=[];
  for(let i=0;i<160;i++)ps.push({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*.7,vx:Math.random()*2-1,vy:2+Math.random()*3.5,r:Math.random()*6.28,vr:Math.random()*.25-.12,s:7+Math.random()*9,c:cols[i%6],t:i%4===0?'♠♥♦♣'[(i/4)%4]:''});
  const t0=performance.now();
  (function loop(){
    x.clearRect(0,0,cv.width,cv.height);let alive=0;
    for(const p of ps){p.x+=p.vx+Math.sin(p.y/40);p.y+=p.vy;p.r+=p.vr;if(p.y>cv.height+30)continue;alive++;
      x.save();x.translate(p.x,p.y);x.rotate(p.r);
      if(p.t){x.font=(p.s*2.2)+'px Georgia';x.textAlign='center';x.fillStyle='♥♦'.includes(p.t)?'#e74c3c':'#fff';x.fillText(p.t,0,0)}
      else{x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2)}
      x.restore()}
    if(alive&&performance.now()-t0<9000)cfid=requestAnimationFrame(loop);else stopConfetti();
  })();
}

// ---------- jogo
const cname=i=>NOPP>1?'CPU '+i:'CPU';
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
function newGame(){
  stopConfetti();$('end').hidden=true;lastTop=null;
  const d=[];for(let r=0;r<13;r++)for(const u of SUITS)d.push({r,u});shuffle(d);
  const me=d.splice(0,7),cpus=Array.from({length:NOPP},()=>d.splice(0,7));
  G={deck:d,pile:[],me,cpus,busy:false,over:false,turn:0,lastN:[]};
  let t;do{t=G.deck.pop();if(t.r===7)G.deck.unshift(t)}while(t.r===7);
  t.rot=-4;G.top=t;G.suit=t.u;G.pile=[t];
  $('cpus').innerHTML='';
  cpus.forEach((_,i)=>{const o=document.createElement('div');o.className='opp';o.innerHTML=`<div class="label">${cname(i+1)} · <span></span>${NOPP>1?'':' cartas'}</div><div class="hand cpu"></div>`;$('cpus').appendChild(o)});
  say('Sua vez! Jogue uma carta.');snd('shuffle');render();
}
function drawCard(){
  if(!G.deck.length&&G.pile.length>1){const t=G.pile.pop();G.deck=shuffle(G.pile);G.pile=[t]}
  return G.deck.pop();
}
function banner(){
  let k,x;
  if(G.over){k='end';x=G.winner===0?'🏆 Você venceu!':'😞 '+cname(G.winner)+' venceu'}
  else if(G.picking){k='me';x='Escolha o novo naipe'}
  else if(G.drawing){k='draw';x='🃏 Comprando...'}
  else if(G.turn>0){k='cpu';x='⏳ Vez da '+cname(G.turn)}
  else if(G.busy){k='me';x='✅ Sua jogada'}
  else if(!G.me.some(ok)){k='draw';x='👇 Compre do monte'}
  else{k='me';x='✅ Sua vez'}
  const b=$('banner');b.className=k;b.textContent=x;
}
let lastTop=null;
function fan(el,hand,w,me,nl){
  el.innerHTML='';const n=hand.length,W=el.clientWidth||320,mid=(n-1)/2;
  const step=n>1?Math.min(w*(me?.62:.32),(W-w-8)/(n-1)):0;
  const a=n>1?Math.min(me?5:3.5,26/(n-1)):0;
  hand.forEach((c,i)=>{
    const im=new Image();im.alt='';im.src=me?src(c):IMG[back+'_backing'];
    const r=(i-mid)*a*(me?1:-1),can=me&&!G.busy&&!G.over&&ok(c);
    const y=r*r*(me?.06:.07)*(w/60)-(can?10:0);
    im.style.setProperty('--r',r+'deg');im.style.setProperty('--y',y+'px');
    im.style.width=w+'px';im.style.zIndex=i;if(i)im.style.marginLeft=-(w-step)+'px';
    if(me){im.className=can?'ok':(G.busy?'':'no');if(can)im.onclick=()=>play(c,im);if(!c.seen){c.seen=1;im.classList.add('new')}}
    else if(i===n-1&&nl)im.className='new';
    el.appendChild(im);
  });
}
function render(){
  if(!G.top)return;
  banner();
  const cw=$('deck').offsetWidth||60,k=[0,.72,.6,.48][NOPP];
  fan($('me'),G.me,cw,true);
  [...$('cpus').children].forEach((o,i)=>{
    fan(o.querySelector('.hand'),G.cpus[i],cw*k,false,G.cpus[i].length>(G.lastN[i]||0));G.lastN[i]=G.cpus[i].length;
    o.querySelector('span').textContent=G.cpus[i].length;o.classList.toggle('act',G.turn===i+1&&!G.over);
  });
  const pc=$('pile');pc.innerHTML='';
  G.pile.slice(-5).forEach(c=>{const im=new Image();im.alt='';im.src=src(c);im.style.setProperty('--r',(c.rot||0)+'deg');
    if(c===G.top&&G.hideTop)im.style.opacity=0;else if(c===G.top&&c!==lastTop)im.className='land';pc.appendChild(im)});
  lastTop=G.top;
  $('dleft').textContent=G.deck.length;$('deck').src=IMG[back+'_backing'];
  const s=$('suit');s.textContent=SYM[G.suit];s.style.color=RED[G.suit]?'#c0392b':'#111';
  const canDraw=!G.busy&&!G.over&&G.turn===0&&!G.me.some(ok);
  $('deck').className=canDraw?'can':'';$('deck').onclick=canDraw?humanDraw:null;
}
function put(hand,c){hand.splice(hand.indexOf(c),1);c.rot=Math.random()*26-13|0;G.pile.push(c);G.top=c;G.suit=c.u}
function win(p){
  const h=p?G.cpus[p-1]:G.me;if(h.length)return false;
  G.over=true;G.winner=p;render();
  snd(p?'lose':'win');if(!p)confetti();
  setTimeout(()=>{$('et').textContent=p?cname(p)+' venceu!':'🏆 Você venceu!';$('end').hidden=false},p?600:1100);
  return true;
}
function next(){
  G.turn=(G.turn+1)%(NOPP+1);
  if(G.turn===0){G.busy=false;say(G.me.some(ok)?'Sua vez!':'Sem jogada. Compre do monte!');render()}
  else{G.busy=true;say(cname(G.turn)+' pensando...');render();const i=G.turn-1;setTimeout(()=>cpuTurn(i),800)}
}
function pickSuit(){
  return new Promise(res=>{
    G.picking=true;render();
    const p=$('picker');p.hidden=false;p.innerHTML='';say('Escolha o novo naipe:');
    SUITS.forEach(u=>{const b=document.createElement('button');b.className='suitbtn';b.textContent=SYM[u];b.style.color=RED[u]?'#c0392b':'#000';b.onclick=()=>{p.hidden=true;G.picking=false;res(u)};p.appendChild(b)});
  });
}
async function play(c,el){
  if(G.busy||G.over||G.turn!==0||!ok(c))return;
  G.busy=true;const from=el.getBoundingClientRect();
  put(G.me,c);G.hideTop=true;render();snd('card');
  await fly(from,$('pile'),c);revealTop();
  if(c.r===7){G.suit=await pickSuit();render()}
  if(win(0))return;
  next();
}
async function humanDraw(){
  if(G.busy||G.over||G.turn!==0)return;
  G.busy=true;G.drawing=true;const c=drawCard();
  if(!c){G.drawing=false;say('Monte vazio. Você passa.');render();await sleep(900);return next()}
  G.me.push(c);snd('draw');render();await sleep(500);G.drawing=false;
  if(ok(c)){G.busy=false;say('Comprou uma carta jogável! Jogue.');render()}
  else{say('Sem jogada. Você passa.');render();await sleep(900);next()}
}
async function cpuTurn(i){
  if(G.over)return;
  const h=G.cpus[i],nm=cname(i+1),n={};let pick=null;
  const cnt=()=>{for(const k in n)delete n[k];h.forEach(x=>n[x.u]=(n[x.u]||0)+1)};
  const pl=h.filter(ok);
  if(pl.length){cnt();const non8=pl.filter(c=>c.r!==7),pool=non8.length?non8:pl;pick=pool.sort((a,b)=>n[b.u]-n[a.u])[0]}
  else{const c=drawCard();
    if(c){h.push(c);snd('draw');render();await sleep(600);if(ok(c))pick=c;else say(nm+' comprou e passou.')}
    else say('Monte vazio. '+nm+' passa.')}
  if(pick){
    const r=$('cpus').children[i].querySelector('.hand').getBoundingClientRect(),w=$('deck').offsetWidth*.72;
    put(h,pick);G.hideTop=true;render();snd('card');
    await fly({left:r.left+r.width/2-w/2,top:r.top,width:w,height:w*1.4545},$('pile'),pick);revealTop();
    if(pick.r===7){cnt();G.suit=Object.keys(n).sort((a,b)=>n[b]-n[a])[0]||SUITS[Math.random()*4|0];say(nm+' jogou um 8 e escolheu '+SYM[G.suit])}
    else say(nm+' jogou.');
    render();if(win(i+1))return;
  }
  await sleep(600);next();
}
addEventListener('resize',()=>{if(G.top)render()});
$('new').onclick=newGame;
$('eagain').onclick=newGame;
$('emenu').onclick=()=>{$('end').hidden=true;showMenu()};
const im=(k,l)=>`<figure><img src="${IMG[k]}" alt="">${l?`<figcaption>${l}</figcaption>`:''}</figure>`;
const SL=[
 {t:'🎯 Objetivo',h:`<p>Você joga contra 1 a 3 CPUs. Cada um começa com <b>7 cartas</b>.</p><p>Vence quem <b>ficar sem cartas primeiro</b>. Os turnos passam um a um: você joga, depois cada CPU.</p><div class="fig">${im(back+'_backing')}${im(back+'_backing')}${im(back+'_backing')}</div>`},
 {t:'🃏 O baralho',h:`<p>É o baralho comum de <b>52 cartas, sem coringas</b>. São 4 naipes: ♣ Paus, ♦ Ouros, ♥ Copas e ♠ Espadas (ouros e copas são vermelhos, paus e espadas são pretos).</p><p>Cada naipe tem 13 valores: Ás (A), 2 ao 10, Valete (J), Dama (Q) e Rei (K).</p><p>Aqui o valor não dá pontos, só serve para combinar as cartas.</p><div class="fig">${im('ace_of_clubs','Paus')}${im('ace_of_diamonds','Ouros')}${im('ace_of_hearts','Copas')}${im('ace_of_spades','Espadas')}</div>`},
 {t:'👆 Como jogar',h:`<p>Olhe a carta da <b>mesa</b>. Você pode jogar uma carta do <b>mesmo naipe</b> ou do <b>mesmo valor</b>.</p><p>As cartas que servem ficam com <b>brilho dourado</b>: clique nelas para jogar. As escurecidas não servem agora.</p><div class="fig">${im('king_of_hearts','Mesa')}<span style="font-size:28px;align-self:center">→</span>${im('five_of_hearts','Mesmo naipe')}${im('king_of_spades','Mesmo valor')}</div>`},
 {t:'⭐ O 8 é coringa',h:`<p>O <b>8</b> pode ser jogado a qualquer momento, em cima de qualquer carta.</p><p>Depois de jogá-lo, você <b>escolhe o novo naipe</b>. O quadro "Naipe" no centro da mesa mostra qual está valendo.</p><div class="fig">${im('eight_of_clubs')}${im('eight_of_diamonds')}${im('eight_of_hearts')}${im('eight_of_spades')}</div>`},
 {t:'📦 Sem jogada?',h:`<p>Se nenhuma carta servir, aparece o aviso <b>COMPRE DO MONTE</b> e o monte começa a balançar.</p><p>Clique nele para comprar <b>1 carta</b>. Se ela servir, você pode jogá-la; se não, a vez passa para a CPU.</p><p>Quando o monte acaba, as cartas já jogadas são embaralhadas de volta.</p><div class="fig">${im(back+'_backing','Monte')}</div>`},
 {t:'🚦 De quem é a vez?',h:`<p>Fique de olho na faixa colorida acima da mesa:</p><div style="display:flex;flex-direction:column;gap:10px;margin:12px 0"><div class="bn me">✅ Sua vez</div><div class="bn cpu">⏳ Vez da CPU</div><div class="bn draw">👇 Compre do monte</div></div><p style="text-align:center">Boa sorte!</p>`}
];
let ti=0,tAfter=null,tLabel='';
function drawTuto(){
  const s=SL[ti];$('tt').textContent=s.t;$('tb').innerHTML=s.h;$('tn').textContent=(ti+1)+' / '+SL.length;
  $('tprev').style.visibility=ti?'visible':'hidden';
  $('tnext').textContent=ti===SL.length-1?tLabel:'Próximo ▶';
}
function openTuto(after,label){ti=0;tAfter=after;tLabel=label;$('tuto').hidden=false;$('menu').hidden=true;drawTuto()}
function closeTuto(){$('tuto').hidden=true;const a=tAfter;tAfter=null;if(a)a()}
$('tprev').onclick=()=>{if(ti){ti--;drawTuto()}};
$('tnext').onclick=()=>{if(ti<SL.length-1){ti++;drawTuto()}else closeTuto()};
$('tskip').onclick=closeTuto;
function showMenu(){$('menu').hidden=false;$('tuto').hidden=true;$('setup').hidden=true}
$('mplay').onclick=()=>{$('menu').hidden=true;$('setup').hidden=false;buildOpts()};
$('sstart').onclick=()=>{$('setup').hidden=true;openTuto(()=>newGame(),'Começar a jogar!')};
$('sback').onclick=showMenu;
$('mhow').onclick=()=>openTuto(showMenu,'Voltar ao menu');
$('rules').onclick=()=>openTuto(()=>{$('menu').hidden=true},'Voltar ao jogo');
$('tomenu').onclick=showMenu;
[['ace_of_spades',-24,-60],['king_of_hearts',0,-50],['eight_of_diamonds',24,-40]].forEach(([k,r,x])=>{const i=new Image();i.src=IMG[k];i.style.transform=`translateX(${x}px) rotate(${r}deg)`;$('fan').appendChild(i)});
const FE=document.documentElement,rfs=FE.requestFullscreen||FE.webkitRequestFullscreen,efs=document.exitFullscreen||document.webkitExitFullscreen;
const inFS=()=>document.fullscreenElement||document.webkitFullscreenElement;
const fsLabel=()=>$('mfs').textContent=inFS()?'⛶ Sair da tela cheia':'⛶ Tela cheia';
if(!rfs){$('mfs').hidden=true;$('fshint').textContent='No iPhone: toque em Compartilhar › Adicionar à Tela de Início para jogar em tela cheia.'}
$('mfs').onclick=async()=>{try{if(inFS())await efs.call(document);else await rfs.call(FE);$('fshint').textContent=''}catch(e){$('fshint').textContent='A tela cheia foi bloqueada aqui. Abra o jogo direto no navegador.'}fsLabel()};
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{fsLabel();if(G.top)render()}));
showMenu();buildOpts();applyTheme();setSnd();