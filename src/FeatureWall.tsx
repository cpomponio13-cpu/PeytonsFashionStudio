import { useState } from 'react'
import './FeatureWall.css'
import { featureRewards,getProgression,meetsUnlock,unlockLabel,type ProgressSavedLook,type UnlockRule } from './progression'

export type FashionFeature={id:string;name:string;icon:string;kind:'Construction'|'Surface';description:string;worksWith:string;rule:UnlockRule}
const starter:UnlockRule={kind:'starter'}
const rewardRule=(id:string)=>featureRewards.find(x=>x.id===id)!.rule
export const fashionFeatures:FashionFeature[]=[
 {id:'contrast-trim',name:'Contrast Trim',icon:'〰️',kind:'Construction',description:'Add a second-colour edge or trim.',worksWith:'Great for tops, hems and edges',rule:starter},
 {id:'pockets',name:'Pockets',icon:'▣',kind:'Construction',description:'Add useful statement pockets.',worksWith:'Great on jeans, shorts and skirts',rule:starter},
 {id:'belt',name:'Belt',icon:'➖',kind:'Construction',description:'Define the waist with a belt.',worksWith:'Great for a strong waist detail',rule:starter},
 {id:'stripes',name:'Stripes',icon:'▥',kind:'Surface',description:'Give the fabric a striped pattern.',worksWith:'Great across simple fabric shapes',rule:starter},
 {id:'floral-print',name:'Floral Print',icon:'🌸',kind:'Surface',description:'Cover the fabric with playful flowers.',worksWith:'Great when you want a playful print',rule:starter},
 {id:'sequins',name:'Sequins',icon:'✨',kind:'Surface',description:'Add sparkle and shine.',worksWith:'Great for glamorous statement pieces',rule:starter},
 {id:'polka-dots',name:'Polka Dots',icon:'●',kind:'Surface',description:'Add a playful dotted print.',worksWith:'Fun on tops and statement pieces',rule:rewardRule('polka-dots')},
 {id:'lace',name:'Lace',icon:'◇',kind:'Surface',description:'Add a delicate lace finish.',worksWith:'Lovely around edges and necklines',rule:rewardRule('lace')},
 {id:'ruffles',name:'Ruffles',icon:'〰',kind:'Construction',description:'Add soft layered ruffle detail.',worksWith:'Great on hems and sleeves',rule:rewardRule('ruffles')},
 {id:'embroidery',name:'Embroidery',icon:'✿',kind:'Surface',description:'Add stitched decorative detail.',worksWith:'A special detail for simple fabrics',rule:rewardRule('embroidery')},
 {id:'metallic-detail',name:'Metallic Detail',icon:'✦',kind:'Surface',description:'Add a polished metallic accent.',worksWith:'Great for bold finishing touches',rule:rewardRule('metallic-detail')},
 {id:'colour-blocking',name:'Colour Blocking',icon:'◩',kind:'Surface',description:'Split the outfit into bold colour sections.',worksWith:'Great for graphic modern looks',rule:rewardRule('colour-blocking')},
]

export const featureIsCompatible=(id:string,top:number,bottom:number)=>{
 if(id==='pockets')return [1,2].includes(bottom)
 if(id==='belt')return [1,3].includes(bottom)
 if(id==='stripes')return top!==1
 if(id==='contrast-trim')return [2,3,5].includes(top)
 return true
}
const readGallery=():ProgressSavedLook[]=>{try{return JSON.parse(localStorage.getItem('peyton-fashion-gallery')||'[]')}catch{return[]}}

type Props={onBack:()=>void;onDesign:()=>void;top?:number;bottom?:number}
export default function FeatureWall({onBack,onDesign,top=1,bottom=1}:Props){
 const progress=getProgression(readGallery())
 const[selected,setSelected]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('peyton-selected-features')||'[]')}catch{return[]}})
 const toggle=(feature:FashionFeature)=>{if(!meetsUnlock(feature.rule,progress))return;const id=feature.id,next=selected.includes(id)?selected.filter(x=>x!==id):selected.length<3?[...selected,id]:selected;setSelected(next);localStorage.setItem('peyton-selected-features',JSON.stringify(next))}
 return <main className="app-shell"><header className="top-bar"><button className="home-button" onClick={onBack}>← Studio</button><div className="designer">Feature Wall</div><div className="star-count">✨ {selected.length}/3</div></header><section className="feature-page"><p className="eyebrow">FEATURE WALL</p><h1>Add Your Signature</h1><p>Choose up to three details for your next design. Challenge achievements unlock even more creative tools.</p><div className="feature-counter"><strong>{selected.length}/3 selected</strong><span>{selected.length===3?'Your feature tray is full ✨':'Tap any unlocked card to add it to your feature tray.'}</span></div><div className="feature-grid">{fashionFeatures.map(feature=>{const active=selected.includes(feature.id),natural=featureIsCompatible(feature.id,top,bottom),isUnlocked=meetsUnlock(feature.rule,progress);return <button key={feature.id} className={`feature-card ${active?'selected':''} ${!isUnlocked?'feature-locked':''}`} onClick={()=>toggle(feature)} disabled={!isUnlocked}><span className="feature-icon">{isUnlocked?feature.icon:'🔒'}</span><small>{feature.kind}</small><strong>{feature.name}</strong><p>{feature.description}</p><em>{isUnlocked?(natural?`✓ ${feature.worksWith}`:`💡 ${feature.worksWith}`):unlockLabel(feature.rule)}</em>{active&&<i>✓</i>}</button>})}</div><div className="feature-tray"><div><small>YOUR FEATURE TRAY</small><strong>{selected.length?selected.map(id=>fashionFeatures.find(f=>f.id===id)?.name).join(' • '):'Nothing added yet'}</strong></div>{selected.length>0&&<button onClick={()=>{setSelected([]);localStorage.setItem('peyton-selected-features','[]')}}>Clear</button>}</div><div className="feature-actions"><button className="reset-design" onClick={onBack}>← Back to Studio</button><button className="finish-design" onClick={onDesign}>Use in Design →</button></div></section></main>
}
