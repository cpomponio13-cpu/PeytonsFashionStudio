import type { KeriLook } from './keriAssets'

export type FashionChallenge={
 id:string
 title:string
 brief:string
 icon:string
 targetStyles:number[]
 targetFeatures:string[]
 targetTops:number[]
 targetBottoms:number[]
 bonus:string
}
export type ChallengeScore={score:number;stars:number;matches:string[];message:string}

// Every scored challenge deliberately has a valid path using starter clothing and
// starter features. Progression rewards add more ways to interpret a brief; they
// never become requirements for earning a strong challenge result.
export const fashionChallenges:FashionChallenge[]=[
 {id:'free',title:'Create a Look You Love!',brief:'No rules for this one. Make something that feels completely you.',icon:'💖',targetStyles:[],targetFeatures:[],targetTops:[],targetBottoms:[],bonus:'Free Design'},
 {id:'party',title:'Party Sparkle',brief:'Create a fun party look. Think bold colour, a dressier shape and one detail that catches the light.',icon:'✨',targetStyles:[3,5],targetFeatures:['sequins','metallic-detail'],targetTops:[2,3,5,8],targetBottoms:[3],bonus:'Bold colour • dressy shape • sparkle'},
 {id:'garden',title:'Garden Day',brief:'Design a fresh playful outfit for a day outdoors. Think light colour, an easy shape and a nature-inspired detail.',icon:'🌸',targetStyles:[6,2],targetFeatures:['floral-print','embroidery'],targetTops:[1,2,3,6,8],targetBottoms:[2,3],bonus:'Fresh colour • relaxed shape • nature detail'},
 {id:'street',title:'Street Style',brief:'Build a confident everyday look. Mix a strong colour with practical clothing and a graphic or useful detail.',icon:'🕶️',targetStyles:[4,5],targetFeatures:['pockets','stripes','colour-blocking'],targetTops:[1,4,5,7,8],targetBottoms:[1,2],bonus:'Strong colour • everyday shape • graphic detail'},
 {id:'classic',title:'Classic With A Twist',brief:'Create a polished outfit, then give it one unexpected detail. Think clean colour, neat shapes and a finishing touch.',icon:'🎀',targetStyles:[1,3],targetFeatures:['contrast-trim','belt','lace','ruffles'],targetTops:[2,3,5,9],targetBottoms:[1,3],bonus:'Polished colour • neat shape • special detail'},
]

export function scoreChallenge(challenge:FashionChallenge,look:KeriLook,features:string[]):ChallengeScore{
 if(challenge.id==='free')return {score:100,stars:3,matches:['You designed it your way'],message:'A completely original Peyton design!'}
 let score=25
 const matches:string[]=[]
 const topStyleMatch=challenge.targetStyles.includes(look.topStyle)
 const bottomStyleMatch=challenge.targetStyles.includes(look.bottomStyle)
 if(topStyleMatch||bottomStyleMatch){score+=20;matches.push('Colour/style suited the brief')}
 if(topStyleMatch&&bottomStyleMatch){score+=10;matches.push('Colour story worked across the outfit')}
 const clothingMatch=challenge.targetTops.includes(look.top)||challenge.targetBottoms.includes(look.bottom)
 if(clothingMatch){score+=20;matches.push('Clothing shape suited the occasion')}
 const featureMatches=features.filter(id=>challenge.targetFeatures.includes(id)).length
 if(featureMatches){score+=20;matches.push('A detail interpreted the brief')}
 if(featureMatches>1){score+=5;matches.push('Extra brief detail added')}
 if(features.length>=2){score+=5;matches.push('Design was thoughtfully layered')}
 score=Math.min(100,score)
 const stars=score>=85?3:score>=60?2:1
 const message=stars===3?'Brilliant interpretation of the brief! ✨':stars===2?'Strong interpretation — with your own creative twist!':'A creative direction — try another interpretation of the brief!'
 return {score,stars,matches,message}
}
