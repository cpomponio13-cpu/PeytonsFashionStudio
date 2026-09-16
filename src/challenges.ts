import type { KeriLook } from './keriAssets'

export type FashionChallenge={id:string;title:string;brief:string;icon:string;targetStyles:number[];targetFeatures:string[];bonus:string}
export type ChallengeScore={score:number;stars:number;matches:string[];message:string}

export const fashionChallenges:FashionChallenge[]=[
 {id:'free',title:'Create a Look You Love!',brief:'No rules for this one. Make something that feels completely you.',icon:'💖',targetStyles:[],targetFeatures:[],bonus:'Free Design'},
 {id:'party',title:'Party Sparkle',brief:'Create a fun party look with a bold colour and something that shines.',icon:'✨',targetStyles:[3,5],targetFeatures:['sequins'],bonus:'Berry or Pop + Sequins'},
 {id:'garden',title:'Garden Day',brief:'Design a fresh playful outfit inspired by flowers and the outdoors.',icon:'🌸',targetStyles:[6,2],targetFeatures:['floral-print'],bonus:'Fresh or Ocean + Floral Print'},
 {id:'street',title:'Street Style',brief:'Build a confident everyday look with strong details.',icon:'🕶️',targetStyles:[4,5],targetFeatures:['pockets','stripes'],bonus:'Midnight or Pop + Pockets/Stripes'},
 {id:'classic',title:'Classic With A Twist',brief:'Start polished, then add one detail that makes the look your own.',icon:'🎀',targetStyles:[1,3],targetFeatures:['contrast-trim','belt'],bonus:'Original or Berry + Trim/Belt'},
]

export function scoreChallenge(challenge:FashionChallenge,look:KeriLook,features:string[]):ChallengeScore{
 if(challenge.id==='free')return {score:100,stars:3,matches:['You designed it your way'],message:'A completely original Peyton design!'}
 let score=40
 const matches:string[]=[]
 const styleMatch=challenge.targetStyles.includes(look.topStyle)||challenge.targetStyles.includes(look.bottomStyle)
 if(styleMatch){score+=30;matches.push('Style matched the brief')}
 const featureMatches=features.filter(id=>challenge.targetFeatures.includes(id)).length
 if(featureMatches){score+=Math.min(30,featureMatches*20);matches.push(`${featureMatches} detail${featureMatches>1?'s':''} matched`)}
 if(features.length>=2){score+=5;matches.push('Layered design details')}
 score=Math.min(100,score)
 const stars=score>=85?3:score>=65?2:1
 const message=stars===3?'Challenge nailed! ✨':stars===2?'Great match — with your own twist!':'Original idea — try another take on the brief!'
 return {score,stars,matches,message}
}
