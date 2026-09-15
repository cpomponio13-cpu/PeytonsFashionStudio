import { useState } from 'react'
import './App.css'

type Screen='home'|'design'|'wardrobe'|'colours'|'features'|'recipes'|'gallery'; type Tab='clothing'|'colour'|'details'
const clothes=[{id:'tshirt',name:'T-Shirt',style:'Casual • Sporty'},{id:'blouse',name:'Blouse',style:'Elegant • Classic'},{id:'jeans',name:'Jeans',style:'Casual • Classic'},{id:'skirt',name:'Pleated Skirt',style:'Classic • Playful'},{id:'summer',name:'Summer Dress',style:'Casual • Playful'},{id:'flowing',name:'Flowing Dress',style:'Elegant • Glamorous'}]
const colours=[{name:'Red',value:'#e74c3c'},{name:'Yellow',value:'#f5c542'},{name:'Blue',value:'#3d7edb'},{name:'Black',value:'#222222'},{name:'White',value:'#ffffff'}]
const details=[{id:'trim',name:'Contrast Trim',icon:'〰️'},{id:'pockets',name:'Pockets',icon:'▢'},{id:'belt',name:'Belt',icon:'🎀'},{id:'stripes',name:'Stripes',icon:'▥'},{id:'floral',name:'Floral Print',icon:'🌸'},{id:'sequins',name:'Sequins',icon:'✦'}]

/* Wardrobe art and wearable art are deliberately separate.
   A wardrobe image can be any attractive isolated garment. A wearable must be
   a full-canvas transparent PNG aligned pixel-for-pixel with base-model.png. */
function GarmentThumbnail({id,colour='#d98aaa'}:{id:string,colour?:string}){
  if(id==='tshirt')return <img className="garment-art garment-image" src="/clothing/tshirt.png" alt="T-Shirt"/>
  const common={fill:colour,stroke:'#654b66',strokeWidth:2,strokeLinejoin:'round' as const}
  return <svg className="garment-art legacy-thumbnail" viewBox="0 0 220 300" aria-label={id}>
    {id==='blouse'&&<path {...common} d="M70 55 91 42h38l21 13 31 35-22 22-18-20v138H79V92l-18 20-22-22z"/>}
    {id==='jeans'&&<path {...common} d="M72 42h76l7 80-13 142h-43l11-115-11 115H56L65 122z"/>}
    {id==='skirt'&&<path {...common} d="M75 58h70l30 184H45z"/>}
    {id==='summer'&&<path {...common} d="M88 43h44l13 40-18 42 42 118H51l42-118-18-42z"/>}
    {id==='flowing'&&<path {...common} d="M88 43h44l13 40-18 42 55 126H38l55-126-18-42z"/>}
  </svg>
}

function WearableGarment({id}:{id:string}){
  /* Wearables are added here only after the artwork has been fitted to the
     permanent 964×1632 model canvas. This prevents floating/geometric clothes. */
  const wearableAssets:Record<string,string>={}
  const src=wearableAssets[id]
  return src?<img className="wearable-garment" src={src} alt="" aria-hidden="true"/>:null
}

function Mannequin({outfit='flowing'}:{colour?:string,outfit?:string,features?:string[]}){
  return <div className="fashion-model fashion-model-v3">
    <img className="base-model-image" src="/model/base-model.png" alt="Fashion model"/>
    <WearableGarment id={outfit}/>
  </div>
}

function App(){const[screen,setScreen]=useState<Screen>('home'),[tab,setTab]=useState<Tab>('clothing'),[clothing,setClothing]=useState(clothes[5]),[colour,setColour]=useState(colours[2]),[features,setFeatures]=useState<string[]>([]);const toggleFeature=(id:string)=>setFeatures(c=>c.includes(id)?c.filter(x=>x!==id):c.length<3?[...c,id]:c)
if(screen==='design')return <main className="app-shell"><header className="top-bar"><button className="home-button" onClick={()=>setScreen('home')}>← Studio</button><div className="brand"><span className="brand-icon">✦</span>Peyton's Fashion Studio</div><div className="star-count">⭐ 0</div></header><section className="designer-page"><div className="designer-challenge"><span>🎯</span><div><small>YOUR CHALLENGE</small><strong>Create a Look You Love!</strong></div><button>💡</button></div><div className="designer-workspace"><div className="designer-summary"><small>CURRENT LOOK</small><h2>{clothing.name}</h2><p>{clothing.style}</p><div className="summary-colour"><i style={{background:colour.value}}/> {colour.name}</div><p>{features.length?features.map(id=>details.find(d=>d.id===id)?.name).join(' • '):'Add some details ✨'}</p></div><div className="designer-mirror"><div className="mirror-shine"/><Mannequin colour={colour.value} outfit={clothing.id} features={features}/></div><div className="designer-tip"><span>♡</span><strong>Design • Create • Express</strong><p>Make it completely yours.</p></div></div><div className="design-drawer"><div className="drawer-tabs"><button className={tab==='clothing'?'active':''} onClick={()=>setTab('clothing')}>👗 <span>Clothing</span></button><button className={tab==='colour'?'active':''} onClick={()=>setTab('colour')}>🎨 <span>Colour</span></button><button className={tab==='details'?'active':''} onClick={()=>setTab('details')}>✨ <span>Details</span><b>{features.length}/3</b></button></div><div className="drawer-options">{tab==='clothing'&&clothes.map(item=><button key={item.id} className={`choice-tile garment-choice ${clothing.id===item.id?'selected':''}`} onClick={()=>setClothing(item)}><GarmentThumbnail id={item.id}/><strong>{item.name}</strong></button>)}{tab==='colour'&&colours.map(item=><button key={item.name} className={`colour-choice ${colour.name===item.name?'selected':''}`} onClick={()=>setColour(item)}><i style={{background:item.value}}/><strong>{item.name}</strong></button>)}{tab==='details'&&details.map(item=><button key={item.id} className={`choice-tile detail-choice ${features.includes(item.id)?'selected':''}`} onClick={()=>toggleFeature(item.id)}><span>{item.icon}</span><strong>{item.name}</strong></button>)}</div></div><div className="designer-actions"><button className="reset-design" onClick={()=>{setClothing(clothes[5]);setColour(colours[2]);setFeatures([])}}>↻ Start Again</button><button className="finish-design">✓ Finish Design</button></div></section></main>
if(screen!=='home')return <main className="app-shell"><header className="top-bar"><div className="brand">✦ Peyton's Fashion Studio</div><div/><div className="star-count">⭐ 0</div></header><section className="placeholder-page"><div className="placeholder-icon">✨</div><h1>{screen}</h1><p>We're building this part of the studio soon.</p><button className="back-button" onClick={()=>setScreen('home')}>← Back to Studio</button></section></main>
return <main className="app-shell"><header className="top-bar"><div className="brand"><span className="brand-icon">✦</span>Peyton's Fashion Studio</div><div className="designer">Designer Peyton</div><div className="star-count">⭐ 0</div></header><section className="studio"><div className="welcome"><p className="eyebrow">WELCOME, DESIGNER</p><h1>Your Fashion Studio</h1><p className="welcome-text">Create outfits, discover colours and build your own fashion collection.</p></div><div className="studio-floor"><button className="studio-area wardrobe-area" onClick={()=>setScreen('wardrobe')}><span className="area-icon">👗</span><span className="area-title">Wardrobe</span><span className="area-description">Your clothing collection</span></button><button className="studio-area colours-area" onClick={()=>setScreen('colours')}><span className="area-icon">🎨</span><span className="area-title">Colour Station</span><span className="area-description">Colours & mixing</span></button><button className="studio-area features-area" onClick={()=>setScreen('features')}><span className="area-icon">✨</span><span className="area-title">Feature Wall</span><span className="area-description">Details & decorations</span></button><button className="studio-area recipes-area" onClick={()=>setScreen('recipes')}><span className="area-icon">📖</span><span className="area-title">Recipe Book</span></button><button className="studio-area gallery-area" onClick={()=>setScreen('gallery')}><span className="area-icon">🖼️</span><span className="area-title">Fashion Gallery</span></button><button className="design-studio" onClick={()=>setScreen('design')}><div className="mirror"><div className="mirror-shine"/><Mannequin/></div><div className="design-studio-label"><span className="design-icon">🪞</span><div><strong>Design Studio</strong><small>Tap the model to start designing</small></div><span className="arrow">→</span></div></button></div><div className="first-challenge"><div className="challenge-icon">🎯</div><div className="challenge-copy"><span>YOUR FIRST CHALLENGE</span><strong>Create a Look You Love!</strong><p>No rules for your first design.</p></div><button className="challenge-button" onClick={()=>setScreen('design')}>Start Designing →</button></div></section><footer className="studio-footer"><span>👗 Create</span><span>🎨 Experiment</span><span>✨ Discover</span><span>💖 Have fun</span></footer></main>}
export default App
