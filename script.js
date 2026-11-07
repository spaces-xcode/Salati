/* Bradford Prayer Times – vanilla JS. Row = 11 values:
   [FajrS,FajrI,Sunrise,DhuhrS,DhuhrI,AsrS,AsrI,MaghribS,MaghribI,IshaS,IshaI] */
const $=s=>document.querySelector(s), pad=n=>String(n).padStart(2,'0');
const PR=['fajr','dhuhr','asr','maghrib','isha'], IQ={fajr:1,dhuhr:4,asr:6,maghrib:8,isha:10}, ST={fajr:0,dhuhr:3,asr:5,maghrib:7,isha:9};
const HEAD=['Fajr S','Fajr Iqama','Sunrise','Dhuhr S','Dhuhr Iqama','Asr S','Asr Iqama','Maghrib S','Maghrib Iqama','Isha S','Isha Iqama'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const OK=t=>/^([01]\d|2[0-3]):[0-5]\d$/.test(t), hm=s=>s.slice(0,2)+':'+s.slice(2);

/* ---------- Storage ---------- */
let db; try{db=JSON.parse(localStorage.bpt)}catch(_e){db=null}
if(!db){db={data:{},set:{on:{fajr:1,dhuhr:1,asr:1,maghrib:1,isha:1},mode:'full',vol:.8,rem:0,notif:0,jtime:'13:00',jmsg:"Jummah Prayer at 1:00 PM InshaAllah.",fired:{}}};
 // Seed: Bradford November 2026 (transcribed from the supplied image)
 const S=`0511 0704 1151 1405 1634 1639 1829|0512 0705 1151 1404 1632 1637 1829|0512 0707 1151 1402 1630 1635 1828|0513 0709 1151 1401 1628 1633 1828|0514 0711 1151 1400 1626 1631 1827|0515 0713 1151 1358 1625 1630 1825|0517 0715 1151 1357 1623 1628 1824|0519 0717 1151 1355 1621 1626 1822|0520 0719 1151 1354 1619 1624 1821|0522 0721 1151 1353 1618 1623 1819|0523 0723 1151 1351 1616 1621 1818|0525 0725 1151 1350 1614 1619 1817|0527 0726 1151 1349 1613 1618 1815|0528 0728 1151 1348 1611 1616 1814|0530 0730 1152 1347 1609 1614 1813|0531 0732 1152 1346 1608 1613 1812|0533 0734 1152 1344 1608 1613 1811|0534 0736 1152 1343 1605 1610 1809|0536 0738 1152 1342 1604 1609 1808|0537 0739 1153 1341 1602 1607 1807|0539 0741 1153 1341 1601 1606 1807|0540 0743 1153 1340 1600 1605 1806|0541 0745 1153 1339 1559 1604 1805|0543 0746 1154 1338 1557 1602 1804|0544 0748 1154 1337 1556 1601 1803|0546 0750 1154 1336 1555 1600 1803|0547 0751 1155 1336 1554 1559 1802|0548 0753 1155 1335 1553 1558 1801|0549 0755 1155 1335 1553 1558 1801|0551 0756 1156 1334 1552 1557 1800`;
 db.data['2026-11']={};S.split('|').forEach((r,i)=>{const[f,sr,d,a,m,mi,is]=r.split(' ').map(hm);
  db.data['2026-11'][i+1]=[f,i<14?'06:00':'06:30',sr,d,'13:00',a,'15:00',m,mi,is,'19:00']});save()}
function save(){try{localStorage.bpt=JSON.stringify(db)}catch(e){alert('Storage full: '+e.message)}}
const key=d=>d.getFullYear()+'-'+(d.getMonth()+1);
const rowOf=d=>(db.data[key(d)]||{})[d.getDate()];  // handles month transitions

/* ---------- Navigation ---------- */
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('on',x==b));
 document.querySelectorAll('main section').forEach(s=>s.hidden=s.id!=b.dataset.v)});

/* ---------- Clock, dashboard, scheduler ---------- */
let view=new Date();
function tick(){
 const n=new Date(); $('#clock').textContent=n.toLocaleTimeString('en-GB');
 let h=''; try{h=' · '+n.toLocaleDateString('en-u-ca-islamic',{day:'numeric',month:'long',year:'numeric'})}catch(_e){}
 $('#dates').textContent=n.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+h;
 const r=rowOf(n); if(!r){$('#next').textContent='No timetable saved for this month – go to Upload.';return}
 // next prayer (by Iqama); falls through to tomorrow's Fajr
 let nx=null;for(const p of PR){const t=at(n,r[ST[p]]);if(t>n){nx={p,t};break}}
 if(!nx){const d=new Date(n);d.setDate(d.getDate()+1);const r2=rowOf(d);if(r2)nx={p:'fajr',t:at(d,r2[0])}}
 if(nx){const s=Math.floor((nx.t-n)/1000);$('#next').innerHTML=`Next Prayer: <b style="font-size:1.2rem">${nx.p.toUpperCase()}</b>Time Remaining<b>${pad(s/3600|0)}:${pad(s%3600/60|0)}:${pad(s%60)}</b>`;
  document.querySelectorAll('.cards .card').forEach(c=>c.classList.toggle('hl',c.dataset.p==nx.p))}
 check(n,r);
}
function at(d,t){const x=new Date(d);x.setHours(+t.slice(0,2),+t.slice(3,5),0,0);return x}
function cards(){const n=new Date(),r=rowOf(n);if(!r){$('#cards').innerHTML='';return}
 $('#cards').innerHTML=PR.map(p=>`<div class="card" data-p="${p}"><div style="font-size:1.8rem">${{fajr:'🌙',dhuhr:'☀️',asr:'🌤️',maghrib:'🌇',isha:'🌌'}[p]}</div><h3>${p[0].toUpperCase()+p.slice(1)}</h3>Start <b>${r[ST[p]]}</b><br>Iqama <b>${r[IQ[p]]}</b><br><small>${db.set.on[p]?'🔔 On':'🔕 Off'}</small></div>`).join('')+`<div class="card">🌅<h3>Sunrise</h3><b>${r[2]}</b><br><small>No Adhan</small></div>`;
 $('#jummah').innerHTML=`<h3>🕋 Jummah (Friday)</h3>${db.set.jmsg}<br><small>Time: ${db.set.jtime}${new Date().getDay()==5?' — <b>Today!</b>':''}</small>`}

/* ---------- Adhan / alerts ---------- */
let audio=null,actx=null,stopSynth=false;
function unlock(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();actx.resume()}catch(_e){}}
document.addEventListener('click',unlock,{once:true});
function beep(count){unlock();if(!actx)return;stopSynth=false;for(let i=0;i<count;i++)setTimeout(()=>{if(stopSynth)return;
 const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=660;g.gain.value=db.set.vol*.3;o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+.6)},i*900)}
function play(mode){stopAdhan();if(mode=='silent')return;
 if(mode=='full'){audio=new Audio(db.set.custom||'azan.mp3');audio.volume=db.set.vol;
  audio.onerror=()=>beep(8); // fall back to chime if the file can't load
  audio.play().catch(e=>{if(e.name=='NotAllowedError')alert('Click anywhere on the page once so the browser allows audio.');else beep(8)})}
 else beep(2)}
function stopAdhan(){stopSynth=true;if(audio){audio.pause();audio=null}}
function fire(p,title,body,sound){
 if(sound)play(db.set.mode);
 $('#at').textContent=title;$('#ac').textContent=body;$('#alert').hidden=false;
 if(db.set.notif&&'Notification' in window&&Notification.permission=='granted')new Notification(title,{body})}
function check(n,r){const today=n.toDateString();
 // Catch-up windows (not an exact-minute match) so throttled/background timers still fire.
 const due=(t,mins)=>{const d=n-at(n,t);return d>=0&&d<mins*6e4};
 for(const p of PR){if(!db.set.on[p])continue;           // Sunrise is never checked: no Adhan
  const st=r[ST[p]],iq=r[IQ[p]],mark=today+p+'s',remK=today+p+'r';
  if(OK(st)&&due(st,5)&&!db.set.fired[mark]){db.set.fired[mark]=1;pruneFired();save();fire(p,`IT'S TIME FOR ${p.toUpperCase()}`,'Scheduled: '+st,true)}
  if(db.set.rem&&OK(iq)){const rt=new Date(at(n,iq)-db.set.rem*6e4),rs=pad(rt.getHours())+':'+pad(rt.getMinutes());
   if(due(rs,2)&&!db.set.fired[remK]){db.set.fired[remK]=1;save();fire(p,`${p.toUpperCase()} Iqama in ${db.set.rem} min`,'Iqama: '+iq,false);beep(1)}}}}
function pruneFired(){const k=Object.keys(db.set.fired);if(k.length>60)k.slice(0,30).forEach(x=>delete db.set.fired[x])}
$('#stop').onclick=stopAdhan;$('#close').onclick=()=>{stopAdhan();$('#alert').hidden=true};

/* ---------- Monthly table ---------- */
function month(){const y=view.getFullYear(),m=view.getMonth(),days=new Date(y,m+1,0).getDate(),D=db.data[y+'-'+(m+1)],n=new Date();
 $('#mt').textContent=MONTHS[m]+' '+y;
 if(!D){$('#tbl').innerHTML='<tr><td>No data for this month. Use Upload.</td></tr>';return}
 let h='<tr><th>Date</th>'+HEAD.map(x=>`<th>${x}</th>`).join('')+'</tr>';
 for(let d=1;d<=days;d++){const t=n.getFullYear()==y&&n.getMonth()==m&&n.getDate()==d;
  h+=`<tr class="${t?'today':''}"><td>${d}</td>${(D[d]||Array(11).fill('–')).map(x=>`<td>${x}</td>`).join('')}</tr>`}
 $('#tbl').innerHTML=h}
$('#pm').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()-1,1);month()};
$('#nm').onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+1,1);month()};

/* ---------- Upload + OCR + editor ---------- */
const drop=$('#drop');
drop.ondragover=e=>{e.preventDefault();drop.classList.add('over')};drop.ondragleave=()=>drop.classList.remove('over');
drop.ondrop=e=>{e.preventDefault();drop.classList.remove('over');handle(e.dataTransfer.files[0])};
$('#file').onchange=e=>handle(e.target.files[0]);
/* Clean the photo before OCR: colour fills (yellow/green rows) and grid lines are what confuse Tesseract.
   1) take max(R,G,B) so coloured fills become bright, 2) adaptive threshold, 3) erase long grid lines. */
function binarize(img){
 const w=img.width,h=img.height,d=img.data,g=new Uint8Array(w*h);
 for(let i=0;i<w*h;i++)g[i]=Math.max(d[4*i],d[4*i+1],d[4*i+2]);
 const W=w+1,I=new Float64Array(W*(h+1));
 for(let y=0;y<h;y++){let row=0;for(let x=0;x<w;x++){row+=g[y*w+x];I[(y+1)*W+x+1]=I[y*W+x+1]+row}}
 const R=25,dark=new Uint8Array(w*h);
 for(let y=0;y<h;y++){const y0=Math.max(0,y-R),y1=Math.min(h,y+R+1);
  for(let x=0;x<w;x++){const x0=Math.max(0,x-R),x1=Math.min(w,x+R+1);
   const mean=(I[y1*W+x1]-I[y0*W+x1]-I[y1*W+x0]+I[y0*W+x0])/((y1-y0)*(x1-x0));
   dark[y*w+x]=g[y*w+x]<mean-15?1:0}}
 const kill=new Uint8Array(w*h),minH=Math.max(40,Math.round(w*.03)),minV=Math.max(30,Math.round(h*.018));
 for(let y=0;y<h;y++){let x=0;while(x<w){if(dark[y*w+x]){const s=x;while(x<w&&dark[y*w+x])x++;if(x-s>=minH)for(let k=s;k<x;k++)kill[y*w+k]=1}else x++}}
 for(let x=0;x<w;x++){let y=0;while(y<h){if(dark[y*w+x]){const s=y;while(y<h&&dark[y*w+x])y++;if(y-s>=minV)for(let k=s;k<y;k++)kill[k*w+x]=1}else y++}}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  let k=0;for(let dy=-1;dy<=1&&!k;dy++)for(let dx=-1;dx<=1;dx++){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<h&&xx>=0&&xx<w&&kill[yy*w+xx]){k=1;break}}
  const v=dark[y*w+x]&&!k?0:255,i=4*(y*w+x);d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}
 return img}
async function prep(f){
 const bmp=await createImageBitmap(f),sc=Math.min(4,Math.max(1,2550/bmp.width));
 const c=document.createElement('canvas'),P=30;c.width=Math.round(bmp.width*sc);c.height=Math.round(bmp.height*sc);
 const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';x.drawImage(bmp,0,0,c.width,c.height);
 x.putImageData(binarize(x.getImageData(0,0,c.width,c.height)),0,0);
 const o=document.createElement('canvas');o.width=c.width+2*P;o.height=c.height+2*P;
 const ox=o.getContext('2d');ox.fillStyle='#fff';ox.fillRect(0,0,o.width,o.height);ox.drawImage(c,P,P);return o}
/* Fix typical OCR slips inside a time token (O->0, l/I/|->1, S->5, B->8) */
const fixTok=t=>t.replace(/[Oo]/g,'0').replace(/[lI|]/g,'1').replace(/S/g,'5').replace(/B/g,'8');
function parseTable(txt){
 const mm=txt.match(new RegExp('('+MONTHS.join('|')+')\\s*(20\\d\\d)','i'));
 let y=new Date().getFullYear(),m=new Date().getMonth()+1,gotM=false;
 if(mm){m=MONTHS.findIndex(x=>x.toLowerCase()==mm[1].toLowerCase())+1;y=+mm[2];gotM=true}
 const rows={};
 txt.split('\n').forEach(l=>{
  l=l.replace(/^[\s|_\[\]()!'"`.,;:-]+/,'');
  const a=l.match(/^(\d{1,2})\s*[*†‡]?[\s|]+(.*)$/);if(!a)return;
  const day=+a[1];if(day<1||day>31)return;
  const t=[],re=/([0-9OoIlSB|]{1,2})\s*[:.;,]\s*([0-9OoIlSB|]{2})(?![0-9])/g;let k;
  while((k=re.exec(a[2]))){t.push(pad(+fixTok(k[1]))+':'+fixTok(k[2]))}
  if(t.length>=11)rows[day]=t.slice(0,11)});
 return{y,m,rows,gotM}}
async function handle(f){
 if(!f||!/^image\/(jpe?g|png)$/.test(f.type))return $('#status').textContent='❌ Invalid file. Please upload a JPG or PNG image.';
 const url=URL.createObjectURL(f);$('#prev').src=url;$('#prev').hidden=false;
 if(!window.Tesseract)return $('#status').textContent='❌ OCR library not loaded (offline?). You can still edit the month manually in Settings.';
 let worker;
 try{$('#status').textContent='⏳ Preparing image…';
  let step='';
  worker=await Tesseract.createWorker('eng',1,{logger:m=>{if(m.status=='recognizing text')$('#status').textContent='⏳ Reading image'+step+'… '+Math.round(m.progress*100)+'%'}});
  await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});
  let best={y:0,m:0,rows:{}},cleaned=null;
  try{cleaned=await prep(f)}catch(e){console.warn('prep failed',e)}
  const attempts=[];if(cleaned)attempts.push(cleaned);attempts.push(f);
  for(let i=0;i<attempts.length;i++){
   step=i?' (2nd try)':'';
   const r=await worker.recognize(attempts[i]),p=parseTable(r.data.text);
   if(Object.keys(p.rows).length>Object.keys(best.rows).length||!best.y)best=p;
   if(Object.keys(best.rows).length>=25)break}
  const found=Object.keys(best.rows).length;
  $('#status').textContent=found?`✅ Recognised ${found} rows for ${MONTHS[best.m-1]} ${best.y}.${best.gotM?'':' (Month not detected – please check the month/year.)'} Please verify below.`:'⚠️ Could not recognise any rows. Try a sharper image, or fill the table manually.';
  openEditor(best.y,best.m,best.rows)}
 catch(e){$('#status').textContent='❌ OCR failed: '+e.message}
 finally{try{worker&&await worker.terminate()}catch(_e){}}}
let ed={};
function openEditor(y,m,rows){ed={y,m};const days=new Date(y,m,0).getDate();$('#editor').hidden=false;$('#et').textContent=MONTHS[m-1]+' '+y;
 let h='<tr><th>Day</th>'+HEAD.map(x=>`<th>${x}</th>`).join('')+'</tr>';
 for(let d=1;d<=days;d++){const r=rows[d]||Array(11).fill('');h+=`<tr><td>${d}</td>${r.map((v,i)=>`<td><input data-d="${d}" data-i="${i}" value="${v}" placeholder="--:--"></td>`).join('')}</tr>`}
 $('#etbl').innerHTML=h}
$('#save').onclick=()=>{let bad=0;const out={};
 document.querySelectorAll('#etbl input').forEach(i=>{const ok=OK(i.value.trim());i.classList.toggle('bad',!ok);if(!ok)bad++;(out[i.dataset.d]=out[i.dataset.d]||[])[i.dataset.i]=i.value.trim()});
 if(bad)return alert(`${bad} missing or invalid time(s) (format HH:MM, 24h). Highlighted in red – please correct.`);
 db.data[ed.y+'-'+ed.m]=out;save();$('#editor').hidden=true;$('#status').textContent='💾 Saved.';view=new Date(ed.y,ed.m-1,1);month();cards()};

/* ---------- Settings ---------- */
function settings(){const s=db.set;
 $('#set').innerHTML=`<fieldset><legend>Adhan per prayer</legend>${PR.map(p=>`<label><input type="checkbox" data-p="${p}" ${s.on[p]?'checked':''}> ${p}</label>`).join('')}</fieldset>
 <label>Sound <select id="mode"><option value="full">Full Adhan</option><option value="short">Short notification</option><option value="silent">Silent</option></select></label>
 <label>Volume <input type="range" id="vol" min="0" max="1" step=".05" value="${s.vol}"></label>
 <label>Reminder before Iqama <select id="rem"><option value="0">Off</option><option value="5">5 min</option><option value="10">10 min</option></select></label>
 <label>Custom Adhan (MP3) <input type="file" id="mp3" accept="audio/mpeg"></label>
 <button id="test">Test Adhan</button> <button id="notif">Enable browser notifications</button>
 <p><small>ℹ️ Browsers need one click on the page to allow audio. Adhan and notifications only work while the app is open; browsers/phones may suspend it in the background or when closed. The bundled azan.mp3 is used unless you pick a custom MP3.</small></p>
 <label>Jummah time <input id="jt" type="time" value="${s.jtime}"></label>
 <label>Announcement <input id="jm" style="width:100%" value="${s.jmsg}"></label>
 <button id="edit">Edit this month manually</button> <button id="exp">Export JSON</button>
 <label class="btn">Import JSON<input id="imp" type="file" accept=".json" hidden></label> <button id="reset" style="background:#b3261e">Reset month</button>`;
 $('#mode').value=s.mode;$('#rem').value=s.rem;
 document.querySelectorAll('[data-p]').forEach(c=>c.onchange=()=>{s.on[c.dataset.p]=c.checked?1:0;save();cards()});
 $('#mode').onchange=e=>{s.mode=e.target.value;save()};$('#vol').oninput=e=>{s.vol=+e.target.value;save()};
 $('#rem').onchange=e=>{s.rem=+e.target.value;save()};
 $('#jt').onchange=e=>{s.jtime=e.target.value;save();cards()};$('#jm').onchange=e=>{s.jmsg=e.target.value;save();cards()};
 $('#test').onclick=()=>{unlock();play(s.mode=='silent'?'short':s.mode)};
 $('#mp3').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{s.custom=r.result;save();alert('Custom Adhan saved (large files may exceed browser storage).')};r.readAsDataURL(f)};
 $('#notif').onclick=async()=>{if(!('Notification' in window))return alert('Notifications are not supported in this browser.');
  s.notif=(await Notification.requestPermission())=='granted'?1:0;save();alert(s.notif?'Notifications enabled.':'Permission denied.')};
 $('#edit').onclick=()=>{const d=new Date(),D=db.data[key(d)]||{};document.querySelector('[data-v=upload]').click();openEditor(d.getFullYear(),d.getMonth()+1,D)};
 $('#exp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(db)],{type:'application/json'}));a.download='prayer-data.json';a.click()};
 $('#imp').onchange=e=>{const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);if(!j.data||!j.set)throw 0;db=j;save();location.reload()}catch(_e){alert('Invalid backup file.')}};r.readAsText(e.target.files[0])};
 $('#reset').onclick=()=>{if(confirm('Delete this month\'s timetable?')){delete db.data[key(new Date())];save();location.reload()}}}

/* ---------- Init ---------- */
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
// Sound-unlock banner: browsers block autoplay until the page has had one tap/click
if(!(navigator.userActivation&&navigator.userActivation.hasBeenActive))$('#snd').hidden=false;
['click','touchstart','keydown'].forEach(e=>addEventListener(e,()=>{unlock();$('#snd').hidden=true},{once:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
cards();month();settings();tick();setInterval(tick,1000);setInterval(cards,60000);
