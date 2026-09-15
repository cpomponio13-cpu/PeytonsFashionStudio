type Recipe={name:string;formula:string;hex:string}
const recipes:Recipe[]=[
{name:'Orange',formula:'Red + Yellow',hex:'#f49a45'},
{name:'Green',formula:'Yellow + Blue',hex:'#58ad70'},
{name:'Purple',formula:'Blue + Red',hex:'#9162bb'},
{name:'Pink',formula:'Red + White',hex:'#f3a2bb'},
{name:'Light Blue',formula:'Blue + White',hex:'#9bc8ef'},
{name:'Grey',formula:'Black + White',hex:'#a8a5ad'},
]
const read=():string[]=>{try{return JSON.parse(localStorage.getItem('peyton-colour-recipes')||'[]')}catch{return[]}}
export default function RecipeBook({onBack,onMix}:{onBack:()=>void;onMix:()=>void}){
 const discovered=read()
 return <main className="app-shell"><header className="top-bar"><button className="home-button" onClick={onBack}>← Studio</button><div className="designer">Recipe Book</div><div className="star-count">📖 {discovered.length}/{recipes.length}</div></header><section className="recipe-page"><p className="eyebrow">MY COLOUR RECIPES</p><h1>Recipe Book</h1><p>Every colour Peyton discovers in the Colour Station is remembered here.</p><div className="recipe-grid">{recipes.map(r=>{const found=discovered.includes(r.name);return <article className={`recipe-card ${found?'recipe-found':'recipe-hidden'}`} key={r.name}>{found?<><span className="recipe-swatch" style={{background:r.hex}}/><div><small>DISCOVERED</small><strong>{r.name}</strong><p>{r.formula}</p></div><b>✓</b></>:<><span className="mystery-swatch">?</span><div><small>UNDISCOVERED</small><strong>Mystery Colour</strong><p>Try mixing two basic colours</p></div><b>🔒</b></>}</article>})}</div><div className="recipe-progress"><strong>{discovered.length} colours discovered</strong><div><span style={{width:`${Math.min(100,discovered.length/recipes.length*100)}%`}}/></div></div><button className="finish-design" onClick={onMix}>🎨 Discover More Colours</button></section></main>
}
