import { useState, useEffect, useCallback, useRef } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar,
  ReferenceLine, Legend
} from "recharts";
import {
  TrendingUp, Wallet, Plus, Edit3, RefreshCw, Settings,
  Trash2, Save, X, DollarSign, BarChart3,
  Target, Layers, ArrowUpRight,
  ArrowDownRight, Check, AlertCircle, Camera, Award,
  Banknote, Zap, Flag, Download, Upload, Moon, Sun, HelpCircle, ChevronRight
} from "lucide-react";

const DARK = {
  bg:"#060a11",card:"#0d1321",cardHover:"#111b2e",
  border:"#1a2744",borderLight:"#243352",
  accent:"#4f8ff7",accentDim:"#1a3366",
  green:"#00d67e",greenDim:"#0c2d1f",
  red:"#ff4757",redDim:"#3d0a13",
  gold:"#f0b90b",goldDim:"#3d2f00",
  text:"#e8ecf4",textDim:"#6b7a99",textMuted:"#3d4f6f",
  purple:"#a855f7",purpleDim:"#2d1a4e",
  cyan:"#06b6d4",orange:"#f97316",
};
const LIGHT = {
  bg:"#f4f6f9",card:"#ffffff",cardHover:"#f0f2f5",
  border:"#e2e6ed",borderLight:"#d0d5de",
  accent:"#2563eb",accentDim:"#dbeafe",
  green:"#059669",greenDim:"#d1fae5",
  red:"#dc2626",redDim:"#fee2e2",
  gold:"#d97706",goldDim:"#fef3c7",
  text:"#1a1a2e",textDim:"#6b7280",textMuted:"#9ca3af",
  purple:"#7c3aed",purpleDim:"#ede9fe",
  cyan:"#0891b2",orange:"#ea580c",
};
let C = DARK;
const PIE_COLORS=["#4f8ff7","#00d67e","#f0b90b","#ff4757","#a855f7","#06b6d4","#f97316","#ec4899","#84cc16","#8b5cf6","#14b8a6","#f59e0b","#ef4444"];

const STABLE_LIST=[
  {symbol:"USDT",name:"Tether USD",cgId:"tether"},
  {symbol:"USDC",name:"USD Coin",cgId:"usd-coin"},
  {symbol:"DAI",name:"DAI",cgId:"dai"},
  {symbol:"USDE",name:"USDe (Ethena)",cgId:"ethena-usde"},
  {symbol:"FRAX",name:"FRAX",cgId:"frax"},
  {symbol:"PYUSD",name:"PayPal USD",cgId:"paypal-usd"},
  {symbol:"EURC",name:"EURC (Circle)",cgId:"euro-coin"},
  {symbol:"EURS",name:"EURS (Stasis)",cgId:"stasis-eurs"},
];

const defaultPEA=[];
const defaultCrypto=[];
const defaultCTO=[];
const defaultLivrets=[];
const defaultVersements={pea:0,crypto:0,cto:0};
const defaultDivHistory=[];

const DEMO_DATA={
  pea:[
    {id:"d1",name:"Amundi MSCI World CW8",ticker:"CW8.PA",quantity:80,pru:370,currentPrice:445,divPerShare:0,divFreq:"annuel"},
    {id:"d2",name:"Amundi PEA S&P 500 PE500",ticker:"PE500.PA",quantity:35,pru:450,currentPrice:532,divPerShare:0,divFreq:"annuel"},
    {id:"d3",name:"TotalEnergies",ticker:"TTE.PA",quantity:45,pru:51,currentPrice:56,divPerShare:3.2,divFreq:"trim"},
    {id:"d4",name:"Air Liquide",ticker:"AIR.PA",quantity:12,pru:158,currentPrice:178,divPerShare:3.5,divFreq:"annuel"},
    {id:"d11",name:"Schneider Electric",ticker:"SU.PA",quantity:10,pru:195,currentPrice:230,divPerShare:3.5,divFreq:"annuel"},
    {id:"d12",name:"LVMH",ticker:"MC.PA",quantity:4,pru:650,currentPrice:588,divPerShare:13.0,divFreq:"annuel"},
    {id:"d13",name:"BNP Paribas",ticker:"BNP.PA",quantity:35,pru:56,currentPrice:65,divPerShare:4.6,divFreq:"annuel"},
  ],
  cto:[
    {id:"d5",name:"Microsoft",ticker:"MSFT",quantity:12,pru:320,currentPrice:385,divPerShare:2.7,divFreq:"trim"},
    {id:"d14",name:"Apple",ticker:"AAPL",quantity:20,pru:162,currentPrice:189,divPerShare:1.0,divFreq:"trim"},
    {id:"d15",name:"Nvidia",ticker:"NVDA",quantity:40,pru:72,currentPrice:101,divPerShare:0.04,divFreq:"trim"},
    {id:"d16",name:"Amazon",ticker:"AMZN",quantity:12,pru:145,currentPrice:172,divPerShare:0,divFreq:"annuel"},
  ],
  crypto:[
    {id:"d6",name:"Bitcoin",symbol:"BTC",cgId:"bitcoin",quantity:0.18,avgPrice:58000,currentPrice:82000},
    {id:"d7",name:"Ethereum",symbol:"ETH",cgId:"ethereum",quantity:3.5,avgPrice:2200,currentPrice:1750},
    {id:"d17",name:"Solana",symbol:"SOL",cgId:"solana",quantity:20,avgPrice:95,currentPrice:125},
  ],
  stablecoins:[{id:"ds1",symbol:"USDT",quantity:850}],
  livrets:[
    {id:"d8",name:"Livret A",balance:8500,rate:3},
    {id:"d9",name:"LDDS",balance:4200,rate:3},
    {id:"d10",name:"LEP",balance:7700,rate:4},
  ],
  peaCash:1650,ctoCash:320,cryptoCash:400,
  versements:{pea:600,crypto:120,cto:0},
  monthlyIncome:3800,
  targetAlloc:{pea:50,cto:10,crypto:20,livrets:16},
  divHistory:[{year:2021,total:180},{year:2022,total:420},{year:2023,total:780},{year:2024,total:1280}],
  snapshots:[
    {date:"2024-09-01T08:00:00.000Z",total:91000,invested:78000,pea:52000,cto:9500,crypto:9500,livrets:20000},
    {date:"2024-10-01T08:00:00.000Z",total:94500,invested:79500,pea:54000,cto:10000,crypto:10500,livrets:20000},
    {date:"2024-11-01T08:00:00.000Z",total:97000,invested:81000,pea:55500,cto:10500,crypto:11000,livrets:20000},
    {date:"2024-12-01T08:00:00.000Z",total:100500,invested:82500,pea:57000,cto:11000,crypto:12500,livrets:20000},
    {date:"2025-01-01T08:00:00.000Z",total:103000,invested:84000,pea:58500,cto:11500,crypto:13000,livrets:20000},
    {date:"2025-02-01T08:00:00.000Z",total:98500,invested:85000,pea:56000,cto:11000,crypto:11500,livrets:20000},
    {date:"2025-03-01T08:00:00.000Z",total:105000,invested:86500,pea:60000,cto:12000,crypto:13000,livrets:20000},
    {date:"2025-04-01T08:00:00.000Z",total:108500,invested:87500,pea:62000,cto:12500,crypto:14000,livrets:20000},
    {date:"2025-05-01T08:00:00.000Z",total:112000,invested:88500,pea:64000,cto:13000,crypto:15000,livrets:20000},
    {date:"2025-06-01T08:00:00.000Z",total:115500,invested:89500,pea:66000,cto:13500,crypto:16000,livrets:20000},
    {date:"2025-07-01T08:00:00.000Z",total:119000,invested:90500,pea:68000,cto:14000,crypto:17000,livrets:20000},
    {date:"2025-08-01T08:00:00.000Z",total:116500,invested:91000,pea:67000,cto:13500,crypto:16000,livrets:20000},
    {date:"2025-09-01T08:00:00.000Z",total:122000,invested:91500,pea:70000,cto:14500,crypto:17500,livrets:20000},
    {date:"2025-10-01T08:00:00.000Z",total:125500,invested:92000,pea:72000,cto:15000,crypto:18500,livrets:20000},
    {date:"2025-11-01T08:00:00.000Z",total:129000,invested:92500,pea:74000,cto:15500,crypto:19500,livrets:20000},
    {date:"2025-12-01T08:00:00.000Z",total:126000,invested:93000,pea:72500,cto:15000,crypto:18500,livrets:20000},
    {date:"2026-01-01T08:00:00.000Z",total:130500,invested:93500,pea:74500,cto:16000,crypto:20000,livrets:20000},
    {date:"2026-02-01T08:00:00.000Z",total:134000,invested:94000,pea:76500,cto:16500,crypto:21000,livrets:20000},
    {date:"2026-03-01T08:00:00.000Z",total:131000,invested:94500,pea:75000,cto:16000,crypto:20000,livrets:20000},
  ],
  transactions:[
    {date:"2024-09-16T09:30:00.000Z",type:"buy",account:"pea",name:"Amundi MSCI World CW8",quantity:5,price:418,notes:"DCA mensuel"},
    {date:"2024-10-14T10:15:00.000Z",type:"buy",account:"pea",name:"Amundi MSCI World CW8",quantity:5,price:425,notes:"DCA mensuel"},
    {date:"2024-11-04T11:00:00.000Z",type:"buy",account:"crypto",name:"Bitcoin",quantity:0.03,price:58000,notes:"DCA BTC"},
    {date:"2024-12-09T09:45:00.000Z",type:"buy",account:"pea",name:"Amundi PEA S&P 500 PE500",quantity:4,price:488,notes:""},
    {date:"2025-01-13T10:30:00.000Z",type:"buy",account:"pea",name:"Amundi MSCI World CW8",quantity:5,price:432,notes:"DCA mensuel"},
    {date:"2025-02-10T14:00:00.000Z",type:"buy",account:"crypto",name:"Ethereum",quantity:0.5,price:2600,notes:"DCA ETH"},
    {date:"2025-03-17T09:00:00.000Z",type:"buy",account:"pea",name:"TotalEnergies",quantity:10,price:50,notes:"Dividende réinvesti"},
    {date:"2025-04-22T11:30:00.000Z",type:"sell",account:"cto",name:"Nvidia",quantity:5,price:115,notes:"Prise de PV partielle"},
    {date:"2025-05-12T10:00:00.000Z",type:"buy",account:"pea",name:"Amundi MSCI World CW8",quantity:5,price:438,notes:"DCA mensuel"},
    {date:"2025-07-08T09:15:00.000Z",type:"buy",account:"crypto",name:"Bitcoin",quantity:0.02,price:76000,notes:"DCA BTC"},
    {date:"2025-09-15T10:45:00.000Z",type:"buy",account:"pea",name:"BNP Paribas",quantity:10,price:58,notes:"Renforcement"},
    {date:"2025-11-10T09:30:00.000Z",type:"buy",account:"pea",name:"Amundi MSCI World CW8",quantity:5,price:441,notes:"DCA mensuel"},
    {date:"2026-01-13T10:00:00.000Z",type:"buy",account:"crypto",name:"Solana",quantity:5,price:118,notes:""},
    {date:"2026-02-17T11:15:00.000Z",type:"buy",account:"pea",name:"Schneider Electric",quantity:3,price:218,notes:""},
    {date:"2026-03-10T09:30:00.000Z",type:"buy",account:"pea",name:"Amundi MSCI World CW8",quantity:5,price:443,notes:"DCA mensuel"},
  ],
  darkMode:true,_isDemo:true,
};

const fmtEur=v=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:0,maximumFractionDigits:2}).format(v);
const fmtPct=v=>(v>=0?"+":"")+v.toFixed(2)+"%";
const fmtDate=d=>new Date(d).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"});
const fmtK=v=>v>=1000000?`${(v/1000000).toFixed(1)}M€`:v>=1000?`${(v/1000).toFixed(0)}k€`:`${v}€`;

/* ═══════════ COMPONENTS ═══════════ */

function MetricCard({label,value,sub,icon:Icon,trend,color}){
  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 24px",display:"flex",flexDirection:"column",gap:6}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{color:C.textDim,fontSize:12,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>{label}</span>
      {Icon&&<Icon size={16} color={color||C.textDim}/>}
    </div>
    <span style={{fontSize:value.length>12?18:value.length>9?22:26,fontWeight:700,color:color||C.text,fontFamily:"'JetBrains Mono',monospace",letterSpacing:-.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{value}</span>
    {sub&&<span style={{fontSize:12,fontWeight:600,color:trend==="up"?C.green:trend==="down"?C.red:C.textDim,display:"flex",alignItems:"center",gap:4}}>
      {trend==="up"&&<ArrowUpRight size={13}/>}{trend==="down"&&<ArrowDownRight size={13}/>}{sub}
    </span>}
  </div>);
}

/* ═══ PV LATENTES VISUAL ═══ */
function PVLatentesVisual({pea,isMobile}){
  const sorted=[...pea].map(h=>({...h,pv:(h.currentPrice-h.pru)*h.quantity,pvPct:((h.currentPrice-h.pru)/h.pru)*100})).sort((a,b)=>b.pv-a.pv);
  const totalPV=sorted.reduce((s,h)=>s+h.pv,0);
  const totalInv=sorted.reduce((s,h)=>s+h.quantity*h.pru,0);
  const totalPVPct=totalInv>0?(totalPV/totalInv)*100:0;
  const maxAbsPV=Math.max(...sorted.map(h=>Math.abs(h.pv)),1);

  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
    {/* Big PV header */}
    <div style={{padding:isMobile?"16px 16px 14px":"24px 24px 20px",borderBottom:`1px solid ${C.border}`,background:`linear-gradient(135deg,${totalPV>=0?C.greenDim:C.redDim},${C.card})`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:C.textDim,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>PLUS-VALUES LATENTES TOTALES</div>
          <div style={{fontSize:isMobile?24:36,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:totalPV>=0?C.green:C.red,letterSpacing:-1,display:"flex",alignItems:"center",gap:8}}>
            {totalPV>=0?<ArrowUpRight size={isMobile?20:28}/>:<ArrowDownRight size={isMobile?20:28}/>}
            {fmtEur(totalPV)}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:isMobile?20:28,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:totalPV>=0?C.green:C.red}}>{fmtPct(totalPVPct)}</div>
          <div style={{fontSize:11,color:C.textDim}}>sur {fmtEur(totalInv)} investis</div>
        </div>
      </div>
    </div>
    {/* Per-line bars */}
    <div style={{padding:isMobile?"12px 14px":"16px 24px"}}>
      {sorted.map((h,i)=>{
        const pos=h.pv>=0;const barW=Math.min((Math.abs(h.pv)/maxAbsPV)*100,100);
        return(<div key={h.id} style={{display:"flex",alignItems:"center",gap:isMobile?8:12,padding:"8px 0",borderBottom:i<sorted.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{width:isMobile?90:160,flexShrink:0}}>
            <div style={{fontSize:12,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div>
          </div>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
            <div style={{flex:1,height:isMobile?14:20,background:C.bg,borderRadius:6,overflow:"hidden",position:"relative"}}>
              <div style={{height:"100%",width:`${barW}%`,background:pos?`linear-gradient(90deg,${C.green}33,${C.green})`:` linear-gradient(90deg,${C.red}33,${C.red})`,borderRadius:6,transition:"width .5s"}}/>
            </div>
          </div>
          <div style={{width:isMobile?75:100,textAlign:"right",flexShrink:0}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:isMobile?11:12,fontWeight:700,color:pos?C.green:C.red}}>{fmtEur(h.pv)}</span>
          </div>
          {!isMobile&&<div style={{width:70,textAlign:"right"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:600,color:pos?C.green:C.red}}>{fmtPct(h.pvPct)}</span>
          </div>}
        </div>);
      })}
    </div>
  </div>);
}

/* ═══ ALLOCATION BARS ═══ */
function AllocationPie({pea,peaTotal,peaCash=0,isMobile}){
  const items=[...pea].map((h,i)=>({name:h.name,value:h.quantity*h.currentPrice,pct:peaTotal>0?((h.quantity*h.currentPrice)/peaTotal)*100:0,fill:PIE_COLORS[i%PIE_COLORS.length]})).sort((a,b)=>b.value-a.value);
  if(peaCash>0)items.push({name:"Espèces",value:peaCash,pct:peaTotal>0?(peaCash/peaTotal)*100:0,fill:C.cyan});
  const sorted=items;

  const RADIAN=Math.PI/180;
  const renderLabel=({cx,cy,midAngle,innerRadius,outerRadius,pct})=>{
    if(pct<4)return null;
    const radius=innerRadius+(outerRadius-innerRadius)*0.5;
    const x=cx+radius*Math.cos(-midAngle*RADIAN);
    const y=cy+radius*Math.sin(-midAngle*RADIAN);
    return(<text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{pct.toFixed(0)}%</text>);
  };

  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
    <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}>
      <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.textDim,letterSpacing:.5,textTransform:"uppercase"}}>RÉPARTITION DU PORTEFEUILLE</h3>
    </div>
    <div style={{padding:20,display:"flex",flexDirection:isMobile?"column":"row",alignItems:isMobile?"stretch":"center",gap:24}}>
      <ResponsiveContainer width={isMobile?"100%":"50%"} height={isMobile?200:260}>
        <PieChart>
          <Pie data={sorted} dataKey="value" cx="50%" cy="50%" innerRadius={isMobile?45:60} outerRadius={isMobile?85:110} paddingAngle={2} stroke="none" labelLine={false} label={renderLabel}>
            {sorted.map((e,i)=><Cell key={i} fill={e.fill}/>)}
          </Pie>
          <Tooltip content={<PieTooltip/>}/>
        </PieChart>
      </ResponsiveContainer>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,maxHeight:isMobile?undefined:260,overflowY:isMobile?"visible":"auto"}}>
        {sorted.map((h,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:i<sorted.length-1?`1px solid ${C.border}22`:"none"}}>
          <div style={{width:12,height:12,borderRadius:4,background:h.fill,flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:C.text}}>{h.pct.toFixed(1)}%</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.textDim}}>{fmtEur(h.value)}</div>
          </div>
        </div>))}
      </div>
    </div>
  </div>);
}

function HoldingRow({item,onEdit,onDelete,type,totalValue,isMobile}){
  const montant=type==="livret"?item.balance:item.quantity*item.currentPrice;
  const pv=type==="pea"?(item.currentPrice-item.pru)*item.quantity:type==="crypto"?(item.currentPrice-item.avgPrice)*item.quantity:0;
  const pvPct=type==="pea"?((item.currentPrice-item.pru)/item.pru)*100:type==="crypto"?((item.currentPrice-item.avgPrice)/item.avgPrice)*100:0;
  const weight=totalValue>0?(montant/totalValue)*100:0;
  const pos=pv>=0;
  const editBtn=<button onClick={()=>onEdit(item)} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:4,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Edit3 size={13}/></button>;
  const delBtn=<button onClick={()=>onDelete(item.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:4,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Trash2 size={13}/></button>;

  if(isMobile){
    return(<div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div>
          <span style={{fontWeight:700,fontSize:14,color:C.text}}>{item.name}</span>
          {item.ticker&&<span style={{color:C.textMuted,marginLeft:6,fontSize:10}}>{item.ticker}</span>}
          {item.symbol&&<span style={{color:C.gold,marginLeft:6,fontSize:11,fontWeight:700}}>{item.symbol}</span>}
        </div>
        <div style={{display:"flex",gap:2}}>{editBtn}{delBtn}</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:17,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:C.text}}>{fmtEur(montant)}</div>
          {type!=="livret"&&<div style={{fontSize:11,color:C.textDim,marginTop:2}}>{type==="crypto"?item.quantity.toFixed(4):item.quantity} × {fmtEur(item.currentPrice)}</div>}
          {type==="livret"&&<div style={{fontSize:11,color:C.accent,marginTop:2}}>{item.rate}% / an</div>}
        </div>
        {type!=="livret"&&<div style={{textAlign:"right"}}>
          <div style={{fontSize:15,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:pos?C.green:C.red,display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end"}}>
            {pos?<ArrowUpRight size={12}/>:<ArrowDownRight size={12}/>}{fmtPct(pvPct)}
          </div>
          <div style={{fontSize:11,color:pos?C.green:C.red,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(pv)}</div>
        </div>}
      </div>
      <div style={{marginTop:5,fontSize:10,color:C.textDim}}>
        Poids {weight.toFixed(1)}%{type!=="livret"?` · PRU ${fmtEur(type==="pea"?item.pru:item.avgPrice)}`:""}
      </div>
    </div>);
  }

  const cols=type==="livret"?{gridTemplateColumns:"2fr 0.6fr 1fr 0.6fr 50px"}:{gridTemplateColumns:"2fr 0.5fr 0.7fr 0.7fr 0.9fr 0.9fr 0.8fr 0.5fr 50px"};
  return(<div style={{display:"grid",...cols,alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontSize:12.5,transition:"background .15s"}}
    onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
    <div><span style={{fontWeight:600,color:C.text}}>{item.name}</span>
      {item.ticker&&<span style={{color:C.textMuted,marginLeft:6,fontSize:10}}>{item.ticker}</span>}
      {item.symbol&&<span style={{color:C.gold,marginLeft:6,fontSize:10,fontWeight:700}}>{item.symbol}</span>}
    </div>
    {type!=="livret"&&<>
      <span style={{color:C.textDim,fontFamily:"'JetBrains Mono',monospace",textAlign:"right"}}>{type==="crypto"?item.quantity.toFixed(4):item.quantity}</span>
      <span style={{color:C.textDim,fontFamily:"'JetBrains Mono',monospace",textAlign:"right"}}>{fmtEur(type==="pea"?item.pru:item.avgPrice)}</span>
      <span style={{color:C.text,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,textAlign:"right"}}>{fmtEur(item.currentPrice)}</span>
    </>}
    <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:C.text,textAlign:"right"}}>{fmtEur(montant)}</span>
    {type!=="livret"&&<>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pos?C.green:C.red,textAlign:"right"}}>{fmtEur(pv)}</span>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pos?C.green:C.red,textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3}}>
        {pos?<ArrowUpRight size={11}/>:<ArrowDownRight size={11}/>}{fmtPct(pvPct)}
      </span>
    </>}
    {type==="livret"&&<span style={{color:C.accent,fontFamily:"'JetBrains Mono',monospace",textAlign:"right"}}>{item.rate}%</span>}
    <span style={{fontFamily:"'JetBrains Mono',monospace",textAlign:"right",fontSize:11,color:C.textDim}}>{weight.toFixed(1)}%</span>
    <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>{editBtn}{delBtn}</div>
  </div>);
}

function Modal({show,onClose,title,children}){
  if(!show)return null;
  return(<div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"28px 32px",minWidth:400,maxWidth:520,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 25px 60px rgba(0,0,0,.5)"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{color:C.text,fontSize:17,fontWeight:700,margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:4}}><X size={18}/></button>
      </div>{children}
    </div>
  </div>);
}

function InputField({label,value,onChange,type="text",placeholder}){
  return(<div style={{marginBottom:14}}>
    <label style={{color:C.textDim,fontSize:11,fontWeight:600,marginBottom:5,display:"block",letterSpacing:.5,textTransform:"uppercase"}}>{label}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace",outline:"none",boxSizing:"border-box"}}
      onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
  </div>);
}

function SelectField({label,value,onChange,options}){
  return(<div style={{marginBottom:14}}>
    <label style={{color:C.textDim,fontSize:11,fontWeight:600,marginBottom:5,display:"block",letterSpacing:.5,textTransform:"uppercase"}}>{label}</label>
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace",outline:"none"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>);
}

function TabBtn({active,label,icon:Icon,onClick,badge}){
  return(<button onClick={onClick} style={{background:active?C.accentDim:"transparent",border:`1px solid ${active?C.accent:"transparent"}`,borderRadius:10,padding:"9px 16px",color:active?C.accent:C.textDim,fontSize:12.5,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"all .2s",whiteSpace:"nowrap"}}
    onMouseEnter={e=>{if(!active)e.currentTarget.style.background=C.cardHover}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
    <Icon size={14}/>{label}{badge!==undefined&&<span style={{background:active?C.accent:C.textMuted,color:active?"#fff":C.textDim,borderRadius:5,padding:"1px 6px",fontSize:10,fontWeight:700}}>{badge}</span>}
  </button>);
}

function SectionCard({title,rightContent,children,scrollable}){
  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
    {title&&<div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
      <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.textDim,letterSpacing:.5,textTransform:"uppercase"}}>{title}</h3>{rightContent}
    </div>}
    {scrollable?<div style={{overflowX:"auto"}}>{children}</div>:children}
  </div>);
}

const PieTooltip=({active,payload})=>{
  if(!active||!payload?.[0])return null;const d=payload[0];
  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px",boxShadow:"0 8px 24px rgba(0,0,0,.4)"}}>
    <div style={{color:C.text,fontWeight:600,fontSize:12}}>{d.name}</div>
    <div style={{color:d.payload.fill,fontWeight:700,fontSize:14,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(d.value)} · {d.payload.pct?.toFixed(1)}%</div>
  </div>);
};

/* ═══ DIVIDEND TOOLTIP (FIXED WHITE TEXT) ═══ */
const DivBarTooltip=({active,payload,label})=>{
  if(!active||!payload?.[0])return null;
  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",boxShadow:"0 8px 24px rgba(0,0,0,.4)"}}>
    <div style={{color:C.text,fontWeight:700,fontSize:14,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(payload[0].value)}</div>
    <div style={{color:C.textDim,fontSize:12,marginTop:2}}>{label}{payload[0].payload.projected?" (projection)":""}</div>
  </div>);
};

function MillionGoal({current,monthly,projData,goal,onGoalChange}){
  const [editingGoal,setEditingGoal]=useState(false);
  const [goalInput,setGoalInput]=useState("");
  const pct=Math.min((current/goal)*100,100);
  const yearToGoal=projData.find(p=>p.capital>=goal);
  const milestones=[
    {val:goal*0.05,label:fmtK(goal*0.05),icon:"🎯"},
    {val:goal*0.10,label:fmtK(goal*0.10),icon:"🔥"},
    {val:goal*0.25,label:fmtK(goal*0.25),icon:"💪"},
    {val:goal*0.50,label:fmtK(goal*0.50),icon:"🚀"},
    {val:goal*0.75,label:fmtK(goal*0.75),icon:"⚡"},
    {val:goal,label:fmtK(goal),icon:"🏆"},
  ];
  const next=milestones.find(m=>m.val>current);
  const confirmGoal=()=>{const v=parseInt(goalInput.replace(/\s/g,""));if(v>0)onGoalChange(v);setEditingGoal(false);};
  return(<div style={{background:`linear-gradient(135deg,${C.card} 0%,#0f1a30 100%)`,border:`1px solid ${C.border}`,borderRadius:16,padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,right:0,width:300,height:300,background:`radial-gradient(circle,${C.accentDim}22 0%,transparent 70%)`,pointerEvents:"none"}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,position:"relative"}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <Flag size={18} color={C.gold}/>
          <span style={{fontSize:18,fontWeight:800,color:C.text}}>OBJECTIF</span>
          {editingGoal
            ?<div style={{display:"flex",alignItems:"center",gap:6}}>
              <input autoFocus type="number" value={goalInput} onChange={e=>setGoalInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")confirmGoal();if(e.key==="Escape")setEditingGoal(false);}}
                style={{background:C.bg,border:`1px solid ${C.gold}`,borderRadius:6,padding:"4px 8px",color:C.text,fontSize:14,fontFamily:"'JetBrains Mono',monospace",width:130,outline:"none",textAlign:"right"}}/>
              <button onClick={confirmGoal} style={{background:"none",border:`1px solid ${C.gold}`,borderRadius:6,padding:"4px 8px",color:C.gold,cursor:"pointer",fontSize:11,fontWeight:600}}><Check size={12}/></button>
              <button onClick={()=>setEditingGoal(false)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 8px",color:C.textDim,cursor:"pointer",fontSize:11}}><X size={12}/></button>
            </div>
            :<div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:18,fontWeight:800,color:C.gold}}>{fmtEur(goal)}</span>
              <button onClick={()=>{setGoalInput(String(goal));setEditingGoal(true);}} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:2}}
                onMouseEnter={e=>e.currentTarget.style.color=C.gold} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Edit3 size={13}/></button>
            </div>
          }
        </div>
        <span style={{color:C.textDim,fontSize:13}}>{yearToGoal?`Estimé en ${yearToGoal.year} à ${fmtEur(monthly)}/mois`:"Continue d'investir !"}</span>
      </div>
      <div style={{textAlign:"right"}}><div style={{fontSize:32,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:C.gold}}>{pct.toFixed(1)}%</div><div style={{fontSize:12,color:C.textDim}}>{fmtEur(current)} / {fmtEur(goal)}</div></div>
    </div>
    <div style={{position:"relative",marginBottom:32}}>
      <div style={{height:28,background:C.bg,borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}`,position:"relative"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.accent},${C.purple},${C.gold})`,borderRadius:14,transition:"width 1s",boxShadow:`0 0 20px ${C.accent}44`}}/>
        {milestones.map((m,i)=>{const mP=(m.val/goal)*100;return(<div key={i} style={{position:"absolute",left:`${mP}%`,top:-18,transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <span style={{fontSize:9}}>{m.icon}</span>
          <div style={{width:1.5,height:40,background:m.val<=current?C.green+"66":C.border,position:"absolute",top:18}}/>
          <span style={{fontSize:8,color:m.val<=current?C.green:C.textMuted,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",position:"absolute",top:52}}>{m.label}</span>
        </div>);})}
      </div>
    </div>
    {next&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
      <span style={{fontSize:20}}>{next.icon}</span>
      <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>Prochain palier : {next.label}€</div>
        <div style={{fontSize:12,color:C.textDim}}>Il manque {fmtEur(next.val-current)} · ~{Math.ceil((next.val-current)/(monthly*12+current*0.08))} an(s) estimé(s)</div>
      </div>
      <div style={{marginLeft:"auto",fontSize:14,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.accent}}>{((current/next.val)*100).toFixed(0)}%</div>
    </div>}
  </div>);
}

function DivRow({item,onEditDiv}){
  if(item.divFreq==="cap"||!item.divPerShare)return null;
  const ann=item.divPerShare*item.quantity;
  const yP=item.currentPrice>0?(item.divPerShare/item.currentPrice)*100:0;
  const yC=item.pru>0?(item.divPerShare/item.pru)*100:0;
  return(<div style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 50px",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontSize:12.5}}
    onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
    <div><span style={{fontWeight:600,color:C.text}}>{item.name}</span><span style={{color:C.textMuted,marginLeft:6,fontSize:10}}>{item.quantity} titres</span></div>
    <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.text,fontWeight:600}}>{fmtEur(item.divPerShare)}</span>
    <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.green,fontWeight:700}}>{fmtEur(ann)}</span>
    <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.accent}}>{yP.toFixed(2)}%</span>
    <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.gold}}>{yC.toFixed(2)}%</span>
    <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.textDim,fontSize:11}}>{item.divFreq==="trim"?"Trimestriel":"Annuel"}</span>
    <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={()=>onEditDiv(item)} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:3}} onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Edit3 size={13}/></button></div>
  </div>);
}

/* ═══════════ MAIN APP ═══════════ */
export default function PatrimoineTracker(){
  const [pea,setPea]=useState(defaultPEA);
  const [crypto,setCrypto]=useState(defaultCrypto);
  const [cto,setCto]=useState(defaultCTO);
  const [livrets,setLivrets]=useState(defaultLivrets);
  const [peaCash,setPeaCash]=useState(0);
  const [ctoCash,setCtoCash]=useState(0);
  const [cryptoCash,setCryptoCash]=useState(0);
  const [stablecoins,setStablecoins]=useState([]);
  const [stablecoinPrices,setStablecoinPrices]=useState({});
  const [stableForm,setStableForm]=useState({symbol:"USDT",quantity:""});
  const [editingCash,setEditingCash]=useState(null);
  const [cashInput,setCashInput]=useState("");
  const [versements,setVersements]=useState(defaultVersements);
  const [divHistory,setDivHistory]=useState(defaultDivHistory);
  const [snapshots,setSnapshots]=useState([]);
  const [activeTab,setActiveTab]=useState(()=>{try{return localStorage.getItem("patra-tab")||"dashboard";}catch(e){return"dashboard";}});
  useEffect(()=>{try{localStorage.setItem("patra-tab",activeTab);}catch(e){}},[activeTab]);
  const [showModal,setShowModal]=useState(null);
  const [editItem,setEditItem]=useState(null);
  const [form,setForm]=useState({});
  const [loaded,setLoaded]=useState(false);
  const [sortConfig,setSortConfig]=useState({key:"montant",dir:"desc"});
  const [txSortConfig,setTxSortConfig]=useState({key:"date",dir:"desc"});
  const [benchData,setBenchData]=useState(null);
  const [benchLoading,setBenchLoading]=useState(false);
  const [benchIndices,setBenchIndices]=useState({cac:true,sp500:true,msci:true});
  const [cryptoLoading,setCryptoLoading]=useState(false);
  const [peaLoading,setPeaLoading]=useState(false);
  const [ctoLoading,setCtoLoading]=useState(false);
  const [lastSync,setLastSync]=useState(null);
  const [lastPeaSync,setLastPeaSync]=useState(null);
  const [lastCtoSync,setLastCtoSync]=useState(null);
  const [peaSyncStatus,setPeaSyncStatus]=useState("");
  const [ctoSyncStatus,setCtoSyncStatus]=useState("");
  const [showDivEditModal,setShowDivEditModal]=useState(false);
  const [divEditItem,setDivEditItem]=useState(null);
  const [showHistoryModal,setShowHistoryModal]=useState(false);
  const [showSnapManager,setShowSnapManager]=useState(false);
  const [showDivHistoryManager,setShowDivHistoryManager]=useState(false);
  const [historyForm,setHistoryForm]=useState({year:"",total:""});
  const [divFetchStatus,setDivFetchStatus]=useState("");
  const [monthlyIncome,setMonthlyIncome]=useState(0);
  const [targetAlloc,setTargetAlloc]=useState({});
  const [goalAmount,setGoalAmount]=useState(()=>{try{const r=localStorage.getItem("patra-goal");return r?parseInt(r):1000000;}catch(e){return 1000000;}});
  useEffect(()=>{try{localStorage.setItem("patra-goal",String(goalAmount));}catch(e){}},[goalAmount]);
  const settingsRef=useRef(null);
  const [showSettings,setShowSettings]=useState(false);
  const [showResetModal,setShowResetModal]=useState(false);
  const [resetInput,setResetInput]=useState("");
  useEffect(()=>{
    const handler=e=>{if(settingsRef.current&&!settingsRef.current.contains(e.target))setShowSettings(false);};
    if(showSettings)document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[showSettings]);
  const [darkMode,setDarkMode]=useState(true);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<768);
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [onboardingStep,setOnboardingStep]=useState(0);
  const [transactions,setTransactions]=useState([]);
  const [showTxModal,setShowTxModal]=useState(false);
  const [isDemo,setIsDemo]=useState(false);
  const [showLanding,setShowLanding]=useState(false);
  const [txForm,setTxForm]=useState({date:new Date().toISOString().slice(0,10),type:"buy",account:"pea",holdingId:"new",name:"",quantity:"",price:"",notes:"",payWith:"cash"});

  // Labels
  const t={dashboard:"Dashboard",pea:"PEA",cto:"CTO",crypto:"Crypto",livrets:"Livrets",dividendes:"Dividendes",objectif:`Objectif ${fmtK(goalAmount)}`,patrimoine:"PATRIMOINE",plusValue:"PLUS-VALUE",divAn:"DIVIDENDES/AN",snapshot:"Snapshot",backup:"Backup",restore:"Restore",add:"Ajouter",save:"Sauvegarder",delete:"Supprimer",syncActions:"Sync Actions",syncCrypto:"Sync Crypto",invested:"investis",month:"/mois",year:"/an",total:"Total",buy:"Achat",sell:"Vente",transactions:"Transactions",noTx:"Aucune transaction enregistrée",logTx:"Enregistrer",name:"Nom",quantity:"Quantité",price:"Prix",notes:"Notes",date:"Date",type:"Type",account:"Compte"};

  // Persistent storage
  useEffect(()=>{try{const raw=localStorage.getItem("patrimoine-v6");if(raw){const p=JSON.parse(raw);if(p.pea)setPea(p.pea);if(p.crypto)setCrypto(p.crypto);if(p.cto)setCto(p.cto);if(p.livrets)setLivrets(p.livrets);if(p.peaCash!==undefined)setPeaCash(p.peaCash);if(p.ctoCash!==undefined)setCtoCash(p.ctoCash);if(p.cryptoCash!==undefined)setCryptoCash(p.cryptoCash);if(p.stablecoins)setStablecoins(p.stablecoins);if(p.versements)setVersements(p.versements);if(p.snapshots)setSnapshots(p.snapshots);if(p.lastSync)setLastSync(p.lastSync);if(p.lastPeaSync)setLastPeaSync(p.lastPeaSync);if(p.lastCtoSync)setLastCtoSync(p.lastCtoSync);if(p.divHistory)setDivHistory(p.divHistory);if(p.monthlyIncome)setMonthlyIncome(p.monthlyIncome);if(p.targetAlloc)setTargetAlloc(p.targetAlloc);if(p.darkMode!==undefined)setDarkMode(p.darkMode);if(p.transactions)setTransactions(p.transactions);if(p._isDemo)setIsDemo(true);} else {if(sessionStorage.getItem('patra-demo')){sessionStorage.removeItem('patra-demo');const d=DEMO_DATA;setPea(d.pea);setCrypto(d.crypto);setCto(d.cto);setLivrets(d.livrets);setPeaCash(d.peaCash);setCtoCash(d.ctoCash);setCryptoCash(d.cryptoCash||0);setStablecoins(d.stablecoins||[]);setVersements(d.versements);setSnapshots(d.snapshots);setDivHistory(d.divHistory);setMonthlyIncome(d.monthlyIncome);if(d.targetAlloc)setTargetAlloc(d.targetAlloc);setTransactions(d.transactions);setIsDemo(true);}else{setShowLanding(true);}}}catch(e){}setLoaded(true);},[]);

  const persist=useCallback(()=>{try{localStorage.setItem("patrimoine-v6",JSON.stringify({pea,crypto,cto,livrets,peaCash,ctoCash,cryptoCash,stablecoins,versements,snapshots,lastSync,lastPeaSync,lastCtoSync,divHistory,monthlyIncome,targetAlloc,darkMode,transactions,...(isDemo?{_isDemo:true}:{})}))}catch(e){}},[pea,crypto,cto,livrets,peaCash,ctoCash,cryptoCash,stablecoins,versements,snapshots,lastSync,lastPeaSync,lastCtoSync,divHistory,monthlyIncome,targetAlloc,darkMode,transactions,isDemo]);
  useEffect(()=>{if(loaded)persist()},[loaded,persist]);

  // Set active theme
  C = darkMode ? DARK : LIGHT;

  // Backup / Restore
  const clearDemo=()=>{setPea([]);setCrypto([]);setCto([]);setLivrets([]);setPeaCash(0);setCtoCash(0);setCryptoCash(0);setStablecoins([]);setVersements({pea:0,crypto:0,cto:0});setSnapshots([]);setDivHistory([]);setMonthlyIncome(0);setTargetAlloc({});setTransactions([]);setIsDemo(false);localStorage.removeItem("patrimoine-v6");};

  const exportBackup=()=>{
    const data={pea,crypto,cto,livrets,peaCash,ctoCash,cryptoCash,stablecoins,versements,snapshots,divHistory,monthlyIncome,targetAlloc,darkMode,transactions,exportDate:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download=`patrimoine_backup_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
  };
  const importBackup=(e)=>{
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      try{
        const d=JSON.parse(ev.target.result);
        if(d.pea)setPea(d.pea);if(d.crypto)setCrypto(d.crypto);if(d.cto)setCto(d.cto);
        if(d.livrets)setLivrets(d.livrets);if(d.peaCash!==undefined)setPeaCash(d.peaCash);
        if(d.ctoCash!==undefined)setCtoCash(d.ctoCash);if(d.cryptoCash!==undefined)setCryptoCash(d.cryptoCash);if(d.stablecoins)setStablecoins(d.stablecoins);if(d.versements)setVersements(d.versements);
        if(d.snapshots)setSnapshots(d.snapshots);if(d.divHistory)setDivHistory(d.divHistory);
        
        if(d.monthlyIncome)setMonthlyIncome(d.monthlyIncome);if(d.targetAlloc)setTargetAlloc(d.targetAlloc);
        if(d.darkMode!==undefined)setDarkMode(d.darkMode);
        if(d.transactions)setTransactions(d.transactions);
        alert("Données restaurées avec succès !");
      }catch(err){alert("Fichier invalide.");}
    };
    reader.readAsText(file);
    e.target.value="";
  };

  // ═══ SYNC PEA PRICES via Yahoo Finance ═══
  const syncPEA=async()=>{
    setPeaLoading(true);setPeaSyncStatus("Synchronisation...");
    let updated=0;let failed=0;
    const newPea=[...pea];
    for(let i=0;i<newPea.length;i++){
      const h=newPea[i];
      if(!h.ticker){failed++;continue;}
      try{
        setPeaSyncStatus(`${h.name}...`);
        const url=`/api/quote?ticker=${encodeURIComponent(h.ticker)}&range=1d&interval=1d`;
        const r=await fetch(url,{signal:AbortSignal.timeout(8000)});
        const d=await r.json();
        const price=d?.chart?.result?.[0]?.meta?.regularMarketPrice;
        if(price&&price>0){newPea[i]={...h,currentPrice:Math.round(price*100)/100};updated++;}
        else{failed++;}
      }catch(e){failed++;console.error(`Failed ${h.ticker}:`,e);}
      // Small delay to avoid rate limits
      if(i<newPea.length-1)await new Promise(r=>setTimeout(r,300));
    }
    setPea(newPea);
    setLastPeaSync(new Date().toISOString());
    setPeaSyncStatus(`${updated} mis à jour${failed>0?`, ${failed} échoué(s)`:""}`);
    setPeaLoading(false);
    setTimeout(()=>setPeaSyncStatus(""),5000);
  };

  // ═══ SYNC CTO PRICES via Yahoo Finance ═══
  const syncCTO=async()=>{
    setCtoLoading(true);setCtoSyncStatus("Synchronisation...");
    let updated=0;let failed=0;
    // Fetch USD/EUR rate first
    let usdEur=1;
    try{
      const fxUrl=`/api/quote?ticker=${encodeURIComponent("EURUSD=X")}&range=1d&interval=1d`;
      const fxR=await fetch(fxUrl,{signal:AbortSignal.timeout(8000)});
      const fxD=await fxR.json();
      const eurUsd=fxD?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if(eurUsd&&eurUsd>0)usdEur=1/eurUsd;
    }catch(e){console.error("FX rate failed, using 1:1",e);}
    const newCto=[...cto];
    for(let i=0;i<newCto.length;i++){
      const h=newCto[i];
      if(!h.ticker){failed++;continue;}
      try{
        setCtoSyncStatus(`${h.name}...`);
        const url=`/api/quote?ticker=${encodeURIComponent(h.ticker)}&range=1d&interval=1d`;
        const r=await fetch(url,{signal:AbortSignal.timeout(8000)});
        const d=await r.json();
        const meta=d?.chart?.result?.[0]?.meta;
        const price=meta?.regularMarketPrice;
        const currency=meta?.currency||"EUR";
        if(price&&price>0){
          const priceEur=currency==="USD"?price*usdEur:currency==="GBP"?price*usdEur*1.17:price;
          newCto[i]={...h,currentPrice:Math.round(priceEur*100)/100,currency};updated++;
        }else{failed++;}
      }catch(e){failed++;console.error(`Failed ${h.ticker}:`,e);}
      if(i<newCto.length-1)await new Promise(r=>setTimeout(r,300));
    }
    setCto(newCto);
    setLastCtoSync(new Date().toISOString());
    setCtoSyncStatus(`${updated} mis à jour${failed>0?`, ${failed} échoué(s)`:""} (1$=${usdEur.toFixed(4)}€)`);
    setCtoLoading(false);
    setTimeout(()=>setCtoSyncStatus(""),8000);
  };

  // Crypto sync - dynamic, uses cgId field from each crypto + stablecoin prices
  const syncCrypto=async()=>{
    setCryptoLoading(true);
    try{
      const cryptoIds=crypto.map(c=>c.cgId).filter(Boolean);
      const stableIds=STABLE_LIST.map(s=>s.cgId);
      const allIds=[...new Set([...cryptoIds,...stableIds])].join(",");
      const r=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${allIds}&vs_currencies=eur`);
      const d=await r.json();
      if(cryptoIds.length)setCrypto(prev=>prev.map(c=>{
        if(c.cgId&&d[c.cgId]?.eur)return{...c,currentPrice:d[c.cgId].eur};
        return c;
      }));
      const prices={};STABLE_LIST.forEach(s=>{if(d[s.cgId]?.eur)prices[s.cgId]=d[s.cgId].eur;});
      setStablecoinPrices(prices);
      setLastSync(new Date().toISOString());
    }catch(e){console.error(e)}
    setCryptoLoading(false);
  };

  useEffect(()=>{if(loaded){syncCrypto();syncPEA();syncCTO();}},[loaded]);
  useEffect(()=>{const h=()=>setIsMobile(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);

  // Auto-sync quand on change d'onglet (cooldown 5 min)
  useEffect(()=>{
    if(!loaded)return;
    const stale=(last)=>!last||Date.now()-new Date(last).getTime()>5*60*1000;
    if(activeTab==="pea"&&stale(lastPeaSync))syncPEA();
    else if(activeTab==="cto"&&stale(lastCtoSync))syncCTO();
    else if(activeTab==="crypto"&&stale(lastSync))syncCrypto();
  },[activeTab,loaded]);

  // Calculations
  const peaTitres=pea.reduce((s,h)=>s+h.quantity*h.currentPrice,0);
  const peaTotal=peaTitres+peaCash;
  const peaInvested=pea.reduce((s,h)=>s+h.quantity*h.pru,0);
  const peaPV=peaTitres-peaInvested;const peaPVPct=peaInvested>0?(peaPV/peaInvested)*100:0;
  const cryptoTitres=crypto.reduce((s,h)=>s+h.quantity*h.currentPrice,0);
  const stableHoldings=stablecoins.map(st=>{const meta=STABLE_LIST.find(m=>m.symbol===st.symbol);const price=meta?(stablecoinPrices[meta.cgId]??0):0;return{id:st.id,name:st.symbol,symbol:st.symbol,cgId:meta?.cgId||"",quantity:st.quantity,avgPrice:price,currentPrice:price,_isStable:true};});
  const stablecoinsTotal=stableHoldings.reduce((s,h)=>s+h.quantity*h.currentPrice,0);
  const cryptoTotal=cryptoTitres+cryptoCash+stablecoinsTotal;
  const cryptoInvested=crypto.reduce((s,h)=>s+h.quantity*h.avgPrice,0);
  const cryptoPV=cryptoTotal-cryptoInvested;const cryptoPVPct=cryptoInvested>0?(cryptoPV/cryptoInvested)*100:0;
  const ctoTitres=cto.reduce((s,h)=>s+h.quantity*h.currentPrice,0);
  const ctoTotal=ctoTitres+ctoCash;
  const ctoInvested=cto.reduce((s,h)=>s+h.quantity*h.pru,0);
  const ctoPV=ctoTitres-ctoInvested;const ctoPVPct=ctoInvested>0?(ctoPV/ctoInvested)*100:0;
  const livretsTotal=livrets.reduce((s,l)=>s+l.balance,0);
  const totalPat=peaTotal+cryptoTotal+ctoTotal+livretsTotal;const totalInv=peaInvested+cryptoInvested+ctoInvested+livretsTotal;
  const totalPV=totalPat-totalInv;const totalPVPct=totalInv>0?(totalPV/totalInv)*100:0;
  const mensuel=versements.pea+versements.crypto+versements.cto;

  const divPayers=[...pea,...cto].filter(h=>h.divPerShare>0&&h.divFreq!=="cap");
  const totalDivAnnual=divPayers.reduce((s,h)=>s+h.divPerShare*h.quantity,0);
  const allTitresTotal=peaTitres+ctoTitres;
  const allTitresInvested=peaInvested+ctoInvested;
  const divYieldGlobal=allTitresTotal>0?(totalDivAnnual/allTitresTotal)*100:0;
  const divYieldOnCost=allTitresInvested>0?(totalDivAnnual/allTitresInvested)*100:0;
  const divMonthly=totalDivAnnual/12;
  const currentYearDivHistory=[...divHistory,{year:2026,total:Math.round(totalDivAnnual),projected:true}];

  const allocGlobal=totalPat>0?[
    {name:"PEA",value:peaTotal,fill:C.accent,pct:(peaTotal/totalPat)*100},
    {name:"CTO",value:ctoTotal,fill:C.purple,pct:(ctoTotal/totalPat)*100},
    {name:"Crypto",value:cryptoTotal,fill:C.gold,pct:(cryptoTotal/totalPat)*100},
    {name:"Livrets",value:livretsTotal,fill:C.green,pct:(livretsTotal/totalPat)*100},
  ].filter(a=>a.value>0):[];

  const projData=[];let cap=totalPat;
  for(let y=0;y<=25;y++){projData.push({year:2026+y,capital:Math.round(cap)});cap=cap*1.08+mensuel*12;}

  // Advanced mode calculations
  const projMulti=[];
  let capP=totalPat,capM=totalPat,capO=totalPat;
  for(let y=0;y<=25;y++){
    projMulti.push({year:2026+y,pessimiste:Math.round(capP),moyen:Math.round(capM),optimiste:Math.round(capO)});
    capP=capP*1.05+mensuel*12;capM=capM*1.08+mensuel*12;capO=capO*1.11+mensuel*12;
  }

  const savingsRate=monthlyIncome>0?((mensuel/monthlyIncome)*100):0;

  // Rebalancing alerts
  const allHoldings=[
    ...pea.map(h=>({name:h.name,value:h.quantity*h.currentPrice,cat:"pea"})),
    ...(peaCash>0?[{name:"Espèces PEA",value:peaCash,cat:"pea"}]:[]),
    ...cto.map(h=>({name:h.name,value:h.quantity*h.currentPrice,cat:"cto"})),
    ...(ctoCash>0?[{name:"Espèces CTO",value:ctoCash,cat:"cto"}]:[]),
    ...crypto.map(h=>({name:h.name,value:h.quantity*h.currentPrice,cat:"crypto"})),
    ...livrets.map(l=>({name:l.name,value:l.balance,cat:"livret"})),
  ];
  const rebalAlerts=Object.entries(targetAlloc).map(([key,target])=>{
    if(!target)return null;
    const [cat,name]=key.includes(":")?key.split(":"):[null,key];
    const sectionItems=allHoldings.filter(h=>h.cat===cat);
    const sectionTotal=sectionItems.reduce((s,h)=>s+h.value,0);
    const holding=sectionItems.find(h=>h.name===name);
    if(!holding||sectionTotal===0)return null;
    const actual=(holding.value/sectionTotal)*100;
    const diff=actual-target;
    if(Math.abs(diff)>=3)return{name,target,actual:actual.toFixed(1),diff:diff.toFixed(1),over:diff>0};
    return null;
  }).filter(Boolean);

  const takeSnap=()=>{const s={date:new Date().toISOString(),total:totalPat,invested:totalInv,pea:peaTotal,cto:ctoTotal,crypto:cryptoTotal,livrets:livretsTotal};setSnapshots(prev=>[...prev,s].slice(-100));};

  // CRUD
  const handleAdd=()=>{const t=showModal;
    if(t==="pea")setPea(p=>[...p,{id:Date.now().toString(),name:form.name||"",ticker:form.ticker||"",quantity:parseFloat(form.quantity)||0,pru:parseFloat(form.pru)||0,currentPrice:parseFloat(form.currentPrice)||0,divPerShare:parseFloat(form.divPerShare)||0,divFreq:form.divFreq||"annuel"}]);
    else if(t==="cto")setCto(p=>[...p,{id:Date.now().toString(),name:form.name||"",ticker:form.ticker||"",quantity:parseFloat(form.quantity)||0,pru:parseFloat(form.pru)||0,currentPrice:parseFloat(form.currentPrice)||0,divPerShare:parseFloat(form.divPerShare)||0,divFreq:form.divFreq||"annuel"}]);
    else if(t==="crypto")setCrypto(p=>[...p,{id:Date.now().toString(),name:form.name||"",symbol:form.symbol||"",cgId:form.cgId||"",quantity:parseFloat(form.quantity)||0,avgPrice:parseFloat(form.avgPrice)||0,currentPrice:parseFloat(form.currentPrice)||0}]);
    else setLivrets(p=>[...p,{id:Date.now().toString(),name:form.name||"",balance:parseFloat(form.balance)||0,rate:parseFloat(form.rate)||0}]);
    setShowModal(null);setForm({});};

  const handleEdit=()=>{const t=editItem._type;
    if(t==="pea")setPea(p=>p.map(h=>h.id===editItem.id?{...h,name:form.name??h.name,ticker:form.ticker??h.ticker,quantity:parseFloat(form.quantity)||h.quantity,pru:parseFloat(form.pru)||h.pru,currentPrice:parseFloat(form.currentPrice)||h.currentPrice,divPerShare:parseFloat(form.divPerShare)>=0?parseFloat(form.divPerShare):h.divPerShare,divFreq:form.divFreq||h.divFreq}:h));
    else if(t==="cto")setCto(p=>p.map(h=>h.id===editItem.id?{...h,name:form.name??h.name,ticker:form.ticker??h.ticker,quantity:parseFloat(form.quantity)||h.quantity,pru:parseFloat(form.pru)||h.pru,currentPrice:parseFloat(form.currentPrice)||h.currentPrice,divPerShare:parseFloat(form.divPerShare)>=0?parseFloat(form.divPerShare):h.divPerShare,divFreq:form.divFreq||h.divFreq}:h));
    else if(t==="crypto")setCrypto(p=>p.map(h=>h.id===editItem.id?{...h,name:form.name??h.name,symbol:form.symbol??h.symbol,cgId:form.cgId??h.cgId,quantity:parseFloat(form.quantity)||h.quantity,avgPrice:parseFloat(form.avgPrice)||h.avgPrice,currentPrice:parseFloat(form.currentPrice)||h.currentPrice}:h));
    else setLivrets(p=>p.map(l=>l.id===editItem.id?{...l,name:form.name??l.name,balance:parseFloat(form.balance)||l.balance,rate:parseFloat(form.rate)||l.rate}:l));
    setEditItem(null);setForm({});};

  const del=(type,id)=>{if(type==="pea")setPea(p=>p.filter(h=>h.id!==id));else if(type==="cto")setCto(p=>p.filter(h=>h.id!==id));else if(type==="crypto")setCrypto(p=>p.filter(h=>h.id!==id));else setLivrets(p=>p.filter(l=>l.id!==id));};

  const openEdit=(item,type)=>{setEditItem({...item,_type:type});
    if(type==="pea"||type==="cto")setForm({name:item.name,ticker:item.ticker,quantity:String(item.quantity),pru:String(item.pru),currentPrice:String(item.currentPrice),divPerShare:String(item.divPerShare||0),divFreq:item.divFreq||"annuel"});
    else if(type==="crypto")setForm({name:item.name,symbol:item.symbol,cgId:item.cgId||"",quantity:String(item.quantity),avgPrice:String(item.avgPrice),currentPrice:String(item.currentPrice)});
    else setForm({name:item.name,balance:String(item.balance),rate:String(item.rate)});};

  const handleDivEdit=()=>{
    const upd=h=>h.id===divEditItem.id?{...h,divPerShare:parseFloat(form.divPerShare)||0,divFreq:form.divFreq||h.divFreq}:h;
    setPea(p=>p.map(upd));setCto(p=>p.map(upd));
    setDivEditItem(null);setShowDivEditModal(false);setForm({});
  };
  const addStable=()=>{const qty=parseFloat(stableForm.quantity)||0;if(!qty)return;setStablecoins(p=>[...p,{id:Date.now().toString(),symbol:stableForm.symbol,quantity:qty}]);setStableForm(p=>({...p,quantity:""}));};

  const addDivHistory=()=>{const y=parseInt(historyForm.year);const t=parseFloat(historyForm.total);
    if(y&&t){setDivHistory(p=>{const e=p.findIndex(d=>d.year===y);if(e>=0){const n=[...p];n[e]={year:y,total:t};return n;}return[...p,{year:y,total:t}].sort((a,b)=>a.year-b.year)});}
    setHistoryForm({year:"",total:""});setShowHistoryModal(false);};

  const fetchDivForTicker=async(ticker)=>{
    if(!ticker)return;
    setDivFetchStatus("⏳ Récupération cours & dividende...");
    try{
      const [divRes,priceRes]=await Promise.all([
        fetch(`/api/dividends?ticker=${encodeURIComponent(ticker)}`),
        fetch(`/api/quote?ticker=${encodeURIComponent(ticker)}&range=1d&interval=1d`)
      ]);
      const [divData,priceData]=await Promise.all([divRes.json(),priceRes.json()]);
      const updates={};
      const msgs=[];
      // Prix actuel
      const closes=priceData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
      const lastPrice=closes?.filter(Boolean).slice(-1)[0];
      if(lastPrice){updates.currentPrice=String(Math.round(lastPrice*100)/100);msgs.push(`cours ${fmtEur(lastPrice)}`);}
      // Dividende
      if(divData.dividendRate!=null&&divData.dividendRate>0){updates.divPerShare=String(divData.dividendRate);msgs.push(`div. ${divData.dividendRate}€/action`);}
      if(Object.keys(updates).length>0){
        setForm(p=>({...p,...updates}));
        setDivFetchStatus(`✅ ${msgs.join(" · ")}`);
      }else{
        setDivFetchStatus("ℹ️ Ticker introuvable ou pas de dividende");
      }
    }catch(e){setDivFetchStatus("❌ Erreur de récupération");}
    setTimeout(()=>setDivFetchStatus(""),5000);
  };

  // Export CSV
  const exportCSV=()=>{
    const lines=["Type,Nom,Quantité,PRU,Cours,Montant,+/- Value,+/- %"];
    pea.forEach(h=>{const m=h.quantity*h.currentPrice;const pv=(h.currentPrice-h.pru)*h.quantity;const pp=((h.currentPrice-h.pru)/h.pru)*100;
      lines.push(`PEA,${h.name},${h.quantity},${h.pru},${h.currentPrice},${m.toFixed(2)},${pv.toFixed(2)},${pp.toFixed(2)}%`);});
    if(peaCash>0)lines.push(`PEA,Espèces,,,,,${peaCash.toFixed(2)},`);
    cto.forEach(h=>{const m=h.quantity*h.currentPrice;const pv=(h.currentPrice-h.pru)*h.quantity;const pp=((h.currentPrice-h.pru)/h.pru)*100;
      lines.push(`CTO,${h.name},${h.quantity},${h.pru},${h.currentPrice},${m.toFixed(2)},${pv.toFixed(2)},${pp.toFixed(2)}%`);});
    if(ctoCash>0)lines.push(`CTO,Espèces,,,,,${ctoCash.toFixed(2)},`);
    crypto.forEach(h=>{const m=h.quantity*h.currentPrice;const pv=(h.currentPrice-h.avgPrice)*h.quantity;const pp=((h.currentPrice-h.avgPrice)/h.avgPrice)*100;
      lines.push(`Crypto,${h.name},${h.quantity},${h.avgPrice},${h.currentPrice},${m.toFixed(2)},${pv.toFixed(2)},${pp.toFixed(2)}%`);});
    livrets.forEach(l=>lines.push(`Livret,${l.name},,,, ${l.balance.toFixed(2)},,${l.rate}%`));
    lines.push(`,,,,TOTAL,${totalPat.toFixed(2)},${totalPV.toFixed(2)},${totalPVPct.toFixed(2)}%`);
    if(transactions.length>0){
      lines.push("","Date,Type,Compte,Nom,Quantité,Prix,Total,Impact cash");
      transactions.forEach(tx=>{
        const total=(tx.quantity*tx.price).toFixed(2);
        const cash=tx.cashDelta!==undefined?tx.cashDelta.toFixed(2):(tx.stableDelta?`${tx.stableDelta.symbol} ${tx.stableDelta.delta.toFixed(2)}`:"");
        lines.push(`${tx.date},${tx.type==="buy"?"Achat":"Vente"},${tx.account.toUpperCase()},${tx.name},${tx.quantity},${tx.price},${total},${cash}`);
      });
    }
    const blob=new Blob(["\uFEFF"+lines.join("\n")],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download=`patrimoine_${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
  };

  // Dividend calendar (month-by-month projection)
  const divCalendar=divPayers.map(h=>{
    const annual=h.divPerShare*h.quantity;
    if(h.divFreq==="trim")return{name:h.name,months:{1:annual/4,4:annual/4,7:annual/4,10:annual/4}};
    return{name:h.name,months:{5:annual}};// Most French stocks pay in May/June
  });
  const monthlyDivData=Array.from({length:12},(_,i)=>{
    const m=i+1;const label=["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"][i];
    const total=divCalendar.reduce((s,d)=>s+(d.months[m]||0),0);
    return{month:label,total:Math.round(total*100)/100};
  });
  const currentMonthDiv=monthlyDivData[new Date().getMonth()]?.total||0;

  const thStyle={color:C.textMuted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,padding:"10px 16px",textAlign:"right"};
  const addBtn=(type)=>(<button onClick={()=>{setShowModal(type);setForm({})}} style={{background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:8,padding:"7px 14px",color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}><Plus size={13}/>Ajouter</button>);

  // Sortable header
  const SortHeader=({label,sortKey,style:s})=>{
    const active=sortConfig.key===sortKey;
    return(<span onClick={()=>setSortConfig(prev=>({key:sortKey,dir:prev.key===sortKey&&prev.dir==="desc"?"asc":"desc"}))}
      style={{...thStyle,...s,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:s?.textAlign==="left"?"flex-start":"flex-end",gap:3,userSelect:"none"}}
      onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=active?C.accent:C.textMuted}>
      {label}{active&&<span style={{fontSize:8}}>{sortConfig.dir==="desc"?"▼":"▲"}</span>}
    </span>);
  };

  // Sortable header for transactions
  const TxSortHeader=({label,sortKey,style:s})=>{
    const active=txSortConfig.key===sortKey;
    return(<span onClick={()=>setTxSortConfig(prev=>({key:sortKey,dir:prev.key===sortKey&&prev.dir==="desc"?"asc":"desc"}))}
      style={{...thStyle,...s,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:s?.textAlign==="left"?"flex-start":s?.textAlign==="center"?"center":"flex-end",gap:3,userSelect:"none"}}
      onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=active?C.accent:C.textMuted}>
      {label}{active&&<span style={{fontSize:8}}>{txSortConfig.dir==="desc"?"▼":"▲"}</span>}
    </span>);
  };

  // Sort holdings
  const sortHoldings=(items,type)=>{
    const {key,dir}=sortConfig;
    return[...items].sort((a,b)=>{
      let vA,vB;
      if(key==="name"){vA=a.name.toLowerCase();vB=b.name.toLowerCase();return dir==="asc"?vA.localeCompare(vB):vB.localeCompare(vA);}
      if(key==="quantity"){vA=a.quantity;vB=b.quantity;}
      else if(key==="pru"){vA=type==="crypto"?a.avgPrice:a.pru;vB=type==="crypto"?b.avgPrice:b.pru;}
      else if(key==="cours"){vA=a.currentPrice;vB=b.currentPrice;}
      else if(key==="montant"){vA=a.quantity*a.currentPrice;vB=b.quantity*b.currentPrice;}
      else if(key==="pv"){vA=type==="crypto"?(a.currentPrice-a.avgPrice)*a.quantity:(a.currentPrice-a.pru)*a.quantity;vB=type==="crypto"?(b.currentPrice-b.avgPrice)*b.quantity:(b.currentPrice-b.pru)*b.quantity;}
      else if(key==="pvpct"){vA=type==="crypto"?(a.currentPrice-a.avgPrice)/Math.max(a.avgPrice,.01):(a.currentPrice-a.pru)/Math.max(a.pru,.01);vB=type==="crypto"?(b.currentPrice-b.avgPrice)/Math.max(b.avgPrice,.01):(b.currentPrice-b.pru)/Math.max(b.pru,.01);}
      else if(key==="solde"||key==="poids"){vA=a.balance||0;vB=b.balance||0;}
      else if(key==="taux"){vA=a.rate||0;vB=b.rate||0;}
      else{vA=a.quantity*a.currentPrice;vB=b.quantity*b.currentPrice;}
      return dir==="asc"?(vA||0)-(vB||0):(vB||0)-(vA||0);
    });
  };

  // Benchmark
  const fetchBenchmark=async()=>{
    if(snapshots.length<2){alert("Il faut au moins 2 snapshots pour comparer.");return;}
    setBenchLoading(true);
    const indices=[{key:"cac",ticker:"^FCHI"},{key:"sp500",ticker:"^GSPC"},{key:"msci",ticker:"CW8.PA"}];
    const startDate=Math.floor(new Date(snapshots[0].date).getTime()/1000);
    const endDate=Math.floor(Date.now()/1000);
    const baseVal=snapshots[0].total;
    // Build unified dataset aligned on snapshot dates
    const merged=snapshots.map(s=>({
      date:new Date(s.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"2-digit"}),
      portfolio:Math.round((s.total/baseVal)*1000)/10
    }));
    for(const idx of indices){
      try{
        const url=`/api/quote?ticker=${encodeURIComponent(idx.ticker)}&period1=${startDate}&period2=${endDate}&interval=1wk`;
        const r=await fetch(url,{signal:AbortSignal.timeout(10000)});const d=await r.json();
        const prices=d?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
        const timestamps=d?.chart?.result?.[0]?.timestamp;
        if(prices?.length>0){
          const bp=prices.find(p=>p>0);
          // For each snapshot date, find the closest index price
          merged.forEach((point,i)=>{
            const snapTs=new Date(snapshots[i].date).getTime()/1000;
            let closest=null,minDiff=Infinity;
            timestamps.forEach((ts,j)=>{if(prices[j]&&Math.abs(ts-snapTs)<minDiff){minDiff=Math.abs(ts-snapTs);closest=prices[j];}});
            point[idx.key]=closest?Math.round((closest/bp)*1000)/10:null;
          });
        }
      }catch(e){console.error(`Bench ${idx.key}:`,e);}
    }
    setBenchData({merged});setBenchLoading(false);
  };

  if(!loaded)return(<div style={{background:"#060a11",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
    <div style={{width:80,height:80,borderRadius:20,background:"linear-gradient(135deg,#4f8ff7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px rgba(79,143,247,.3)",animation:"pulse 2s ease infinite"}}>
      <span style={{fontSize:32,fontWeight:900,color:"#fff",fontFamily:"'Outfit',sans-serif",letterSpacing:-1}}>PT</span>
    </div>
    <div style={{fontSize:28,fontWeight:800,color:"#e8ecf4",fontFamily:"'Outfit',sans-serif",letterSpacing:-.5}}>PaTra</div>
    <div style={{fontSize:13,color:"#6b7a99",fontWeight:500}}>Chargement de votre patrimoine...</div>
    <div style={{width:120,height:3,background:"#1a2744",borderRadius:2,overflow:"hidden",marginTop:4}}>
      <div style={{width:"60%",height:"100%",background:"linear-gradient(90deg,#4f8ff7,#a855f7)",borderRadius:2,animation:"loading 1.5s ease infinite"}}/>
    </div>
    <style>{`
      @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
      @keyframes loading{0%{width:0;margin-left:0}50%{width:100%}100%{width:0;margin-left:100%}}
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    `}</style>
  </div>);

  // ── Load demo data ──
  const loadDemo=()=>{const d=DEMO_DATA;setPea(d.pea);setCrypto(d.crypto);setCto(d.cto);setLivrets(d.livrets);setPeaCash(d.peaCash);setCtoCash(d.ctoCash);setCryptoCash(d.cryptoCash||0);setStablecoins(d.stablecoins||[]);setVersements(d.versements);setSnapshots(d.snapshots);setDivHistory(d.divHistory);setMonthlyIncome(d.monthlyIncome);if(d.targetAlloc)setTargetAlloc(d.targetAlloc);setTransactions(d.transactions);setIsDemo(true);setShowLanding(false);};

  // ── Transaction form live validation ──
  const _txQty=parseFloat(txForm.quantity)||0;
  const _txPrice=parseFloat(txForm.price)||0;
  const _txTotal=_txQty*_txPrice;
  const _txIsBuy=txForm.type==="buy";
  const _txArr=txForm.account==="pea"?pea:txForm.account==="cto"?cto:crypto;
  const _txExisting=txForm.holdingId!=="new"?_txArr.find(h=>h.id===txForm.holdingId):null;
  const txValidationError=(()=>{
    if(!_txQty||!_txPrice)return"";
    if(_txIsBuy){
      if(txForm.account==="pea"&&_txTotal>peaCash)return`Cash insuffisant sur PEA. Dispo : ${fmtEur(peaCash)}, requis : ${fmtEur(_txTotal)}. Ajoutez un dépôt.`;
      if(txForm.account==="cto"&&_txTotal>ctoCash)return`Cash insuffisant sur CTO. Dispo : ${fmtEur(ctoCash)}, requis : ${fmtEur(_txTotal)}. Ajoutez un dépôt.`;
      if(txForm.account==="crypto"){
        if(txForm.payWith==="cash"&&_txTotal>cryptoCash)return`Cash insuffisant. Dispo : ${fmtEur(cryptoCash)}, requis : ${fmtEur(_txTotal)}.`;
        if(txForm.payWith!=="cash"){
          const _st=stablecoins.find(s=>s.symbol===txForm.payWith);
          const _meta=STABLE_LIST.find(m=>m.symbol===txForm.payWith);
          const _stP=_meta?(stablecoinPrices[_meta.cgId]??0):0;
          const _needed=_stP>0?_txTotal/_stP:_txTotal;
          if(!_st||_st.quantity<_needed)return`${txForm.payWith} insuffisant. Solde : ${(_st?.quantity??0).toFixed(2)}, requis : ${_needed.toFixed(2)}.`;
        }
      }
    }else{
      if(_txExisting&&_txQty>_txExisting.quantity)return`Quantité insuffisante. Vous détenez ${_txExisting.quantity}, vous tentez de vendre ${_txQty}.`;
    }
    return"";
  })();

  if(showLanding)return(<div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Outfit',-apple-system,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <style>{`:root{color-scheme:dark} *{box-sizing:border-box}`}</style>
    <div style={{maxWidth:560,width:"100%",textAlign:"center"}}>
      {/* Logo */}
      <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:32}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:C.accent}}/>
        <span style={{fontSize:15,fontWeight:800,letterSpacing:2,color:C.accent}}>PATRA</span>
      </div>

      {/* Hero */}
      <h1 style={{fontSize:isMobile?36:52,fontWeight:900,lineHeight:1.08,letterSpacing:-1.5,margin:"0 0 18px"}}>Ton patrimoine,<br/><span style={{color:C.accent}}>enfin lisible.</span></h1>
      <p style={{fontSize:17,color:C.textDim,lineHeight:1.6,margin:"0 0 40px"}}>Suis ton PEA, ta crypto et tes livrets en un seul endroit.<br/>Gratuit, sans compte, tes données restent chez toi.</p>

      {/* Feature pills */}
      <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:44}}>
        {[["📈","PEA · CTO · Crypto · Livrets"],["🔒","Zéro compte, zéro serveur"],["💾","Backup JSON / Export CSV"],["🎯","Objectif & suivi de progression"]].map(([icon,label])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"8px 16px",fontSize:13,color:C.textDim}}>
            <span>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
        <button onClick={loadDemo} style={{width:"100%",maxWidth:360,padding:"14px 24px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.accent},${C.purple})`,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:"'Outfit',sans-serif",letterSpacing:.3}}>
          Explorer la démo →
        </button>
        <button onClick={()=>setShowLanding(false)} style={{width:"100%",maxWidth:360,padding:"13px 24px",borderRadius:12,border:`1px solid ${C.border}`,background:"none",color:C.textDim,fontWeight:600,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
          Commencer avec mes données →
        </button>
      </div>

      <p style={{marginTop:28,fontSize:12,color:C.textMuted}}>L'alternative honnête à Finary — open source, sans abonnement.</p>
    </div>
  </div>);

  return(<div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Outfit',-apple-system,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:${C.bg}} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}`}</style>

    {/* HEADER */}
    <div style={{padding:isMobile?"12px 14px":"16px 28px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:`linear-gradient(180deg,${C.card},${C.bg})`,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setActiveTab("dashboard")}>
        <div style={{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Layers size={18} color="#fff"/></div>
        <div><h1 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:-.5}}>PaTra</h1>
          <span style={{color:C.textDim,fontSize:11}}>
            {fmtDate(new Date())}
            {lastPeaSync&&` · PEA ${new Date(lastPeaSync).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`}
            {lastCtoSync&&` · CTO ${new Date(lastCtoSync).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`}
            {lastSync&&` · Crypto ${new Date(lastSync).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`}
          </span>
        </div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        {peaSyncStatus&&<span style={{fontSize:11,color:C.accent,fontWeight:500}}>{peaSyncStatus}</span>}
        {ctoSyncStatus&&<span style={{fontSize:11,color:C.purple,fontWeight:500}}>{ctoSyncStatus}</span>}
        {!isMobile&&<><button onClick={()=>{syncPEA();syncCTO();}} disabled={peaLoading||ctoLoading} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}>
          <RefreshCw size={13} style={peaLoading||ctoLoading?{animation:"spin 1s linear infinite"}:{}}/>{peaLoading||ctoLoading?"...":t.syncActions}
        </button>
        <button onClick={syncCrypto} disabled={cryptoLoading} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",color:C.gold,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}>
          <RefreshCw size={13} style={cryptoLoading?{animation:"spin 1s linear infinite"}:{}}/>{cryptoLoading?"...":t.syncCrypto}
        </button></>}
        <button onClick={takeSnap} style={{background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:8,padding:"7px 12px",color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}><Camera size={13}/>{!isMobile&&t.snapshot}</button>
        <button onClick={()=>setDarkMode(!darkMode)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",color:C.textDim,cursor:"pointer",display:"flex",alignItems:"center",fontSize:12}}>
          {darkMode?<Sun size={15}/>:<Moon size={15}/>}
        </button>
        <div ref={settingsRef} style={{position:"relative"}}>
          <button onClick={()=>setShowSettings(p=>!p)} style={{background:showSettings?C.accentDim:C.card,border:`1px solid ${showSettings?C.accent:C.border}`,borderRadius:8,padding:"7px 12px",color:showSettings?C.accent:C.textDim,cursor:"pointer",display:"flex",alignItems:"center",fontSize:12}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}} onMouseLeave={e=>{if(!showSettings){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textDim;}}}>
            <Settings size={15}/>
          </button>
          {showSettings&&<div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,width:210,zIndex:500,boxShadow:`0 8px 32px rgba(0,0,0,.4)`,padding:"6px 0",animation:"fadeIn .12s ease"}}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
            {[
              {icon:<Download size={14}/>,label:"Export CSV",action:()=>{exportCSV();setShowSettings(false);}},
              {icon:<Download size={14}/>,label:"Backup JSON",action:()=>{exportBackup();setShowSettings(false);}},
            ].map(item=>(
              <button key={item.label} onClick={item.action} style={{width:"100%",background:"none",border:"none",padding:"9px 14px",display:"flex",alignItems:"center",gap:10,color:C.textDim,fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                {item.icon}{item.label}
              </button>
            ))}
            <label style={{width:"100%",background:"none",border:"none",padding:"9px 14px",display:"flex",alignItems:"center",gap:10,color:C.textDim,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxSizing:"border-box"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <Upload size={14}/>Restore JSON<input type="file" accept=".json" onChange={e=>{importBackup(e);setShowSettings(false);}} style={{display:"none"}}/>
            </label>
            <div style={{borderTop:`1px solid ${C.border}`,margin:"4px 0"}}/>
            <button onClick={()=>{setShowSettings(false);setResetInput("");setShowResetModal(true);}} style={{width:"100%",background:"none",border:"none",padding:"9px 14px",display:"flex",alignItems:"center",gap:10,color:C.red,fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"'Outfit',sans-serif"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.redDim} onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <Trash2 size={14}/>Réinitialiser l'application
            </button>
          </div>}
        </div>
      </div>
    </div>

    {/* DEMO BANNER */}
    {isDemo&&<div style={{background:`linear-gradient(90deg,${C.accentDim},${C.purpleDim})`,borderBottom:`1px solid ${C.border}`,padding:"9px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
      <span style={{fontSize:12,color:C.textDim}}>Vous explorez avec des <strong style={{color:C.accent}}>données de démo</strong> — rien n'est réel ici.</span>
      <button onClick={clearDemo} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 12px",color:C.red,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,flexShrink:0}}><Trash2 size={12}/>Effacer et commencer</button>
    </div>}

    {/* TABS */}
    <div style={{padding:isMobile?"8px 10px":"12px 28px",display:"flex",gap:6,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
      <TabBtn active={activeTab==="dashboard"} label={t.dashboard} icon={BarChart3} onClick={()=>setActiveTab("dashboard")}/>
      <TabBtn active={activeTab==="pea"} label={t.pea} icon={TrendingUp} onClick={()=>setActiveTab("pea")} badge={pea.length}/>
      <TabBtn active={activeTab==="cto"} label={t.cto} icon={DollarSign} onClick={()=>setActiveTab("cto")} badge={cto.length}/>
      <TabBtn active={activeTab==="crypto"} label={t.crypto} icon={Zap} onClick={()=>setActiveTab("crypto")} badge={crypto.length}/>
      <TabBtn active={activeTab==="livrets"} label={t.livrets} icon={Wallet} onClick={()=>setActiveTab("livrets")} badge={livrets.length}/>
      <TabBtn active={activeTab==="dividendes"} label={t.dividendes} icon={Banknote} onClick={()=>setActiveTab("dividendes")} badge={currentMonthDiv>0?"€":undefined}/>
      <TabBtn active={activeTab==="objectif"} label={t.objectif} icon={Flag} onClick={()=>setActiveTab("objectif")}/>
      {<TabBtn active={activeTab==="transactions"} label={t.transactions} icon={Layers} onClick={()=>setActiveTab("transactions")} badge={transactions.length||undefined}/>}
    </div>

    <div style={{padding:isMobile?"12px":"20px 28px",maxWidth:1400,margin:"0 auto"}}>

      {/* ═══ DASHBOARD ═══ */}
      {activeTab==="dashboard"&&<>
        {/* Snapshot reminder */}
        {snapshots.length>0&&(()=>{const daysSince=Math.floor((Date.now()-new Date(snapshots[snapshots.length-1].date).getTime())/(1000*60*60*24));return daysSince>=30;})()&&<div style={{background:C.goldDim,border:`1px solid ${C.gold}44`,borderRadius:12,padding:"12px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <Camera size={18} color={C.gold}/>
          <div style={{flex:1}}>
            <span style={{fontSize:13,fontWeight:600,color:C.text}}>Snapshot en retard</span>
            <span style={{fontSize:13,color:C.textDim,marginLeft:8}}>Dernier il y a {Math.floor((Date.now()-new Date(snapshots[snapshots.length-1].date).getTime())/(1000*60*60*24))} jours — prends-en un pour suivre ta progression</span>
          </div>
          <button onClick={takeSnap} style={{background:C.gold,border:"none",borderRadius:8,padding:"7px 14px",color:"#000",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}><Camera size={12}/>Snapshot</button>
        </div>}
        {/* Dividend notification */}
        {currentMonthDiv>0&&<div style={{background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:12,padding:"12px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <Banknote size={18} color={C.green}/>
          <div style={{flex:1}}>
            <span style={{fontSize:13,fontWeight:600,color:C.text}}>Dividendes attendus ce mois-ci</span>
            <span style={{fontSize:13,color:C.textDim,marginLeft:8}}>Environ {fmtEur(currentMonthDiv)} prévus en {["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][new Date().getMonth()]}</span>
          </div>
          <span style={{fontSize:16,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:C.green}}>{fmtEur(currentMonthDiv)}</span>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:24}}>
          <MetricCard label={t.patrimoine} value={fmtEur(totalPat)} sub={fmtPct(totalPVPct)} icon={Layers} trend={totalPV>=0?"up":"down"}/>
          <MetricCard label={t.plusValue} value={fmtEur(totalPV)} sub={`sur ${fmtEur(totalInv)} ${t.invested}`} icon={TrendingUp} trend={totalPV>=0?"up":"down"} color={totalPV>=0?C.green:C.red}/>
          <MetricCard label="PEA" value={fmtEur(peaTotal)} sub={`PV ${fmtPct(peaPVPct)}`} icon={BarChart3} trend={peaPV>=0?"up":"down"} color={C.accent}/>
          {ctoTotal>0&&<MetricCard label="CTO" value={fmtEur(ctoTotal)} sub={`PV ${fmtPct(ctoPVPct)}`} icon={Layers} trend={ctoPV>=0?"up":"down"} color={C.purple}/>}
          <MetricCard label="CRYPTO" value={fmtEur(cryptoTotal)} sub={`PV ${fmtPct(cryptoPVPct)}`} icon={Zap} trend={cryptoPV>=0?"up":"down"} color={C.gold}/>
          <MetricCard label="LIVRETS" value={fmtEur(livretsTotal)} sub={livretsTotal>0?`~${(livrets.reduce((s,l)=>s+l.balance*l.rate,0)/(livretsTotal||1)).toFixed(1)}% rendement pondéré`:`${livrets.length} livret(s)`} icon={Wallet} color={C.green}/>
          <MetricCard label={t.divAn} value={fmtEur(totalDivAnnual)} sub={`${fmtEur(divMonthly)}${t.month}`} icon={Banknote} color={C.purple}/>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
          <Flag size={16} color={C.gold}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:600,color:C.textDim}}>Objectif {fmtK(goalAmount)}</span>
              <span style={{fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.gold}}>{((totalPat/goalAmount)*100).toFixed(1)}%</span>
            </div>
            <div style={{height:8,background:C.bg,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min((totalPat/goalAmount)*100,100)}%`,background:`linear-gradient(90deg,${C.accent},${C.gold})`,borderRadius:4,transition:"width .5s"}}/></div>
          </div>
          <span style={{fontSize:14,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.text}}>{fmtEur(totalPat)}</span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16,marginBottom:20}}>
          <SectionCard title="Allocation Globale">
            <div style={{padding:20,display:"flex",flexDirection:isMobile?"column":"row",alignItems:isMobile?"stretch":"center",gap:16}}>
              <ResponsiveContainer width={isMobile?"100%":"48%"} height={190}><PieChart><Pie data={allocGlobal} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">{allocGlobal.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Pie><Tooltip content={<PieTooltip/>}/></PieChart></ResponsiveContainer>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
                {allocGlobal.map((a,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:3,background:a.fill}}/><span style={{fontSize:12,fontWeight:600}}>{a.name}</span></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{a.pct.toFixed(1)}%</div><div style={{fontSize:10,color:C.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(a.value)}</div></div>
                </div>))}
              </div>
            </div>
          </SectionCard>
          {/* PV Latentes mini */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <div style={{fontSize:12,fontWeight:600,color:C.textDim,textTransform:"uppercase",letterSpacing:.8,marginBottom:12}}>PLUS-VALUES LATENTES</div>
            <div style={{fontSize:42,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:totalPV>=0?C.green:C.red,display:"flex",alignItems:"center",gap:8}}>
              {totalPV>=0?<ArrowUpRight size={32}/>:<ArrowDownRight size={32}/>}{fmtEur(totalPV)}
            </div>
            <div style={{fontSize:20,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:totalPV>=0?C.green:C.red,marginTop:4}}>{fmtPct(totalPVPct)}</div>
            <div style={{fontSize:12,color:C.textDim,marginTop:8}}>sur {fmtEur(totalInv)} investis</div>
          </div>
        </div>

        {snapshots.length>0&&<SectionCard title={`Évolution (${snapshots.length} snapshots)`} rightContent={
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowSnapManager(!showSnapManager)} style={{background:showSnapManager?C.accentDim:"transparent",border:`1px solid ${showSnapManager?C.accent:C.border}`,borderRadius:8,padding:"6px 12px",color:showSnapManager?C.accent:C.textDim,cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
              <Edit3 size={12}/>{showSnapManager?"Fermer":"Gérer"}
            </button>
          </div>
        }>
          <div style={{padding:20}}><ResponsiveContainer width="100%" height={240}>
            <AreaChart data={snapshots.map(s=>({...s,dateLabel:fmtDate(s.date)}))}>
              <defs><linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={.3}/><stop offset="95%" stopColor={C.accent} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="dateLabel" tick={{fontSize:10,fill:C.textDim}} stroke={C.border}/>
              <YAxis tick={{fontSize:10,fill:C.textDim}} stroke={C.border} tickFormatter={fmtK}/>
              <Tooltip content={({active,payload,label})=>{
                if(!active||!payload?.[0])return null;
                const d=payload[0].payload;
                const prev=snapshots.indexOf(d)>0?snapshots[snapshots.indexOf(d)-1]:null;
                const diff=prev?d.total-prev.total:0;
                const diffPct=prev&&prev.total>0?((d.total-prev.total)/prev.total)*100:0;
                return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",boxShadow:"0 12px 32px rgba(0,0,0,.5)",minWidth:180}}>
                  <div style={{fontSize:11,color:C.textDim,marginBottom:8,fontWeight:600}}>{label}</div>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:C.text,marginBottom:10}}>{fmtEur(d.total)}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                    {d.pea!==undefined&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.textDim}}>PEA</span><span style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.accent}}>{fmtEur(d.pea)}</span></div>}
                    {d.cto!==undefined&&d.cto>0&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.textDim}}>CTO</span><span style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.purple}}>{fmtEur(d.cto)}</span></div>}
                    {d.crypto!==undefined&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.textDim}}>Crypto</span><span style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.gold}}>{fmtEur(d.crypto)}</span></div>}
                    {d.livrets!==undefined&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.textDim}}>Livrets</span><span style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.green}}>{fmtEur(d.livrets)}</span></div>}
                  </div>
                  {prev&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:10,color:C.textDim}}>vs précédent</span>
                    <span style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:diff>=0?C.green:C.red,display:"flex",alignItems:"center",gap:3}}>
                      {diff>=0?<ArrowUpRight size={10}/>:<ArrowDownRight size={10}/>}{diff>=0?"+":""}{fmtEur(diff)} ({diffPct>=0?"+":""}{diffPct.toFixed(1)}%)
                    </span>
                  </div>}
                </div>);
              }}/>
              <Area type="monotone" dataKey="total" stroke={C.accent} strokeWidth={2.5} fill="url(#gT)" dot={{r:3,fill:C.accent,stroke:C.card,strokeWidth:2}} activeDot={{r:6,fill:C.accent,stroke:"#fff",strokeWidth:2}}/>
            </AreaChart>
          </ResponsiveContainer></div>
          {showSnapManager&&<div style={{borderTop:`1px solid ${C.border}`,maxHeight:250,overflowY:"auto"}}>
            <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr 50px",padding:"8px 16px",background:C.bg}}>
              <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5}}>DATE</span>
              <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5,textAlign:"right"}}>TOTAL</span>
              <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5,textAlign:"right"}}>PEA</span>
              <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5,textAlign:"right"}}>CRYPTO</span>
              <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5,textAlign:"right"}}>LIVRETS</span>
              <span></span>
            </div>
            {[...snapshots].reverse().map((s,i)=>{
              const idx=snapshots.length-1-i;
              return(<div key={i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr 50px",padding:"10px 16px",borderBottom:`1px solid ${C.border}`,fontSize:12,alignItems:"center"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{color:C.text,fontWeight:500}}>{new Date(s.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:C.text}}>{fmtEur(s.total)}</span>
                <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.accent}}>{fmtEur(s.pea||0)}</span>
                <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.gold}}>{fmtEur(s.crypto||0)}</span>
                <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.green}}>{fmtEur(s.livrets||0)}</span>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <button onClick={()=>setSnapshots(prev=>prev.filter((_,j)=>j!==idx))} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:3,borderRadius:4}}
                    onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>);
            })}
            {snapshots.length>1&&<div style={{padding:"10px 16px",display:"flex",justifyContent:"flex-end"}}>
              <button onClick={()=>{if(window.confirm("Supprimer tous les snapshots ?"))setSnapshots([])}} style={{background:C.redDim,border:`1px solid ${C.red}44`,borderRadius:8,padding:"6px 14px",color:C.red,cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                <Trash2 size={12}/>Tout supprimer
              </button>
            </div>}
          </div>}
        </SectionCard>}

        {/* ═══ DASHBOARD EXTRAS ═══ */}
          {/* Savings Rate */}
          <SectionCard title="Taux d'épargne">
            <div style={{padding:20}}>
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
                <div style={{flex:1}}>
                  <InputField label="Revenu mensuel net (€)" value={monthlyIncome||""} onChange={v=>setMonthlyIncome(parseFloat(v)||0)} type="number" placeholder="Ex: 2500"/>
                </div>
                <div style={{textAlign:"center",padding:"10px 24px",background:savingsRate>=20?C.greenDim:savingsRate>=10?C.goldDim:C.redDim,borderRadius:12,border:`1px solid ${savingsRate>=20?C.green:savingsRate>=10?C.gold:C.red}44`}}>
                  <div style={{fontSize:28,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:savingsRate>=20?C.green:savingsRate>=10?C.gold:C.red}}>{savingsRate.toFixed(0)}%</div>
                  <div style={{fontSize:11,color:C.textDim,marginTop:2}}>taux d'épargne</div>
                </div>
                <div style={{textAlign:"center",padding:"10px 24px"}}>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.text}}>{fmtEur(mensuel)}</div>
                  <div style={{fontSize:11,color:C.textDim,marginTop:2}}>épargne / mois</div>
                </div>
              </div>
              {monthlyIncome>0&&<div style={{height:8,background:C.bg,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(savingsRate,100)}%`,background:`linear-gradient(90deg,${savingsRate>=20?C.green:savingsRate>=10?C.gold:C.red},${savingsRate>=20?C.green:savingsRate>=10?C.gold:C.red}aa)`,borderRadius:4,transition:"width .5s"}}/>
              </div>}
              {monthlyIncome>0&&<div style={{marginTop:8,fontSize:11,color:C.textDim}}>
                {savingsRate>=30?"Excellent ! Tu es une machine à épargner.":savingsRate>=20?"Très bien. Tu es au-dessus de la moyenne.":savingsRate>=10?"Correct, mais il y a de la marge pour accélérer.":"En dessous de 10%, ça va être long pour le million. Cherche à augmenter tes revenus ou réduire tes dépenses."}
              </div>}
            </div>
          </SectionCard>

          {/* Rebalancing Alerts */}
          <SectionCard title="Alertes de rééquilibrage" rightContent={
            <span style={{fontSize:10,color:C.textDim}}>Alerte si écart ≥ 3%</span>
          }>
            <div style={{padding:20}}>
              {[
                {label:"PEA",cat:"pea",color:C.accent},
                {label:"CTO",cat:"cto",color:C.purple},
                {label:"Crypto",cat:"crypto",color:C.gold},
              ].map(section=>{
                const items=allHoldings.filter(h=>h.value>0&&h.cat===section.cat);
                if(items.length===0)return null;
                const sectionTotal=items.reduce((s,h)=>s+h.value,0);
                return(<div key={section.cat} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <div style={{width:10,height:10,borderRadius:3,background:section.color}}/>
                    <span style={{fontSize:13,fontWeight:700,color:C.text}}>{section.label}</span>
                    <span style={{fontSize:11,color:C.textDim}}>({fmtEur(sectionTotal)})</span>
                  </div>
                  {items.map((h,i)=>{
                    const actual=sectionTotal>0?(h.value/sectionTotal)*100:0;
                    const target=targetAlloc[`${section.cat}:${h.name}`];
                    return(<div key={i} style={{display:"flex",alignItems:"center",gap:isMobile?6:12,padding:isMobile?"6px 0 6px 8px":"6px 0 6px 18px",borderBottom:i<items.length-1?`1px solid ${C.border}22`:"none"}}>
                      <span style={{fontSize:12,fontWeight:500,color:C.text,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</span>
                      <span style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:C.textDim,width:isMobile?40:55,textAlign:"right"}}>{actual.toFixed(1)}%</span>
                      <span style={{fontSize:10,color:C.textMuted,width:10,textAlign:"center"}}>→</span>
                      <input type="number" value={target||""} placeholder="—" onChange={e=>{const v=parseFloat(e.target.value);setTargetAlloc(p=>({...p,[`${section.cat}:${h.name}`]:v||undefined}));}}
                        style={{width:isMobile?40:55,background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 6px",color:C.text,fontSize:11,fontFamily:"'JetBrains Mono',monospace",textAlign:"right",outline:"none"}}/>
                      <span style={{fontSize:10,color:C.textMuted,width:8}}>%</span>
                      {target!==undefined&&Math.abs(actual-target)>=3&&<span style={{fontSize:10,fontWeight:700,color:actual>target?C.red:C.green,width:isMobile?50:70,textAlign:"right"}}>
                        {actual>target?(isMobile?"↓":"↓ Alléger"):(isMobile?"↑":"↑ Renforcer")}
                      </span>}
                      {(target===undefined||Math.abs(actual-target)<3)&&<span style={{width:isMobile?50:70}}/>}
                    </div>);
                  })}
                </div>);
              })}
              {rebalAlerts.length>0&&<div style={{marginTop:8,padding:"10px 14px",background:C.goldDim,borderRadius:8,border:`1px solid ${C.gold}33`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:6}}>⚠ {rebalAlerts.length} alerte(s)</div>
                {rebalAlerts.map((a,i)=>(<div key={i} style={{fontSize:11,color:C.textDim,marginBottom:2}}>
                  <span style={{color:C.text,fontWeight:600}}>{a.name}</span> : {a.actual}% actuel vs {a.target}% cible ({a.over?"+":""}{a.diff}%)
                </div>))}
              </div>}
            </div>
          </SectionCard>

          {/* Cumulative: Invested vs Value */}
          {snapshots.length>=2&&<SectionCard title="Valeur du portefeuille vs Capital investi">
            <div style={{padding:20}}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={snapshots.filter(s=>s.invested).map(s=>({...s,dateLabel:fmtDate(s.date)}))}>
                  <defs>
                    <linearGradient id="gVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={.2}/><stop offset="95%" stopColor={C.accent} stopOpacity={0}/></linearGradient>
                    <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.textDim} stopOpacity={.1}/><stop offset="95%" stopColor={C.textDim} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="dateLabel" tick={{fontSize:10,fill:C.textDim}} stroke={C.border}/>
                  <YAxis tick={{fontSize:10,fill:C.textDim}} stroke={C.border} tickFormatter={fmtK}/>
                  <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12}} labelStyle={{color:C.text}} itemStyle={{color:C.text}} formatter={(v,name)=>[fmtEur(v),name==="total"?"Valeur":"Investi"]}/>
                  <Area type="monotone" dataKey="total" stroke={C.accent} strokeWidth={2.5} fill="url(#gVal)"/>
                  <Area type="monotone" dataKey="invested" stroke={C.textDim} strokeWidth={1.5} fill="url(#gInv)" strokeDasharray="4 4"/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:10}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.accent}}/><span style={{fontSize:11,color:C.textDim}}>Valeur du portefeuille</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.textDim,opacity:.5}}/><span style={{fontSize:11,color:C.textDim}}>Capital investi</span></div>
              </div>
              <div style={{marginTop:12,fontSize:11,color:C.textDim,textAlign:"center"}}>L'écart entre les deux courbes représente ta création de richesse. Ce graphique se construit au fil de tes snapshots.</div>
            </div>
          </SectionCard>}

          {/* Benchmark */}
          <SectionCard title="Benchmark — Mon portefeuille vs les indices" rightContent={
            <button onClick={fetchBenchmark} disabled={benchLoading} style={{background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:8,padding:"7px 14px",color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}>
              <RefreshCw size={13} style={benchLoading?{animation:"spin 1s linear infinite"}:{}}/>{benchLoading?"Chargement...":"Charger le benchmark"}
            </button>
          }>
            <div style={{padding:20}}>
              {!benchData&&!benchLoading&&<div style={{textAlign:"center",padding:"30px 20px",color:C.textDim}}>
                <div style={{fontSize:32,marginBottom:10}}>📊</div>
                <div style={{fontSize:13}}>Clique "Charger le benchmark" pour comparer ton portefeuille aux indices.</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:6}}>Base 100 depuis ton premier snapshot. Nécessite au moins 2 snapshots.</div>
              </div>}
              {benchData&&<>
                <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                  <button onClick={()=>setBenchIndices(p=>({...p,cac:!p.cac}))} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${benchIndices.cac?C.red:C.border}`,background:benchIndices.cac?C.redDim:"transparent",color:benchIndices.cac?C.red:C.textDim,cursor:"pointer",fontSize:12,fontWeight:600}}>CAC 40</button>
                  <button onClick={()=>setBenchIndices(p=>({...p,sp500:!p.sp500}))} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${benchIndices.sp500?C.gold:C.border}`,background:benchIndices.sp500?C.goldDim:"transparent",color:benchIndices.sp500?C.gold:C.textDim,cursor:"pointer",fontSize:12,fontWeight:600}}>S&P 500</button>
                  <button onClick={()=>setBenchIndices(p=>({...p,msci:!p.msci}))} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${benchIndices.msci?C.green:C.border}`,background:benchIndices.msci?C.greenDim:"transparent",color:benchIndices.msci?C.green:C.textDim,cursor:"pointer",fontSize:12,fontWeight:600}}>MSCI World</button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={benchData.merged}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                    <XAxis dataKey="date" tick={{fontSize:10,fill:C.textDim}} stroke={C.border}/>
                    <YAxis tick={{fontSize:10,fill:C.textDim}} stroke={C.border} domain={["auto","auto"]}/>
                    <ReferenceLine y={100} stroke={C.textMuted} strokeDasharray="4 4" strokeWidth={1}/>
                    <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12}} labelStyle={{color:C.text}} itemStyle={{color:C.text}}/>
                    <Area type="monotone" dataKey="portfolio" name="Mon portefeuille" stroke={C.accent} strokeWidth={3} fill="none" dot={false}/>
                    {benchIndices.cac&&<Area type="monotone" dataKey="cac" name="CAC 40" stroke={C.red} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 4"/>}
                    {benchIndices.sp500&&<Area type="monotone" dataKey="sp500" name="S&P 500" stroke={C.gold} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 4"/>}
                    {benchIndices.msci&&<Area type="monotone" dataKey="msci" name="MSCI World" stroke={C.green} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 4"/>}
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:12,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.accent}}/><span style={{fontSize:11,color:C.textDim}}>Mon portefeuille</span></div>
                  {benchIndices.cac&&<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.red,opacity:.7}}/><span style={{fontSize:11,color:C.textDim}}>CAC 40</span></div>}
                  {benchIndices.sp500&&<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.gold,opacity:.7}}/><span style={{fontSize:11,color:C.textDim}}>S&P 500</span></div>}
                  {benchIndices.msci&&<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.green,opacity:.7}}/><span style={{fontSize:11,color:C.textDim}}>MSCI World</span></div>}
                </div>
                <div style={{marginTop:12,fontSize:11,color:C.textMuted,textAlign:"center"}}>Base 100 depuis le {fmtDate(snapshots[0]?.date)}. Ton portefeuille en trait plein, les indices en pointillés.</div>
                {snapshots.length<6&&<div style={{marginTop:8,padding:"8px 14px",background:C.goldDim,border:`1px solid ${C.gold}33`,borderRadius:8,fontSize:11,color:C.gold,textAlign:"center"}}>💡 Plus tu ajoutes de snapshots réguliers, plus le benchmark est lisible. Idéalement 1 par mois.</div>}
              </>}
            </div>
          </SectionCard>
      </>}

      {/* ═══ PEA ═══ */}
      {activeTab==="pea"&&<>
        {/* Allocation pie */}
        <AllocationPie pea={pea} peaTotal={peaTotal} peaCash={peaCash} isMobile={isMobile}/>

        {/* PV Latentes visual */}
        <PVLatentesVisual pea={pea} isMobile={isMobile}/>

        {/* Solde espèces */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Wallet size={16} color={C.cyan}/>
            <span style={{fontSize:13,fontWeight:600,color:C.textDim}}>Solde espèces PEA</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {editingCash==="pea"?<>
              <input type="number" value={cashInput} onChange={e=>setCashInput(e.target.value)} autoFocus
                onKeyDown={e=>{if(e.key==="Enter"){setPeaCash(parseFloat(cashInput)||0);setEditingCash(null);}if(e.key==="Escape")setEditingCash(null);}}
                style={{background:C.bg,border:`1px solid ${C.accent}`,borderRadius:6,padding:"6px 10px",color:C.text,fontSize:14,fontFamily:"'JetBrains Mono',monospace",width:120,outline:"none",textAlign:"right"}}/>
              <button onClick={()=>{setPeaCash(parseFloat(cashInput)||0);setEditingCash(null);}} style={{background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:6,padding:"6px 10px",color:C.accent,cursor:"pointer",fontSize:11,fontWeight:600}}><Check size={12}/></button>
              <button onClick={()=>setEditingCash(null)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",color:C.textDim,cursor:"pointer",fontSize:11}}><X size={12}/></button>
            </>:<>
              <span style={{fontSize:18,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.cyan}}>{fmtEur(peaCash)}</span>
              <button onClick={()=>{setCashInput(String(peaCash));setEditingCash("pea");}} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:3}}
                onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Edit3 size={14}/></button>
            </>}
          </div>
        </div>

        {/* Holdings table */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div><h3 style={{margin:0,fontSize:15,fontWeight:700}}>Lignes du PEA</h3>
              <span style={{color:C.textDim,fontSize:12}}>{pea.length} lignes · Total {fmtEur(peaTotal)} · <span style={{color:peaPV>=0?C.green:C.red,fontWeight:600}}>PV {fmtEur(peaPV)} ({fmtPct(peaPVPct)})</span></span>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={syncPEA} disabled={peaLoading} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}>
                <RefreshCw size={13} style={peaLoading?{animation:"spin 1s linear infinite"}:{}}/>{peaLoading?"Sync...":"Sync cours"}
              </button>
              {addBtn("pea")}
            </div>
          </div>
          {isMobile
            ? <div>{sortHoldings(pea,"pea").map(h=><HoldingRow key={h.id} item={h} type="pea" totalValue={peaTotal} onEdit={i=>openEdit(i,"pea")} onDelete={id=>del("pea",id)} isMobile/>)}</div>
            : <div style={{overflowX:"auto"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 0.5fr 0.7fr 0.7fr 0.9fr 0.9fr 0.8fr 0.5fr 50px",padding:"0 16px",borderBottom:`1px solid ${C.border}`,background:C.bg,minWidth:640}}>
                  <SortHeader label="VALEUR" sortKey="name" style={{textAlign:"left"}}/><SortHeader label="QTÉ" sortKey="quantity"/><SortHeader label="PRU" sortKey="pru"/><SortHeader label="COURS" sortKey="cours"/><SortHeader label="MONTANT" sortKey="montant"/><SortHeader label="+/- VAL" sortKey="pv"/><SortHeader label="+/- %" sortKey="pvpct"/><span style={thStyle}>POIDS</span><span style={thStyle}></span>
                </div>
                <div style={{minWidth:640}}>{sortHoldings(pea,"pea").map(h=><HoldingRow key={h.id} item={h} type="pea" totalValue={peaTotal} onEdit={i=>openEdit(i,"pea")} onDelete={id=>del("pea",id)}/>)}</div>
              </div>
          }
          {peaSyncStatus&&<div style={{padding:"10px 16px",fontSize:11,color:C.accent,background:C.bg}}>{peaSyncStatus}</div>}
        </div>
      </>}

      {/* ═══ CTO ═══ */}
      {activeTab==="cto"&&<>
        {/* Allocation pie CTO */}
        <AllocationPie pea={cto} peaTotal={ctoTotal} peaCash={ctoCash} isMobile={isMobile}/>

        {/* PV Latentes visual CTO */}
        <PVLatentesVisual pea={cto} isMobile={isMobile}/>

        {/* Solde espèces CTO */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Wallet size={16} color={C.purple}/>
            <span style={{fontSize:13,fontWeight:600,color:C.textDim}}>Solde espèces CTO</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {editingCash==="cto"?<>
              <input type="number" value={cashInput} onChange={e=>setCashInput(e.target.value)} autoFocus
                onKeyDown={e=>{if(e.key==="Enter"){setCtoCash(parseFloat(cashInput)||0);setEditingCash(null);}if(e.key==="Escape")setEditingCash(null);}}
                style={{background:C.bg,border:`1px solid ${C.purple}`,borderRadius:6,padding:"6px 10px",color:C.text,fontSize:14,fontFamily:"'JetBrains Mono',monospace",width:120,outline:"none",textAlign:"right"}}/>
              <button onClick={()=>{setCtoCash(parseFloat(cashInput)||0);setEditingCash(null);}} style={{background:C.purpleDim,border:`1px solid ${C.purple}`,borderRadius:6,padding:"6px 10px",color:C.purple,cursor:"pointer",fontSize:11,fontWeight:600}}><Check size={12}/></button>
              <button onClick={()=>setEditingCash(null)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",color:C.textDim,cursor:"pointer",fontSize:11}}><X size={12}/></button>
            </>:<>
              <span style={{fontSize:18,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.purple}}>{fmtEur(ctoCash)}</span>
              <button onClick={()=>{setCashInput(String(ctoCash));setEditingCash("cto");}} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:3}}
                onMouseEnter={e=>e.currentTarget.style.color=C.purple} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Edit3 size={14}/></button>
            </>}
          </div>
        </div>

        {/* Holdings table CTO */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div><h3 style={{margin:0,fontSize:15,fontWeight:700}}>Compte-Titres Ordinaire</h3>
              <span style={{color:C.textDim,fontSize:12}}>{cto.length} lignes · Total {fmtEur(ctoTotal)} · <span style={{color:ctoPV>=0?C.green:C.red,fontWeight:600}}>PV {fmtEur(ctoPV)} ({fmtPct(ctoPVPct)})</span></span>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={syncCTO} disabled={ctoLoading} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",color:C.purple,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}>
                <RefreshCw size={13} style={ctoLoading?{animation:"spin 1s linear infinite"}:{}}/>{ctoLoading?"Sync...":"Sync cours"}
              </button>
              {addBtn("cto")}
            </div>
          </div>
          {isMobile
            ? <div>{sortHoldings(cto,"pea").map(h=><HoldingRow key={h.id} item={h} type="pea" totalValue={ctoTotal} onEdit={i=>openEdit(i,"cto")} onDelete={id=>del("cto",id)} isMobile/>)}</div>
            : <div style={{overflowX:"auto"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 0.5fr 0.7fr 0.7fr 0.9fr 0.9fr 0.8fr 0.5fr 50px",padding:"0 16px",borderBottom:`1px solid ${C.border}`,background:C.bg,minWidth:640}}>
                  <SortHeader label="VALEUR" sortKey="name" style={{textAlign:"left"}}/><SortHeader label="QTÉ" sortKey="quantity"/><SortHeader label="PRU" sortKey="pru"/><SortHeader label="COURS" sortKey="cours"/><SortHeader label="MONTANT" sortKey="montant"/><SortHeader label="+/- VAL" sortKey="pv"/><SortHeader label="+/- %" sortKey="pvpct"/><span style={thStyle}>POIDS</span><span style={thStyle}></span>
                </div>
                <div style={{minWidth:640}}>{sortHoldings(cto,"pea").map(h=><HoldingRow key={h.id} item={h} type="pea" totalValue={ctoTotal} onEdit={i=>openEdit(i,"cto")} onDelete={id=>del("cto",id)}/>)}</div>
              </div>
          }
          {ctoSyncStatus&&<div style={{padding:"10px 16px",fontSize:11,color:C.purple,background:C.bg}}>{ctoSyncStatus}</div>}
        </div>
      </>}

      {/* ═══ CRYPTO ═══ */}
      {activeTab==="crypto"&&<>
        <AllocationPie pea={[...crypto,...stableHoldings]} peaTotal={cryptoTotal} peaCash={cryptoCash} isMobile={isMobile}/>

        {/* Cash € */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Wallet size={16} color={C.cyan}/>
            <span style={{fontSize:13,fontWeight:600,color:C.textDim}}>Espèces</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {editingCash==="crypto"?<>
              <input type="number" value={cashInput} onChange={e=>setCashInput(e.target.value)} autoFocus
                onKeyDown={e=>{if(e.key==="Enter"){setCryptoCash(parseFloat(cashInput)||0);setEditingCash(null);}if(e.key==="Escape")setEditingCash(null);}}
                style={{background:C.bg,border:`1px solid ${C.cyan}`,borderRadius:6,padding:"6px 10px",color:C.text,fontSize:14,fontFamily:"'JetBrains Mono',monospace",width:120,outline:"none",textAlign:"right"}}/>
              <button onClick={()=>{setCryptoCash(parseFloat(cashInput)||0);setEditingCash(null);}} style={{background:"none",border:`1px solid ${C.cyan}`,borderRadius:6,padding:"6px 10px",color:C.cyan,cursor:"pointer",fontSize:11,fontWeight:600}}><Check size={12}/></button>
              <button onClick={()=>setEditingCash(null)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",color:C.textDim,cursor:"pointer",fontSize:11}}><X size={12}/></button>
            </>:<>
              <span style={{fontSize:18,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:C.cyan}}>{fmtEur(cryptoCash)}</span>
              <button onClick={()=>{setCashInput(String(cryptoCash));setEditingCash("crypto");}} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:3}}
                onMouseEnter={e=>e.currentTarget.style.color=C.cyan} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Edit3 size={14}/></button>
            </>}
          </div>
        </div>

        {/* Stablecoins */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Zap size={16} color={C.gold}/>
              <span style={{fontSize:13,fontWeight:600,color:C.textDim}}>Stablecoins</span>
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:16,color:C.gold}}>{fmtEur(stablecoinsTotal)}</span>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:stablecoins.length>0?12:0}}>
            <select value={stableForm.symbol} onChange={e=>setStableForm(p=>({...p,symbol:e.target.value}))}
              style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.text,fontSize:12,fontFamily:"'JetBrains Mono',monospace",outline:"none"}}>
              {STABLE_LIST.map(s=><option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>)}
            </select>
            <input type="number" value={stableForm.quantity} onChange={e=>setStableForm(p=>({...p,quantity:e.target.value}))} placeholder="Quantité"
              onKeyDown={e=>e.key==="Enter"&&addStable()}
              style={{width:110,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.text,fontSize:12,fontFamily:"'JetBrains Mono',monospace",outline:"none",textAlign:"right"}}/>
            <button onClick={addStable} style={{background:C.goldDim,border:`1px solid ${C.gold}`,borderRadius:8,padding:"8px 12px",color:C.gold,cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}><Plus size={13}/></button>
          </div>
          {stablecoins.length>0&&<div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,display:"flex",flexDirection:"column",gap:6}}>
            {stablecoins.map((st,i)=>{
              const meta=STABLE_LIST.find(m=>m.symbol===st.symbol);
              const price=meta?(stablecoinPrices[meta.cgId]??0):0;
              const val=st.quantity*price;
              return(<div key={st.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<stablecoins.length-1?`1px solid ${C.border}22`:"none"}}>
                <span style={{width:50,fontWeight:700,fontSize:12,color:C.gold}}>{st.symbol}</span>
                <span style={{flex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:C.textDim}}>{st.quantity.toLocaleString("fr-FR")}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:C.text}}>{fmtEur(val)}</span>
                {price>0&&<span style={{fontSize:10,color:C.textMuted,width:110,textAlign:"right"}}>1 {st.symbol} = {fmtEur(price)}</span>}
                <button onClick={()=>setStablecoins(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:3,marginLeft:4}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Trash2 size={12}/></button>
              </div>);
            })}
          </div>}
        </div>

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div><h3 style={{margin:0,fontSize:15,fontWeight:700}}>Portefeuille Crypto</h3><span style={{color:C.textDim,fontSize:12}}>{crypto.length} positions · Valeur {fmtEur(cryptoTotal)} · <span style={{color:cryptoPV>=0?C.green:C.red,fontWeight:600}}>PV {fmtEur(cryptoPV)} ({fmtPct(cryptoPVPct)})</span></span></div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={syncCrypto} disabled={cryptoLoading} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",color:C.gold,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}><RefreshCw size={13} style={cryptoLoading?{animation:"spin 1s linear infinite"}:{}}/>{cryptoLoading?"...":"Actualiser"}</button>
              {addBtn("crypto")}
            </div>
          </div>
          {isMobile
            ? <div>{[...stableHoldings,...sortHoldings(crypto,"crypto")].map(h=><HoldingRow key={h.id} item={h} type="crypto" totalValue={cryptoTotal} onEdit={h._isStable?()=>{}:i=>openEdit(i,"crypto")} onDelete={h._isStable?id=>setStablecoins(p=>p.filter(s=>s.id!==id)):id=>del("crypto",id)} isMobile/>)}</div>
            : <div style={{overflowX:"auto"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 0.6fr 0.8fr 0.8fr 0.9fr 0.9fr 0.8fr 0.5fr 50px",padding:"0 16px",borderBottom:`1px solid ${C.border}`,background:C.bg,minWidth:680}}>
                  <SortHeader label="CRYPTO" sortKey="name" style={{textAlign:"left"}}/><SortHeader label="QTÉ" sortKey="quantity"/><SortHeader label="PRU" sortKey="pru"/><SortHeader label="COURS" sortKey="cours"/><SortHeader label="MONTANT" sortKey="montant"/><SortHeader label="+/- VAL" sortKey="pv"/><SortHeader label="+/- %" sortKey="pvpct"/><span style={thStyle}>POIDS</span><span style={thStyle}></span>
                </div>
                <div style={{minWidth:680}}>{[...stableHoldings,...sortHoldings(crypto,"crypto")].map(h=><HoldingRow key={h.id} item={h} type="crypto" totalValue={cryptoTotal} onEdit={h._isStable?()=>{}:i=>openEdit(i,"crypto")} onDelete={h._isStable?id=>setStablecoins(p=>p.filter(s=>s.id!==id)):id=>del("crypto",id)}/>)}</div>
              </div>
          }
        </div>
      </>}

      {/* ═══ LIVRETS ═══ */}
      {activeTab==="livrets"&&<>
        <AllocationPie pea={livrets.map(l=>({...l,quantity:1,currentPrice:l.balance}))} peaTotal={livretsTotal} peaCash={0} isMobile={isMobile}/>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div><h3 style={{margin:0,fontSize:15,fontWeight:700}}>Livrets & Épargne</h3><span style={{color:C.textDim,fontSize:12}}>{livrets.length} livrets · Total {fmtEur(livretsTotal)}</span></div>
            {addBtn("livret")}
          </div>
          {isMobile
            ? <div>{livrets.map(l=><HoldingRow key={l.id} item={l} type="livret" totalValue={livretsTotal} onEdit={i=>openEdit(i,"livret")} onDelete={id=>del("livret",id)} isMobile/>)}</div>
            : <div style={{overflowX:"auto"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 0.6fr 1fr 0.6fr 50px",padding:"0 16px",borderBottom:`1px solid ${C.border}`,background:C.bg,minWidth:380}}>
                  <SortHeader label="LIVRET" sortKey="name" style={{textAlign:"left"}}/><SortHeader label="SOLDE" sortKey="solde"/><SortHeader label="TAUX" sortKey="taux"/><SortHeader label="POIDS" sortKey="poids"/><span style={thStyle}></span>
                </div>
                <div style={{minWidth:380}}>{sortHoldings(livrets,"livret").map(l=><HoldingRow key={l.id} item={l} type="livret" totalValue={livretsTotal} onEdit={i=>openEdit(i,"livret")} onDelete={id=>del("livret",id)}/>)}</div>
              </div>
          }
        </div>
      </>}

      {/* ═══ DIVIDENDES ═══ */}
      {activeTab==="dividendes"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:20}}>
          <MetricCard label="DIVIDENDES ANNUELS" value={fmtEur(totalDivAnnual)} sub={`${fmtEur(divMonthly)}/mois`} icon={Banknote} color={C.green}/>
          <MetricCard label="RENDEMENT / COURS" value={divYieldGlobal.toFixed(2)+"%"} sub="Yield on price" icon={TrendingUp} color={C.accent}/>
          <MetricCard label="RENDEMENT / PRU" value={divYieldOnCost.toFixed(2)+"%"} sub="Yield on cost" icon={Award} color={C.gold}/>
          <MetricCard label="LIGNES VERSANTES" value={`${divPayers.length}/${pea.length+cto.length}`} sub={`${pea.length+cto.length-divPayers.length} capitalisant(s)`} icon={Layers} color={C.purple}/>
        </div>

        <SectionCard title="Historique des dividendes" rightContent={
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowHistoryModal(true)} style={{background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:8,padding:"6px 12px",color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600}}><Plus size={12}/>Ajouter</button>
            {divHistory.length>0&&<button onClick={()=>setShowDivHistoryManager(!showDivHistoryManager)} style={{background:showDivHistoryManager?C.accentDim:"transparent",border:`1px solid ${showDivHistoryManager?C.accent:C.border}`,borderRadius:8,padding:"6px 12px",color:showDivHistoryManager?C.accent:C.textDim,cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
              <Edit3 size={12}/>{showDivHistoryManager?"Fermer":"Gérer"}
            </button>}
          </div>
        }>
          <div style={{padding:20}}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={currentYearDivHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="year" tick={{fontSize:11,fill:C.textDim}} stroke={C.border}/><YAxis tick={{fontSize:11,fill:C.textDim}} stroke={C.border} tickFormatter={v=>`${v}€`}/>
                <Tooltip content={<DivBarTooltip/>}/>
                <Bar dataKey="total" radius={[6,6,0,0]}>{currentYearDivHistory.map((e,i)=><Cell key={i} fill={e.projected?C.accentDim:C.green}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:12}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:2,background:C.green}}/><span style={{fontSize:11,color:C.textDim}}>Perçus</span></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:2,background:C.accentDim}}/><span style={{fontSize:11,color:C.textDim}}>Projection 2026</span></div>
            </div>
          </div>
          {showDivHistoryManager&&<div style={{borderTop:`1px solid ${C.border}`,maxHeight:250,overflowY:"auto"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px",padding:"8px 16px",background:C.bg}}>
              <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5}}>ANNÉE</span>
              <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5,textAlign:"right"}}>TOTAL PERÇU</span>
              <span></span>
            </div>
            {[...divHistory].reverse().map(d=>(
              <div key={d.year} style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px",padding:"10px 16px",borderBottom:`1px solid ${C.border}`,fontSize:12,alignItems:"center"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontWeight:600,color:C.text}}>{d.year}</span>
                <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:C.green}}>{fmtEur(d.total)}</span>
                <div style={{display:"flex",gap:4,justifyContent:"flex-end"}}>
                  <button onClick={()=>{setHistoryForm({year:String(d.year),total:String(d.total)});setShowHistoryModal(true);}} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:4,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=C.accent} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Edit3 size={13}/></button>
                  <button onClick={()=>setDivHistory(p=>p.filter(x=>x.year!==d.year))} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:4,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Trash2 size={13}/></button>
                </div>
              </div>
            ))}
          </div>}
        </SectionCard>

        <SectionCard scrollable title="Détail par ligne">
          <div style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 50px",padding:"0 16px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
            <span style={{...thStyle,textAlign:"left"}}>VALEUR</span><span style={thStyle}>DIV/ACTION</span><span style={thStyle}>TOTAL/AN</span><span style={thStyle}>YIELD</span><span style={thStyle}>YIELD/PRU</span><span style={thStyle}>FRÉQUENCE</span><span style={thStyle}></span>
          </div>
          {divPayers.sort((a,b)=>(b.divPerShare*b.quantity)-(a.divPerShare*a.quantity)).map(h=>
            <DivRow key={h.id} item={h} onEditDiv={i=>{setDivEditItem(i);setForm({divPerShare:String(i.divPerShare),divFreq:i.divFreq});setShowDivEditModal(true)}}/>
          )}
          {[...pea,...cto].filter(h=>h.divFreq==="cap").map(h=>(
            <div key={h.id} style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 50px",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontSize:12.5}}>
              <div><span style={{fontWeight:600,color:C.textMuted}}>{h.name}</span></div>
              <span style={{textAlign:"right",color:C.textMuted,fontSize:11}}>—</span><span style={{textAlign:"right",color:C.textMuted,fontSize:11}}>—</span><span style={{textAlign:"right",color:C.textMuted,fontSize:11}}>—</span><span style={{textAlign:"right",color:C.textMuted,fontSize:11}}>—</span>
              <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.textMuted,fontSize:11}}>Capitalisant</span><span></span>
            </div>
          ))}
          <div style={{padding:"14px 16px",display:"flex",justifyContent:"flex-end",gap:24,background:C.bg}}>
            <span style={{fontSize:12,fontWeight:700,color:C.textDim}}>TOTAL ANNUEL</span>
            <span style={{fontSize:14,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:C.green}}>{fmtEur(totalDivAnnual)}</span>
          </div>
        </SectionCard>

        {/* Advanced: Dividend Calendar */}
        {divPayers.length>0&&<SectionCard title="Calendrier prévisionnel des dividendes">
          <div style={{padding:20}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyDivData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:C.textDim}} stroke={C.border}/>
                <YAxis tick={{fontSize:11,fill:C.textDim}} stroke={C.border} tickFormatter={v=>`${v}€`}/>
                <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}} labelStyle={{color:C.text}} itemStyle={{color:C.text}} formatter={v=>[fmtEur(v),"Dividendes"]}/>
                <Bar dataKey="total" radius={[6,6,0,0]}>
                  {monthlyDivData.map((e,i)=><Cell key={i} fill={e.total>0?C.green:C.border}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{marginTop:16,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
              {divCalendar.map((d,i)=>(<div key={i} style={{padding:"8px 12px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:11,fontWeight:600,color:C.text,marginBottom:4}}>{d.name}</div>
                <div style={{fontSize:10,color:C.textDim}}>
                  {Object.entries(d.months).map(([m,v])=>{
                    const labels=["","Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
                    return <span key={m} style={{marginRight:6}}>{labels[parseInt(m)]}: <span style={{color:C.green,fontWeight:600}}>{fmtEur(v)}</span></span>;
                  })}
                </div>
              </div>))}
            </div>
            <div style={{marginTop:12,fontSize:11,color:C.textDim}}>
              Estimation basée sur les fréquences déclarées. Les dates réelles peuvent varier. Trimestriels : Jan/Avr/Jul/Oct. Annuels : Mai.
            </div>
          </div>
        </SectionCard>}
      </>}

      {/* ═══ TRANSACTIONS (Advanced) ═══ */}
      {activeTab==="transactions"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.text}}>{t.transactions}</h3>
          <button onClick={()=>setShowTxModal(true)} style={{background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:8,padding:"7px 14px",color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600}}><Plus size={13}/>{t.logTx}</button>
        </div>
        {transactions.length===0&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"40px 20px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>📋</div>
          <div style={{color:C.textDim,fontSize:14}}>{t.noTx}</div>
          <div style={{color:C.textMuted,fontSize:12,marginTop:6}}>Enregistre tes achats et ventes pour garder un historique.</div>
        </div>}
        {transactions.length>0&&<SectionCard scrollable>
          <div style={{display:"grid",gridTemplateColumns:"1fr 0.6fr 0.6fr 1.2fr 0.6fr 0.8fr 1fr 40px",padding:"0 16px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
            <TxSortHeader label={t.date} sortKey="date" style={{textAlign:"left"}}/>
            <TxSortHeader label={t.type} sortKey="type"/>
            <TxSortHeader label={t.account} sortKey="account" style={{textAlign:"center"}}/>
            <TxSortHeader label={t.name} sortKey="name" style={{textAlign:"left",paddingLeft:12}}/>
            <TxSortHeader label={t.quantity} sortKey="quantity"/>
            <TxSortHeader label={t.price} sortKey="price"/>
            <TxSortHeader label={t.total} sortKey="total"/>
            <span style={thStyle}></span>
          </div>
          {[...transactions].map((tx,origIdx)=>({...tx,_origIdx:origIdx})).sort((a,b)=>{
            const {key,dir}=txSortConfig;
            if(key==="date"){const d=new Date(a.date).getTime()-new Date(b.date).getTime();return dir==="asc"?d:-d;}
            if(key==="type"||key==="account"||key==="name"){const s=a[key].localeCompare(b[key]);return dir==="asc"?s:-s;}
            let vA,vB;
            if(key==="quantity"){vA=a.quantity;vB=b.quantity;}
            else if(key==="price"){vA=a.price;vB=b.price;}
            else if(key==="total"){vA=a.quantity*a.price;vB=b.quantity*b.price;}
            else{vA=new Date(a.date).getTime();vB=new Date(b.date).getTime();}
            return dir==="asc"?vA-vB:vB-vA;
          }).map((tx,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 0.6fr 0.6fr 1.2fr 0.6fr 0.8fr 1fr 40px",padding:"10px 16px",borderBottom:`1px solid ${C.border}`,fontSize:12.5,alignItems:"center"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{color:C.text,fontWeight:500}}>{fmtDate(tx.date)}{tx.date.includes("T")&&<span style={{display:"block",fontSize:10,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{new Date(tx.date).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</span>}</span>
              <span style={{textAlign:"right"}}><span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:tx.type==="buy"?C.greenDim:C.redDim,color:tx.type==="buy"?C.green:C.red}}>{tx.type==="buy"?t.buy:t.sell}</span></span>
              <span style={{textAlign:"center",color:C.textDim,fontSize:11,fontWeight:600}}>{tx.account.toUpperCase()}</span>
              <span style={{color:C.text,fontWeight:600,paddingLeft:12}}>{tx.name}{tx.notes&&<span style={{display:"block",color:C.textMuted,fontSize:10,fontWeight:400}}>{tx.notes}</span>}</span>
              <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.textDim}}>{tx.quantity}</span>
              <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:C.textDim}}>{fmtEur(tx.price)}</span>
              <span style={{textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:tx.type==="buy"?C.green:C.red}}>
                {tx.type==="buy"?"-":"+"}{fmtEur(tx.quantity*tx.price)}
                {tx.cashDelta!==undefined&&<span style={{display:"block",fontSize:10,color:C.textMuted,fontWeight:400,marginTop:2}}>espèces : {tx.cashDelta>0?"+":""}{fmtEur(tx.cashDelta)}</span>}
                {tx.stableDelta&&<span style={{display:"block",fontSize:10,color:C.textMuted,fontWeight:400,marginTop:2}}>{tx.stableDelta.symbol} : {tx.stableDelta.delta>0?"+":""}{tx.stableDelta.delta.toFixed(2)}</span>}
              </span>
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button onClick={()=>{const tx2=transactions[tx._origIdx];if(tx2?.cashDelta){if(tx2.account==="pea")setPeaCash(c=>c-tx2.cashDelta);else if(tx2.account==="cto")setCtoCash(c=>c-tx2.cashDelta);else setCryptoCash(c=>c-tx2.cashDelta);}if(tx2?.stableDelta){setStablecoins(p=>p.map(s=>s.symbol===tx2.stableDelta.symbol?{...s,quantity:s.quantity-tx2.stableDelta.delta}:s));}setTransactions(p=>p.filter((_,j)=>j!==tx._origIdx));}} style={{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:3}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.textDim}><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </SectionCard>}
      </>}

      {/* ═══ OBJECTIF 1M ═══ */}
      {activeTab==="objectif"&&<>
        <MillionGoal current={totalPat} monthly={mensuel} projData={projData} goal={goalAmount} onGoalChange={setGoalAmount}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:20}}>
          <MetricCard label="PROJECTION 5 ANS" value={fmtEur(projData[5]?.capital||0)} sub={`+${fmtEur((projData[5]?.capital||0)-totalPat)}`} icon={Target} trend="up" color={C.accent}/>
          <MetricCard label="PROJECTION 10 ANS" value={fmtEur(projData[10]?.capital||0)} sub={`+${fmtEur((projData[10]?.capital||0)-totalPat)}`} icon={Target} trend="up" color={C.green}/>
          <MetricCard label="PROJECTION 20 ANS" value={fmtEur(projData[20]?.capital||0)} sub={`+${fmtEur((projData[20]?.capital||0)-totalPat)}`} icon={Target} trend="up" color={C.gold}/>
        </div>
        <SectionCard title={`Projection multi-scénarios · ${fmtEur(mensuel)}/mois`} rightContent={<span style={{display:"flex",alignItems:"center",gap:5,color:C.textDim,fontSize:11}}><AlertCircle size={12}/>Pessimiste 5% · Moyen 8% · Optimiste 11%</span>}>
          <div style={{padding:20}}><ResponsiveContainer width="100%" height={360}>
            <AreaChart data={projMulti}>
              <defs>
                <linearGradient id="gOpt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={.15}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
                <linearGradient id="gMoy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={.15}/><stop offset="95%" stopColor={C.accent} stopOpacity={0}/></linearGradient>
                <linearGradient id="gPes" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={.1}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="year" tick={{fontSize:10,fill:C.textDim}} stroke={C.border}/>
              <YAxis tick={{fontSize:10,fill:C.textDim}} stroke={C.border} tickFormatter={fmtK}/>
              <ReferenceLine y={goalAmount} stroke={C.gold} strokeDasharray="8 4" strokeWidth={2} label={{value:fmtK(goalAmount),position:"insideTopRight",fill:C.gold,fontSize:13,fontWeight:700}}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12}} labelStyle={{color:C.text}} itemStyle={{color:C.text}} formatter={(v,name)=>[fmtEur(v),name==="optimiste"?"Optimiste (11%)":name==="moyen"?"Moyen (8%)":"Pessimiste (5%)"]}/>
              <Area type="monotone" dataKey="optimiste" stroke={C.green} strokeWidth={2} fill="url(#gOpt)" strokeDasharray="none"/>
              <Area type="monotone" dataKey="moyen" stroke={C.accent} strokeWidth={2.5} fill="url(#gMoy)"/>
              <Area type="monotone" dataKey="pessimiste" stroke={C.gold} strokeWidth={2} fill="url(#gPes)" strokeDasharray="4 4"/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:12}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.green}}/><span style={{fontSize:11,color:C.textDim}}>Optimiste 11%</span></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.accent}}/><span style={{fontSize:11,color:C.textDim}}>Moyen 8%</span></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:20,height:3,borderRadius:2,background:C.gold,opacity:.7}}/><span style={{fontSize:11,color:C.textDim}}>Pessimiste 5%</span></div>
          </div>
          </div>
          <div style={{padding:"0 20px 20px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <div style={{background:C.bg,borderRadius:10,padding:"12px 16px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.gold,fontWeight:600,marginBottom:4}}>PESSIMISTE (5%)</div>
              <div style={{fontSize:11,color:C.textDim}}>10 ans : <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtK(projMulti[10]?.pessimiste||0)}</span></div>
              <div style={{fontSize:11,color:C.textDim}}>20 ans : <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtK(projMulti[20]?.pessimiste||0)}</span></div>
            </div>
            <div style={{background:C.accentDim,borderRadius:10,padding:"12px 16px",border:`1px solid ${C.accent}44`}}>
              <div style={{fontSize:10,color:C.accent,fontWeight:600,marginBottom:4}}>MOYEN (8%)</div>
              <div style={{fontSize:11,color:C.textDim}}>10 ans : <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtK(projMulti[10]?.moyen||0)}</span></div>
              <div style={{fontSize:11,color:C.textDim}}>20 ans : <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtK(projMulti[20]?.moyen||0)}</span></div>
            </div>
            <div style={{background:C.greenDim,borderRadius:10,padding:"12px 16px",border:`1px solid ${C.green}44`}}>
              <div style={{fontSize:10,color:C.green,fontWeight:600,marginBottom:4}}>OPTIMISTE (11%)</div>
              <div style={{fontSize:11,color:C.textDim}}>10 ans : <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtK(projMulti[10]?.optimiste||0)}</span></div>
              <div style={{fontSize:11,color:C.textDim}}>20 ans : <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtK(projMulti[20]?.optimiste||0)}</span></div>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Versements mensuels">
          <div style={{padding:20,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
            <InputField label="PEA" value={versements.pea} type="number" onChange={v=>setVersements(p=>({...p,pea:parseFloat(v)||0}))}/>
            <InputField label="Crypto" value={versements.crypto} type="number" onChange={v=>setVersements(p=>({...p,crypto:parseFloat(v)||0}))}/>
            <InputField label="CTO" value={versements.cto} type="number" onChange={v=>setVersements(p=>({...p,cto:parseFloat(v)||0}))}/>
          </div>
          <div style={{padding:"0 20px 16px",fontSize:13,color:C.textDim}}>{t.total} : <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(mensuel)}{t.month}</span> · <span style={{color:C.text,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(mensuel*12)}{t.year}</span></div>
        </SectionCard>
      </>}
    </div>

    {/* ═══ FOOTER ═══ */}
    <div style={{padding:"28px 28px",display:"flex",justifyContent:"center",alignItems:"center",borderTop:`1px solid ${C.border}`,marginTop:8}}>
      <a href="https://ko-fi.com/patracker" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:10,border:`1px solid ${C.border}`,background:C.card,color:C.textDim,textDecoration:"none",fontSize:13,fontWeight:600,transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.text;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textDim;}}>
        ☕ Soutenir PaTra — un café (tarif aéroport)
      </a>
    </div>

    {/* ═══ MODALS ═══ */}
    <Modal show={!!showModal} onClose={()=>{setShowModal(null);setForm({})}} title={`Ajouter — ${showModal==="pea"?"PEA":showModal==="cto"?"CTO":showModal==="crypto"?"Crypto":"Livret"}`}>
      {(showModal==="pea"||showModal==="cto")&&<><InputField label="Nom" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="TOTALENERGIES"/>
        <div style={{marginBottom:14}}>
          <label style={{color:C.textDim,fontSize:11,fontWeight:600,marginBottom:5,display:"block",letterSpacing:.5,textTransform:"uppercase"}}>Ticker Yahoo</label>
          <div style={{display:"flex",gap:8}}>
            <input value={form.ticker||""} onChange={e=>setForm(p=>({...p,ticker:e.target.value}))} placeholder="TTE.PA"
              style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace",outline:"none"}}
              onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>{e.target.style.borderColor=C.border;fetchDivForTicker(form.ticker);}}/>
            <button type="button" onClick={()=>fetchDivForTicker(form.ticker)} style={{background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:8,padding:"9px 14px",color:C.accent,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>Récupérer</button>
          </div>
          {divFetchStatus&&<div style={{fontSize:11,color:C.textDim,marginTop:5}}>{divFetchStatus}</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <InputField label="Quantité" value={form.quantity||""} onChange={v=>setForm(p=>({...p,quantity:v}))} type="number"/>
          <InputField label="PRU (€)" value={form.pru||""} onChange={v=>setForm(p=>({...p,pru:v}))} type="number"/>
          <InputField label="Cours (€)" value={form.currentPrice||""} onChange={v=>setForm(p=>({...p,currentPrice:v}))} type="number"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <InputField label="Div/action (€)" value={form.divPerShare||""} onChange={v=>setForm(p=>({...p,divPerShare:v}))} type="number" placeholder="0 si capitalisant"/>
          <SelectField label="Fréquence" value={form.divFreq||"annuel"} onChange={v=>setForm(p=>({...p,divFreq:v}))} options={[{value:"annuel",label:"Annuel"},{value:"trim",label:"Trimestriel"},{value:"cap",label:"Capitalisant"}]}/>
        </div></>}
      {showModal==="crypto"&&<><InputField label="Nom" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Bitcoin"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <InputField label="Symbole" value={form.symbol||""} onChange={v=>setForm(p=>({...p,symbol:v}))} placeholder="BTC"/>
          <InputField label="ID CoinGecko" value={form.cgId||""} onChange={v=>setForm(p=>({...p,cgId:v}))} placeholder="bitcoin"/>
        </div>
        <div style={{padding:"8px 12px",background:C.bg,borderRadius:6,marginBottom:14,fontSize:11,color:C.textDim}}>
          L'ID CoinGecko se trouve dans l'URL : coingecko.com/en/coins/<span style={{color:C.accent}}>bitcoin</span> → l'ID est <span style={{color:C.accent}}>bitcoin</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <InputField label="Quantité" value={form.quantity||""} onChange={v=>setForm(p=>({...p,quantity:v}))} type="number"/>
          <InputField label="Prix moy (€)" value={form.avgPrice||""} onChange={v=>setForm(p=>({...p,avgPrice:v}))} type="number"/>
          <InputField label="Cours (€)" value={form.currentPrice||""} onChange={v=>setForm(p=>({...p,currentPrice:v}))} type="number"/>
        </div></>}
      {showModal==="livret"&&<><InputField label="Nom" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Livret A"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <InputField label="Solde (€)" value={form.balance||""} onChange={v=>setForm(p=>({...p,balance:v}))} type="number"/>
          <InputField label="Taux (%)" value={form.rate||""} onChange={v=>setForm(p=>({...p,rate:v}))} type="number"/>
        </div></>}
      <button onClick={handleAdd} style={{width:"100%",padding:11,borderRadius:8,border:"none",background:`linear-gradient(135deg,${C.accent},${C.purple})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:6}}><Check size={14} style={{verticalAlign:"middle",marginRight:5}}/>Ajouter</button>
    </Modal>

    <Modal show={!!editItem} onClose={()=>{setEditItem(null);setForm({})}} title={`Modifier — ${form.name||""}`}>
      {(editItem?._type==="pea"||editItem?._type==="cto")&&<><InputField label="Nom" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))}/>
        <InputField label="Ticker Yahoo" value={form.ticker||""} onChange={v=>setForm(p=>({...p,ticker:v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <InputField label="Quantité" value={form.quantity||""} onChange={v=>setForm(p=>({...p,quantity:v}))} type="number"/>
          <InputField label="PRU (€)" value={form.pru||""} onChange={v=>setForm(p=>({...p,pru:v}))} type="number"/>
          <InputField label="Cours (€)" value={form.currentPrice||""} onChange={v=>setForm(p=>({...p,currentPrice:v}))} type="number"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <InputField label="Div/action (€)" value={form.divPerShare||""} onChange={v=>setForm(p=>({...p,divPerShare:v}))} type="number"/>
          <SelectField label="Fréquence" value={form.divFreq||"annuel"} onChange={v=>setForm(p=>({...p,divFreq:v}))} options={[{value:"annuel",label:"Annuel"},{value:"trim",label:"Trimestriel"},{value:"cap",label:"Capitalisant"}]}/>
        </div></>}
      {editItem?._type==="crypto"&&<><InputField label="Nom" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <InputField label="Symbole" value={form.symbol||""} onChange={v=>setForm(p=>({...p,symbol:v}))}/>
          <InputField label="ID CoinGecko" value={form.cgId||""} onChange={v=>setForm(p=>({...p,cgId:v}))} placeholder="bitcoin"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <InputField label="Quantité" value={form.quantity||""} onChange={v=>setForm(p=>({...p,quantity:v}))} type="number"/>
          <InputField label="Prix moy (€)" value={form.avgPrice||""} onChange={v=>setForm(p=>({...p,avgPrice:v}))} type="number"/>
          <InputField label="Cours (€)" value={form.currentPrice||""} onChange={v=>setForm(p=>({...p,currentPrice:v}))} type="number"/>
        </div></>}
      {editItem?._type==="livret"&&<><InputField label="Nom" value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <InputField label="Solde (€)" value={form.balance||""} onChange={v=>setForm(p=>({...p,balance:v}))} type="number"/>
          <InputField label="Taux (%)" value={form.rate||""} onChange={v=>setForm(p=>({...p,rate:v}))} type="number"/>
        </div></>}
      <button onClick={handleEdit} style={{width:"100%",padding:11,borderRadius:8,border:"none",background:`linear-gradient(135deg,${C.accent},${C.purple})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:6}}><Save size={14} style={{verticalAlign:"middle",marginRight:5}}/>Sauvegarder</button>
    </Modal>

    <Modal show={showDivEditModal} onClose={()=>{setShowDivEditModal(false);setDivEditItem(null);setForm({})}} title={`Dividende — ${divEditItem?.name||""}`}>
      <div style={{padding:"12px 16px",background:C.bg,borderRadius:8,marginBottom:16,fontSize:12,color:C.textDim}}>Mets à jour le dividende/action quand il est annoncé.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <InputField label="Dividende/action (€)" value={form.divPerShare||""} onChange={v=>setForm(p=>({...p,divPerShare:v}))} type="number"/>
        <SelectField label="Fréquence" value={form.divFreq||"annuel"} onChange={v=>setForm(p=>({...p,divFreq:v}))} options={[{value:"annuel",label:"Annuel"},{value:"trim",label:"Trimestriel"},{value:"cap",label:"Capitalisant"}]}/>
      </div>
      <button onClick={handleDivEdit} style={{width:"100%",padding:11,borderRadius:8,border:"none",background:`linear-gradient(135deg,${C.green},${C.accent})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:6}}><Save size={14} style={{verticalAlign:"middle",marginRight:5}}/>Mettre à jour</button>
    </Modal>

    <Modal show={showHistoryModal} onClose={()=>{setShowHistoryModal(false);setHistoryForm({year:"",total:""})}} title="Ajouter année de dividendes">
      <div style={{padding:"12px 16px",background:C.bg,borderRadius:8,marginBottom:16,fontSize:12,color:C.textDim}}>Saisis le total des dividendes perçus pour une année.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <InputField label="Année" value={historyForm.year} onChange={v=>setHistoryForm(p=>({...p,year:v}))} type="number" placeholder="2025"/>
        <InputField label="Total perçu (€)" value={historyForm.total} onChange={v=>setHistoryForm(p=>({...p,total:v}))} type="number" placeholder="860"/>
      </div>
      <button onClick={addDivHistory} style={{width:"100%",padding:11,borderRadius:8,border:"none",background:`linear-gradient(135deg,${C.green},${C.accent})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:6}}><Check size={14} style={{verticalAlign:"middle",marginRight:5}}/>Ajouter</button>
    </Modal>

    {/* ═══ TRANSACTION MODAL ═══ */}
    <Modal show={showTxModal} onClose={()=>setShowTxModal(false)} title={t.logTx}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <InputField label={t.date} value={txForm.date} onChange={v=>setTxForm(p=>({...p,date:v}))} type="date"/>
        <SelectField label={t.type} value={txForm.type} onChange={v=>setTxForm(p=>({...p,type:v}))} options={[{value:"buy",label:t.buy},{value:"sell",label:t.sell}]}/>
      </div>
      <SelectField label={t.account} value={txForm.account} onChange={v=>setTxForm(p=>({...p,account:v,holdingId:"new",name:""}))} options={[{value:"pea",label:"PEA"},{value:"cto",label:"CTO"},{value:"crypto",label:"Crypto"}]}/>
      {txForm.type==="buy"&&txForm.account==="pea"&&<div style={{fontSize:12,color:C.textDim,marginTop:-6,marginBottom:4,paddingLeft:2}}>Espèces PEA disponibles : <span style={{color:peaCash>0?C.cyan:C.red,fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(peaCash)}</span>{peaCash===0&&<span style={{marginLeft:6,color:C.red}}>— Alimentez le cash PEA dans l'onglet PEA avant d'acheter.</span>}</div>}
      {txForm.type==="buy"&&txForm.account==="cto"&&<div style={{fontSize:12,color:C.textDim,marginTop:-6,marginBottom:4,paddingLeft:2}}>Espèces CTO disponibles : <span style={{color:ctoCash>0?C.cyan:C.red,fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(ctoCash)}</span>{ctoCash===0&&<span style={{marginLeft:6,color:C.red}}>— Alimentez le cash CTO dans l'onglet CTO avant d'acheter.</span>}</div>}
      <SelectField label={t.name} value={txForm.holdingId} onChange={v=>setTxForm(p=>({...p,holdingId:v,name:""}))} options={[{value:"new",label:"— Nouvelle ligne —"},...(txForm.account==="pea"?pea:txForm.account==="cto"?cto:crypto).map(h=>({value:h.id,label:h.name}))]}/>
      {txForm.holdingId==="new"&&<InputField label={t.name} value={txForm.name} onChange={v=>setTxForm(p=>({...p,name:v}))} placeholder={txForm.account==="crypto"?"Bitcoin":"TOTALENERGIES"}/>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <InputField label={t.quantity} value={txForm.quantity} onChange={v=>setTxForm(p=>({...p,quantity:v}))} type="number"/>
        <InputField label={`${t.price} (€)`} value={txForm.price} onChange={v=>setTxForm(p=>({...p,price:v}))} type="number"/>
      </div>
      <InputField label={t.notes} value={txForm.notes} onChange={v=>setTxForm(p=>({...p,notes:v}))} placeholder="Optionnel"/>
      {txForm.account==="crypto"&&txForm.type==="buy"&&<SelectField label="Payé avec" value={txForm.payWith} onChange={v=>setTxForm(p=>({...p,payWith:v}))} options={[{value:"cash",label:`Espèces € — ${fmtEur(cryptoCash)} dispo`},...stablecoins.map(st=>({value:st.symbol,label:`${st.symbol} — ${st.quantity.toFixed(2)} dispo`}))]}/>}
      {txForm.quantity&&txForm.price&&<div style={{padding:"10px 14px",background:C.bg,borderRadius:8,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:C.textDim}}>{t.total}</span>
        <div style={{textAlign:"right"}}>
          <span style={{display:"block",fontSize:16,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:txForm.type==="buy"?C.green:C.red}}>{fmtEur(parseFloat(txForm.quantity)*parseFloat(txForm.price))}</span>
          {txForm.account==="pea"&&txForm.type==="buy"&&<span style={{display:"block",fontSize:11,color:C.textDim,marginTop:2}}>Cash PEA dispo : {fmtEur(peaCash)}</span>}
          {txForm.account==="cto"&&txForm.type==="buy"&&<span style={{display:"block",fontSize:11,color:C.textDim,marginTop:2}}>Cash CTO dispo : {fmtEur(ctoCash)}</span>}
        </div>
      </div>}
      {txValidationError&&<div style={{padding:"8px 12px",background:C.redDim,border:`1px solid ${C.red}44`,borderRadius:8,marginBottom:10,fontSize:12,color:C.red}}>{txValidationError}</div>}
      <button disabled={!!txValidationError} onClick={()=>{
        const qty=parseFloat(txForm.quantity)||0;
        const price=parseFloat(txForm.price)||0;
        if(!qty||!price)return;
        const {holdingId,account,type:txType,date,notes,payWith}=txForm;
        const isBuy=txType==="buy";
        const arr=account==="pea"?pea:account==="cto"?cto:crypto;
        const existing=holdingId!=="new"?arr.find(h=>h.id===holdingId):null;
        const txName=existing?existing.name:(txForm.name||"");
        if(holdingId==="new"&&!txName)return;
        const total=qty*price;
        // Cash delta
        let cashDelta=0;let stableDelta=null;
        if(isBuy){
          if(account==="pea"){setPeaCash(c=>c-total);cashDelta=-total;}
          else if(account==="cto"){setCtoCash(c=>c-total);cashDelta=-total;}
          else if(account==="crypto"){
            if(payWith==="cash"){setCryptoCash(c=>c-total);cashDelta=-total;}
            else{
              const _meta=STABLE_LIST.find(m=>m.symbol===payWith);
              const _stP=_meta?(stablecoinPrices[_meta.cgId]??0):0;
              const needed=_stP>0?total/_stP:total;
              setStablecoins(p=>p.map(s=>s.symbol===payWith?{...s,quantity:s.quantity-needed}:s));
              stableDelta={symbol:payWith,delta:-needed};
            }
          }
        }else{
          if(account==="pea"){setPeaCash(c=>c+total);cashDelta=total;}
          else if(account==="cto"){setCtoCash(c=>c+total);cashDelta=total;}
          else if(account==="crypto"){setCryptoCash(c=>c+total);cashDelta=total;}
        }
        // Update portfolio
        if(existing){
          const updater=h=>{
            if(h.id!==holdingId)return h;
            if(isBuy){
              const newQty=h.quantity+qty;
              if(account==="crypto"){const newAvg=(h.quantity*h.avgPrice+qty*price)/newQty;return{...h,quantity:newQty,avgPrice:newAvg};}
              else{const newPru=(h.quantity*h.pru+qty*price)/newQty;return{...h,quantity:newQty,pru:newPru};}
            }else{
              return{...h,quantity:Math.max(0,h.quantity-qty)};
            }
          };
          if(account==="pea")setPea(p=>p.map(updater));
          else if(account==="cto")setCto(p=>p.map(updater));
          else setCrypto(p=>p.map(updater));
        }else if(isBuy){
          const id=Date.now().toString();
          if(account==="pea")setPea(p=>[...p,{id,name:txName,ticker:"",quantity:qty,pru:price,currentPrice:price,divPerShare:0,divFreq:"annuel"}]);
          else if(account==="cto")setCto(p=>[...p,{id,name:txName,ticker:"",quantity:qty,pru:price,currentPrice:price,divPerShare:0,divFreq:"annuel"}]);
          else setCrypto(p=>[...p,{id,name:txName,symbol:"",cgId:"",quantity:qty,avgPrice:price,currentPrice:price}]);
        }
        const fullDate=date===new Date().toISOString().slice(0,10)?new Date().toISOString():date+"T"+new Date().toISOString().slice(11);
        const txEntry={date:fullDate,type:txType,account,name:txName,quantity:qty,price,notes:notes||""};
        if(cashDelta!==0)txEntry.cashDelta=cashDelta;
        if(stableDelta)txEntry.stableDelta=stableDelta;
        setTransactions(p=>[...p,txEntry]);
        setShowTxModal(false);
        setTxForm({date:new Date().toISOString().slice(0,10),type:"buy",account:"pea",holdingId:"new",name:"",quantity:"",price:"",notes:"",payWith:"cash"});
      }} style={{width:"100%",padding:11,borderRadius:8,border:"none",background:txValidationError?C.border:`linear-gradient(135deg,${C.accent},${C.purple})`,color:txValidationError?C.textMuted:"#fff",fontWeight:700,fontSize:13,cursor:txValidationError?"not-allowed":"pointer",marginTop:6,opacity:txValidationError?0.6:1,transition:"all .15s"}}>
        <Check size={14} style={{verticalAlign:"middle",marginRight:5}}/>{t.logTx}
      </button>
    </Modal>

    {/* ═══ RESET MODAL ═══ */}
    <Modal show={showResetModal} onClose={()=>{setShowResetModal(false);setResetInput("");}} title="Réinitialiser l'application">
      <div style={{padding:"4px 0 12px"}}>
        <div style={{background:C.redDim,border:`1px solid ${C.red}44`,borderRadius:10,padding:"14px 16px",marginBottom:18}}>
          <div style={{fontSize:15,fontWeight:700,color:C.red,marginBottom:6}}>⚠️ Action irréversible</div>
          <div style={{fontSize:13,color:C.textDim,lineHeight:1.6}}>Cette action supprimera définitivement <strong style={{color:C.text}}>TOUTES vos données</strong> — portefeuilles, snapshots, transactions, historique. Rien ne pourra être récupéré.</div>
        </div>
        <div style={{background:C.greenDim,border:`1px solid ${C.green}44`,borderRadius:10,padding:"10px 14px",marginBottom:18,fontSize:12,color:C.textDim,lineHeight:1.5}}>
          ✅ <strong style={{color:C.green}}>Vos exports JSON ne sont pas affectés.</strong> Si vous avez fait un Backup, vous pourrez restaurer vos données via "Restore JSON" après la réinitialisation.</div>
        <div style={{fontSize:13,color:C.textDim,marginBottom:8}}>Pour confirmer, tapez exactement <strong style={{color:C.text,fontFamily:"'JetBrains Mono',monospace"}}>Supprimer</strong> :</div>
        <input type="text" value={resetInput} onChange={e=>setResetInput(e.target.value)} placeholder="Supprimer"
          style={{width:"100%",background:C.bg,border:`1px solid ${resetInput==="Supprimer"?C.red:C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace",outline:"none",boxSizing:"border-box",marginBottom:16}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{setShowResetModal(false);setResetInput("");}} style={{flex:1,padding:11,borderRadius:8,border:`1px solid ${C.border}`,background:"none",color:C.textDim,cursor:"pointer",fontSize:13,fontWeight:600}}>Annuler</button>
          <button disabled={resetInput!=="Supprimer"} onClick={()=>{localStorage.removeItem("patrimoine-v6");localStorage.removeItem("patra-tab");localStorage.removeItem("patra-goal");window.location.reload();}}
            style={{flex:1,padding:11,borderRadius:8,border:"none",background:resetInput==="Supprimer"?C.red:"#333",color:resetInput==="Supprimer"?"#fff":C.textMuted,cursor:resetInput==="Supprimer"?"pointer":"not-allowed",fontSize:13,fontWeight:700,transition:"background .2s"}}>
            Confirmer la suppression
          </button>
        </div>
      </div>
    </Modal>

    {/* ═══ ONBOARDING ═══ */}
    {showOnboarding&&<div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:24,padding:"40px 48px",maxWidth:560,width:"90%",boxShadow:"0 30px 80px rgba(0,0,0,.6)"}}>
        {onboardingStep===0&&<>
          <div style={{fontSize:48,marginBottom:16}}>💰</div>
          <h2 style={{color:C.text,fontSize:28,fontWeight:800,margin:"0 0 12px",letterSpacing:-.5}}>Bienvenue sur PaTra</h2>
          <p style={{color:C.textDim,fontSize:14,lineHeight:1.7,marginBottom:24}}>
            Patrimoine Tracker t'aide à suivre tous tes investissements en un seul endroit : PEA, CTO, crypto, livrets. Tes données restent 100% dans ton navigateur. Rien n'est envoyé sur un serveur.
          </p>
          <button onClick={()=>setOnboardingStep(1)} style={{width:"100%",padding:14,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.accent},${C.purple})`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            C'est parti <ChevronRight size={18}/>
          </button>
        </>}
        {onboardingStep===1&&<>
          <div style={{fontSize:48,marginBottom:16}}>📈</div>
          <h2 style={{color:C.text,fontSize:24,fontWeight:800,margin:"0 0 12px"}}>Commence par ton PEA</h2>
          <p style={{color:C.textDim,fontSize:14,lineHeight:1.7,marginBottom:12}}>
            Va dans l'onglet <strong style={{color:C.accent}}>PEA</strong> et clique <strong style={{color:C.accent}}>Ajouter</strong> pour chaque ligne de ton portefeuille.
          </p>
          <div style={{background:C.bg,borderRadius:10,padding:16,marginBottom:20,fontSize:13,color:C.textDim,lineHeight:1.8}}>
            <strong style={{color:C.text}}>Pour chaque action, renseigne :</strong><br/>
            • Le nom (ex: TOTALENERGIES)<br/>
            • Le ticker Yahoo Finance (ex: TTE.PA)<br/>
            • La quantité et le PRU<br/>
            • Le dividende par action (optionnel)
          </div>
          <button onClick={()=>setOnboardingStep(2)} style={{width:"100%",padding:14,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.accent},${C.purple})`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            Suivant <ChevronRight size={18}/>
          </button>
        </>}
        {onboardingStep===2&&<>
          <div style={{fontSize:48,marginBottom:16}}>⚡</div>
          <h2 style={{color:C.text,fontSize:24,fontWeight:800,margin:"0 0 12px"}}>Ajoute tes cryptos</h2>
          <p style={{color:C.textDim,fontSize:14,lineHeight:1.7,marginBottom:12}}>
            Onglet <strong style={{color:C.gold}}>Crypto</strong>, même principe. Le cours se synchronise automatiquement via CoinGecko.
          </p>
          <div style={{background:C.bg,borderRadius:10,padding:16,marginBottom:20,fontSize:13,color:C.textDim,lineHeight:1.8}}>
            <strong style={{color:C.text}}>L'ID CoinGecko se trouve dans l'URL :</strong><br/>
            coingecko.com/en/coins/<strong style={{color:C.gold}}>bitcoin</strong> → ID = <strong style={{color:C.gold}}>bitcoin</strong><br/>
            coingecko.com/en/coins/<strong style={{color:C.gold}}>ethereum</strong> → ID = <strong style={{color:C.gold}}>ethereum</strong>
          </div>
          <button onClick={()=>setOnboardingStep(3)} style={{width:"100%",padding:14,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.gold},${C.orange})`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            Suivant <ChevronRight size={18}/>
          </button>
        </>}
        {onboardingStep===3&&<>
          <div style={{fontSize:48,marginBottom:16}}>📸</div>
          <h2 style={{color:C.text,fontSize:24,fontWeight:800,margin:"0 0 12px"}}>Pense au snapshot</h2>
          <p style={{color:C.textDim,fontSize:14,lineHeight:1.7,marginBottom:12}}>
            Chaque semaine, clique <strong style={{color:C.accent}}>Snapshot</strong> pour sauvegarder l'état de ton patrimoine. Au fil du temps, ça construit ta courbe d'évolution.
          </p>
          <div style={{background:C.bg,borderRadius:10,padding:16,marginBottom:20,fontSize:13,color:C.textDim,lineHeight:1.8}}>
            <strong style={{color:C.text}}>Routine hebdo (2 min) :</strong><br/>
            1. Ouvre l'app<br/>
            2. Les prix se synchronisent automatiquement<br/>
            3. Clique <strong style={{color:C.accent}}>Snapshot</strong><br/>
            4. C'est tout !
          </div>
          <button onClick={()=>setOnboardingStep(4)} style={{width:"100%",padding:14,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.accent},${C.purple})`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            Suivant <ChevronRight size={18}/>
          </button>
        </>}
        {onboardingStep===4&&<>
          <div style={{fontSize:48,marginBottom:16}}>🎯</div>
          <h2 style={{color:C.text,fontSize:24,fontWeight:800,margin:"0 0 12px"}}>Tu es prêt !</h2>
          <p style={{color:C.textDim,fontSize:14,lineHeight:1.7,marginBottom:12}}>
            Quelques tips pour bien démarrer :
          </p>
          <div style={{background:C.bg,borderRadius:10,padding:16,marginBottom:20,fontSize:13,color:C.textDim,lineHeight:1.8}}>
            • Bouton <strong style={{color:C.purple}}>⚡ Avancé</strong> pour débloquer les features pro<br/>
            • Bouton <strong style={{color:C.green}}>Backup</strong> pour sauvegarder tes données<br/>
            • Bouton <strong style={{color:darkMode?C.text:C.textDim}}>{darkMode?"☀":"🌙"}</strong> pour changer de thème<br/>
            • Onglet <strong style={{color:C.gold}}>Objectif 1M</strong> pour visualiser ta trajectoire
          </div>
          <button onClick={()=>{setShowOnboarding(false);setOnboardingStep(0);}} style={{width:"100%",padding:14,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.green},${C.accent})`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>
            Commencer
          </button>
        </>}
        {onboardingStep>0&&<button onClick={()=>setOnboardingStep(p=>p-1)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:12,marginTop:12,padding:4}}>
          ← Retour
        </button>}
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16}}>
          {[0,1,2,3,4].map(i=>(<div key={i} style={{width:8,height:8,borderRadius:4,background:i===onboardingStep?C.accent:C.border,transition:"background .3s"}}/>))}
        </div>
      </div>
    </div>}
  </div>);
}
