// ===== CENTRAL GAME DATA (edit freely) =====
const RAR=['Common','Rare','Epic','Mythos'],RM=[1,2.5,6,25],RW=[10,3,1],RSTR=[[1,2.5],[2.5,4.5],[4.5,6.5],[7.5,9.5]];
const BAITS=[{n:'Basic Bait',p:100,b:.05,uses:5,col:'#ffe9a0',gl:6},{n:'Rare Bait',p:500,b:.10,uses:5,col:'#5cf',gl:16},{n:'Ultimate Fresh Mythos Bait',p:1000,b:.20,uses:5,col:'#fd4',gl:30}];
const MYTHOS_BASE=.03,MYTHOS_CAP=.30; // base chance per cast + bait bonus, capped
const LOC={
 c:{n:'Mediterranean Coast',x:0,y:0,r:620,c:'#35d6c4',d:12},
 s:{n:'Posidonia Seaweed Forest',x:-1150,y:-650,r:540,c:'#2f9e6a',d:25},
 r:{n:'Mediterranean Coral Reef',x:1150,y:-750,r:540,c:'#ff8f6b',d:30},
 w:{n:'Greek Old Shipwreck',x:950,y:950,r:480,c:'#c9a26a',d:45},
 o:{n:'Open Mediterranean Sea',x:-1350,y:950,r:690,c:'#1f5f9e',d:1200},
 t:{n:'Ocean Trench',x:0,y:2100,r:690,c:'#02030c',d:4500}};
// name,rarity,value,minKg,maxKg,color,accent,shape(0 fish,1 deep,2 eel,3 ray,4 shark,5 kraken,6 whale),habitats,nightBonus,description,rarityWeight
const F=[
['European Sardine',0,10,.02,.12,'#9bb7cc','#2d5a8a',0,'cr','','Silvery schooling fish of coastal waters.'],
['European Anchovy',0,10,.01,.05,'#a7b8a0','#3a5a7a',0,'cs','','Tiny blue-backed schooling fish.'],
['Small Sandeel',0,9,.01,.06,'#d9c89a','#9a8a5a',2,'cs','','Slender fish that buries itself in sand.'],
['Mediterranean Sand Eel',0,12,.02,.1,'#cbb68a','#7a6a3a',2,'cs','','Long, pale burrower of sandy flats.'],
['Cardinalfish',0,14,.02,.1,'#e5684a','#a33a2a',1,'rw','','Red nocturnal fish hiding in crevices.'],
['Mediterranean Damselfish',0,14,.03,.12,'#2b2f66','#556',1,'rc','','Dark, territorial rock-dweller.'],
['Mediterranean Rainbow Wrasse',0,20,.05,.3,'#34c4a0','#ff9a3c',0,'crs','','Colourful wrasse of rocky shores.'],
['Gilthead Seabream',0,28,.3,2,'#c8ced6','#e8b23a',1,'cs','','Golden-browed favourite of Greek tables.'],
['Dusky Grouper',1,120,2,60,'#8a6b4a','#4a3a2a',1,'rw','','Huge, curious ambusher of rocky reefs.'],
['Black Scorpionfish',1,70,.2,1.5,'#7a2f26','#3a1a16',1,'rws','','Spiny camouflaged bottom dweller.'],
['Corvina',1,80,.5,25,'#6f7a63','#3a4a3a',0,'cws','','Silver-bronze drum fish of rocky coasts.'],
['European Conger Eel',1,110,2,70,'#4a4f57','#22262c',2,'wr','n','Powerful eel lurking in wrecks and holes.'],
['Atlantic Bonito',1,90,1,8,'#4a79b8','#1a2a3a',0,'oc','','Fast striped predator of open water.'],
['Twaite Shad',1,60,.3,1.5,'#a9c0d6','#4a6a8a',0,'co','','Silvery migratory herring relative.'],
['Duckbill Eagle Ray',1,150,5,120,'#5b5a52','#8a8a7a',3,'orc','','Graceful ray that glides on wide wings.'],
['Sphinx Blenny',1,50,.01,.04,'#b99a6a','#6a4a2a',2,'crs','','Tiny crested blenny, rarely seen.'],
['Mediterranean Grey Mullet',1,55,.5,6,'#9aa4a8','#5a6a6a',0,'cs','','Schooling grazer of harbours and lagoons.'],
['Swordfish',2,600,50,350,'#35507a','#8aa0c0',0,'ot','n','Pelagic hunter with a long, flat bill.'],
['Flying Fish',2,500,.2,1.5,'#4fa3d9','#cfeaff',0,'o','','Glides above waves on winglike fins.'],
['Great White Shark',2,1200,300,1100,'#7d8a96','#e8eef2',4,'ot','n','Apex predator, rare in these waters.',.5],
['Basking Shark',2,1500,1000,4000,'#5b6670','#3a444c',4,'o','','Gentle filter-feeding giant. Extremely rare.',.2],
// ---- MYTHOS (separate from the 21 normal fish) ----
['Colossus Kraken',3,6000,2000,8000,'#3a1a4a','#a0f',5,'to','','A legendary tentacled terror with glowing eyes.'],
['Great Megalodon',3,8000,20000,40000,'#2a2f3a','#556',4,'to','','Prehistoric shark of impossible size.'],
['Big White Sperm Whale',3,7000,30000,45000,'#f1f3f5','#c8d0d8',6,'ot','','A pale leviathan that rises from the deep.'],
['Giant Atlantic Bluefin Tuna',3,5000,400,900,'#2a5aa8','#cfd8e6',0,'ow','','A metallic blue torpedo of raw speed.']];
const ALL=F.map((a,i)=>({id:i,n:a[0],r:a[1],v:a[2],a:a[3],b:a[4],c:a[5],k:a[6],s:a[7],h:a[8],ng:a[9],d:a[10],q:a[11]||1}));
const NORMAL=ALL.slice(0,21),MYTH=ALL.slice(21);
const HABN={c:'Coast',s:'Seaweed Forest',r:'Coral Reef',w:'Shipwreck',o:'Open Sea',t:'Ocean Trench'};

// Catch-bar drain per second while fighting (by rarity). Lower = easier.
const DR=[.5,1.1,1.8,2.7];
