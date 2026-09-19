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

export type WardrobeCategory='top'|'bottom'|'dress'|'jacket'|'shoes'
export type WardrobeUnlock={category:WardrobeCategory;id:number;name:string;rule:UnlockRule}
export type ColourReward={id:string;name:string;hex:string;rule:UnlockRule}
export type FeatureReward={id:string;name:string;rule:UnlockRule}
export type StudioReward={name:string;icon:string;rule:UnlockRule}

export const wardrobeUnlocks:WardrobeUnlock[]=[
 {category:'top',id:1,name:'Top 1',rule:{kind:'starter'}},
 {category:'top',id:2,name:'Top 2',rule:{kind:'starter'}},
 {category:'top',id:3,name:'Top 3',rule:{kind:'completed',count:1}},
 {category:'top',id:4,name:'Top 4',rule:{kind:'stars',count:3}},
 {category:'top',id:5,name:'Top 5',rule:{kind:'completed',count:2}},
 {category:'top',id:6,name:'Top 6',rule:{kind:'threeStar',count:1}},
 {category:'bottom',id:1,name:'Trousers 1',rule:{kind:'starter'}},
 {category:'bottom',id:2,name:'Trousers 2',rule:{kind:'starter'}},
 {category:'bottom',id:3,name:'Skirt 1',rule:{kind:'completed',count:1}},
 {category:'bottom',id:4,name:'Shorts 1',rule:{kind:'starter'}},
 {category:'bottom',id:5,name:'Skirt 2',rule:{kind:'stars',count:4}},
 {category:'bottom',id:6,name:'Leggings 1',rule:{kind:'completed',count:2}},
 {category:'bottom',id:7,name:'Trousers 3',rule:{kind:'threeStar',count:1}},
 {category:'dress',id:1,name:'Dress 1',rule:{kind:'starter'}},
 {category:'dress',id:2,name:'Dress 2',rule:{kind:'completed',count:1}},
 {category:'dress',id:3,name:'Dress 3',rule:{kind:'stars',count:3}},
 {category:'dress',id:4,name:'Dress 4',rule:{kind:'completed',count:2}},
 {category:'dress',id:5,name:'Dress 5',rule:{kind:'stars',count:6}},
 {category:'dress',id:6,name:'Dress 6',rule:{kind:'threeStar',count:1}},
 {category:'dress',id:7,name:'Dress 7',rule:{kind:'stars',count:9}},
 {category:'jacket',id:1,name:'Jacket 1',rule:{kind:'starter'}},
 {category:'jacket',id:2,name:'Jacket 2',rule:{kind:'completed',count:1}},
 {category:'jacket',id:3,name:'Jacket 3',rule:{kind:'stars',count:4}},
 {category:'jacket',id:4,name:'Jacket 4',rule:{kind:'completed',count:2}},
 {category:'jacket',id:5,name:'Jacket 5',rule:{kind:'stars',count:7}},
 {category:'jacket',id:6,name:'Jacket 6',rule:{kind:'threeStar',count:1}},
 {category:'shoes',id:1,name:'Shoes 1',rule:{kind:'starter'}},
 {category:'shoes',id:2,name:'Shoes 2',rule:{kind:'starter'}},
 {category:'shoes',id:3,name:'Shoes 3',rule:{kind:'completed',count:1}},
 {category:'shoes',id:4,name:'Shoes 4',rule:{kind:'stars',count:4}},
 {category:'shoes',id:5,name:'Shoes 5',rule:{kind:'completed',count:2}},
 {category:'shoes',id:6,name:'Shoes 6',rule:{kind:'threeStar',count:1}},
]

// The five basic paint colours always stay open.
export const colourRewards:ColourReward[]=[
 {id:'metallic-gold',name:'Metallic Gold',hex:'#d7ae4b',rule:{kind:'stars',count:3}},
 {id:'neon-pink',name:'Neon Pink',hex:'#ff4fa3',rule:{kind:'threeStar',count:1}},
 {id:'silver',name:'Silver',hex:'#b9bec8',rule:{kind:'stars',count:6}},
 {id:'rose-gold',name:'Rose Gold',hex:'#d99a91',rule:{kind:'stars',count:9}},
 {id:'holographic',name:'Holographic',hex:'#b9a7e8',rule:{kind:'threeStar',count:2}},
]

// The original six details are starter tools. These are extra creative rewards.
export const featureRewards:FeatureReward[]=[
 {id:'polka-dots',name:'Polka Dots',rule:{kind:'completed',count:1}},
 {id:'lace',name:'Lace',rule:{kind:'stars',count:3}},
 {id:'ruffles',name:'Ruffles',rule:{kind:'completed',count:2}},
 {id:'embroidery',name:'Embroidery',rule:{kind:'stars',count:6}},
 {id:'metallic-detail',name:'Metallic Detail',rule:{kind:'threeStar',count:1}},
 {id:'colour-blocking',name:'Colour Blocking',rule:{kind:'stars',count:9}},
]

export function getProgression(gallery:ProgressSavedLook[]):ProgressionSnapshot{
 const best:Record<string,number>={}
 for(const item of gallery){
  if(!item.challengeId||item.challengeId==='free'||item.challengeStars==null)continue
  best[item.challengeId]=Math.max(best[item.challengeId]??0,item.challengeStars)
 }
 const stars=Object.values(best)
 return {completedChallenges:stars.length,totalBestStars:stars.reduce((sum,value)=>sum+value,0),threeStarChallenges:stars.filter(value=>value===3).length}
}

export function meetsUnlock(rule:UnlockRule,progress:ProgressionSnapshot){
 if(rule.kind==='starter')return true
 if(rule.kind==='completed')return progress.completedChallenges>=rule.count
 if(rule.kind==='stars')return progress.totalBestStars>=rule.count
 return progress.threeStarChallenges>=rule.count
}

export function unlockLabel(rule:UnlockRule){
 if(rule.kind==='starter')return 'Starter studio item'
 if(rule.kind==='completed')return `Complete ${rule.count} ${rule.count===1?'challenge':'challenges'}`
 if(rule.kind==='stars')return `Earn ${rule.count} challenge stars`
 return `Earn 3 stars on ${rule.count} ${rule.count===1?'challenge':'challenges'}`
}

function rewardDistance(rule:UnlockRule,progress:ProgressionSnapshot){
 if(rule.kind==='starter')return 0
 const current=rule.kind==='completed'
  ? progress.completedChallenges
  : rule.kind==='stars'
   ? progress.totalBestStars
   : progress.threeStarChallenges
 return Math.max(0,(rule.count-current)/rule.count)
}

export function nearestLockedReward(rewards:StudioReward[],progress:ProgressionSnapshot){
 return rewards
  .filter(reward=>reward.rule.kind!=='starter'&&!meetsUnlock(reward.rule,progress))
  .sort((a,b)=>rewardDistance(a.rule,progress)-rewardDistance(b.rule,progress))[0]
}

export function wardrobeRule(category:WardrobeCategory,id:number):UnlockRule{
 return wardrobeUnlocks.find(item=>item.category===category&&item.id===id)?.rule??{kind:'starter'}
}
