import { defaultKeriLook, keriLayers, type KeriLook } from './keriAssets'
import './KeriMannequin.css'

type Props={ look?:KeriLook; className?:string; portrait?:boolean }

export default function KeriMannequin({look=defaultKeriLook,className='',portrait=false}:Props){
  return <div className={`keri-model ${portrait?'keri-portrait':''} ${className}`} role="img" aria-label="Fashion model">
    {keriLayers(look).map((src,index)=><img key={src} className="keri-layer" src={src} alt="" aria-hidden={index!==0}/>) }
  </div>
}
