import './KeriMannequin.css'

export type GlamLook = {
  skin:number
  hairStyle:number
  hairColour:number
  eyes:number
  eyeColour:number
  top:number
  topStyle:number
  topSet:number
  bottom:number
  bottomStyle:number
  bottomSet:number
  dress:number
  dressStyle:number
  jacket:number
  jacketStyle:number
  jacketSet:number
  shoes:number
  shoesStyle:number
  shoesSet:number
  necklace:number
  necklaceSet:number
  earrings:number
  earringsSet:number
  bracelet:number
}

export const defaultGlamLook:GlamLook={
  skin:1,hairStyle:1,hairColour:1,eyes:1,eyeColour:1,
  top:1,topStyle:1,topSet:1,bottom:1,bottomStyle:1,bottomSet:1,dress:0,dressStyle:1,
  jacket:0,jacketStyle:1,jacketSet:1,shoes:1,shoesStyle:1,shoesSet:1,necklace:0,necklaceSet:1,earrings:0,earringsSet:1,bracelet:0
}

const asset=(src:string)=>`${import.meta.env.BASE_URL}${src.replace(/^\//,'')}`

const hairLayers=(style:number)=>style===4
 ? {back:asset('/glamgirl/hair/hair-4_1_back.png'),front:asset('/glamgirl/hair/hair-4_1_front.png')}
 : {front:asset(`/glamgirl/hair/hair-${Math.max(1,Math.min(9,style))}_1.png`)}

const bottomAsset=(id:number,set=1,style=1)=>{
 if(set===2){
  if(id===101)return asset(`/glamgirl/everyday-casual/trousers-2_${style}.png`)
  if(id===102)return asset(`/glamgirl/everyday-casual/shorts-1_${style}.png`)
  if(id===103)return asset(`/glamgirl/everyday-casual/leggings-1_${style}.png`)
 }
 if(id<=2)return asset(`/glamgirl/trousers/trousers-${id}_1.png`)
 if(id===3)return asset('/glamgirl/skirts/skirt-1_1.png')
 if(id===4)return asset('/glamgirl/shorts/shorts-1_1.png')
 if(id===5)return asset('/glamgirl/skirts/skirt-2_1.png')
 if(id===6)return asset('/glamgirl/leggings/leggings-1_1.png')
 if(id===7)return asset('/glamgirl/trousers/trousers-3_1.png')
 return asset('/glamgirl/trousers/trousers-1_1.png')
}

const topAsset=(id:number,set=1,style=1)=>set===3
 ? asset('/glamgirl/custom-casual/tshirt-white.svg')
 : set===2
  ? asset(`/glamgirl/everyday-casual/top-${id}_${style}.png`)
  : asset(`/glamgirl/tops/top-${Math.max(1,Math.min(6,id))}_1.png`)

const partyDressStyles:Record<number,number[]>={4:[2,5,8],5:[3,7,12]}
const dinnerDressStyles:Record<number,number[]>={6:[6,10],7:[8,14]}
const partyShoeStyles:Record<number,number[]>={2:[4,8],4:[3,10]}
const dinnerShoeStyles:Record<number,number[]>={6:[1,6,17]}
const dinnerJacketStyles:Record<number,number[]>={3:[3,4]}

const variantAsset=(kind:'dress'|'shoes',id:number,style:number)=>{
 const dinnerAllowed=kind==='dress'?dinnerDressStyles[id]:dinnerShoeStyles[id]
 if(dinnerAllowed?.includes(style))return asset(`/glamgirl/dinner-out/${kind}-${id}_${style}.png`)
 const partyAllowed=kind==='dress'?partyDressStyles[id]:partyShoeStyles[id]
 return partyAllowed?.includes(style)
  ? asset(`/glamgirl/party-time/${kind}-${id}_${style}.png`)
  : kind==='dress'
   ? asset(`/glamgirl/dresses/dress-${id}_1.png`)
   : asset(`/glamgirl/shoes/shoes-${id}_1.png`)
}

const glamLayers=(look:GlamLook)=>{
 const dress=look.dress>0?variantAsset('dress',Math.max(1,Math.min(7,look.dress)),look.dressStyle||1):undefined
 const jacketId=Math.max(1,Math.min(6,look.jacket))
 const jacketStyle=look.jacketStyle||1
 const jacket=look.jacket>0
  ? look.jacketSet===2
   ? asset(`/glamgirl/everyday-casual/jacket-${jacketId}_${jacketStyle}.png`)
   : dinnerJacketStyles[jacketId]?.includes(jacketStyle)
    ? asset(`/glamgirl/dinner-out/jacket-${jacketId}_${jacketStyle}.png`)
    : asset(`/glamgirl/jackets/jacket-${jacketId}_1.png`)
  : undefined
 const shoes=look.shoesSet===2
  ? asset(`/glamgirl/everyday-casual/shoes-${Math.max(1,Math.min(6,look.shoes||1))}_${look.shoesStyle||1}.png`)
  : variantAsset('shoes',Math.max(1,Math.min(6,look.shoes||1)),look.shoesStyle||1)
 const hair=hairLayers(look.hairStyle)
 return [
  hair.back,
  asset('/glamgirl/body/body-1_1.png'),
  asset('/glamgirl/face/eyes-1_1_back.png'),
  asset('/glamgirl/face/irises-1_1.png'),
  asset('/glamgirl/face/eyes-1_1_front.png'),
  asset('/glamgirl/face/eyebrows-1_1.png'),
  asset('/glamgirl/face/cheeks-1_1.png'),
  asset('/glamgirl/face/lips-1_1.png'),
  dress?undefined:bottomAsset(look.bottom,look.bottomSet||1,look.bottomStyle||1),
  dress?undefined:topAsset(look.top,look.topSet||1,look.topStyle||1),
  dress,
  jacket,
  shoes,
  look.necklace>0?asset(`/glamgirl/${look.necklaceSet===2?'dinner-out':'party-time'}/necklace-${look.necklaceSet||1}_${look.necklace}.png`):undefined,
  look.bracelet>0?asset(`/glamgirl/party-time/bracelet-1_${look.bracelet}.png`):undefined,
  look.earrings>0?asset(`/glamgirl/${look.earringsSet===2?'dinner-out':'party-time'}/earrings-${look.earringsSet||1}_${look.earrings}.png`):undefined,
  hair.front,
 ].filter(Boolean) as string[]
}

type Props={ look?:GlamLook; className?:string; portrait?:boolean; features?:string[] }

export default function KeriMannequin({look=defaultGlamLook,className='',portrait=false}:Props){
 return <div className={`keri-model glam-model ${portrait?'keri-portrait':''} ${className}`} role="img" aria-label="Fashion model">
  {glamLayers(look).map((src,index)=><img key={`${src}-${index}`} className="keri-layer glam-layer" src={src} alt="" aria-hidden={index!==1}/>)}
 </div>
}
