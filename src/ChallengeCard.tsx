import { fashionChallenges, type FashionChallenge } from './challenges'
import './ChallengeCard.css'

type Props={active:FashionChallenge;onChange:(challenge:FashionChallenge)=>void;compact?:boolean}

export default function ChallengeCard({active,onChange,compact=false}:Props){
 return <section className={`challenge-card ${compact?'compact':''}`}>
  <div className="challenge-current"><span className="challenge-big-icon">{active.icon}</span><div><small>YOUR CHALLENGE</small><strong>{active.title}</strong><p>{active.brief}</p>{active.id!=='free'&&<em>💡 {active.bonus}</em>}</div></div>
  {!compact&&<div className="challenge-picker">{fashionChallenges.map(challenge=><button key={challenge.id} className={active.id===challenge.id?'active':''} onClick={()=>onChange(challenge)}><span>{challenge.icon}</span><strong>{challenge.title}</strong><small>{challenge.id==='free'?'Free Design':'Challenge'}</small></button>)}</div>}
 </section>
}
