const ROOT = 'https://raw.githubusercontent.com/lunalucid/Keri-Dressup-RenPy-Template/master/game/Create_Character'

export type KeriLook = { skin:number; hairStyle:number; hairColour:number; eyes:number; eyeColour:number; top:number; topStyle:number; bottom:number; bottomStyle:number }
export const defaultKeriLook: KeriLook = { skin:1, hairStyle:1, hairColour:1, eyes:1, eyeColour:1, top:1, topStyle:1, bottom:1, bottomStyle:1 }
export const keriLayers=(k:KeriLook)=>[
 `${ROOT}/Base/base${k.skin}.png`,
 `${ROOT}/Bottoms/bottom${k.bottom}_${k.bottomStyle}.png`,
 `${ROOT}/Tops/top${k.top}_${k.topStyle}.png`,
 `${ROOT}/Eyebrows/eyebrows${k.skin}_1.png`,
 `${ROOT}/Eyes/eyes${k.eyes}_${k.eyeColour}.png`,
 `${ROOT}/Mouth/mouth${k.skin}_1.png`,
 `${ROOT}/Hair/hair${k.hairStyle}_${k.hairColour}.png`,
]
