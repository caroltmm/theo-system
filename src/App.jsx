import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xqkiqbaeimwkxdppaskz.supabase.co";
const SUPABASE_KEY = "sb_publishable_YkfnX-6cGjCUcOiZe6LFqQ_jSaIcH2i";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const todayKey    = () => new Date().toISOString().slice(0, 10);
const monthKey    = () => new Date().toISOString().slice(0, 7);
const daysInMonth = (ym) => { const [y,m]=ym.split("-").map(Number); return new Date(y,m,0).getDate(); };

const THEO = {
  name: "Theo",
  color1: "#FF6B35",
  color2: "#4ECDC4",
  color3: "#FFD700",
  color4: "#a78bfa",
  bgKid:  "linear-gradient(160deg,#0f0c29 0%,#1a1044 40%,#24243e 100%)",
  bgShop: "linear-gradient(160deg,#0d1b2a 0%,#1b2838 50%,#0a1628 100%)",
  phrases: [
    "Bora Theo, você consegue! 💪",
    "Campeão em campo e em casa! ⚽",
    "Cada tarefa é um gol, Theo! 🥅",
    "Você tá arrasando! 🔥",
    "Theo na área! 🎯",
  ],
  taskDone: [
    "Goool do Theo! ⚽",
    "Que chute! 🥅",
    "Passou pelo marcador! 🔥",
    "Drible perfeito! ⚡",
    "Campeão! 🏆",
  ],
};

const ICON_OPTIONS = ["⭐","🎯","🏆","🎮","🍕","🚀","🦁","🐉","🌟","💪","🍦","🎁","🧩","📖","🚲","🎨","🎸","🍫","🏅","🛹","⚽","👕","🎽","🧤"];

const S = {
  input: {width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.07)",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"},
  btnPrimary: {width:"100%",padding:"12px",background:"linear-gradient(90deg,#FF6B35,#ff8c42)",color:"#fff",border:"none",borderRadius:10,fontWeight:800,fontSize:14,cursor:"pointer"},
  card: {background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,padding:20,marginBottom:14},
  sectionLabel: {fontSize:11,fontWeight:700,letterSpacing:2,color:"#94a3b8",textTransform:"uppercase",marginBottom:12},
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
  @keyframes twinkle{0%,100%{opacity:0.15;transform:scale(1)}50%{opacity:0.9;transform:scale(1.5)}}
  @keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
  @keyframes slideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
  @keyframes popIn{0%{transform:scale(0.5) rotate(-10deg);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
  @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes floatBall{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-12px) rotate(120deg)}66%{transform:translateY(-6px) rotate(240deg)}}
  @keyframes glowGold{0%,100%{box-shadow:0 0 16px rgba(255,215,0,0.2)}50%{box-shadow:0 0 40px rgba(255,215,0,0.6)}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes bounceIn{0%{transform:scale(0.2) translateY(30px);opacity:0}60%{transform:scale(1.12)}80%{transform:scale(0.96)}100%{transform:scale(1);opacity:1}}
  @keyframes pendingPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,0.6)}50%{box-shadow:0 0 0 10px rgba(255,215,0,0)}}
  @keyframes heartbeat{0%,100%{transform:scale(1)}25%{transform:scale(1.15)}60%{transform:scale(1.08)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  *{font-family:'Nunito','Segoe UI',system-ui,sans-serif;}
  .task-card{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);}
  .task-card:active{transform:scale(0.96)!important}
  .prize-card{transition:all 0.2s ease;}
  .prize-card:hover{transform:scale(1.03)!important}
  .btn-b:active{transform:scale(0.94)!important}
  input,select{box-sizing:border-box}
`;

function Starfield() {
  const items = useRef(Array.from({length:50},(_,i)=>({
    id:i,x:Math.random()*100,y:Math.random()*100,
    size:Math.random()*2+0.6,delay:Math.random()*5,dur:2.5+Math.random()*3,
    isBall:i<5,
  }))).current;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {items.map(s=>s.isBall
        ?<div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,fontSize:s.size*6,opacity:0.05,animation:`floatBall ${8+s.delay}s ease-in-out ${s.delay}s infinite`}}>⚽</div>
        :<div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:"#fff",animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`}}/>
      )}
    </div>
  );
}

function Confetti({active}) {
  const p=useRef(Array.from({length:50},(_,i)=>({id:i,x:Math.random()*100,color:["#FFD700","#FF6B35","#4ECDC4","#a78bfa","#FF6B6B","#96CEB4"][i%6],size:Math.random()*11+5,delay:Math.random()*0.6,isBall:i%8===0}))).current;
  if(!active)return null;
  return <>{p.map(c=>c.isBall
    ?<div key={c.id} style={{position:"fixed",left:`${c.x}%`,top:-30,fontSize:20,zIndex:3000,pointerEvents:"none",animation:`fall 3s ease-in ${c.delay}s forwards`}}>⚽</div>
    :<div key={c.id} style={{position:"fixed",left:`${c.x}%`,top:-20,width:c.size,height:c.size,background:c.color,borderRadius:c.size>10?"50%":2,zIndex:3000,pointerEvents:"none",animation:`fall 2.8s ease-in ${c.delay}s forwards`}}/>
  )}</>;
}

function Toast({msg,color="#4ECDC4"}) {
  if(!msg)return null;
  return <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:color,color:"#fff",padding:"13px 28px",borderRadius:999,fontWeight:800,fontSize:16,animation:"slideDown 0.3s ease",zIndex:2999,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>{msg}</div>;
}

function Loader() {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f0c29 0%,#1a1044 40%,#24243e 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <style>{CSS}</style>
      <div style={{fontSize:60,animation:"floatBall 2s ease-in-out infinite"}}>⚽</div>
      <div style={{fontSize:18,fontWeight:800,color:"rgba(255,255,255,0.5)"}}>Carregando o sistema do Theo...</div>
      <div style={{width:44,height:44,border:"4px solid rgba(255,255,255,0.08)",borderTop:"4px solid #FF6B35",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
    </div>
  );
}

function TheoAvatar({size=52,glow=false}) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.48,flexShrink:0,boxShadow:glow?"0 0 0 3px rgba(255,107,53,0.5),0 0 24px rgba(255,107,53,0.4)":"0 4px 16px rgba(0,0,0,0.3)",animation:"heartbeat 4s ease-in-out infinite"}}>
      ⚽
    </div>
  );
}

function KidView({tasks,doneToday,totalPoints,pointsToday,maxPerDay,nextPrize,confetti,toast,toastColor,onComplete,setMode}) {
  const [pending,setPending]=useState(null);
  const phrase=useRef(THEO.phrases[Math.floor(Math.random()*THEO.phrases.length)]).current;
  const allDone=tasks.length>0&&tasks.every(t=>doneToday.includes(t.id));
  const donePct=tasks.length?Math.round((doneToday.length/tasks.length)*100):0;
  const handleCard=(task)=>{
    if(doneToday.includes(task.id))return;
    if(pending===task.id){onComplete(task);setPending(null);}
    else setPending(task.id);
  };
  return (
    <div style={{minHeight:"100vh",background:THEO.bgKid,color:"#fff",overflow:"hidden"}} onClick={e=>{if(!e.target.closest(".task-card"))setPending(null);}}>
      <style>{CSS}</style>
      <Starfield/>
      <Confetti active={confetti}/>
      <Toast msg={toast} color={toastColor}/>
      <div style={{position:"relative",zIndex:10,padding:"22px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <TheoAvatar size={50} glow/>
            <div>
              <div style={{fontSize:11,letterSpacing:2,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>Olá,</div>
              <div style={{fontSize:24,fontWeight:900,lineHeight:1,background:"linear-gradient(90deg,#fff,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Theo! 👋</div>
              <div style={{display:"flex",gap:2,marginTop:3}}>{[...Array(5)].map((_,i)=><span key={i} style={{fontSize:10,color:"#FFD700",animation:`twinkle ${1.5+i*0.3}s ease-in-out ${i*0.2}s infinite`}}>★</span>)}</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
            <button className="btn-b" onClick={()=>setMode("kid-dashboard")} style={{background:"rgba(167,139,250,0.2)",border:"1px solid rgba(167,139,250,0.4)",color:"#c4b5fd",padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:800}}>🗺️ Meu Mapa</button>
            <div style={{display:"flex",gap:6}}>
              <button className="btn-b" onClick={()=>setMode("shop")} style={{background:"rgba(255,215,0,0.15)",border:"1px solid rgba(255,215,0,0.35)",color:"#FFD700",padding:"6px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:800}}>🏪 Loja</button>
              <button className="btn-b" onClick={()=>setMode("pin-entry")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.35)",padding:"6px 10px",borderRadius:20,cursor:"pointer",fontSize:11}}>🔒</button>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,107,53,0.25)",borderRadius:12,padding:"9px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>💬</span>
          <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.8)",fontStyle:"italic"}}>{phrase}</span>
        </div>
      </div>
      <div style={{position:"relative",zIndex:10,padding:"0 20px 14px"}}>
        <div style={{background:"rgba(255,255,255,0.07)",border:`2px solid ${allDone?"#FFD700":"rgba(255,255,255,0.1)"}`,borderRadius:20,padding:"16px 18px",animation:allDone?"glowGold 2s infinite":"none",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-16,top:-16,fontSize:72,opacity:0.04,transform:"rotate(20deg)",pointerEvents:"none"}}>⚽</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,position:"relative"}}>
            <div>
              <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:2}}>Pontos do Theo</div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontSize:48,fontWeight:900,color:"#FFD700",lineHeight:1,textShadow:"0 0 20px rgba(255,215,0,0.4)"}}>{totalPoints}</span>
                <span style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:700}}>pts</span>
              </div>
              {pointsToday>0&&<div style={{fontSize:12,color:"#4ECDC4",fontWeight:700,marginTop:2}}>+{pointsToday} ganhos hoje! 🔥</div>}
            </div>
            <div style={{textAlign:"center"}}>
              {allDone?<div style={{fontSize:40,animation:"heartbeat 1s ease-in-out infinite"}}>🏆</div>:<><div style={{fontSize:30,fontWeight:900,color:donePct>=50?"#4ECDC4":"#FF6B35"}}>{donePct}%</div><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700}}>do dia</div></>}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:700,marginBottom:5}}>
            <span>Tarefas: {doneToday.length}/{tasks.length}</span>
            {nextPrize&&<span style={{color:"#a78bfa"}}>Próximo: {nextPrize.label} ({nextPrize.cost-totalPoints} pts)</span>}
          </div>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:999,height:10,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${donePct}%`,background:allDone?"linear-gradient(90deg,#FFD700,#FFA500,#FFD700)":"linear-gradient(90deg,#FF6B35,#4ECDC4)",borderRadius:999,transition:"width 0.8s ease",backgroundSize:"200%",animation:allDone?"shimmer 2s linear infinite":"none"}}/>
          </div>
        </div>
      </div>
      {pending&&<div style={{position:"relative",zIndex:10,margin:"0 20px 10px",padding:"10px 16px",background:"rgba(255,215,0,0.12)",border:"2px solid rgba(255,215,0,0.45)",borderRadius:12,fontSize:13,color:"#FFD700",textAlign:"center",fontWeight:800,animation:"pendingPulse 1s ease infinite"}}>👆 Toca de novo pra confirmar — ou toca fora pra cancelar!</div>}
      <div style={{position:"relative",zIndex:10,padding:"0 20px 32px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{fontSize:14}}>⚡</span>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>Missões de hoje</span>
          {allDone&&<span style={{fontSize:11,fontWeight:800,color:"#FFD700",background:"rgba(255,215,0,0.12)",padding:"2px 10px",borderRadius:999,border:"1px solid rgba(255,215,0,0.3)"}}>Todas feitas! 🎉</span>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:12}}>
          {tasks.map(task=>{
            const done=doneToday.includes(task.id);
            const isPending=pending===task.id;
            return (
              <div key={task.id} className="task-card" onClick={()=>handleCard(task)} style={{background:done?"linear-gradient(135deg,#FF6B35cc,#FF6B3588)":isPending?"rgba(255,215,0,0.16)":"rgba(255,255,255,0.07)",border:`2px solid ${done?"#FF6B35":isPending?"#FFD700":"rgba(255,255,255,0.1)"}`,borderRadius:18,padding:"16px 12px",cursor:done?"default":"pointer",textAlign:"center",animation:isPending?"pendingPulse 1s ease infinite":done?"popIn 0.5s ease":"none",boxShadow:done?"0 4px 20px rgba(255,107,53,0.3)":isPending?"0 4px 20px rgba(255,215,0,0.25)":"none",position:"relative",overflow:"hidden"}}>
                {done&&<div style={{position:"absolute",top:4,right:6,fontSize:9,fontWeight:800,color:"#fff",opacity:0.5}}>✓</div>}
                <div style={{fontSize:30,marginBottom:6}}>{done?"✅":isPending?"👆":task.icon}</div>
                <div style={{fontSize:13,fontWeight:800,color:done?"#fff":isPending?"#FFD700":"rgba(255,255,255,0.9)",marginBottom:6,lineHeight:1.3}}>{task.label}</div>
                <div style={{fontSize:11,fontWeight:800,color:done?"#fff":isPending?"#1a1a2e":"#FFD700",background:done?"rgba(255,255,255,0.2)":isPending?"#FFD700":"rgba(255,215,0,0.1)",borderRadius:999,padding:"3px 10px",display:"inline-block"}}>
                  {done?"Feito! 🎯":isPending?"Confirmar?":`+${task.points} pts`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KidDashboard({prizes,totalPoints,monthPoints,threshold80,progress80,reached80,currentMonthPrize,nextPrize,confetti,toast,toastColor,setMode}) {
  const allPrizes=[...prizes].sort((a,b)=>a.cost-b.cost);
  const levelColors=[
    {bg:"#FF6B35",glow:"rgba(255,107,53,0.7)",ring:"#FF8C5A"},
    {bg:"#FFD700",glow:"rgba(255,215,0,0.7)",ring:"#FFE55C"},
    {bg:"#4ECDC4",glow:"rgba(78,205,196,0.7)",ring:"#7EDDD7"},
    {bg:"#45B7D1",glow:"rgba(69,183,209,0.7)",ring:"#72CADE"},
    {bg:"#a78bfa",glow:"rgba(167,139,250,0.7)",ring:"#C4B0FC"},
    {bg:"#f472b6",glow:"rgba(244,114,182,0.7)",ring:"#F9A8D4"},
    {bg:"#fb923c",glow:"rgba(251,146,60,0.7)",ring:"#FCA86A"},
    {bg:"#34d399",glow:"rgba(52,211,153,0.7)",ring:"#6EE7B7"},
  ];
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#050010 0%,#0a0520 30%,#060d1e 70%,#020810 100%)",color:"#fff",position:"relative",overflowX:"hidden",paddingBottom:80}}>
      <style>{CSS}</style>
      <Starfield/>
      <Confetti active={confetti}/>
      <Toast msg={toast} color={toastColor}/>
      <div style={{position:"relative",zIndex:10,padding:"22px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <TheoAvatar size={46}/>
          <div>
            <div style={{fontSize:11,letterSpacing:2,color:"#a78bfa",textTransform:"uppercase"}}>Mapa do</div>
            <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(90deg,#fff,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Theo Campeão 🏆</div>
          </div>
        </div>
        <button className="btn-b" onClick={()=>setMode("kid")} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.5)",padding:"8px 16px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700}}>← Voltar</button>
      </div>
      <div style={{position:"relative",zIndex:10,padding:"14px 20px"}}>
        <div style={{background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,215,0,0.25)",borderRadius:20,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:2}}>Meus Pontos</div>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}>
              <span style={{fontSize:44,fontWeight:900,color:"#FFD700",lineHeight:1,textShadow:"0 0 20px rgba(255,215,0,0.4)"}}>{totalPoints}</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:700}}>pts</span>
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:46,animation:"floatBall 4s ease-in-out infinite"}}>⚽</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:1,fontWeight:700}}>EU AQUI!</div>
          </div>
        </div>
      </div>
      <div style={{position:"relative",zIndex:10,padding:"0 20px 10px"}}>
        <div style={{background:reached80?"rgba(255,215,0,0.1)":"rgba(167,139,250,0.07)",border:`2px solid ${reached80?"rgba(255,215,0,0.5)":"rgba(167,139,250,0.25)"}`,borderRadius:16,padding:"13px 16px",animation:reached80?"glowGold 2s infinite":"none"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <div style={{fontSize:10,letterSpacing:2,color:reached80?"#FFD700":"#a78bfa",textTransform:"uppercase",fontWeight:700,marginBottom:2}}>{reached80?"🏆 META DO MÊS!":"⚡ Meta do mês — 80%"}</div>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)"}}>{monthPoints} de {threshold80} pontos</div>
            </div>
            <div style={{fontSize:28,fontWeight:900,color:reached80?"#FFD700":"#a78bfa"}}>{Math.round(progress80)}%</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:999,height:10,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress80}%`,background:reached80?"linear-gradient(90deg,#FFD700,#FFA500,#FFD700)":"linear-gradient(90deg,#a78bfa,#7c3aed)",borderRadius:999,transition:"width 1s ease",backgroundSize:"200%",animation:reached80?"shimmer 1.5s linear infinite":"none"}}/>
          </div>
        </div>
      </div>
      <div style={{position:"relative",zIndex:10,padding:"8px 20px 0"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",marginBottom:16,textAlign:"center"}}>🎯 Prêmios que o Theo pode ganhar</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {allPrizes.map((prize,idx)=>{
            const col=levelColors[idx%levelColors.length];
            const unlocked=totalPoints>=prize.cost;
            const pct=Math.min((totalPoints/prize.cost)*100,100);
            const isNext=!prize.redeemed&&prize===nextPrize;
            const side=idx%2===0?"row":"row-reverse";
            return (
              <div key={prize.id} style={{display:"flex",flexDirection:side,alignItems:"center",gap:12,animation:`bounceIn 0.5s ease ${idx*0.07}s both`}}>
                <div style={{flex:1,background:prize.redeemed?"rgba(255,255,255,0.03)":unlocked?`linear-gradient(135deg,${col.bg}28,${col.bg}15)`:"rgba(255,255,255,0.05)",border:`2px solid ${prize.redeemed?"rgba(255,255,255,0.05)":unlocked?col.bg:"rgba(255,255,255,0.09)"}`,borderRadius:18,padding:"11px 13px",opacity:prize.redeemed?0.4:1,boxShadow:isNext?`0 0 24px ${col.glow}`:"none",position:"relative",overflow:"hidden"}}>
                  {unlocked&&!prize.redeemed&&<div style={{position:"absolute",top:-30,right:-30,width:90,height:90,background:col.bg,borderRadius:"50%",opacity:0.07,filter:"blur(20px)",pointerEvents:"none"}}/>}
                  {isNext&&<div style={{position:"absolute",top:7,right:7,fontSize:8,fontWeight:900,color:"#fff",background:col.bg,padding:"2px 7px",borderRadius:999,letterSpacing:1}}>PRÓXIMO! ⚡</div>}
                  <div style={{display:"flex",alignItems:"center",gap:10,position:"relative"}}>
                    <div style={{width:42,height:42,borderRadius:12,background:prize.redeemed?"rgba(255,255,255,0.05)":unlocked?col.bg:"rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,animation:isNext?"floatUp 2.5s ease-in-out infinite":"none"}}>{prize.redeemed?"✅":prize.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:800,color:prize.redeemed?"#64748b":unlocked?"#fff":"rgba(255,255,255,0.45)",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{prize.label}</div>
                      <div style={{fontSize:11,fontWeight:700,color:prize.redeemed?"#475569":unlocked?col.bg:"rgba(255,255,255,0.25)"}}>{prize.redeemed?"✓ Já é seu!":unlocked?"🛒 Disponível na Loja!":`Faltam ${prize.cost-totalPoints} pts`}</div>
                      {!prize.redeemed&&<div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:4,overflow:"hidden",marginTop:5}}><div style={{height:"100%",width:`${pct}%`,background:unlocked?col.bg:"rgba(255,255,255,0.12)",borderRadius:999,transition:"width 1.2s ease"}}/></div>}
                    </div>
                  </div>
                </div>
                <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:prize.redeemed?"#4ECDC4":unlocked?col.bg:"rgba(255,255,255,0.05)",border:`3px solid ${prize.redeemed?"#4ECDC4":unlocked?col.ring:"rgba(255,255,255,0.09)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:unlocked&&!prize.redeemed?`0 0 14px ${col.glow}`:"none"}}>
                  {prize.redeemed?"✓":unlocked?"⚡":"🔒"}
                </div>
                <div style={{flex:1}}/>
              </div>
            );
          })}
          <div style={{marginTop:8,animation:"bounceIn 0.7s ease 0.5s both"}}>
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:10,letterSpacing:2,color:reached80?"#FFD700":"rgba(255,255,255,0.2)",textTransform:"uppercase",padding:"4px 16px",border:`1px solid ${reached80?"rgba(255,215,0,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:999,fontWeight:800}}>
                <span>👑</span> PRÊMIO MÁXIMO DO MÊS <span>👑</span>
              </div>
            </div>
            <div style={{background:reached80?"linear-gradient(135deg,rgba(255,215,0,0.13),rgba(255,165,0,0.07))":"rgba(255,255,255,0.04)",border:`2px solid ${reached80?"rgba(255,215,0,0.6)":"rgba(255,255,255,0.08)"}`,borderRadius:22,padding:22,textAlign:"center",position:"relative",overflow:"hidden",animation:reached80?"glowGold 2s infinite":"none"}}>
              {reached80&&<><div style={{position:"absolute",top:-40,left:-40,width:140,height:140,background:"rgba(255,215,0,0.1)",borderRadius:"50%",filter:"blur(32px)"}}/><div style={{position:"absolute",bottom:-40,right:-40,width:140,height:140,background:"rgba(255,165,0,0.1)",borderRadius:"50%",filter:"blur(32px)"}}/></>}
              <div style={{position:"relative"}}>
                <div style={{fontSize:52,marginBottom:8,animation:"floatUp 3s ease-in-out infinite"}}>{reached80?"🏆":"🔒"}</div>
                <div style={{fontSize:17,fontWeight:900,color:reached80?"#FFD700":"rgba(255,255,255,0.2)",marginBottom:6}}>{currentMonthPrize?.label||"Surpresa especial do Theo! 🎁"}</div>
                <div style={{fontSize:13,fontWeight:700,color:reached80?"rgba(255,200,0,0.7)":"rgba(255,255,255,0.25)",marginBottom:12}}>{reached80?"Você arrasou esse mês! 🔥🔥🔥":`Junte ${threshold80} pontos no mês`}</div>
                {!reached80&&<><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:700,marginBottom:4}}><span>{monthPoints} pts</span><span>{threshold80} pts</span></div><div style={{background:"rgba(255,255,255,0.06)",borderRadius:999,height:8,overflow:"hidden",marginBottom:6}}><div style={{height:"100%",width:`${progress80}%`,background:"linear-gradient(90deg,#a78bfa,#7c3aed)",borderRadius:999,transition:"width 1s ease"}}/></div><div style={{fontSize:11,color:"rgba(255,255,255,0.25)",fontWeight:700}}>Faltam {Math.max(0,threshold80-monthPoints)} pontos</div></>}
                {reached80&&!currentMonthPrize&&<div style={{fontSize:13,color:"#FFD700",fontWeight:800,padding:"10px 14px",background:"rgba(255,215,0,0.1)",borderRadius:10,border:"1px solid rgba(255,215,0,0.3)"}}>🎉 Fala com a mamãe pra revelar a surpresa!</div>}
                {reached80&&currentMonthPrize&&!currentMonthPrize.redeemed&&<div style={{fontSize:13,color:"#FFD700",fontWeight:800,padding:"10px 14px",background:"rgba(255,215,0,0.1)",borderRadius:10,border:"2px solid rgba(255,215,0,0.4)"}}>🎉 PRÊMIO DESBLOQUEADO! Chama a mamãe! 🏆</div>}
                {currentMonthPrize?.redeemed&&<div style={{fontSize:13,color:"#4ECDC4",fontWeight:800}}>✅ Já resgatado! Parabéns, campeão!</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{position:"relative",zIndex:10,padding:"24px 20px 0",textAlign:"center"}}>
        <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.2)"}}>{totalPoints===0?"Completa suas missões e sobe de nível! 🚀":nextPrize?`⚡ Faltam ${nextPrize.cost-totalPoints} pts para ${nextPrize.label}!`:"Theo desbloqueou tudo! Lenda! 👑"}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [mode,setMode]=useState("kid");
  const [loading,setLoading]=useState(true);
  const [tasks,setTasks]=useState([]);
  const [prizes,setPrizes]=useState([]);
  const [totalPoints,setTotalPoints]=useState(0);
  const [doneToday,setDoneToday]=useState([]);
  const [history,setHistory]=useState([]);
  const [dailyLog,setDailyLog]=useState({});
  const [schoolBonus,setSchoolBonus]=useState([]);
  const [monthPrizes,setMonthPrizes]=useState({});
  const [pin,setPin]=useState("");
  const [confetti,setConfetti]=useState(false);
  const [toast,setToast]=useState(null);
  const [toastColor,setToastColor]=useState(THEO.color1);
  const [pinInput,setPinInput]=useState("");
  const [pinError,setPinError]=useState(false);
  const [pinSetup,setPinSetup]=useState(false);
  const [pinStep,setPinStep]=useState(1);
  const [newPin,setNewPin]=useState("");
  const [confirmPin,setConfirmPin]=useState("");
  const [showAddTask,setShowAddTask]=useState(false);
  const [showAddPrize,setShowAddPrize]=useState(false);
  const [showSchool,setShowSchool]=useState(false);
  const [newTask,setNewTask]=useState({label:"",points:10,icon:"⭐"});
  const [newPrize,setNewPrize]=useState({label:"",cost:100,icon:"🎁"});
  const [gradeInputs,setGradeInputs]=useState(["","",""]);
  const [monthPrizeInput,setMonthPrizeInput]=useState("");
  const [editingMonthPrize,setEditingMonthPrize]=useState(false);

  const showToast=(msg,color=THEO.color1)=>{setToast(msg);setToastColor(color);};

  useEffect(()=>{if(!confetti)return;const t=setTimeout(()=>setConfetti(false),3200);return()=>clearTimeout(t);},[confetti]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),2600);return()=>clearTimeout(t);},[toast]);

  const loadAll=useCallback(async()=>{
    try {
      const [{data:td},{data:pd},{data:cd},{data:hd},{data:ld},{data:sd}]=await Promise.all([
        sb.from("tasks").select("*").eq("active",true).order("id"),
        sb.from("prizes").select("*").order("cost"),
        sb.from("config").select("*"),
        sb.from("history").select("*").order("created_at",{ascending:false}).limit(60),
        sb.from("daily_log").select("*").order("date",{ascending:false}).limit(90),
        sb.from("school_bonus").select("*").order("created_at",{ascending:false}).limit(20),
      ]);
      setTasks(td||[]);
      setPrizes(pd||[]);
      setHistory(hd||[]);
      setSchoolBonus(sd||[]);
      const logObj={};
      (ld||[]).forEach(d=>{logObj[d.date]={points:d.points,tasks_done:d.tasks_done||[]};});
      setDailyLog(logObj);
      const todayLog=logObj[todayKey()];
      if(todayLog)setDoneToday(todayLog.tasks_done||[]);
      const cfg={};
      (cd||[]).forEach(c=>{cfg[c.key]=c.value;});
      setTotalPoints(typeof cfg.total_points==="number"?cfg.total_points:0);
      setPin(typeof cfg.pin==="string"?cfg.pin:"");
      setMonthPrizes(cfg.month_prizes&&typeof cfg.month_prizes==="object"?cfg.month_prizes:{});
    } catch(e){console.error(e);}
    setLoading(false);
  },[]);

  useEffect(()=>{loadAll();},[loadAll]);
  useEffect(()=>{const id=setInterval(()=>loadAll(),30000);return()=>clearInterval(id);},[loadAll]);

  const upsertConfig=async(key,value)=>{await sb.from("config").upsert({key,value},{onConflict:"key"});};
  const upsertDailyLog=async(taskIds,pts)=>{
    const today=todayKey();
    await sb.from("daily_log").upsert({date:today,points:pts,tasks_done:taskIds},{onConflict:"date"});
    setDailyLog(prev=>({...prev,[today]:{points:pts,tasks_done:taskIds}}));
  };

  const completeTask=async(task)=>{
    if(doneToday.includes(task.id))return;
    const newDone=[...doneToday,task.id];
    const newTotal=totalPoints+task.points;
    const newPtsToday=tasks.filter(t=>newDone.includes(t.id)).reduce((s,t)=>s+t.points,0);
    setDoneToday(newDone);setTotalPoints(newTotal);
    const phrase=THEO.taskDone[Math.floor(Math.random()*THEO.taskDone.length)];
    showToast(`${phrase} +${task.points} pts!`,THEO.color1);setConfetti(true);
    await Promise.all([upsertConfig("total_points",newTotal),upsertDailyLog(newDone,newPtsToday),sb.from("history").insert({label:task.label,points:task.points,type:"earned"})]);
    setHistory(h=>[{label:task.label,points:task.points,type:"earned",created_at:new Date().toISOString()},...h].slice(0,60));
  };

  const undoTask=async(task)=>{
    if(!doneToday.includes(task.id))return;
    const newDone=doneToday.filter(id=>id!==task.id);
    const newTotal=Math.max(0,totalPoints-task.points);
    const newPts=tasks.filter(t=>newDone.includes(t.id)).reduce((s,t)=>s+t.points,0);
    setDoneToday(newDone);setTotalPoints(newTotal);
    await Promise.all([upsertConfig("total_points",newTotal),upsertDailyLog(newDone,newPts)]);
  };

  const redeemPrize=async(prize)=>{
    if(totalPoints<prize.cost){showToast("Pontos insuficientes! 😅","#ef4444");return;}
    const newTotal=totalPoints-prize.cost;
    setTotalPoints(newTotal);setPrizes(prizes.map(p=>p.id===prize.id?{...p,redeemed:true}:p));
    setConfetti(true);showToast(`${prize.icon} ${prize.label} resgatado! 🎉`,THEO.color3);
    await Promise.all([upsertConfig("total_points",newTotal),sb.from("prizes").update({redeemed:true,redeemed_at:new Date().toISOString()}).eq("id",prize.id),sb.from("history").insert({label:prize.label,points:prize.cost,type:"redeemed"})]);
    setHistory(h=>[{label:prize.label,points:prize.cost,type:"redeemed",created_at:new Date().toISOString()},...h].slice(0,60));
  };

  const restorePrize=async(prize)=>{
    const newTotal=totalPoints+prize.cost;
    setTotalPoints(newTotal);setPrizes(prizes.map(p=>p.id===prize.id?{...p,redeemed:false}:p));
    await Promise.all([upsertConfig("total_points",newTotal),sb.from("prizes").update({redeemed:false,redeemed_at:null}).eq("id",prize.id)]);
  };

  const addTask=async()=>{
    if(!newTask.label.trim())return;
    const{data}=await sb.from("tasks").insert({...newTask,points:Number(newTask.points),active:true}).select().single();
    if(data)setTasks([...tasks,data]);
    setNewTask({label:"",points:10,icon:"⭐"});setShowAddTask(false);
  };

  const deleteTask=async(id)=>{
    await sb.from("tasks").update({active:false}).eq("id",id);
    setTasks(tasks.filter(t=>t.id!==id));setDoneToday(doneToday.filter(i=>i!==id));
  };

  const addPrize=async()=>{
    if(!newPrize.label.trim())return;
    const{data}=await sb.from("prizes").insert({...newPrize,cost:Number(newPrize.cost),redeemed:false}).select().single();
    if(data)setPrizes([...prizes,data]);
    setNewPrize({label:"",cost:100,icon:"🎁"});setShowAddPrize(false);
  };

  const deletePrize=async(id)=>{
    await sb.from("prizes").delete().eq("id",id);
    setPrizes(prizes.filter(p=>p.id!==id));
  };

  const savePin=async()=>{
    if(pinStep===1){if(newPin.length>=4)setPinStep(2);return;}
    if(confirmPin===newPin){setPin(newPin);await upsertConfig("pin",newPin);setPinSetup(false);setPinStep(1);setNewPin("");setConfirmPin("");}
  };

  const saveMonthPrize=async()=>{
    if(!monthPrizeInput.trim())return;
    const mk=monthKey();
    const updated={...monthPrizes,[mk]:{label:monthPrizeInput,redeemed:false}};
    setMonthPrizes(updated);await upsertConfig("month_prizes",updated);
    setMonthPrizeInput("");setEditingMonthPrize(false);
  };

  const redeemMonthPrize=async()=>{
    const mk=monthKey();
    const updated={...monthPrizes,[mk]:{...monthPrizes[mk],redeemed:true}};
    setMonthPrizes(updated);await upsertConfig("month_prizes",updated);
    setConfetti(true);showToast("🏆 PRÊMIO MÁXIMO DO THEO!",THEO.color3);
  };

  const applySchoolBonus=async()=>{
    const grades=gradeInputs.map(g=>parseFloat(g.replace(",",".")));
    if(grades.some(isNaN)){showToast("Preencha as 3 notas! 📝","#ef4444");return;}
    const above9=grades.filter(g=>g>9).length;
    if(above9<3){showToast(`${above9} nota(s) acima de 9. Precisa de 3!`,"#ef4444");return;}
    const newTotal=totalPoints+30;
    setTotalPoints(newTotal);setConfetti(true);showToast("+30 pts! Craque na escola! 🎓",THEO.color3);
    setGradeInputs(["","",""]);setShowSchool(false);
    const{data}=await sb.from("school_bonus").insert({grades}).select().single();
    if(data)setSchoolBonus(s=>[data,...s]);
    await Promise.all([upsertConfig("total_points",newTotal),sb.from("history").insert({label:"Bônus Escolar — 3 notas acima de 9",points:30,type:"earned"})]);
    setHistory(h=>[{label:"Bônus Escolar — 3 notas acima de 9",points:30,type:"earned",created_at:new Date().toISOString()},...h].slice(0,60));
  };

  const resetDay=async()=>{
    const today=todayKey();setDoneToday([]);
    await sb.from("daily_log").upsert({date:today,points:0,tasks_done:[]},{onConflict:"date"});
    setDailyLog(prev=>({...prev,[today]:{points:0,tasks_done:[]}}));
  };

  const resetAll=async()=>{
    setDoneToday([]);setTotalPoints(0);setHistory([]);
    setPrizes(prizes.map(p=>({...p,redeemed:false})));setDailyLog({});setSchoolBonus([]);
    await Promise.all([upsertConfig("total_points",0),sb.from("prizes").update({redeemed:false,redeemed_at:null}).neq("id",0),sb.from("history").delete().neq("id",0),sb.from("daily_log").delete().neq("id",0),sb.from("school_bonus").delete().neq("id",0)]);
  };

  const currentMonth=monthKey();
  const totalDays=daysInMonth(currentMonth);
  const maxPerDay=tasks.reduce((s,t)=>s+t.points,0);
  const maxMonthPoints=totalDays*maxPerDay;
  const threshold80=Math.ceil(maxMonthPoints*0.8);
  const pointsToday=tasks.filter(t=>doneToday.includes(t.id)).reduce((s,t)=>s+t.points,0);
  const monthPoints=Object.entries(dailyLog).filter(([date])=>date.startsWith(currentMonth)).reduce((s,[,v])=>s+(v.points||0),0);
  const reached80=monthPoints>=threshold80;
  const progress80=maxMonthPoints>0?Math.min((monthPoints/threshold80)*100,100):0;
  const monthProgress=maxMonthPoints>0?Math.min((monthPoints/maxMonthPoints)*100,100):0;
  const currentMonthPrize=monthPrizes[currentMonth];
  const availablePrizes=prizes.filter(p=>!p.redeemed).sort((a,b)=>a.cost-b.cost);
  const redeemedPrizes=prizes.filter(p=>p.redeemed);
  const nextPrize=availablePrizes.find(p=>p.cost>totalPoints)||null;
  const monthNames=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const currentMonthName=monthNames[new Date().getMonth()];

  const buildCalendar=()=>{
    const [y,m]=currentMonth.split("-").map(Number);
    const firstDow=new Date(y,m-1,1).getDay();
    const days=daysInMonth(currentMonth);
    const cells=[];
    for(let i=0;i<firstDow;i++)cells.push(null);
    for(let d=1;d<=days;d++){
      const dk=`${currentMonth}-${String(d).padStart(2,"0")}`;
      const logEntry=dailyLog[dk];
      const pts=logEntry?logEntry.points:(dk===todayKey()?pointsToday:null);
      const pct=pts!==null&&maxPerDay>0?(pts/maxPerDay)*100:null;
      cells.push({day:d,key:dk,pts,pct,isToday:dk===todayKey(),isFuture:dk>todayKey()});
    }
    return cells;
  };
  const calCells=buildCalendar();
  const attemptPin=()=>{if(!pin||pinInput===pin){setMode("parent");setPinInput("");setPinError(false);}else{setPinError(true);setPinInput("");}};

  if(loading)return <Loader/>;

  if(mode==="kid")return <KidView tasks={tasks} doneToday={doneToday} totalPoints={totalPoints} pointsToday={pointsToday} maxPerDay={maxPerDay} nextPrize={nextPrize} confetti={confetti} toast={toast} toastColor={toastColor} onComplete={completeTask} setMode={setMode}/>;
  if(mode==="kid-dashboard")return <KidDashboard prizes={prizes} totalPoints={totalPoints} monthPoints={monthPoints} threshold80={threshold80} progress80={progress80} reached80={reached80} currentMonthPrize={currentMonthPrize} nextPrize={nextPrize} confetti={confetti} toast={toast} toastColor={toastColor} setMode={setMode}/>;

  if(mode==="pin-entry")return(
    <div style={{minHeight:"100vh",background:"#0a0a1a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',system-ui,sans-serif",color:"#fff"}}>
      <style>{CSS}</style>
      <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:24,padding:40,width:300,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🔒</div>
        <div style={{fontSize:20,fontWeight:900,marginBottom:4}}>Área dos Pais</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:22}}>sistema do Theo</div>
        {pin?(<><input type="password" inputMode="numeric" maxLength={6} value={pinInput} onChange={e=>setPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attemptPin()} placeholder="••••" style={{...S.input,textAlign:"center",letterSpacing:10,fontSize:24,marginBottom:6}}/>{pinError&&<div style={{color:"#ef4444",fontSize:12,marginBottom:8,fontWeight:700}}>PIN incorreto!</div>}<button className="btn-b" onClick={attemptPin} style={{...S.btnPrimary,marginTop:10}}>Entrar</button></>):(<><div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:20}}>Nenhum PIN configurado</div><button className="btn-b" onClick={attemptPin} style={S.btnPrimary}>Continuar</button></>)}
        <button onClick={()=>setMode("kid")} style={{marginTop:16,background:"transparent",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:13,fontWeight:700}}>← Voltar pro Theo</button>
      </div>
    </div>
  );

  if(mode==="shop")return(
    <div style={{minHeight:"100vh",background:THEO.bgShop,fontFamily:"'Nunito',system-ui,sans-serif",color:"#fff",paddingBottom:40}}>
      <style>{CSS}</style>
      <Confetti active={confetti}/>
      <Toast msg={toast} color={toastColor}/>
      <div style={{padding:"22px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <TheoAvatar size={44}/>
          <div>
            <div style={{fontSize:11,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>Loja do</div>
            <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(90deg,#FFD700,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Theo! 🏪</div>
          </div>
        </div>
        <button className="btn-b" onClick={()=>setMode("kid")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)",padding:"8px 16px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700}}>← Tarefas</button>
      </div>
      <div style={{padding:"13px 20px"}}>
        <div style={{background:"linear-gradient(135deg,rgba(255,215,0,0.13),rgba(255,107,53,0.08))",border:"2px solid rgba(255,215,0,0.35)",borderRadius:18,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",fontWeight:700,marginBottom:2}}>Saldo do Theo</div>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}>
              <span style={{fontSize:36,fontWeight:900,color:"#FFD700",textShadow:"0 0 14px rgba(255,215,0,0.4)"}}>{totalPoints}</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:700}}>pontos</span>
            </div>
          </div>
          <div style={{fontSize:38,animation:"floatUp 3s ease-in-out infinite"}}>💰</div>
        </div>
      </div>
      <div style={{padding:"4px 20px"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",marginBottom:13}}>🎯 Disponíveis</div>
        {availablePrizes.length===0&&<div style={{textAlign:"center",padding:36}}><div style={{fontSize:44,marginBottom:10}}>🏆</div><div style={{fontSize:15,fontWeight:800,color:"rgba(255,255,255,0.25)"}}>Theo resgatou tudo! Lenda!</div></div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:12,marginBottom:22}}>
          {availablePrizes.map(prize=>{
            const can=totalPoints>=prize.cost;
            const pct=Math.min((totalPoints/prize.cost)*100,100);
            return(
              <div key={prize.id} className="prize-card" onClick={()=>can&&redeemPrize(prize)} style={{background:can?"rgba(167,139,250,0.13)":"rgba(255,255,255,0.04)",border:`2px solid ${can?"rgba(167,139,250,0.55)":"rgba(255,255,255,0.07)"}`,borderRadius:18,padding:"15px 12px",cursor:can?"pointer":"default",textAlign:"center",opacity:can?1:0.6,boxShadow:can?"0 4px 22px rgba(167,139,250,0.2)":"none"}}>
                <div style={{fontSize:34,marginBottom:7,animation:can?"floatUp 3s ease-in-out infinite":"none"}}>{prize.icon}</div>
                <div style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:7,lineHeight:1.3}}>{prize.label}</div>
                <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:`${pct}%`,background:can?"#a78bfa":"rgba(255,255,255,0.12)",borderRadius:999,transition:"width 0.8s ease"}}/></div>
                <div style={{fontSize:12,fontWeight:800,color:can?"#a78bfa":"rgba(255,255,255,0.25)",background:can?"rgba(167,139,250,0.18)":"rgba(255,255,255,0.04)",borderRadius:999,padding:"4px 12px",display:"inline-block"}}>{prize.cost} pts</div>
                {can&&<div style={{fontSize:11,color:"#4ECDC4",marginTop:7,fontWeight:800}}>⚡ Toca pra resgatar!</div>}
                {!can&&<div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:5,fontWeight:700}}>faltam {prize.cost-totalPoints} pts</div>}
              </div>
            );
          })}
        </div>
        {redeemedPrizes.length>0&&<>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:10}}>✅ Já conquistados</div>
          {redeemedPrizes.map(prize=>(
            <div key={prize.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"11px 14px",display:"flex",alignItems:"center",gap:11,opacity:0.4,marginBottom:7}}>
              <span style={{fontSize:18}}>{prize.icon}</span>
              <span style={{fontSize:13,fontWeight:700,flex:1}}>{prize.label}</span>
              <span style={{fontSize:11,color:"#4ECDC4",fontWeight:700}}>✓</span>
            </div>
          ))}
        </>}
      </div>
    </div>
  );

  if(mode==="dashboard")return(
    <div style={{minHeight:"100vh",background:"#0a0a16",fontFamily:"'Nunito',system-ui,sans-serif",color:"#fff",paddingBottom:60}}>
      <style>{CSS}</style>
      <Confetti active={confetti}/>
      <Toast msg={toast} color={toastColor}/>
      <div style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",fontWeight:700}}>Progresso do Theo</div><div style={{fontSize:19,fontWeight:900}}>Dashboard — {currentMonthName}</div></div>
        <button className="btn-b" onClick={()=>setMode("parent")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.35)",padding:"7px 14px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700}}>← Painel</button>
      </div>
      <div style={{padding:"16px 20px",maxWidth:520,margin:"0 auto"}}>
        <div style={{background:reached80?"rgba(255,215,0,0.07)":"rgba(255,255,255,0.04)",border:`1px solid ${reached80?"rgba(255,215,0,0.35)":"rgba(255,255,255,0.07)"}`,borderRadius:18,padding:20,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <div style={{fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",fontWeight:700,marginBottom:4}}>Meta do mês</div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:36,fontWeight:900,color:reached80?"#FFD700":"#fff",lineHeight:1}}>{monthPoints}</span><span style={{fontSize:12,color:"rgba(255,255,255,0.25)",fontWeight:700}}>/ {maxMonthPoints} pts</span></div>
              <div style={{fontSize:12,color:reached80?"#FFD700":"rgba(255,255,255,0.35)",fontWeight:700,marginTop:3}}>{reached80?"🏆 80% atingido!":`Faltam ${Math.max(0,threshold80-monthPoints)} pts para 80%`}</div>
            </div>
            <div style={{textAlign:"center"}}><div style={{fontSize:34,fontWeight:900,color:reached80?"#FFD700":"#4ECDC4"}}>{Math.round(progress80)}%</div><div style={{fontSize:8,color:"rgba(255,255,255,0.25)",letterSpacing:1,fontWeight:700}}>DA META</div></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:700,marginBottom:4}}><span>0</span><span style={{color:reached80?"#FFD700":"rgba(167,139,250,0.5)"}}>80% = {threshold80}</span><span>{maxMonthPoints}</span></div>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:12,overflow:"hidden",position:"relative"}}>
            <div style={{height:"100%",width:`${monthProgress}%`,background:reached80?"linear-gradient(90deg,#FFD700,#FFA500)":"linear-gradient(90deg,#FF6B35,#4ECDC4)",borderRadius:999,transition:"width 1s ease"}}/>
            <div style={{position:"absolute",left:"80%",top:0,bottom:0,width:2,background:"rgba(255,255,255,0.25)"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12}}>
            {[{label:"Atual",value:monthPoints,color:"#4ECDC4"},{label:"Meta 80%",value:threshold80,color:"#a78bfa"},{label:"Máximo",value:maxMonthPoints,color:"rgba(255,255,255,0.25)"}].map(s=>(
              <div key={s.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:900,color:s.color}}>{s.value}</div>
                <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:700,letterSpacing:1,marginTop:2,textTransform:"uppercase"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{...S.card,border:reached80&&currentMonthPrize&&!currentMonthPrize?.redeemed?"1px solid rgba(255,215,0,0.35)":"1px solid rgba(255,255,255,0.07)"}}>
          <div style={S.sectionLabel}>Prêmio Máximo — {currentMonthName}</div>
          {!currentMonthPrize&&!editingMonthPrize&&<div><div style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:700,marginBottom:11}}>Nenhum prêmio definido.</div><button className="btn-b" onClick={()=>setEditingMonthPrize(true)} style={{...S.btnPrimary,background:"rgba(255,215,0,0.12)",color:"#FFD700",border:"1px solid rgba(255,215,0,0.25)"}}>Definir prêmio máximo</button></div>}
          {editingMonthPrize&&<div style={{display:"flex",flexDirection:"column",gap:9}}><input value={monthPrizeInput} onChange={e=>setMonthPrizeInput(e.target.value)} placeholder="Ex: Viagem ao Beto Carrero" style={S.input}/><button className="btn-b" onClick={saveMonthPrize} style={S.btnPrimary}>Salvar</button><button onClick={()=>setEditingMonthPrize(false)} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.25)",cursor:"pointer",fontSize:12,fontWeight:700}}>Cancelar</button></div>}
          {currentMonthPrize&&!editingMonthPrize&&<div>
            <div style={{display:"flex",alignItems:"center",gap:11,padding:"11px 13px",background:"rgba(255,255,255,0.04)",borderRadius:12,marginBottom:11}}>
              <span style={{fontSize:26}}>🎖️</span>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:currentMonthPrize.redeemed?"rgba(255,255,255,0.25)":"#fff"}}>{currentMonthPrize.label}</div><div style={{fontSize:11,color:currentMonthPrize.redeemed?"#4ECDC4":"rgba(255,255,255,0.35)",fontWeight:700,marginTop:2}}>{currentMonthPrize.redeemed?"✓ Resgatado":reached80?"⚡ Disponível!":"Continue acumulando..."}</div></div>
            </div>
            {reached80&&!currentMonthPrize.redeemed&&<button className="btn-b" onClick={redeemMonthPrize} style={{...S.btnPrimary,background:"linear-gradient(90deg,#FFD700,#FFA500)",fontSize:14,padding:13,fontWeight:900}}>🏆 Resgatar prêmio máximo!</button>}
            <button onClick={()=>{setMonthPrizeInput(currentMonthPrize.label);setEditingMonthPrize(true);}} style={{marginTop:9,background:"transparent",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:11,fontWeight:700,display:"block",width:"100%"}}>Alterar prêmio</button>
          </div>}
        </div>
        <div style={S.card}>
          <div style={S.sectionLabel}>Calendário — {currentMonthName}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:5}}>
            {["D","S","T","Q","Q","S","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:800,padding:"3px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {calCells.map((cell,i)=>{
              if(!cell)return<div key={i}/>;
              const bg=cell.isFuture?"rgba(255,255,255,0.02)":cell.pct===null?"rgba(255,255,255,0.05)":cell.pct>=80?"rgba(78,205,196,0.35)":cell.pct>=50?"rgba(167,139,250,0.3)":cell.pct>0?"rgba(255,107,53,0.25)":"rgba(239,68,68,0.18)";
              return(<div key={cell.key} style={{background:bg,border:cell.isToday?"2px solid #4ECDC4":"1px solid rgba(255,255,255,0.05)",borderRadius:7,padding:"4px 2px",textAlign:"center",minHeight:40}}>
                <div style={{fontSize:10,fontWeight:cell.isToday?900:600,color:cell.isToday?"#4ECDC4":cell.isFuture?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.45)"}}>{cell.day}</div>
                {!cell.isFuture&&cell.pts!==null&&<div style={{fontSize:9,color:"#fff",marginTop:1,fontWeight:800}}>{cell.pts}</div>}
                {!cell.isFuture&&cell.pts===null&&<div style={{fontSize:8,color:"rgba(239,68,68,0.5)",marginTop:1}}>—</div>}
              </div>);
            })}
          </div>
          <div style={{display:"flex",gap:10,marginTop:11,flexWrap:"wrap"}}>
            {[{color:"rgba(78,205,196,0.35)",label:"≥80%"},{color:"rgba(167,139,250,0.3)",label:"50–79%"},{color:"rgba(255,107,53,0.25)",label:"1–49%"},{color:"rgba(239,68,68,0.18)",label:"0 pts"}].map(l=>(
              <div key={l.label} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:9,height:9,background:l.color,borderRadius:2}}/><span style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:700}}>{l.label}</span></div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={S.sectionLabel}>Referência</div>
          {[{label:"Máximo diário",value:`${maxPerDay} pts`,color:"#4ECDC4"},{label:"Dias no mês",value:`${totalDays} dias`,color:"rgba(255,255,255,0.35)"},{label:"Máximo mensal",value:`${maxMonthPoints} pts`,color:"rgba(255,255,255,0.35)"},{label:"Meta 80%",value:`${threshold80} pts`,color:"#a78bfa"}].map(r=>(
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:700}}>{r.label}</span>
              <span style={{fontSize:13,fontWeight:800,color:r.color}}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#080812",fontFamily:"'Nunito',system-ui,sans-serif",color:"#fff",paddingBottom:60}}>
      <style>{CSS}</style>
      <Toast msg={toast} color={toastColor}/>
      <Confetti active={confetti}/>
      <div style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"15px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>⚽</span>
          <div><div style={{fontSize:9,letterSpacing:2,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",fontWeight:700}}>Sistema do</div><div style={{fontSize:17,fontWeight:900}}>Theo — Painel dos Pais</div></div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button className="btn-b" onClick={()=>loadAll()} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)",padding:"7px 10px",borderRadius:10,fontWeight:800,fontSize:11,cursor:"pointer"}}>↻</button>
          <button className="btn-b" onClick={()=>setMode("dashboard")} style={{background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.2)",color:"#FFD700",padding:"7px 10px",borderRadius:10,fontWeight:800,fontSize:11,cursor:"pointer"}}>📊</button>
          <button className="btn-b" onClick={()=>setMode("kid")} style={{background:"linear-gradient(90deg,#FF6B35,#ff8c42)",color:"#fff",border:"none",padding:"7px 13px",borderRadius:10,fontWeight:800,fontSize:12,cursor:"pointer"}}>Ver Theo</button>
        </div>
      </div>
      <div style={{padding:"14px 18px",maxWidth:480,margin:"0 auto"}}>
        {reached80&&currentMonthPrize&&!currentMonthPrize.redeemed&&(
          <div style={{background:"rgba(255,215,0,0.08)",border:"2px solid rgba(255,215,0,0.35)",borderRadius:14,padding:"12px 15px",marginBottom:13,display:"flex",alignItems:"center",gap:11,animation:"glowGold 2s infinite"}}>
            <span style={{fontSize:24}}>🏆</span>
            <div><div style={{fontSize:13,fontWeight:800,color:"#FFD700"}}>Theo bateu a meta mensal!</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:700}}>Vai no Dashboard 📊 para resgatar.</div></div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[{label:"Pontos totais",value:totalPoints,color:"#FFD700"},{label:"Tarefas hoje",value:`${doneToday.length}/${tasks.length}`,color:"#4ECDC4"},{label:"Mês 80%",value:`${Math.round(progress80)}%`,color:reached80?"#FFD700":"#a78bfa"}].map(s=>(
            <div key={s.label} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"11px 8px",textAlign:"center"}}>
              <div style={{fontSize:21,fontWeight:900,color:s.color}}>{s.value}</div>
              <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:700,letterSpacing:1,marginTop:2,textTransform:"uppercase"}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
            <div style={S.sectionLabel}>Bônus Escolar 🎓</div>
            <button className="btn-b" onClick={()=>setShowSchool(!showSchool)} style={{background:showSchool?"transparent":"rgba(255,215,0,0.1)",border:showSchool?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(255,215,0,0.25)",color:showSchool?"rgba(255,255,255,0.25)":"#FFD700",padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:800,cursor:"pointer"}}>{showSchool?"Cancelar":"+ Registrar notas"}</button>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.35)"}}>3 notas acima de 9 = <span style={{color:"#FFD700",fontWeight:900}}>+30 pontos</span></div>
          {showSchool&&(
            <div style={{background:"rgba(255,215,0,0.05)",border:"1px solid rgba(255,215,0,0.18)",borderRadius:12,padding:13,marginTop:11}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:700,marginBottom:9}}>Digite as 3 notas do Theo:</div>
              <div style={{display:"flex",gap:8,marginBottom:11}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:700,marginBottom:4}}>Nota {i+1}</div>
                    <input type="number" min="0" max="10" step="0.1" value={gradeInputs[i]} onChange={e=>{const n=[...gradeInputs];n[i]=e.target.value;setGradeInputs(n);}} placeholder="0" style={{...S.input,textAlign:"center",fontSize:19,fontWeight:900,padding:"9px 4px"}}/>
                  </div>
                ))}
              </div>
              <button className="btn-b" onClick={applySchoolBonus} style={{...S.btnPrimary,background:"linear-gradient(90deg,#FFD700,#FFA500)",fontWeight:900}}>✓ Confirmar +30 pontos!</button>
            </div>
          )}
          {schoolBonus.length>0&&(
            <div style={{marginTop:11,display:"flex",flexDirection:"column",gap:5}}>
              {schoolBonus.slice(0,4).map(b=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"5px 0",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{color:"rgba(255,255,255,0.35)",fontWeight:700}}>Notas: {Array.isArray(b.grades)?b.grades.join(" / "):JSON.stringify(b.grades)}</span>
                  <span style={{color:"#FFD700",fontWeight:800}}>+30 pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
            <div style={S.sectionLabel}>Prêmios</div>
            <button className="btn-b" onClick={()=>setShowAddPrize(!showAddPrize)} style={{background:showAddPrize?"transparent":"#a78bfa",border:showAddPrize?"1px solid rgba(255,255,255,0.08)":"none",color:showAddPrize?"rgba(255,255,255,0.25)":"#fff",padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:800,cursor:"pointer"}}>{showAddPrize?"Cancelar":"+ Adicionar"}</button>
          </div>
          {showAddPrize&&<div style={{background:"rgba(255,255,255,0.04)",borderRadius:11,padding:13,marginBottom:13}}><div style={{display:"flex",flexDirection:"column",gap:8}}><input value={newPrize.label} onChange={e=>setNewPrize({...newPrize,label:e.target.value})} placeholder="Nome do prêmio" style={S.input}/><div style={{display:"flex",gap:8}}><input type="number" value={newPrize.cost} onChange={e=>setNewPrize({...newPrize,cost:e.target.value})} placeholder="Pontos" style={{...S.input,flex:1}}/><select value={newPrize.icon} onChange={e=>setNewPrize({...newPrize,icon:e.target.value})} style={{...S.input,flex:0.55}}>{ICON_OPTIONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}</select></div><button className="btn-b" onClick={addPrize} style={S.btnPrimary}>Adicionar prêmio</button></div></div>}
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {prizes.map(prize=>(
              <div key={prize.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 11px",background:prize.redeemed?"rgba(78,205,196,0.07)":"rgba(255,255,255,0.04)",borderRadius:11,border:`1px solid ${prize.redeemed?"rgba(78,205,196,0.18)":"rgba(255,255,255,0.07)"}`}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:17}}>{prize.icon}</span><div><div style={{fontSize:13,fontWeight:700,color:prize.redeemed?"rgba(255,255,255,0.25)":"#fff"}}>{prize.label}</div><div style={{fontSize:11,color:"#a78bfa",fontWeight:700}}>{prize.cost} pts</div></div></div>
                <div style={{display:"flex",gap:5}}>
                  {prize.redeemed&&<button onClick={()=>restorePrize(prize)} style={{background:"rgba(255,165,0,0.1)",border:"1px solid rgba(255,165,0,0.22)",color:"#FFA500",padding:"3px 8px",borderRadius:8,fontSize:10,cursor:"pointer",fontWeight:700}}>Devolver</button>}
                  <button onClick={()=>deletePrize(prize.id)} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.2)",padding:"3px 8px",borderRadius:8,fontSize:10,cursor:"pointer",fontWeight:700}}>Remover</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
            <div style={S.sectionLabel}>Missões diárias</div>
            <button className="btn-b" onClick={()=>setShowAddTask(!showAddTask)} style={{background:showAddTask?"transparent":"#4ECDC4",border:showAddTask?"1px solid rgba(255,255,255,0.08)":"none",color:showAddTask?"rgba(255,255,255,0.25)":"#1a1a2e",padding:"4px 11px",borderRadius:20,fontSize:11,fontWeight:800,cursor:"pointer"}}>{showAddTask?"Cancelar":"+ Adicionar"}</button>
          </div>
          {showAddTask&&<div style={{background:"rgba(255,255,255,0.04)",borderRadius:11,padding:13,marginBottom:13}}><div style={{display:"flex",flexDirection:"column",gap:8}}><input value={newTask.label} onChange={e=>setNewTask({...newTask,label:e.target.value})} placeholder="Nome da missão" style={S.input}/><div style={{display:"flex",gap:8}}><input type="number" value={newTask.points} onChange={e=>setNewTask({...newTask,points:e.target.value})} placeholder="Pontos" style={{...S.input,flex:1}}/><select value={newTask.icon} onChange={e=>setNewTask({...newTask,icon:e.target.value})} style={{...S.input,flex:0.55}}>{ICON_OPTIONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}</select></div><button className="btn-b" onClick={addTask} style={S.btnPrimary}>Adicionar missão</button></div></div>}
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {tasks.map(task=>{
              const done=doneToday.includes(task.id);
              return(
                <div key={task.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 11px",background:done?"rgba(255,107,53,0.09)":"rgba(255,255,255,0.04)",borderRadius:11,border:`1px solid ${done?"rgba(255,107,53,0.22)":"rgba(255,255,255,0.07)"}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:17}}>{done?"✅":task.icon}</span><div><div style={{fontSize:13,fontWeight:700}}>{task.label}</div><div style={{fontSize:11,color:"#FFD700",fontWeight:700}}>+{task.points} pts</div></div></div>
                  <div style={{display:"flex",gap:5}}>
                    {done&&<button onClick={()=>undoTask(task)} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.22)",color:"#ef4444",padding:"3px 8px",borderRadius:8,fontSize:10,cursor:"pointer",fontWeight:700}}>Desfazer</button>}
                    <button onClick={()=>deleteTask(task.id)} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.2)",padding:"3px 8px",borderRadius:8,fontSize:10,cursor:"pointer",fontWeight:700}}>Remover</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {history.length>0&&(
          <div style={S.card}>
            <div style={S.sectionLabel}>Histórico</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {history.slice(0,12).map((h,i)=>{
                const time=h.created_at?new Date(h.created_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}):"";
                const date=h.created_at?new Date(h.created_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}):"";
                return(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"5px 0",borderBottom:i<11?"1px solid rgba(255,255,255,0.04)":"none"}}>
                    <span style={{color:"rgba(255,255,255,0.55)",fontWeight:700,flex:1,marginRight:8}}>{h.label}</span>
                    <span style={{color:"rgba(255,255,255,0.25)",fontWeight:700,whiteSpace:"nowrap"}}><span style={{color:h.type==="redeemed"?"#ef4444":"#4ECDC4",fontWeight:800}}>{h.type==="redeemed"?`-${h.points}`:`+${h.points}`}</span> · {date} {time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div style={S.card}>
          <div style={S.sectionLabel}>Segurança</div>
          {!pinSetup?(<div><div style={{fontSize:12,color:"rgba(255,255,255,0.25)",fontWeight:700,marginBottom:11}}>{pin?"PIN ativo.":"Sem PIN — qualquer um acessa."}</div><button className="btn-b" onClick={()=>{setPinSetup(true);setPinStep(1);setNewPin("");setConfirmPin("");}} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",padding:"7px 14px",borderRadius:9,fontSize:12,cursor:"pointer",fontWeight:700}}>{pin?"Alterar PIN":"Definir PIN"}</button></div>):(<div style={{display:"flex",flexDirection:"column",gap:8}}><div style={{fontSize:12,color:"rgba(255,255,255,0.35)",fontWeight:700}}>{pinStep===1?"Novo PIN (mínimo 4 dígitos)":"Confirme o PIN"}</div><input type="password" inputMode="numeric" maxLength={6} value={pinStep===1?newPin:confirmPin} onChange={e=>pinStep===1?setNewPin(e.target.value):setConfirmPin(e.target.value)} placeholder="••••" style={{...S.input,textAlign:"center",letterSpacing:10,fontSize:22}}/>{pinStep===2&&confirmPin&&confirmPin!==newPin&&<div style={{color:"#ef4444",fontSize:11,fontWeight:700}}>PINs não coincidem</div>}<button className="btn-b" onClick={savePin} style={S.btnPrimary}>{pinStep===1?"Próximo":"Salvar PIN"}</button><button onClick={()=>setPinSetup(false)} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.25)",cursor:"pointer",fontSize:11,fontWeight:700}}>Cancelar</button></div>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-b" onClick={resetDay} style={{flex:1,padding:11,background:"rgba(255,165,0,0.1)",border:"1px solid rgba(255,165,0,0.22)",color:"#FFA500",borderRadius:11,fontWeight:800,fontSize:12,cursor:"pointer"}}>Resetar dia</button>
          <button className="btn-b" onClick={resetAll} style={{flex:1,padding:11,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.22)",color:"#ef4444",borderRadius:11,fontWeight:800,fontSize:12,cursor:"pointer"}}>Zerar tudo</button>
        </div>
      </div>
    </div>
  );
}
