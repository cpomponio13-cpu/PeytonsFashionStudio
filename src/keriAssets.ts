const ROOT = 'https://raw.githubusercontent.com/lunalucid/Keri-Dressup-RenPy-Template/master/game/Create_Character'

export type KeriLook = { skin:number; hairStyle:number; hairColour:number; eyes:number; eyeColour:number; top:number; topStyle:number; bottom:number; bottomStyle:number }
export const defaultKeriLook: KeriLook = { skin:1, hairStyle:1, hairColour:1, eyes:1, eyeColour:1, top:1, topStyle:1, bottom:1, bottomStyle:1 }

const LOCAL_TOPS:Record<number,string[]> = {
  6: [
    '/clothing/tops/top6_1_long_sleeve.png',
    '/clothing/tops/top6_2_lilac.png',
    '/clothing/tops/top6_3_pink.png',
    '/clothing/tops/top6_4_mint.png',
    '/clothing/tops/top6_5_sky.png',
    '/clothing/tops/top6_6_cream.png',
  ],
  7: [
    '/clothing/outerwear/hoodies/top7_1_hoodie_lavender.png',
    '/clothing/outerwear/hoodies/top7_2_hoodie_pink.png',
    '/clothing/outerwear/hoodies/top7_3_hoodie_mint.png',
    '/clothing/outerwear/hoodies/top7_4_hoodie_sky.png',
    '/clothing/outerwear/hoodies/top7_5_hoodie_cream.png',
    '/clothing/outerwear/hoodies/top7_6_hoodie_charcoal.png',
  ],
  8: [
    '/clothing/tops/top8_1_cropped_top.png',
    '/clothing/tops/top8_2_cropped_top_lilac.png',
    '/clothing/tops/top8_3_cropped_top_pink.png',
    '/clothing/tops/top8_4_cropped_top_mint.png',
    '/clothing/tops/top8_5_cropped_top_sky.png',
    '/clothing/tops/top8_6_cropped_top_black.png',
  ],
  9: [
    '/clothing/tops/top9_1_blouse_white.png',
    '/clothing/tops/top9_2_blouse_lilac.png',
    '/clothing/tops/top9_3_blouse_pink.png',
    '/clothing/tops/top9_4_blouse_mint.png',
    '/clothing/tops/top9_5_blouse_sky.png',
    '/clothing/tops/top9_6_blouse_black.png',
  ],
  10: [
    '/clothing/outerwear/jackets/jackets_leather/asymmetrical_black_leather_biker_jacket.png',
    '/clothing/outerwear/jackets/jackets_leather/maroon_cropped_leather_biker_jacket.png',
    '/clothing/outerwear/jackets/jackets_leather/cream_beige_asymmetrical_biker_jacket.png',
    '/clothing/outerwear/jackets/jackets_leather/pink_asymmetrical_moto_jacket_asset.png',
    '/clothing/outerwear/jackets/jackets_leather/navy_asymmetric_leather_biker_jacket.png',
    '/clothing/outerwear/jackets/jackets_leather/asymmetrical_black_leather_biker_jacket.png',
  ],
  11: [
    '/clothing/outerwear/cardigan/pink_cardigan.png',
    '/clothing/outerwear/cardigan/pink_cardigan.png',
    '/clothing/outerwear/cardigan/pink_cardigan.png',
    '/clothing/outerwear/cardigan/pink_cardigan.png',
    '/clothing/outerwear/cardigan/pink_cardigan.png',
    '/clothing/outerwear/cardigan/pink_cardigan.png',
  ],
}

export const topAsset=(top:number,style:number)=>{
  const local=LOCAL_TOPS[top]
  if(local)return local[Math.max(0,Math.min(local.length-1,style-1))]
  return `${ROOT}/Tops/top${top}_${style}.png`
}

const LOCAL_BOTTOMS:Record<number,string[]> = {
  4: Array(6).fill('/clothing/bottoms/shorts/denim_shorts.png'),
  5: Array(6).fill('/clothing/bottoms/skirt/pleated_skirt.png'),
  6: Array(6).fill('/clothing/bottoms/leggings/black_leggings.png'),
  7: Array(6).fill('/clothing/bottoms/trousers/palazzo_trousers.png'),
}

export const bottomAsset=(bottom:number,style:number)=>{
  const local=LOCAL_BOTTOMS[bottom]
  if(local)return local[Math.max(0,Math.min(local.length-1,style-1))]
  return `${ROOT}/Bottoms/bottom${bottom}_${style}.png`
}

export const keriLayers=(k:KeriLook)=>[
 `${ROOT}/Base/base${k.skin}.png`,
 bottomAsset(k.bottom,k.bottomStyle),
 topAsset(k.top,k.topStyle),
 `${ROOT}/Eyebrows/eyebrows${k.skin}_1.png`,
 `${ROOT}/Eyes/eyes${k.eyes}_${k.eyeColour}.png`,
 `${ROOT}/Mouth/mouth${k.skin}_1.png`,
 `${ROOT}/Hair/hair${k.hairStyle}_${k.hairColour}.png`,
]
