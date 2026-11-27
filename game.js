'use strict';
const $=i=>document.getElementById(i),cv=$('g'),c=cv.getContext('2d'),mm=$('mm'),m2=mm.getContext('2d');
let W,H;function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
const rnd=n=>Math.random()*n,pick=a=>a[rnd(a.length)|0],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
// ===== SAVE SYSTEM =====
const D0={g:150,inv:[],aq:[],dis:{},cnt:{},rec:{},bait:[0,0,0],eq:-1,tot:0,up:{sp:0,st:0,rod:0},bx:0,by:380,seen:{c:1},an:'My Aquarium',vol:.6,mute:false,t:0,dec:[],sold:0};
let S=JSON.parse(JSON.stringify(D0));
try{const j=JSON.parse(localStorage.getItem('mfa_save'));if(j)Object.assign(S,j)}catch(e){}
const save=()=>{S.bx=B.x;S.by=B.y;try{localStorage.setItem('mfa_save',JSON.stringify(S))}catch(e){}};
setInterval(save,4000);addEventListener('beforeunload',save);
// ===== AUDIO (procedural) =====
let AC,eg;function au(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator();eg=AC.createGain();o.type='sawtooth';o.frequency.value=50;eg.gain.value=0;o.connect(eg);eg.connect(AC.destination);o.start()}catch(e){}}if(AC&&AC.state=='suspended')AC.resume()}
function snd(f,d=.12,ty='sine',v=.3,sl=0){if(!AC||S.mute)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+sl),t+d);g.gain.setValueAtTime(v*S.vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(t+d)}
const SFX={click:()=>snd(600,.06,'square',.15),cast:()=>snd(500,.35,'sine',.3,-380),bite:()=>{snd(900,.1,'square',.3);setTimeout(()=>snd(1200,.15,'square',.3),110)},reel:()=>snd(300+rnd(80),.05,'triangle',.2),snap:()=>snd(900,.4,'sawtooth',.4,-800),splash:()=>snd(200,.3,'sawtooth',.25,-120),myth:()=>{snd(70,1.8,'sawtooth',.5,40);snd(140,2,'sine',.4,-60)},caught:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>snd(f,.2,'triangle',.3),i*110)),gold:()=>{snd(1400,.1,'triangle',.25);setTimeout(()=>snd(1900,.15,'triangle',.25),80)},tens:()=>snd(1000,.05,'square',.12)};
// ===== WORLD =====
const ISL=[{x:0,y:-400,r:270,v:1},{x:-620,y:-1450,r:230},{x:1550,y:80,r:210},{x:-420,y:1250,r:240},{x:1750,y:1500,r:270},{x:-1900,y:-150,r:230},{x:500,y:-1500,r:200}];
// irregular organic shapes: radius varies with angle
function mk(o,sd_){o.R=a=>o.r*(1+.17*Math.sin(2*a+sd_)+.13*Math.sin(3*a+sd_*2.3)+.08*Math.sin(5*a+sd_*3.1)+.05*Math.sin(9*a+sd_*1.7))}
function inBlob(o,x,y,m=0){const dx=x-o.x,dy=y-o.y;return Math.hypot(dx,dy)<o.R(Math.atan2(dy,dx))+m}
function pathBlob(g,o,s_,fx,fy){fx=fx||(v=>v);fy=fy||(v=>v);g.beginPath();for(let i=0;i<=56;i++){const a=i/56*Math.PI*2,r=o.R(a)*s_,px=fx(o.x+Math.cos(a)*r),py=fy(o.y+Math.sin(a)*r);i?g.lineTo(px,py):g.moveTo(px,py)}g.closePath()}
ISL.forEach((o,i)=>mk(o,(i+1)*1.7));for(const k in LOC)mk(LOC[k],k.charCodeAt(0)*.37);
const SHAL=['c','s','r','w'];
let sd=7;const sr=()=>(sd=(sd*16807)%2147483647)/2147483647;
const bsamp=(o,f=.9)=>{const a=sr()*7,r=Math.sqrt(sr())*o.R(a)*f;return{x:o.x+Math.cos(a)*r,y:o.y+Math.sin(a)*r}};
const DEC={};for(const k in LOC){const L=LOC[k];DEC[k]=[];for(let i=0;i<95;i++){const q=bsamp(L);DEC[k].push({x:q.x,y:q.y,k:sr(),s:.7+sr()*.9})}}
const AMB=[];for(const k in LOC){const L=LOC[k],pool=NORMAL.filter(f=>f.h.includes(k));for(let i=0;i<14;i++){const f=k=='t'&&i<2?pick(MYTH):pick(pool),q=bsamp(L,.8);AMB.push({f,k,x:q.x,y:q.y,a:rnd(7),sp:20+rnd(30)*(f.r+1),L:Math.min(f.s>=4?150:70,18+Math.pow(f.b,.33)*14)})}}
// ===== STATE =====
const B={x:S.bx,y:S.by,a:-Math.PI/2,v:0,tg:null,rock:0};
const cam={x:B.x,y:B.y,z:.9,tz:.9},keys={};let T=0,cur=null,wx=0,wt=40,shk=0,FS=null,POP=null,panel=null,SIL=0,toastT=0;
const MS=()=>(260+S.up.sp*45)*(wx==2?.8:1),CAP=()=>10+6*S.up.st;
const wibH=()=>{const d=new Date();return (d.getUTCHours()+7)%24+d.getUTCMinutes()/60+d.getUTCSeconds()/3600};
const dark=()=>cl(.6*(Math.cos(wibH()/24*Math.PI*2)*1.3+.1),0,.6),isNight=()=>dark()>.25;
const wibStr=()=>new Date(Date.now()+7*3600000).toISOString().substr(11,8)+' WIB';
const lvl=()=>1+Math.floor(Math.sqrt(S.tot));
// ===== PARTICLES (pooled) =====
const PL=[];for(let i=0;i<500;i++)PL.push({l:0});let pi=0;
function sp(x,y,vx,vy,l,s,col,g=0){const p=PL[pi++%500];p.x=x;p.y=y;p.vx=vx;p.vy=vy;p.l=p.m=l;p.s=s;p.c=col;p.g=g}
const burst=(x,y,n,col,pw=120,s=3,l=.9)=>{for(let i=0;i<n;i++){const a=rnd(7),v=rnd(pw);sp(x,y,Math.cos(a)*v,Math.sin(a)*v,l*(.5+rnd(.7)),s*(.5+rnd(1)),col)}};
// ===== FISH SPRITE =====
function spr(x,f,L,t,px,py,an,al){x.save();x.translate(px,py);x.rotate(an||0);x.globalAlpha=al==null?1:al;
 const s=f.s,w=[.26,.42,.09,.5,.22,.5,.4][s],wag=Math.sin(t*6)*L*.06,C=SIL?'#061425':f.c,K=SIL?C:f.k;x.fillStyle=C;x.strokeStyle=C;
 if(s==5){x.beginPath();x.ellipse(L*.12,0,L*.28,L*.22,0,0,7);x.fill();x.lineWidth=L*.05;x.lineCap='round';for(let i=0;i<8;i++){const o=(i-3.5)*L*.06,q=Math.sin(t*3+i)*L*.1;x.beginPath();x.moveTo(-L*.1,o);x.quadraticCurveTo(-L*.3,o*2+q,-L*.5,o*3-q);x.stroke()}}
 else if(s==3){x.beginPath();x.moveTo(L*.5,0);x.quadraticCurveTo(0,-L*.5,-L*.3,0);x.quadraticCurveTo(0,L*.5,L*.5,0);x.fill();x.lineWidth=2;x.beginPath();x.moveTo(-L*.3,0);x.quadraticCurveTo(-L*.5,wag,-L*.7,wag*2);x.stroke();if(!SIL){x.fillStyle=K;x.beginPath();x.ellipse(0,0,L*.2,L*.12,0,0,7);x.fill()}}
 else{x.beginPath();x.ellipse(0,0,L/2,L*w/2,0,0,7);x.fill();x.beginPath();x.moveTo(-L/2+2,0);x.lineTo(-L*.68,-L*w*.6+wag);x.lineTo(-L*.68,L*w*.6+wag);x.fill();
  if(s==4||s==6){x.beginPath();x.moveTo(L*.05,-L*w/2);x.lineTo(-L*.12,-L*w*.9);x.lineTo(-L*.2,-L*w/2);x.fill()}
  if(f.n=='Swordfish')x.fillRect(L/2,-1.5,L*.25,3);
  if(f.n=='Flying Fish'){x.beginPath();x.moveTo(L*.1,0);x.lineTo(-L*.1,-L*.4);x.lineTo(-L*.25,0);x.fill()}
  if(!SIL){x.fillStyle='rgba(255,255,255,.3)';x.beginPath();x.ellipse(0,L*w*.15,L*.4,L*w*.25,0,0,7);x.fill();x.fillStyle=K;x.beginPath();x.ellipse(-L*.05,-L*w*.2,L*.38,L*w*.12,0,0,7);x.fill();if(s==1||f.k=='#ff9a3c'){x.strokeStyle=K;x.lineWidth=Math.max(1,L*.02);for(let i=-2;i<3;i++){x.beginPath();x.moveTo(i*L*.08,-L*w*.4);x.lineTo(i*L*.08,L*w*.4);x.stroke()}}}}
 if(!SIL){x.fillStyle=s==5?'#ff3':'#fff';x.beginPath();x.arc(L*(s==5?.2:.33),-L*w*.08,Math.max(2,L*.025),0,7);x.fill();x.fillStyle=s==5?'#f00':'#000';x.beginPath();x.arc(L*(s==5?.2:.34),-L*w*.08,Math.max(1,L*.012),0,7);x.fill()}
 x.restore()}
// ===== UI helpers =====
function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');toastT=2.4}
let banT;function banner(m,myth){const e=$('ban');e.textContent=m;e.className='on'+(myth?' myth':'');clearTimeout(banT);banT=setTimeout(()=>e.className='',myth?3500:2200)}
function ui(){$('tl').innerHTML=`<b>Lv ${lvl()}</b> · 🪙 <b>${S.g}</b><br><small>Catches ${S.tot} · Species ${Object.keys(S.dis).length}/25 · Bag ${S.inv.length}/${CAP()}</small>`;
 $('tr').innerHTML=`${['☀️ Clear','🌧 Rain','⛈ Storm'][wx]} · ${isNight()?'🌙':'🌞'} <b>${wibStr()}</b><br>📍 <b>${cur?LOC[cur].n:'Open water'}</b><br><small>Depth ${cur?LOC[cur].d+' m':'—'}</small>`;
 const bt=S.eq>=0&&S.bait[S.eq]>0?` · Bait: ${BAITS[S.eq].n} x${S.bait[S.eq]}`:' · No bait';
 $('st').textContent=(FS?{wait:'Waiting for a bite…',bite:'BITE!!',intro:'SOMETHING HUGE…',fight:'Reel it in! Tap / Space'}[FS.ph]:cur?'Ready to fish at '+LOC[cur].n:'Sail to a fishing spot')+bt;
 }
// ===== INPUT =====
addEventListener('keydown',e=>{au();const k=e.key.toLowerCase();if(k==' '){e.preventDefault();if(FS&&FS.ph=='fight')tap();else if(!FS&&!panel&&!POP)cast()}if('wasd'.includes(k)&&k.length==1)keys[k]=1;if(k=='arrowup')keys.w=1;if(k=='arrowdown')keys.s=1;if(k=='arrowleft')keys.a=1;if(k=='arrowright')keys.d=1;if(k=='escape')closeP()});
addEventListener('keyup',e=>{const k=e.key.toLowerCase();keys[k]=0;if(k=='arrowup')keys.w=0;if(k=='arrowdown')keys.s=0;if(k=='arrowleft')keys.a=0;if(k=='arrowright')keys.d=0});
const toW=(px,py)=>({x:(px-W/2)/cam.z+cam.x,y:(py-H/2)/cam.z+cam.y});
const onIsl=(x,y,m=0)=>ISL.some(i=>inBlob(i,x,y,m));
let lpT=0,lpF=0;
function rcast(){if(panel||POP)return;if(FS){if(FS.ph=='wait'){FS=null;toast('Line reeled in')}else if(FS.ph=='fight')tap()}else cast()}
function go(e){if(panel||POP||FS)return;const p=toW(e.clientX,e.clientY);if(onIsl(p.x,p.y,10)){toast("That's land!");return}B.tg=p;SFX.click()}
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{au();if(e.button==2){rcast();return}if(panel||POP)return;if(FS&&FS.ph=='fight'){tap();return}if(e.pointerType=='touch'){lpF=0;clearTimeout(lpT);lpT=setTimeout(()=>{lpF=1;rcast()},550)}else go(e)});
cv.addEventListener('pointerup',e=>{clearTimeout(lpT);if(e.pointerType=='touch'&&!lpF)go(e)});
cv.addEventListener('wheel',e=>{e.preventDefault();cam.tz=cl(cam.tz*(e.deltaY>0?.9:1.1),.4,1.7)},{passive:false});
mm.addEventListener('pointerdown',e=>{au();if(FS||panel)return;const r=mm.getBoundingClientRect(),sc=170/5600,px=(e.clientX-r.left)*170/r.width,py=(e.clientY-r.top)*170/r.height;const p={x:(px-85)/sc,y:(py-85)/sc+600};let best=null;for(const k in LOC)if(inBlob(LOC[k],p.x,p.y))best=k;if(best)B.tg={x:LOC[best].x,y:LOC[best].y+(best=='c'?250:0)};else if(!onIsl(p.x,p.y,10))B.tg=p;SFX.click()});

// ===== FISHING =====
function cast(){if(FS||panel||POP)return;if(!cur){toast('Sail into a fishing spot first');return}if(S.inv.length>=CAP()){toast('Bag full! Sell or move fish to the aquarium');return}
 let bonus=0,bi=-1;if(S.eq>=0&&S.bait[S.eq]>0){bi=S.eq;S.bait[bi]--;bonus=BAITS[bi].b}B.tg=null;SFX.cast();
 FS={ph:'wait',t:1.8+rnd(3)*(bi>=0?.7:1),bonus,bi,loc:cur,fa:rnd(7)};burst(B.x+Math.cos(B.a)*90,B.y+Math.sin(B.a)*90,10,'#fff',60,2)}
function choose(loc,bonus){const mc=Math.min(MYTHOS_CAP,(MYTHOS_BASE*(loc=='t'?2.5:1))+bonus),ms=MYTH.filter(m=>m.h.includes(loc));if(ms.length&&Math.random()<mc)return pick(ms);
 const night=isNight(),pool=NORMAL.filter(f=>f.h.includes(loc)).map(f=>({f,w:RW[f.r]*f.q*(night&&f.ng?2.5:1)*(loc=='w'&&f.r>0?2:1)*(loc=='t'&&f.r==2?3:1)}));let tot=pool.reduce((a,b)=>a+b.w,0),r=rnd(tot);for(const p of pool){r-=p.w;if(r<=0)return p.f}return pool[0].f}
function hook(){const f=choose(FS.loc,FS.bonus),fr=f.r==3?Math.random():Math.pow(Math.random(),2.2),w=f.a+(f.b-f.a)*fr,sr_=RSTR[f.r];
 FS.f=f;FS.w=w;FS.str=sr_[0]+(sr_[1]-sr_[0])*Math.min(1,fr*.7+Math.random()*.3);FS.p=12;FS.tn=0;FS.sT=1;FS.jump=0;FS.tt=0;SFX.bite();
 if(f.r==3){FS.ph='intro';FS.t=0;SFX.myth();banner('SOMETHING MASSIVE HAS TAKEN THE BAIT…',1);cam.tz=Math.max(cam.tz,.9)}else{FS.ph='bite';FS.t=.9;banner('🐟 BITE!')}}
function tap(){const F_=FS;if(!F_||F_.ph!='fight')return;const rod=S.up.rod;F_.p=Math.min(100,F_.p+(7-F_.str*.35)*(1+.12*rod));F_.tn+=(3+F_.str*.3)*(1-.07*rod);SFX.reel();sp(B.x+Math.cos(B.a)*90,B.y+Math.sin(B.a)*90,rnd(40)-20,rnd(40)-20,.4,2,'#aef')}
function fishUpd(dt){const f=FS;f.t-=dt;
 if(f.ph=='wait'&&f.t<=0)hook();
 else if(f.ph=='bite'&&f.t<=0){f.ph='fight';f.fa=rnd(7)}
 else if(f.ph=='intro'){f.tt+=dt;shk=Math.max(shk,4+f.tt*2);cam.tz=1.5;B.rock=Math.sin(T*9)*.12;if(Math.random()<.5)sp(B.x+rnd(160)-80,B.y+rnd(160)-80,0,-20,1.2,3+rnd(5),'rgba(255,255,255,.7)');
  if(f.tt>1.8&&!f.rev){f.rev=1;banner('★ '+f.f.n.toUpperCase()+' ★',1);burst(B.x,B.y,60,'#fff',260,5)}if(f.tt>3.6){f.ph='fight';cam.tz=1.2}}
 else if(f.ph=='fight'){const s=f.str,mythic=f.f.r==3,sm=wx==2?1.25:1;f.tt+=dt;
  f.sT-=dt;if(f.sT<=0){f.sT=.6+rnd(1.4)/(mythic?1.4:1);f.tn+=(2+s*.6)*sm*(.6+rnd(.8));f.fa+=rnd(2)-1;if(mythic||s>5)f.jump=.7;if(f.jump>0)SFX.splash();shk=Math.max(shk,mythic?7:2)}
  f.tn=Math.max(0,f.tn-16*dt);if(f.p<92)f.p=Math.max(0,f.p-DR[f.f.r]*dt);f.fa+=dt*(.8+s*.15)*(f.str>5?1:.5);if(f.jump>0){f.jump-=dt;if(f.jump>.3&&Math.random()<.4)burst(B.x+Math.cos(f.fa)*100,B.y+Math.sin(f.fa)*100,4,'#cff',140,3)}
  if(mythic){B.x+=Math.cos(f.fa)*s*5*dt;B.y+=Math.sin(f.fa)*s*5*dt;B.rock=Math.sin(T*8)*.1;cam.tz=1.15}
  if(f.tn>70&&Math.random()<.2)SFX.tens();
  if(f.tn>=100){SFX.snap();banner('LINE SNAPPED!');toast('The '+f.f.n+' escaped…');const bx=B.x+Math.cos(B.a)*90,by=B.y+Math.sin(B.a)*90;burst(bx,by,25,'#fff',150,2);FS=null;cam.tz=.9}
  else if(f.p>=97)land()}}
function land(){const f=FS.f,w=FS.w,id=f.id,isNew=!S.dis[id];S.dis[id]=1;S.cnt[id]=(S.cnt[id]||0)+1;S.tot++;S.rec[id]=Math.max(S.rec[id]||0,w);
 POP={id,w,isNew,v:val(f,w)};FS=null;cam.tz=.9;SFX.caught();burst(B.x,B.y,40,f.r==3?'#fc3':'#7ff',220,4,1.2);showCatch();save()}
const val=(f,w)=>Math.max(1,Math.round(f.v*cl(.4+.6*w/((f.a+f.b)/2),.4,2.5)*RM[f.r]/(f.r==3?5:1)));
function showCatch(){const f=ALL[POP.id],m=f.r==3;$('C').hidden=false;$('C').innerHTML=`<div class="box catch ${m?'legend':''}">${m?'<h1 style="color:#fc3;margin:0">★ LEGENDARY CATCH ★</h1>':''}${POP.isNew?'<div class="new">✦ NEW DISCOVERY! Added to the Fish Book ✦</div>':''}<h2>${f.n}</h2><canvas id="pc" width="${m?520:300}" height="${m?240:130}"></canvas><div class="r${f.r}"><b>${RAR[f.r]}</b></div><div>Weight: <b>${fmt(POP.w)}</b> · Value: 🪙 <b>${POP.v}</b></div><p><small>${f.d}</small></p><div class="row" style="justify-content:center;border:0"><button data-act="csell">Sell 🪙${POP.v}</button><button data-act="caq">To aquarium</button><button data-act="ckeep">Keep in bag</button></div></div>`}
const fmt=w=>w<1?(w*1000).toFixed(0)+' g':w<1000?w.toFixed(1)+' kg':(w/1000).toFixed(2)+' t';
// ===== PANELS =====
function closeP(){panel=null;$('P').hidden=true}
function openP(n){panel=n;$('P').hidden=false;render()}
function render(){const P=$('P');let h='';
 if(panel=='inv'){h=`<h2>🎒 Inventory — Sell Fish</h2><small>Bag ${S.inv.length}/${CAP()} · Aquarium ${S.aq.length}/16</small>`;if(!S.inv.length)h+='<p>No fish in your bag.</p>';S.inv.forEach((o,i)=>{const f=ALL[o.id];h+=`<div class="row"><span class="r${f.r}"><b>${f.n}</b> <small>${RAR[f.r]} · ${fmt(o.w)}</small></span>🪙${val(f,o.w)}<button data-act="sell" data-a="${i}">Sell</button><button data-act="toaq" data-a="${i}">Aquarium</button></div>`});
  h+=`<div class="row"><span><b>Total: 🪙 ${S.inv.reduce((a,o)=>a+val(ALL[o.id],o.w),0)}</b></span><button data-act="sellall">Sell all</button><button data-act="close">Close</button></div>`}
 else if(panel=='shop'){h=`<h2>🪱 Bait Shop</h2>🪙 <b>${S.g}</b> gold`;BAITS.forEach((b,i)=>{h+=`<div class="row" style="text-shadow:0 0 ${b.gl}px ${b.col}"><span style="color:${b.col}"><b>${b.n}</b> — +${b.b*100}% Mythos chance<br><small>${b.p} gold · ${b.uses} uses · owned: ${S.bait[i]} ${S.eq==i?'(equipped)':''}</small></span><button data-act="buy" data-a="${i}">Buy</button><button data-act="eq" data-a="${i}">${S.eq==i?'Unequip':'Equip'}</button></div>`});
  h+=`<small>Mythos chance = ${MYTHOS_BASE*100}% base + bait bonus, capped at ${MYTHOS_CAP*100}%. One bait use per cast; bonuses never stack.</small><h3>Boat upgrades</h3>`;
  [['sp','Engine (speed)'],['st','Fish storage (+6)'],['rod','Rod strength (easier reeling)']].forEach(([k,n])=>{const lv=S.up[k],cost=300*(lv+1);h+=`<div class="row"><span>${n} <small>Lv ${lv}/5</small></span><button data-act="up" data-a="${k}" ${lv>=5?'disabled':''}>${lv>=5?'MAX':'🪙'+cost}</button></div>`});h+='<button data-act="close">Close</button>'}
 else if(panel=='book'){const sp_=Object.keys(S.dis).length,my=MYTH.filter(m=>S.dis[m.id]).length;h=`<h2>📖 Fish Book</h2><p>Species ${sp_}/25 (${(sp_/25*100).toFixed(0)}%) · Total caught ${S.tot} · Mythos ${my}/4</p><div class="grid">`+ALL.map(f=>{const k=S.dis[f.id];return `<div class="card"><canvas data-id="${f.id}" width="170" height="64"></canvas>${k?`<b class="r${f.r}">${f.n}</b><br>${RAR[f.r]} · Max ${fmt(S.rec[f.id])} · ×${S.cnt[f.id]}<br><small>${[...f.h].map(x=>HABN[x]).join(', ')}<br>${f.d}</small>`:`<b>${f.r==3?'??? (Mythos)':'???'}</b><br><small>Undiscovered</small>`}</div>`}).join('')+'</div><br><button data-act="close">Close</button>'}
 else if(panel=='aq'){h=`<h2>🐠 <input type="text" id="an" value="${S.an.replace(/"/g,'')}" maxlength="24"></h2><canvas id="aqc" width="860" height="420" style="width:min(860px,88vw);border-radius:12px;border:3px solid #8ef"></canvas><div>`;
  S.aq.forEach((o,i)=>{const f=ALL[o.id];h+=`<div class="row"><span class="r${f.r}">${f.n} <small>${fmt(o.w)}</small></span><button data-act="fromaq" data-a="${i}">Remove to bag</button></div>`});
  h+=`<div class="row"><span>Decor (${S.dec.length}/12)</span>${['coral','rock','weed','shell'].map(t=>`<button data-act="decadd" data-a="${t}">+${t}</button>`).join('')}<button data-act="decdel">Undo</button></div><button data-act="close">Close</button></div>`}
 else if(panel=='set'){h=`<h2>⚙ Settings</h2><div class="row"><span>Volume</span><input type="range" id="vol" min="0" max="1" step=".05" value="${S.vol}"></div><div class="row"><span>Sound</span><button data-act="mute">${S.mute?'Unmute':'Mute'}</button></div><div class="row"><span>Reset all progress</span><button data-act="reset">Reset…</button></div><button data-act="close">Close</button>`}
 P.innerHTML=`<div class="box">${h}</div>`;
 if(panel=='book')P.querySelectorAll('canvas[data-id]').forEach(cn=>{const f=ALL[+cn.dataset.id],x=cn.getContext('2d');SIL=!S.dis[f.id];x.clearRect(0,0,170,64);spr(x,f,Math.min(f.s>=4||f.s==6?140:100,f.s==5?100:60+Math.pow(f.b,.2)*18),0,85,32,0);SIL=0;if(SIL==0&&!S.dis[f.id]){x.fillStyle='#8ef';x.font='bold 22px sans-serif';x.fillText('?',78,40)}});
 if(panel=='aq'){buildAq();const a=$('an');a.oninput=()=>{S.an=a.value}}
 if(panel=='set'){$('vol').oninput=e=>{S.vol=+e.target.value;snd(700,.1)}}}
let resetArm=0;
const ACT={open:a=>{SFX.click();openP(a)},close:()=>{SFX.click();closeP()},
 sell:a=>{const o=S.inv.splice(+a,1)[0],v=val(ALL[o.id],o.w);S.g+=v;S.sold+=v;SFX.gold();burst(B.x,B.y,20,'#fc3',150,3);toast('+'+v+' gold');render()},
 sellall:()=>{const v=S.inv.reduce((a,o)=>a+val(ALL[o.id],o.w),0);S.inv=[];S.g+=v;SFX.gold();burst(B.x,B.y,60,'#fc3',250,4,1.3);toast('Sold all: +'+v+' gold');render()},
 toaq:a=>{if(S.aq.length>=16)return toast('Aquarium full');S.aq.push(S.inv.splice(+a,1)[0]);SFX.click();render()},
 fromaq:a=>{if(S.inv.length>=CAP())return toast('Bag full');S.inv.push(S.aq.splice(+a,1)[0]);SFX.click();render()},
 buy:a=>{const b=BAITS[+a];if(S.g<b.p)return toast('Not enough gold');S.g-=b.p;S.bait[+a]+=b.uses;if(S.eq<0)S.eq=+a;SFX.gold();burst(B.x,B.y,10+a*25,b.col,200,3+a);toast('Bought '+b.n+' x'+b.uses);render()},
 eq:a=>{S.eq=S.eq==+a?-1:+a;SFX.click();render()},
 up:k=>{const lv=S.up[k],cost=300*(lv+1);if(lv>=5||S.g<cost)return toast('Not enough gold');S.g-=cost;S.up[k]++;SFX.gold();render()},
 mute:()=>{S.mute=!S.mute;render()},
 reset:()=>{if(!resetArm){resetArm=1;toast('Click Reset again within 4s to CONFIRM');setTimeout(()=>resetArm=0,4000)}else{localStorage.removeItem('mfa_save');S=JSON.parse(JSON.stringify(D0));B.x=0;B.y=380;S.bx=0;S.by=380;closeP();toast('Progress reset')}},
 decadd:t=>{if(S.dec.length>=12)return toast('Aquarium decor full');S.dec.push({t,x:.05+Math.random()*.9,s:.7+Math.random()*.6});render()},
 decdel:()=>{S.dec.pop();render()},
 csell:()=>{S.g+=POP.v;S.sold+=POP.v;SFX.gold();burst(B.x,B.y,30,'#fc3',200,3);toast('+'+POP.v+' gold');endCatch()},
 caq:()=>{if(S.aq.length>=16)return toast('Aquarium full — kept in bag instead'),ACT.ckeep();S.aq.push({id:POP.id,w:POP.w});endCatch()},
 ckeep:()=>{S.inv.push({id:POP.id,w:POP.w});endCatch()}};
function endCatch(){POP=null;$('C').hidden=true;save()}
document.addEventListener('click',e=>{au();const t=e.target.closest('[data-act]');if(t&&ACT[t.dataset.act])ACT[t.dataset.act](t.dataset.a)});
// ===== AQUARIUM =====
let AQ=[];function buildAq(){AQ=S.aq.map(o=>{const f=ALL[o.id];return{f,x:60+rnd(740),y:60+rnd(280),vx:(Math.random()<.5?-1:1)*(25+rnd(35)),vy:rnd(10)-5,L:f.r==3?Math.min(300,150+Math.pow(o.w,.25)*14):Math.min(130,30+Math.pow(o.w,.33)*16),ph:rnd(7)}})}
function drawAq(dt){const x=$('aqc').getContext('2d'),w=860,h=420,g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2fc3d8');g.addColorStop(1,'#0a2e5a');x.fillStyle=g;x.fillRect(0,0,w,h);
 x.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<4;i++){x.beginPath();x.moveTo(100+i*220+Math.sin(T+i)*20,0);x.lineTo(160+i*220,0);x.lineTo(60+i*220,h);x.lineTo(20+i*220,h);x.fill()}
 x.fillStyle='#d9c58a';x.fillRect(0,h-40,w,40);x.fillStyle='#b8a470';for(let i=0;i<30;i++)x.fillRect(i*31%w,h-30+i%3*9,10,3);
 S.dec.forEach(d=>{const px=d.x*w,by=h-36;if(d.t=='rock'){x.fillStyle='#6a7078';x.beginPath();x.ellipse(px,by,30*d.s,22*d.s,0,Math.PI,0);x.fill()}else if(d.t=='coral'){x.strokeStyle='#ff6a8a';x.lineWidth=5;for(let i=-2;i<3;i++){x.beginPath();x.moveTo(px,by);x.lineTo(px+i*10*d.s,by-45*d.s-Math.abs(i)*-8);x.stroke()}}else if(d.t=='weed'){x.strokeStyle='#2db36a';x.lineWidth=4;for(let i=-1;i<2;i++){x.beginPath();x.moveTo(px+i*8,by);x.quadraticCurveTo(px+i*8+Math.sin(T*2+i)*12,by-40*d.s,px+i*8+Math.sin(T*2+i+1)*16,by-80*d.s);x.stroke()}}else{x.fillStyle='#f5d7c0';x.beginPath();x.arc(px,by+4,12*d.s,Math.PI,0);x.fill()}});
 for(let i=0;i<14;i++){const bx=(i*97+T*20)%w,by=h-((T*40+i*53)%h);x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.arc(bx+Math.sin(T+i)*6,by,2+i%3,0,7);x.fill()}
 AQ.forEach((a,i)=>{a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=(Math.sin(T*.7+a.ph)*8-a.vy*.5)*dt;const m=a.L*.5;if(a.x<m){a.x=m;a.vx=Math.abs(a.vx)}if(a.x>w-m){a.x=w-m;a.vx=-Math.abs(a.vx)}if(a.y<a.L*.2+10){a.y=a.L*.2+10;a.vy=Math.abs(a.vy)}if(a.y>h-50-a.L*.15){a.y=h-50-a.L*.15;a.vy=-Math.abs(a.vy)}
  for(let j=i+1;j<AQ.length;j++){const b=AQ[j],dx=b.x-a.x,dy=b.y-a.y;if(Math.hypot(dx,dy)<(a.L+b.L)*.3){const s=dy>=0?1:-1;a.vy-=s*30*dt;b.vy+=s*30*dt}}
  if(a.f.r==3){x.fillStyle='rgba(255,200,60,.12)';x.beginPath();x.arc(a.x,a.y,a.L*.7,0,7);x.fill()}
  x.save();x.translate(a.x,a.y);if(a.vx<0)x.scale(-1,1);spr(x,a.f,a.L,T+a.ph,0,0,a.vy*.01*(a.vx<0?-1:1),1);x.restore()});}
// ===== UPDATE =====
function upd(dt){T+=dt;S.t+=dt;wt-=dt;if(wt<=0){wx=pick([0,0,0,1,2]);wt=50+rnd(70)}toastT-=dt;if(toastT<0)$('toast').classList.remove('on');
 let best=null,bd=1e9;for(const k in LOC){const L=LOC[k],d=Math.hypot(B.x-L.x,B.y-L.y);if(d<bd&&inBlob(L,B.x,B.y)){bd=d;best=k}}
 if(best!=cur){cur=best;if(cur){const first=!S.seen[cur];S.seen[cur]=1;banner((first?'✦ DISCOVERED: ':'')+LOC[cur].n)}}
 const mx=MS();let tv=0;
 if(FS)B.v*=Math.max(0,1-dt*3);else{
  if(keys.w||keys.s||keys.a||keys.d){B.tg=null;tv=keys.w?mx:keys.s?-mx*.4:0;B.a+=((keys.d?1:0)-(keys.a?1:0))*dt*1.9*(.25+Math.min(.75,Math.abs(B.v)/120))*(B.v<-1?-1:1)}
  else if(B.tg){const dx=B.tg.x-B.x,dy=B.tg.y-B.y,d=Math.hypot(dx,dy);if(d<18){B.tg=null}else{let da=Math.atan2(dy,dx)-B.a;da=Math.atan2(Math.sin(da),Math.cos(da));B.a+=cl(da,-2.2*dt,2.2*dt);tv=Math.min(mx,d*1.4)*(Math.abs(da)<1?1:.25)}}
  B.v+=(tv-B.v)*Math.min(1,dt*(tv==0?2.2:1.4))}
 B.x+=Math.cos(B.a)*B.v*dt;B.y+=Math.sin(B.a)*B.v*dt;
 for(const i of ISL){const dx=B.x-i.x,dy=B.y-i.y,d=Math.hypot(dx,dy),m=i.R(Math.atan2(dy,dx))*1.04+20;if(d<m){B.x=i.x+dx/d*m;B.y=i.y+dy/d*m;B.v*=.5;if(B.tg&&Math.hypot(B.tg.x-i.x,B.tg.y-i.y)<m)B.tg=null}}
 if(!FS||FS.ph!='intro')B.rock=Math.sin(T*2)*.02*(1+wx*1.5)+Math.sin(T*3.1)*.01;
 if(Math.abs(B.v)>40&&Math.random()<dt*40){const bx=B.x-Math.cos(B.a)*30,by=B.y-Math.sin(B.a)*30;sp(bx+rnd(10)-5,by+rnd(10)-5,rnd(20)-10,rnd(20)-10,1.2,5+rnd(4),'rgba(255,255,255,.55)');if(Math.random()<.3)sp(B.x+Math.cos(B.a)*34,B.y+Math.sin(B.a)*34,rnd(60)-30,rnd(60)-30,.4,2,'#fff')}
 if(FS)fishUpd(dt);
 for(const a of AMB){a.x+=Math.cos(a.a)*a.sp*dt;a.y+=Math.sin(a.a)*a.sp*dt;a.a+=(rnd(2)-1)*dt*2;const L=LOC[a.k];if(!inBlob(L,a.x,a.y,-80)){const t=Math.atan2(L.y-a.y,L.x-a.x);let d=t-a.a;a.a+=Math.atan2(Math.sin(d),Math.cos(d))*dt*3}}
 const ft=FS?.ph=='intro'?1.5:cam.tz;cam.z+=(ft-cam.z)*Math.min(1,dt*3);cam.x+=(B.x-cam.x)*Math.min(1,dt*3.5);cam.y+=(B.y-cam.y)*Math.min(1,dt*3.5);shk*=Math.pow(.02,dt);
 for(const p of PL)if(p.l>0){p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.97;p.vy*=.97;p.vy+=p.g*dt}
 if(eg)eg.gain.value=S.mute?0:S.vol*.06*Math.min(1,Math.abs(B.v)/260)}
// ===== RENDER =====
function render_(){const sx=(Math.random()-.5)*shk,sy=(Math.random()-.5)*shk;
 const bg=c.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#0e4a78');bg.addColorStop(.5,'#0a3566');bg.addColorStop(1,'#07264f');c.fillStyle=bg;c.fillRect(0,0,W,H);
 for(let i=0;i<5;i++){const gx=W*(.15+.2*i)+Math.sin(T*.1+i)*120,gy=H*(.3+.4*((i*.37)%1))+Math.cos(T*.13+i)*90,gg=c.createRadialGradient(gx,gy,0,gx,gy,380);gg.addColorStop(0,'rgba(90,200,235,.11)');gg.addColorStop(1,'rgba(90,200,235,0)');c.fillStyle=gg;c.fillRect(0,0,W,H)}
 c.save();c.translate(W/2+sx,H/2+sy);c.scale(cam.z,cam.z);c.translate(-cam.x,-cam.y);
 const vw=W/cam.z/2+200,vh=H/cam.z/2+200,vis=(x,y,r=0)=>Math.abs(x-cam.x)<vw+r&&Math.abs(y-cam.y)<vh+r;
 // shallow gradients + regions
 for(const k in LOC){const L=LOC[k];if(!vis(L.x,L.y,L.r*1.5))continue;c.fillStyle=L.c;for(let j=0;j<6;j++){c.globalAlpha=k=='t'?.3:.2;pathBlob(c,L,1.25-j*.17);c.fill()}c.globalAlpha=1}
 // underwater decor
 for(const k in LOC)for(const d of DEC[k]){if(!vis(d.x,d.y))continue;const sw=Math.sin(T*1.5+d.x*.01)*8;
  if(k=='s'){c.strokeStyle='rgba(20,120,60,.8)';c.lineWidth=4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(d.x+i*6,d.y);c.quadraticCurveTo(d.x+i*6+sw,d.y-30*d.s,d.x+i*6+sw*1.6,d.y-60*d.s);c.stroke()}}
  else if(k=='r'){c.fillStyle=['#ff6a8a','#ffb03a','#c46aff','#ff7a4a'][(d.k*4)|0];c.beginPath();c.arc(d.x,d.y,16*d.s,0,7);c.arc(d.x+14*d.s,d.y+6,10*d.s,0,7);c.fill();if(d.k>.6){c.strokeStyle='#ff4a6a';c.lineWidth=2;for(let i=-3;i<4;i++){c.beginPath();c.moveTo(d.x,d.y);c.lineTo(d.x+i*8,d.y-36*d.s);c.stroke()}}}
  else if(k=='w'){if(d.k<.3){c.fillStyle='#b8845a';c.beginPath();c.ellipse(d.x,d.y,7*d.s,11*d.s,.5,0,7);c.fill()}else if(d.k<.5){c.fillStyle='#d8d0c0';c.fillRect(d.x-7,d.y-30,14,30)}}
  else if(k=='c'){if(d.k<.5){c.strokeStyle='rgba(30,140,80,.7)';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.moveTo(d.x+i*4,d.y);c.lineTo(d.x+i*4+sw*.5,d.y-18)}c.stroke()}else{c.fillStyle='rgba(70,80,80,.6)';c.beginPath();c.ellipse(d.x,d.y,14*d.s,9*d.s,0,0,7);c.fill()}}
  else if(k=='t'){c.fillStyle='rgba(60,120,255,.35)';c.beginPath();c.arc(d.x+sw,d.y,3+d.k*3,0,7);c.fill()}
  else if(k=='o'&&d.k>.8){c.fillStyle='rgba(120,180,255,.15)';c.beginPath();c.arc(d.x,d.y,12,0,7);c.fill()}}
 // shipwreck
 {const L=LOC.w;c.save();c.translate(L.x,L.y);c.rotate(-.35);c.scale(1.6,1.6);c.fillStyle='#6a4526';c.beginPath();c.ellipse(0,0,120,38,0,0,7);c.fill();c.strokeStyle='#3e2814';c.lineWidth=4;for(let i=-4;i<5;i++){c.beginPath();c.moveTo(i*24,-34);c.lineTo(i*22,34);c.stroke()}c.fillStyle='#d8d0c0';c.fillRect(-170,40,16,60);c.fillRect(150,-80,16,70);c.fillStyle='#ffd24a';c.beginPath();c.arc(30,0,8,0,7);c.arc(44,6,6,0,7);c.fill();c.restore()}
 // ambient fish shadows
 SIL=1;for(const a of AMB){if(!vis(a.x,a.y,100))continue;c.save();spr(c,a.f,a.L,T+a.x,a.x,a.y,a.a,.28);c.restore()}SIL=0;
 // waves
 {const st=Math.max(46,38/cam.z),gx0=Math.floor((cam.x-vw)/st)*st,gy0=Math.floor((cam.y-vh)/st)*st,dk_=dark();c.lineWidth=1.5;
  for(let y=gy0;y<cam.y+vh;y+=st)for(let x=gx0;x<cam.x+vw;x+=st){const hh=((Math.floor(x/st)*73856093)^(Math.floor(y/st)*19349663))>>>0,h1=(hh%1000)/1000,g=Math.sin(T*2.2+h1*40);
   if(g>.93){c.globalAlpha=(g-.93)*9*(1-dk_);c.fillStyle='#fff';c.fillRect(x+h1*st,y+((hh>>3)%100)/100*st,3,2)}
   if(h1<.6)for(const k of SHAL){const L=LOC[k];if(Math.hypot(x-L.x,y-L.y)<L.r*1.45&&inBlob(L,x,y)){const ax=x+Math.sin(T*.9+y*.04)*12,ay=y+Math.cos(T*.8+x*.04)*12;c.globalAlpha=(.08+.05*Math.sin(T*2+h1*9))*(1-dk_);c.strokeStyle='#d8ffff';c.beginPath();c.moveTo(ax,ay);c.quadraticCurveTo(ax+10,ay-8+Math.sin(T+h1*6)*5,ax+22,ay+4);c.stroke();break}}}
  c.globalAlpha=1}
 c.strokeStyle='rgba(255,255,255,'+(.07+wx*.04)+')';c.lineWidth=2;const ws=70,amp=3+wx*5,x0=Math.floor((cam.x-vw)/ws)*ws,y0=Math.floor((cam.y-vh)/ws)*ws;
 for(let y=y0;y<cam.y+vh;y+=ws){c.beginPath();for(let x=x0;x<cam.x+vw;x+=25){const yy=y+(x*.37%23)+Math.sin(x*.02+T*1.2+y*.05)*amp;x==x0?c.moveTo(x,yy):c.lineTo(x,yy)}c.stroke()}
 // islands (organic shapes, shallow rim, animated shore waves)
 for(const i of ISL){if(!vis(i.x,i.y,i.r*1.7))continue;
  c.fillStyle='#5fe3d6';for(const q of [[1.6,.1],[1.42,.13],[1.27,.17],[1.14,.22]]){c.globalAlpha=q[1];pathBlob(c,i,q[0]);c.fill()}c.globalAlpha=1;
  c.strokeStyle='#fff';c.lineWidth=3;for(let w=0;w<3;w++){const ph=(T*.3+w/3)%1;c.globalAlpha=(1-ph)*.5;pathBlob(c,i,1.05+ph*.2);c.stroke()}
  c.globalAlpha=.85;c.lineWidth=5;c.setLineDash([22,12]);c.lineDashOffset=-T*10;pathBlob(c,i,1.03+Math.sin(T*1.6)*.012);c.stroke();c.setLineDash([]);c.globalAlpha=1;
  c.fillStyle='#ece0b0';pathBlob(c,i,1.02);c.fill();c.fillStyle='#8a8372';pathBlob(c,i,.9);c.fill();c.fillStyle='#4f8a4a';pathBlob(c,i,.74);c.fill();c.fillStyle='#3f7a3e';pathBlob(c,i,.5);c.fill();
  for(let t=0;t<14;t++){const a=t*2.1+i.x,r=i.R(a)*(.15+.5*((t*53%10)/10));c.fillStyle='#2c6a34';c.beginPath();c.arc(i.x+Math.cos(a)*r,i.y+Math.sin(a)*r,10+t%3*3,0,7);c.fill()}
  if(i.v){for(let h=0;h<18;h++){const a=h*2.4,r=i.R(a)*(.12+.4*((h*37%10)/10)),hx=i.x+Math.cos(a)*r,hy=i.y+Math.sin(a)*r;c.fillStyle='#f4f1ea';c.fillRect(hx-13,hy-9,26,18);c.fillStyle=h%3?'#2a6fc0':'#c9553a';c.fillRect(hx-15,hy-12,30,8)}
   const py=i.y+i.R(Math.PI/2)*.9;c.fillStyle='#8a6a40';c.fillRect(i.x-18,py,36,200);c.fillRect(i.x-70,py+170,140,12);for(let p=0;p<2;p++){c.fillStyle=p?'#c9553a':'#2a6fc0';c.beginPath();c.ellipse(i.x-90+p*180,py+176+Math.sin(T*1.5+p)*3,26,10,0,0,7);c.fill()}}}
 // fishing line + fish
 const bx=B.x+Math.cos(B.a)*95,by=B.y+Math.sin(B.a)*95;
 if(FS){let tx=bx,ty=by;if(FS.ph=='fight'){const d=50+(100-FS.p)*(FS.f.r==3?2.2:1.3);tx=B.x+Math.cos(FS.fa)*d;ty=B.y+Math.sin(FS.fa)*d;const jmp=FS.jump>0;
   spr(c,FS.f,Math.min(FS.f.r==3?420:200,40+Math.pow(FS.w,.33)*18)*(jmp?1.25:1),T*3,tx,ty-(jmp?30*Math.sin(FS.jump/.7*3):0),FS.fa+Math.PI+Math.sin(T*8)*.3,jmp?1:.55);if(jmp&&Math.random()<.3)burst(tx,ty,6,'#fff',120,3)}
  if(FS.ph=='intro'){const t=FS.tt,id=FS.f.id;c.fillStyle='rgba(0,0,10,'+Math.min(.6,t*.25)+')';c.beginPath();c.ellipse(B.x,B.y,60+t*50,35+t*30,0,0,7);c.fill();c.lineWidth=14;c.strokeStyle=FS.f.c;c.lineCap='round';
   if(id==21)for(let i=0;i<6;i++){const a=i*1.05+t*.4,r=100+t*12;c.beginPath();c.moveTo(B.x+Math.cos(a)*60,B.y+Math.sin(a)*40);c.quadraticCurveTo(B.x+Math.cos(a)*r,B.y+Math.sin(a)*r,B.x+Math.cos(a+.6)*r*.8,B.y+Math.sin(a+.6)*r*.8-Math.max(0,t-1)*50);c.stroke()}
   else if(id==22){const a=t*3;c.fillStyle='#2a2f3a';c.beginPath();c.moveTo(B.x+Math.cos(a)*130,B.y+Math.sin(a)*130);c.lineTo(B.x+Math.cos(a)*130-10,B.y+Math.sin(a)*130+22);c.lineTo(B.x+Math.cos(a)*130+16,B.y+Math.sin(a)*130+22);c.fill()}
   else if(id==23&&t>2.2)spr(c,FS.f,300*Math.min(1,(t-2.2)/1.4),0,B.x,B.y-(t-2.2)*30,-Math.PI/2,.95);
   else if(id==24&&t>2.4)spr(c,FS.f,160,T*5,B.x-200+(t-2.4)*340,B.y-60*Math.sin((t-2.4)/1.2*3.14),(t-2.4)*3-1.5,1)}
  c.strokeStyle=FS.ph=='fight'?(FS.tn<50?'#fff':FS.tn<80?'#ff8':'#f55'):'rgba(255,255,255,.8)';c.lineWidth=FS.ph=='fight'?Math.max(1,3-FS.tn*.02):1.5;c.beginPath();c.moveTo(B.x+Math.cos(B.a)*40,B.y+Math.sin(B.a)*40);c.quadraticCurveTo((B.x+tx)/2+Math.sin(T*10)*(FS.ph=='fight'?FS.tn*.1:0),(B.y+ty)/2,tx,ty);c.stroke();
  if(FS.ph!='fight'){const bb=Math.sin(T*3)*2+(FS.ph=='bite'?Math.sin(T*40)*5:0);c.fillStyle='#fff';c.beginPath();c.arc(tx,ty+bb,6,0,7);c.fill();c.fillStyle='#e22';c.beginPath();c.arc(tx,ty+bb-2,6,Math.PI,0);c.fill();
   if(FS.bi>=0){const b=BAITS[FS.bi];c.fillStyle=b.col;c.shadowColor=b.col;c.shadowBlur=b.gl;c.beginPath();c.arc(tx,ty+8,3,0,7);c.fill();c.shadowBlur=0;if(Math.random()<.2+FS.bi*.2)sp(tx,ty+8,rnd(30)-15,rnd(30)-15,.8,2,b.col)}}
  if(FS.ph=='bite'){c.fillStyle='#ff4';c.font='bold 40px sans-serif';c.fillText('!',tx+12,ty-12)}}
 // wake (particles) + boat
 for(const p of PL)if(p.l>0){c.globalAlpha=Math.max(0,p.l/p.m);c.fillStyle=p.c;c.beginPath();c.arc(p.x,p.y,p.s,0,7);c.fill()}c.globalAlpha=1;
 c.save();c.translate(B.x,B.y);c.rotate(B.a+B.rock);c.fillStyle='rgba(0,20,40,.25)';c.beginPath();c.ellipse(4,6,52,20,0,0,7);c.fill();
 c.fillStyle='#f4f1ea';c.beginPath();c.moveTo(52,0);c.quadraticCurveTo(40,-22,-30,-20);c.lineTo(-44,-16);c.lineTo(-44,16);c.lineTo(-30,20);c.quadraticCurveTo(40,22,52,0);c.fill();c.strokeStyle='#1d6fb8';c.lineWidth=5;c.stroke();c.fillStyle='#b8885a';c.beginPath();c.moveTo(36,0);c.quadraticCurveTo(28,-13,-24,-13);c.lineTo(-24,13);c.quadraticCurveTo(28,13,36,0);c.fill();c.fillStyle='#2a6fb0';c.fillRect(-12,-9,22,18);c.fillStyle='#cfe9ff';c.fillRect(-4,-7,10,14);c.restore();
 // sample cast ring for destination
 if(B.tg){c.strokeStyle='#ff6';c.lineWidth=2;c.beginPath();c.arc(B.tg.x,B.tg.y,10+Math.sin(T*6)*3,0,7);c.stroke();c.beginPath();c.moveTo(B.tg.x-6,B.tg.y);c.lineTo(B.tg.x+6,B.tg.y);c.moveTo(B.tg.x,B.tg.y-6);c.lineTo(B.tg.x,B.tg.y+6);c.stroke()}
 // location labels
 c.textAlign='center';c.font='bold 22px sans-serif';for(const k in LOC){const L=LOC[k];if(cam.z>.55&&vis(L.x,L.y,300)){c.fillStyle='rgba(255,255,255,.65)';c.fillText(S.seen[k]?L.n:'???',L.x,L.y-L.r*1.1)}}
 c.restore();
 // daylight / weather overlay
 const dk=dark()+wx*.08;if(dk>0){c.fillStyle='rgba(2,8,40,'+dk+')';c.fillRect(0,0,W,H)}
 if(wx>0){c.strokeStyle='rgba(200,225,255,.45)';c.lineWidth=1;c.beginPath();const n=wx==2?260:120;for(let i=0;i<n;i++){const x=(i*173+T*(wx==2?900:500))%(W+200)-100,y=(i*97+T*1100)%H;c.moveTo(x,y);c.lineTo(x-8,y+22)}c.stroke();if(wx==2&&Math.random()<.01){c.fillStyle='rgba(255,255,255,.5)';c.fillRect(0,0,W,H)}}
const vg=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.45,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,10,30,0)');vg.addColorStop(1,'rgba(0,10,30,.45)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 // bars
 const bars=FS&&FS.ph=='fight';$('bars').hidden=!bars;if(bars){$('pb').style.width=cl(FS.p,0,100)+'%';const t=cl(FS.tn,0,100);$('tb').style.width=t+'%';$('tb').style.background=t<50?'#2e8':t<80?'#fd3':'#f33'}
 // popup canvas
 const pc=$('pc');if(pc&&POP){const x=pc.getContext('2d'),f=ALL[POP.id];x.clearRect(0,0,pc.width,pc.height);const g=x.createRadialGradient(pc.width/2,pc.height/2,10,pc.width/2,pc.height/2,pc.width/2);g.addColorStop(0,f.r==3?'rgba(255,190,50,.5)':'rgba(80,220,255,.25)');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,pc.width,pc.height);spr(x,f,Math.min(pc.width*.8,(f.s==5?.5:1)*(60+Math.pow(POP.w,.3)*30)*(f.r==3?1.6:1)),T,pc.width/2,pc.height/2,Math.sin(T*2)*.1)}
 if(panel=='aq'&&$('aqc'))drawAq(.016);
 // minimap
 m2.clearRect(0,0,170,170);m2.fillStyle='rgba(5,30,60,.8)';m2.fillRect(0,0,170,170);const sc=170/5600,mxp=x=>x*sc+85,myp=y=>(y-600)*sc+85;
 m2.fillStyle='#d8c88a';for(const i of ISL){pathBlob(m2,i,1,mxp,myp);m2.fill()}
 for(const k in LOC){const L=LOC[k];m2.fillStyle=S.seen[k]?L.c:'#334';m2.globalAlpha=.8;pathBlob(m2,L,1,mxp,myp);m2.fill();m2.globalAlpha=1;m2.fillStyle='#fff';m2.font='9px sans-serif';m2.textAlign='center';m2.fillText(S.seen[k]?L.n.split(' ')[1]||L.n:'?',mxp(L.x),myp(L.y)+3)}
 if(B.tg){m2.strokeStyle='#ff6';m2.beginPath();m2.arc(mxp(B.tg.x),myp(B.tg.y),4,0,7);m2.stroke()}
 m2.fillStyle='#f55';m2.beginPath();m2.arc(mxp(B.x),myp(B.y),3.5,0,7);m2.fill()}
let last=performance.now(),uit=0;
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;try{if(!panel||panel=='aq'||true)upd(dt);render_();uit+=dt;if(uit>.15){uit=0;ui()}}catch(e){console.error(e)}requestAnimationFrame(loop)}
ui();requestAnimationFrame(loop);

setTimeout(()=>toast('Right-click to throw bait · Left-click water to sail'),700);
