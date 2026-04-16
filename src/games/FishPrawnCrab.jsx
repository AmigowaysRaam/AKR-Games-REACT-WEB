const FPC_ITEMS=[
  {id:'fish',  label:'Fish',  digits:[1,2,3], icon:'🐟', color:'#22C55E', border:'#16A34A'},
  {id:'prawn', label:'Prawn', digits:[4,5,6], icon:'🦐', color:'#3B82F6', border:'#2563EB'},
  {id:'crab',  label:'Crab',  digits:[7,8,9], icon:'🦀', color:'#EF4444', border:'#DC2626'},
];

const COLUMNS=[
  {key:'A',color:'#F59E0B',border:'#D97706'},
  {key:'B',color:'#3B82F6',border:'#2563EB'},
  {key:'C',color:'#EF4444',border:'#DC2626'},
  {key:'D',color:'#22C55E',border:'#16A34A'},
];
export default function FishPrawnCrabTab({bets,onToggle,prizeTab}){
  const isSel=(col,type)=>bets.some(b=>b.col===col&&b.type===type);
  const colCfg=COLUMNS.find(c=>c.key==='D');
  return(
    <div>
      {/* Info banner */}
      <div style={{background:'#f9f8ff',padding:'10px 14px',
        borderBottom:'1px solid #ede9f8',display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:20,height:20,borderRadius:'50%',background:'#aaa',flexShrink:0,
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:900}}>!</div>
        <span style={{fontSize:12,color:'#555',fontWeight:500}}>
          <b>Fish:</b> 1,2,3 &nbsp;|&nbsp; <b>Prawn:</b> 4,5,6 &nbsp;|&nbsp; <b>Crab:</b> 7,8,9
        </span>
      </div>
      {/* D column only */}
      <div style={{background:'#f4f2fb',padding:'16px 14px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {/* Column label */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,width:24,flexShrink:0}}>
            <span style={{fontSize:16,fontWeight:900,color:colCfg.color}}>D</span>
            <div style={{width:16,height:16,borderRadius:'50%',background:colCfg.color,
              boxShadow:`0 2px 6px ${colCfg.color}60`}}/>
          </div>
          {/* Fish / Prawn / Crab buttons */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,flex:1}}>
            {FPC_ITEMS.map(item=>{
              const sel=isSel('D',item.id);
              return(
                <button key={item.id} onClick={()=>onToggle('D',item.id)} style={{
                  display:'flex',flexDirection:'column',alignItems:'center',
                  justifyContent:'center',padding:'16px 8px',borderRadius:14,
                  border:`2.5px solid ${sel?item.border:item.border+'55'}`,
                  background:sel?item.color+'18':'#fff',cursor:'pointer',gap:4,
                  transition:'all 0.15s',transform:sel?'scale(1.04)':'scale(1)',
                  boxShadow:sel?`0 4px 16px ${item.color}40`:'0 2px 8px rgba(0,0,0,0.07)',
                }}>
                  <span style={{fontSize:28}}>{item.icon}</span>
                  <span style={{fontSize:14,fontWeight:800,color:sel?item.color:'#1a1a2e'}}>
                    {item.label}
                  </span>
                  <span style={{fontSize:12,fontWeight:600,color:sel?item.color:'#888'}}>
                    3.2X
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}