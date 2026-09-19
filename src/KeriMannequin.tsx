import './KeriMannequin.css'

export type GlamLook = {
  skin:number
  hairStyle:number
  hairColour:number
  eyes:number
  eyeColour:number
  top:number
  topStyle:number
  bottom:number
  bottomStyle:number
  dress:number
  jacket:number
  shoes:number
}

export const defaultGlamLook:GlamLook={
  skin:1,hairStyle:1,hairColour:1,eyes:1,eyeColour:1,
  top:1,topStyle:1,bottom:1,bottomStyle:1,dress:0,jacket:0,shoes:1
}

const layer=(src:string)=>src

const hairLayers=(style:number)=>style===4
 ? {back:layer('/glamgirl/hair/hair-4_1_back.png'),front:layer('/glamgirl/hair/hair-4_1_front.png')}
 : {front:layer(`/glamgirl/hair/hair-${Math.max(1,Math.min(9,style))}_1.png`)}

const bottomAsset=(id:number)=>{
 if(id<=2)return `/glamgirl/trousers/trousers-${id}_1.png`
 if(id===3)return '/glamgirl/skirts/skirt-1_1.png'
 if(id===4)return '/glamgirl/shorts/shorts-1_1.png'
 if(id===5)return '/glamgirl/skirts/skirt-2_1.png'
 if(id===6)return '/glamgirl/leggings/leggings-1_1.png'
 if(id===7)return '/glamgirl/trousers/trousers-3_1.png'
 return '/glamgirl/trousers/trousers-1_1.png'
}

const topAsset=(id:number)=>`/glamgirl/tops/top-${Math.max(1,Math.min(6,id))}_1.png`

const glamLayers=(look:GlamLook)=>{
 const dress=look.dress>0?`/glamgirl/dresses/dress-${Math.max(1,Math.min(7,look.dress))}_1.png`:undefined
 const jacket=look.jacket>0?`/glamgirl/jackets/jacket-${Math.max(1,Math.min(6,look.jacket))}_1.png`:undefined
 const shoes=`/glamgirl/shoes/shoes-${Math.max(1,Math.min(6,look.shoes||1))}_1.png`
 const hair=hairLayers(look.hairStyle)
 return [
  hair.back,
  '/glamgirl/body/body-1_1.png',
  '/glamgirl/face/eyes-1_1_back.png',
  '/glamgirl/face/irises-1_1.png',
  '/glamgirl/face/eyes-1_1_front.png',
  '/glamgirl/face/eyebrows-1_1.png',
  '/glamgirl/face/cheeks-1_1.png',
  '/glamgirl/face/lips-1_1.png',
  dress?undefined:bottomAsset(look.bottom),
  dress?undefined:topAsset(look.top),
  dress,
  jacket,
  shoes,
  hair.front,
 ].filter(Boolean) as string[]
}

type Props={ look?:GlamLook; className?:string; portrait?:boolean; features?:string[] }

export default function KeriMannequin({look=defaultGlamLook,className='',portrait=false}:Props){
 return <div className={`keri-model glam-model ${portrait?'keri-portrait':''} ${className}`} role="img" aria-label="Fashion model">
  {glamLayers(look).map((src,index)=><img key={`${src}-${index}`} className="keri-layer glam-layer" src={src} alt="" aria-hidden={index!==1}/>)}
 </div>
}
