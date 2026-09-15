import { useState } from 'react'
import './ColourStation.css'

type Colour={name:string;hex:string}
const basics:Colour[]=[{name:'Red',hex:'#ef5350'},{name:'Yellow',hex:'#f5cf45'},{name:'Blue',hex:'#4385df'},{name:'Black',hex:'#35313b'},{name:'White',hex:'#fffdf8'}]
const recipes:Record<string,Colour>={
 'Red+Yellow':{name:'Orange',hex:'#f49a45'},'Blue+Yellow':{name:'Green',hex:'#58ad70'},'Blue+Red':{name:'Purple',hex:'#9162bb'},'Red+White':{name:'Pink',hex:'#f3a2bb'},'Blue+White':{name:'Light Blue',hex:'#9bc8ef'},'Black+White':{name:'Grey',hex:'#a8a5ad'},
}
const key=(a:string,b:string)=>[a,b].sort().join('+')
const read=():string[]=>{try{return JSON.parse(localStorage.getItem('peyton-colour-recipes')||'[]')}catch{return[]}}

export default function ColourStation({onBack,onRecipes}:{onBack:()=>void;onRecipes:()=>void}){
 const[first,setFirst]=useState<Colour|null>(null),[second,setSecond]=useState<Colour|null>(null),[result,setResult]=useState<Colour|null>(null),[discovered,setDiscovered]=useState<string[]>(read)
 const choose=(c:Colour)=>{setResult(null);if(!first)setFirst(c);else if(!second)setSecond(c);else{setFirst(c);setSecond(null)}}
 const mix=()=>{if(!first||!second)return;let found=recipes[key(first.name,second.name)];if(!found){if(first.name==='White')found={name:`Light ${second.name}`,hex:second.hex};else if(second.name==='White')found={name:`Light ${first.name}`,hex:first.hex};else if(first.name==='Black')found={name:`Deep ${second.name}`,hex:second.hex};else if(second.name==='Black')found={name:`Deep ${first.name}`,hex:first.hex};else found={name:`${first.name} + ${second.name}`,hex:'#b58aae'}}setResult(found);if(!discovered.includes(found.name)){const next=[...discovered,found.name];setDiscovered(next);localStorage.setItem('peyton-colour-recipes',JSON.stringify(next))}}
 const clear=()=>{setFirst(null);setSecond(null);setResult(null)}
 return <main className="app-shell"><header className="top-bar"><button className="home-button" onClick={onBack}>← Studio</button><div className="designer">Colour Lab</div><div className="star-count">🎨 {discovered.length}</div></header><section className="colour-page"><p className="eyebrow">COLOUR STATION</p><h1>Mix Something New</h1><p>Pick two colours, mix them together and discover a new colour for your Recipe Book.</p><div className="paint-shelf">{basics.map(c=><button key={c.name} onClick={()=>choose(c)} className="paint-pot"><span style={{background:c.hex}}/><strong>{c.name}</strong></button>)}</div><div className="mixing-bench"><div className="mix-slot">{first?<><span className="mix-swatch" style={{background:first.hex}}/><strong>{first.name}</strong></>:<em>Pick colour 1</em>}</div><b>+</b><div className="mix-slot">{second?<><span className="mix-swatch" style={{background:second.hex}}/><strong>{second.name}</strong></>:<em>Pick colour 2</em>}</div><b>=</b><div className={`mix-slot result-slot ${result?'revealed':''}`}>{result?<><span className="mix-swatch" style={{background:result.hex}}/><strong>{result.name}</strong><small>✨ Discovered!</small></>:<em>?</em>}</div></div><div className="colour-actions"><button className="reset-design" onClick={clear}>↻ Clear</button><button className="finish-design" disabled={!first||!second} onClick={mix}>🎨 Mix Colours</button></div><button className="recipe-link" onClick={onRecipes}>📖 Open Recipe Book · {discovered.length} discovered</button></section></main>
}
