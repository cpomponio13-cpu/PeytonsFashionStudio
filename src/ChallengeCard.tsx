import { type FashionChallenge } from './challenges'
import './ChallengeCard.css'

export type ChallengeProgress=Record<string,{attempts:number;bestStars:number;bestScore:number}>
export type ChallengeProgressEntry=ChallengeProgress[string]
type Props={challenge:FashionChallenge;onStart:()=>void;progress?:ChallengeProgressEntry}

export default function ChallengeCard({challenge,progress,onStart}:Props){
 return <section className="challenge-card">
  <div className="challenge-current"><span className="challenge-big-icon">{challenge.icon}</span><div><small>YOUR NEXT CHALLENGE</small><strong>{challenge.title}</strong><p>{challenge.brief}</p>{progress?.attempts?<span className="challenge-best">Best {'★'.repeat(progress.bestStars)}{'☆'.repeat(3-progress.bestStars)} · {progress.bestScore}% · {progress.attempts} {progress.attempts===1?'try':'tries'}</span>:<span className="challenge-new">NEW CHALLENGE</span>}<em>💡 {challenge.bonus}</em></div></div>
  <button className="finish-design" onClick={onStart}>Start Challenge →</button>
 </section>
}
