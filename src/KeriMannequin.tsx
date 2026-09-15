import { defaultKeriLook, keriLayers, type KeriLook } from './keriAssets'

type Props={ look?:KeriLook; className?:string }

export default function KeriMannequin({look=defaultKeriLook,className=''}:Props){
  return <div className={`keri-model ${className}`} role="img" aria-label="Fashion model">
    {keriLayers(look).map((src,index)=><img key={src} className="keri-layer" src={src} alt="" aria-hidden={index!==0}/>) }
  </div>
}
