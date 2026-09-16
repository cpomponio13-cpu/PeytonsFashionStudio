import { scoreChallenge, type FashionChallenge } from './challenges'
import type { KeriLook } from './keriAssets'
import './ChallengeResult.css'

type Props={challenge:FashionChallenge;look:KeriLook;features:string[]}

export default function ChallengeResult({challenge,look,features}:Props){
 const result=scoreChallenge(challenge,look,features)
 return <section className="challenge-result">
  <div className="result-icon">{challenge.icon}</div>
  <div className="result-copy">
   <small>{challenge.id==='free'?'YOUR DESIGN':'CHALLENGE MATCH'}</small>
   <strong>{challenge.title}</strong>
   <div className="result-stars" aria-label={`${result.stars} stars`}>{[1,2,3].map(n=><span key={n} className={n<=result.stars?'earned':''}>★</span>)}</div>
   <p>{result.message}</p>
   {challenge.id!=='free'&&<div className="match-notes">{result.matches.map(match=><span key={match}>✓ {match}</span>)}</div>}
  </div>
  {challenge.id!=='free'&&<div className="match-score"><strong>{result.score}</strong><small>MATCH</small></div>}
 </section>
}
