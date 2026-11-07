:root{--navy:#0b1f3a;--em:#0f8a5f;--gold:#d4af37;--bg:#f3f5f8}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:var(--bg);color:#16243a}
header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;color:#fff;background:linear-gradient(135deg,var(--navy),#0d4d3c)}
.logo{font-size:1.2rem}.logo small,.clock small{display:block;color:var(--gold);font-size:.75rem}#clock{font:700 1.5rem monospace;text-align:right}.clock{text-align:right}
nav{display:flex;gap:6px;padding:8px;background:var(--navy);position:sticky;top:0;z-index:5}
nav button{flex:1;padding:10px;border:0;border-radius:10px;background:#16335a;color:#fff}nav .on{background:var(--em)}
main{max-width:1100px;margin:auto;padding:14px}.card,.next,.drop{background:#fff;border-radius:16px;padding:16px;margin:10px 0;box-shadow:0 2px 10px #0001}
.next{background:var(--navy);color:#fff;text-align:center;border:2px solid var(--gold)}.next b{display:block;font:700 2rem monospace;color:var(--gold)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.cards .card{text-align:center;transition:.3s;margin:0}
.cards .hl{outline:3px solid var(--gold);transform:scale(1.03)}.cards h3{margin:4px 0;color:var(--em)}
.bar{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
button,.btn{cursor:pointer;padding:9px 14px;border:0;border-radius:10px;background:var(--em);color:#fff;font-size:.95rem}
.scroll{overflow-x:auto}table{border-collapse:collapse;width:100%;background:#fff;font-size:.85rem;text-align:center}
th{background:var(--navy);color:#fff;padding:6px;position:sticky;top:0}td{padding:5px;border:1px solid #e3e7ee}tr:nth-child(even) td{background:#fbf8e6}tr.today td{background:var(--gold)!important;font-weight:700}
td input{width:62px;text-align:center;border:1px solid #bbb;border-radius:6px;padding:3px}td input.bad{border-color:red;background:#fee}
.drop{border:2px dashed var(--em);text-align:center;padding:30px}.drop.over{background:#e6f6ef}#prev{max-width:100%;max-height:300px}
.warn{color:#8a5a00}#set label{display:block;margin:10px 0}#set fieldset{border:1px solid #ddd;border-radius:10px}
#alert{position:fixed;top:0;right:0;bottom:0;left:0;background:#0b1f3af2;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;z-index:99}
#alert[hidden],[hidden]{display:none!important}#alert h1{color:var(--gold);font-size:2.2rem}
@media print{header,nav,.bar button{display:none}}

nav button{margin:0 3px}.bar>*{margin:0 4px}
