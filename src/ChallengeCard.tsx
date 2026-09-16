import { fashionChallenges, type FashionChallenge } from './challenges'
import './ChallengeCard.css'

export type ChallengeProgress=Record<string,{attempts:number;bestStars:number;bestScore:number}>
type Props={active:FashionChallenge;onChange:(challenge:FashionChallenge)=>void;compact?:boolean;progress?:ChallengeProgress}

export default function ChallengeCard({active,onChange,compact=false,progress={}}:Props){
 const activeProgress=progress[active.id]
 return <section className={`challenge-card ${compact?'compact':''}`}>
  <div className="challenge-current"><span className="challenge-big-icon">{active.icon}</span><div><small>{active.id==='free'?'FREE DESIGN':'YOUR CHALLENGE'}</small><strong>{active.title}</strong><p>{active.brief}</p>{active.id!=='free'&&<>{activeProgress?.attempts?<span className="challenge-best">Best {'★'.repeat(activeProgress.bestStars)}{'☆'.repeat(3-activeProgress.bestStars)} · {activeProgress.bestScore}% · {activeProgress.attempts} {activeProgress.attempts===1?'try':'tries'}</span>:<span className="challenge-new">NEW CHALLENGE</span>}<em>💡 {active.bonus}</em></>}</div></div>
  {!compact&&<div className="challenge-picker">{fashionChallenges.map(challenge=>{const record=progress[challenge.id];return <button key={challenge.id} className={active.id===challenge.id?'active':''} onClick={()=>onChange(challenge)}><span>{challenge.icon}</span><strong>{challenge.title}</strong><small>{challenge.id==='free'?'Free Design':record?.attempts?`${'★'.repeat(record.bestStars)}${'☆'.repeat(3-record.bestStars)} · Best ${record.bestScore}%`:'New Challenge'}</small></button>})}</div>}
 </section>
}
