import { useState } from 'react'
import './FeatureWall.css'

export type FashionFeature={id:string;name:string;icon:string;kind:'Construction'|'Surface';description:string;worksWith:string}
export const fashionFeatures:FashionFeature[]=[
 {id:'contrast-trim',name:'Contrast Trim',icon:'〰️',kind:'Construction',description:'Add a second-colour edge or trim.',worksWith:'Works with every top'},
 {id:'pockets',name:'Pockets',icon:'▣',kind:'Construction',description:'Add useful statement pockets.',worksWith:'Best on jeans, shorts & skirts'},
 {id:'belt',name:'Belt',icon:'➖',kind:'Construction',description:'Define the waist with a belt.',worksWith:'Best at the waist'},
 {id:'stripes',name:'Stripes',icon:'▥',kind:'Surface',description:'Give the fabric a striped pattern.',worksWith:'Works on every fabric top'},
 {id:'floral-print',name:'Floral Print',icon:'🌸',kind:'Surface',description:'Cover the fabric with playful flowers.',worksWith:'Works on every fabric top'},
 {id:'sequins',name:'Sequins',icon:'✨',kind:'Surface',description:'Add sparkle and shine.',worksWith:'Works on every fabric top'},
]

export const featureIsCompatible=(id:string,top:number,bottom:number)=>{
 if(id==='pockets')return [1,2,3].includes(bottom)
 if(id==='belt')return [1,2,3].includes(bottom)
 if(['contrast-trim','stripes','floral-print','sequins'].includes(id))return [1,2,3,4,5].includes(top)
 return true
}

type Props={onBack:()=>void;onDesign:()=>void;top?:number;bottom?:number}
export default function FeatureWall({onBack,onDesign,top=1,bottom=1}:Props){
 const[selected,setSelected]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('peyton-selected-features')||'[]')}catch{return[]}})
 const toggle=(id:string)=>{if(!featureIsCompatible(id,top,bottom))return;const next=selected.includes(id)?selected.filter(x=>x!==id):selected.length<3?[...selected,id]:selected;setSelected(next);localStorage.setItem('peyton-selected-features',JSON.stringify(next))}
 return <main className="app-shell"><header className="top-bar"><button className="home-button" onClick={onBack}>← Studio</button><div className="designer">Feature Wall</div><div className="star-count">✨ {selected.length}/3</div></header><section className="feature-page"><p className="eyebrow">FEATURE WALL</p><h1>Add Your Signature</h1><p>Choose up to three details for your next design. The cards now show where each detail works naturally.</p><div className="feature-counter"><strong>{selected.length}/3 selected</strong><span>{selected.length===3?'Your feature tray is full ✨':'Tap a compatible card to add it to your feature tray.'}</span></div><div className="feature-grid">{fashionFeatures.map(feature=>{const active=selected.includes(feature.id),compatible=featureIsCompatible(feature.id,top,bottom);return <button key={feature.id} disabled={!compatible} className={`feature-card ${active?'selected':''} ${!compatible?'incompatible':''}`} onClick={()=>toggle(feature.id)}><span className="feature-icon">{feature.icon}</span><small>{feature.kind}</small><strong>{feature.name}</strong><p>{feature.description}</p><em>{compatible?feature.worksWith:'Not compatible with this outfit'}</em>{active&&<i>✓</i>}</button>})}</div><div className="feature-tray"><div><small>YOUR FEATURE TRAY</small><strong>{selected.length?selected.map(id=>fashionFeatures.find(f=>f.id===id)?.name).join(' • '):'Nothing added yet'}</strong></div>{selected.length>0&&<button onClick={()=>{setSelected([]);localStorage.setItem('peyton-selected-features','[]')}}>Clear</button>}</div><div className="feature-actions"><button className="reset-design" onClick={onBack}>← Back to Studio</button><button className="finish-design" onClick={onDesign}>Use in Design →</button></div></section></main>
}
