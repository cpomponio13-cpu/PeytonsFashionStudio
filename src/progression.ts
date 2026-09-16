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
