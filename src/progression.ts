export type ProgressSavedLook={challengeId?:string;challengeStars?:number;challengeScore?:number}

export type ProgressionSnapshot={
 completedChallenges:number
 totalBestStars:number
 threeStarChallenges:number
}

export type UnlockRule=
 | {kind:'starter'}
 | {kind:'completed';count:number}
 | {kind:'stars';count:number}
 | {kind:'threeStar';count:number}

export type WardrobeUnlock={
 category:'top'|'bottom'
 id:number
 name:string
 rule:UnlockRule
}

// Core wardrobe progression. Free Design stays completely open and creative;
// challenge achievements unlock extra wardrobe pieces.
export const wardrobeUnlocks:WardrobeUnlock[]=[
 {category:'top',id:1,name:'Striped Tee',rule:{kind:'starter'}},
 {category:'top',id:2,name:'Bow Tunic',rule:{kind:'starter'}},
 {category:'bottom',id:1,name:'Skinny Jeans',rule:{kind:'starter'}},
 {category:'bottom',id:2,name:'Denim Shorts',rule:{kind:'starter'}},
 {category:'top',id:3,name:'Sweetheart Top',rule:{kind:'completed',count:1}},
 {category:'bottom',id:3,name:'Pleated Skirt',rule:{kind:'stars',count:4}},
 {category:'top',id:4,name:'Layered Tee',rule:{kind:'completed',count:3}},
 {category:'top',id:5,name:'Classic Top',rule:{kind:'threeStar',count:2}},
]

export function getProgression(gallery:ProgressSavedLook[]):ProgressionSnapshot{
 const best:Record<string,number>={}
 for(const item of gallery){
  if(!item.challengeId||item.challengeId==='free'||item.challengeStars==null)continue
  best[item.challengeId]=Math.max(best[item.challengeId]??0,item.challengeStars)
 }
 const stars=Object.values(best)
 return {
  completedChallenges:stars.length,
  totalBestStars:stars.reduce((sum,value)=>sum+value,0),
  threeStarChallenges:stars.filter(value=>value===3).length,
 }
}

export function meetsUnlock(rule:UnlockRule,progress:ProgressionSnapshot){
 if(rule.kind==='starter')return true
 if(rule.kind==='completed')return progress.completedChallenges>=rule.count
 if(rule.kind==='stars')return progress.totalBestStars>=rule.count
 return progress.threeStarChallenges>=rule.count
}

export function unlockLabel(rule:UnlockRule){
 if(rule.kind==='starter')return 'Starter wardrobe'
 if(rule.kind==='completed')return `Complete ${rule.count} ${rule.count===1?'challenge':'challenges'}`
 if(rule.kind==='stars')return `Earn ${rule.count} challenge stars`
 return `Earn 3 stars on ${rule.count} ${rule.count===1?'challenge':'challenges'}`
}

export function wardrobeRule(category:'top'|'bottom',id:number):UnlockRule{
 return wardrobeUnlocks.find(item=>item.category===category&&item.id===id)?.rule??{kind:'starter'}
}
