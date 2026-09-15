import { defaultKeriLook, keriLayers, type KeriLook } from './keriAssets'
import './KeriMannequin.css'

type Props={ look?:KeriLook; className?:string; portrait?:boolean; features?:string[] }

export default function KeriMannequin({look=defaultKeriLook,className='',portrait=false,features=[]}:Props){
  const has=(id:string)=>features.includes(id)
  return <div className={`keri-model ${portrait?'keri-portrait':''} ${className}`} role="img" aria-label="Fashion model">
    {keriLayers(look).map((src,index)=><img key={src} className="keri-layer" src={src} alt="" aria-hidden={index!==0}/>) }
    {!portrait&&features.length>0&&<div className="fashion-feature-layer" aria-hidden="true">
      {has('contrast-trim')&&<><span className="feature-trim trim-neck"/><span className="feature-trim trim-hem"/></>}
      {has('pockets')&&<><span className="feature-pocket pocket-left"/><span className="feature-pocket pocket-right"/></>}
      {has('belt')&&<span className="feature-belt"><i/></span>}
      {has('stripes')&&<span className="feature-pattern feature-stripes"/>}
      {has('floral-print')&&<span className="feature-pattern feature-floral">✿　❀　✿<br/>　❀　✿<br/>✿　❀　✿</span>}
      {has('sequins')&&<span className="feature-pattern feature-sequins">✦ · ✧ · ✦<br/>· ✦ · ✧ ·<br/>✧ · ✦ · ✧</span>}
    </div>}
  </div>
}
