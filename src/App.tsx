import { useState } from "react";
import "./App.css";
import KeriMannequin from "./KeriMannequin";
import ColourStation from "./ColourStation";
import RecipeBook from "./RecipeBook";
import FeatureWall, { fashionFeatures } from "./FeatureWall";
import ChallengeCard, { type ChallengeProgress } from "./ChallengeCard";
import {
  fashionChallenges,
  scoreChallenge,
  type FashionChallenge,
} from "./challenges";
import {
  colourRewards,
  featureRewards,
  getProgression,
  meetsUnlock,
  nearestLockedReward,
  unlockLabel,
  wardrobeUnlocks,
  type UnlockRule,
  type ProgressionSnapshot,
} from "./progression";
import { defaultKeriLook, type KeriLook } from "./keriAssets";

type Screen =
  | "home"
  | "design"
  | "wardrobe"
  | "colours"
  | "features"
  | "recipes"
  | "gallery"
  | "finished"
  | "mystery";
type Tab = "clothing" | "style" | "details" | "model";
type MysteryId="party"|"dinner"|"winter"|"summer"|"city"|"redcarpet"|"fantasy";
type MysteryOpened=Partial<Record<MysteryId,boolean>>;
type SavedLook = {
  id: number;
  name: string;
  look: KeriLook;
  features?: string[];
  challengeId?: string;
  challengeScore?: number;
  challengeStars?: number;
  matchedCues?: string[];
  challengeMessage?: string;
};
type Garment = {
  id: number;
  name: string;
  rule: UnlockRule;
  category: "top" | "bottom" | "dress" | "jacket" | "shoes";
};
const tops: Garment[] = wardrobeUnlocks
  .filter((x) => x.category === "top")
  .map((x) => ({ ...x, category: "top" }));
const bottoms: Garment[] = wardrobeUnlocks
  .filter((x) => x.category === "bottom")
  .map((x) => ({ ...x, category: "bottom" }));
const dresses: Garment[] = wardrobeUnlocks.filter((x) => x.category === "dress").map((x) => ({ ...x, category: "dress" }));
const jackets: Garment[] = wardrobeUnlocks.filter((x) => x.category === "jacket").map((x) => ({ ...x, category: "jacket" }));
const shoes: Garment[] = wardrobeUnlocks.filter((x) => x.category === "shoes").map((x) => ({ ...x, category: "shoes" }));
const allGarments = [...tops, ...bottoms, ...dresses, ...jackets, ...shoes];
const hairStyles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const mysteryWardrobes:{id:MysteryId;icon:string;name:string;tagline:string;need:number;rewards:string}[]=[
 {id:"party",icon:"🎉",name:"Party Time",tagline:"Birthday dinners, celebrations and sparkle.",need:2,rewards:"Party dresses • dress shoes • jewellery • bright colourways"},
 {id:"dinner",icon:"🍽️",name:"Dinner Out",tagline:"A polished collection for somewhere special.",need:4,rewards:"Elegant dresses • jackets • heels • necklaces"},
 {id:"winter",icon:"❄️",name:"Winter Style",tagline:"Layer up and make cold weather fashionable.",need:6,rewards:"Coats • scarves • gloves • boots • stockings"},
 {id:"summer",icon:"🌴",name:"Summer Escape",tagline:"Holiday looks for sunshine and adventure.",need:8,rewards:"Shorts • light tops • swimwear • glasses"},
 {id:"city",icon:"🏙️",name:"City Style",tagline:"Smart, confident looks for a day in the city.",need:10,rewards:"Jackets • trousers • skirts • bags • glasses"},
 {id:"redcarpet",icon:"✨",name:"Red Carpet",tagline:"Create a show-stopping special-event look.",need:12,rewards:"Eveningwear • statement shoes • jewellery • glam colours"},
 {id:"fantasy",icon:"👑",name:"Fantasy Fashion",tagline:"The designer vault where anything can happen.",need:15,rewards:"Capes • statement pieces • metallics • surprise accessories"},
];

const readGallery = (): SavedLook[] => {
  try {
    return JSON.parse(localStorage.getItem("peyton-fashion-gallery") || "[]");
  } catch {
    return [];
  }
};
const readRecipes = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem("peyton-colour-recipes") || "[]");
  } catch {
    return [];
  }
};
const readFeatures = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem("peyton-selected-features") || "[]");
  } catch {
    return [];
  }
};
const rewardProgress = (rule: UnlockRule, p: ProgressionSnapshot) =>
  rule.kind === "stars"
    ? `${Math.min(p.totalBestStars, rule.count)}/${rule.count} stars`
    : rule.kind === "completed"
      ? `${Math.min(p.completedChallenges, rule.count)}/${rule.count} challenges`
      : rule.kind === "threeStar"
        ? `${Math.min(p.threeStarChallenges, rule.count)}/${rule.count} three-star challenges`
        : "Unlocked";

function App() {
  const [screen, setScreen] = useState<Screen>("home"),
    [tab, setTab] = useState<Tab>("clothing"),
    [clothingCategory, setClothingCategory] = useState<Garment["category"]>("top"),
    [openedMysteries, setOpenedMysteries] = useState<MysteryOpened>(()=>{try{return JSON.parse(localStorage.getItem("pfs-mystery-opened")||"{}")}catch{return {}}}),
    [mysteryReveal, setMysteryReveal] = useState<(typeof mysteryWardrobes)[number]|null>(null),
    [look, setLook] = useState<KeriLook>(defaultKeriLook),
    [gallery, setGallery] = useState<SavedLook[]>(readGallery),
    [finished, setFinished] = useState<SavedLook | null>(null),
    [newUnlock, setNewUnlock] = useState<string | null>(null),
    [features, setFeatures] = useState<string[]>(readFeatures),
    [challenge, setChallenge] = useState<FashionChallenge>(fashionChallenges[0]);
  const progression = getProgression(gallery);
  const unlocked = (g: Garment) => meetsUnlock(g.rule, progression);
  const nextReward = nearestLockedReward([
    ...wardrobeUnlocks.map((x) => ({ name: x.name, icon: "👗", rule: x.rule })),
    ...colourRewards.map((x) => ({ name: x.name, icon: "🎨", rule: x.rule })),
    ...featureRewards.map((x) => ({ name: x.name, icon: "✨", rule: x.rule })),
  ], progression);
  const challengeProgress: ChallengeProgress = gallery.reduce((acc, item) => {
    if (
      !item.challengeId ||
      item.challengeId === "free" ||
      item.challengeScore == null ||
      item.challengeStars == null
    )
      return acc;
    const current = acc[item.challengeId] ?? { attempts: 0, bestStars: 0, bestScore: 0 };
    acc[item.challengeId] = {
      attempts: current.attempts + 1,
      bestStars: Math.max(current.bestStars, item.challengeStars),
      bestScore: Math.max(current.bestScore, item.challengeScore),
    };
    return acc;
  }, {} as ChallengeProgress);
  const patch = (p: Partial<KeriLook>) => setLook((v) => ({ ...v, ...p }));
  const reset = () => {
    setLook(defaultKeriLook);
    setFeatures([]);
    localStorage.setItem("peyton-selected-features", "[]");
  };
  const preview = (change: Partial<KeriLook>) => ({ ...look, ...change });
  const syncFeatures = () => setFeatures(readFeatures());
  const featureUnlocked = (id: string) => {
    const f = fashionFeatures.find((x) => x.id === id);
    return !!f && meetsUnlock(f.rule, progression);
  };
  const toggleFeature = (id: string) => {
    if (!featureUnlocked(id)) return;
    const next = features.includes(id)
      ? features.filter((x) => x !== id)
      : features.length < 3
        ? [...features, id]
        : features;
    setFeatures(next);
    localStorage.setItem("peyton-selected-features", JSON.stringify(next));
  };
  const startChallenge = (next: FashionChallenge) => {
    setChallenge(next);
    syncFeatures();
    setScreen("design");
  };
  const topName = tops.find((x) => x.id === look.top)?.name ?? "Top",
    bottomName = bottoms.find((x) => x.id === look.bottom)?.name ?? "Bottom",
    dressName = dresses.find((x) => x.id === look.dress)?.name,
    jacketName = jackets.find((x) => x.id === look.jacket)?.name,
    shoesName = shoes.find((x) => x.id === look.shoes)?.name ?? "Shoes";
  const outfitMain = dressName ?? `${topName} + ${bottomName}`;
  const outfitExtras = [jacketName, shoesName].filter(Boolean).join(" • ");
  const outfitName = [outfitMain, jacketName].filter(Boolean).join(" + ");
  const finishDesign = () => {
    const result = challenge.id === "free" ? null : scoreChallenge(challenge, look, features);
    const saved: SavedLook = {
      id: Date.now(),
      name: outfitName,
      look: { ...look },
      features: [...features],
      challengeId: challenge.id,
      challengeScore: result?.score,
      challengeStars: result?.stars,
      matchedCues: result?.matches,
      challengeMessage: result?.message,
    };
    const next = [saved, ...gallery];
    const nextProgression = getProgression(next);
    const garmentUnlocks = allGarments
      .filter((g) => !meetsUnlock(g.rule, progression) && meetsUnlock(g.rule, nextProgression))
      .map((g) => `👗 ${g.name}`);
    const colourUnlocks = colourRewards
      .filter((r) => !meetsUnlock(r.rule, progression) && meetsUnlock(r.rule, nextProgression))
      .map((r) => `🎨 ${r.name}`);
    const featureUnlocks = featureRewards
      .filter((r) => !meetsUnlock(r.rule, progression) && meetsUnlock(r.rule, nextProgression))
      .map((r) => `✨ ${r.name}`);
    setGallery(next);
    localStorage.setItem("peyton-fashion-gallery", JSON.stringify(next));
    setFinished(saved);
    setNewUnlock([...garmentUnlocks, ...colourUnlocks, ...featureUnlocks].join(" • ") || null);
    setScreen("finished");
  };
  const openMystery=(box:(typeof mysteryWardrobes)[number])=>{
    if(progression.totalBestStars<box.need||openedMysteries[box.id])return;
    const next={...openedMysteries,[box.id]:true}; setOpenedMysteries(next);
    localStorage.setItem("pfs-mystery-opened",JSON.stringify(next)); setMysteryReveal(box);
  };

  const Header = ({ back = false }: { back?: boolean }) => (
    <header className="top-bar">
      {back ? (
        <button className="home-button" onClick={() => setScreen("home")}>← Studio</button>
      ) : (
        <div className="brand"><span className="brand-icon">✦</span>Peyton's Fashion Studio</div>
      )}
      <div className="designer">Designer Peyton</div>
      <div className="star-count" title="Best challenge stars">⭐ {progression.totalBestStars}</div>
    </header>
  );
  const GarmentChoice = ({ item, type }: { item: Garment; type: "top" | "bottom" | "dress" | "jacket" | "shoes" }) => {
    const isUnlocked = unlocked(item),
      selected = look[type] === item.id;
    return (
      <button
        className={`visual-choice ${selected ? "selected" : ""} ${!isUnlocked ? "locked-choice" : ""}`}
        onClick={() => isUnlocked && patch(type === "dress" ? { dress: item.id } : type === "top" || type === "bottom" ? { [type]: item.id, dress: 0 } : { [type]: item.id })}
        disabled={!isUnlocked}
      >
        <span className="choice-preview">
          <KeriMannequin look={preview({ [type]: item.id })} />
          {!isUnlocked && <span className="lock-cover">🔒<small>{unlockLabel(item.rule)}</small></span>}
        </span>
        <strong>{item.name}</strong>
        {selected && isUnlocked && <i>✓</i>}
      </button>
    );
  };
  if (screen === "colours")
    return <ColourStation onBack={() => setScreen("home")} onRecipes={() => setScreen("recipes")} />;
  if (screen === "recipes")
    return <RecipeBook onBack={() => setScreen("home")} onMix={() => setScreen("colours")} />;
  if (screen === "features")
    return (
      <FeatureWall
        top={look.top}
        bottom={look.bottom}
        onBack={() => { syncFeatures(); setScreen("home"); }}
        onDesign={() => { syncFeatures(); setTab("details"); setScreen("design"); }}
      />
    );
  if (screen === "finished" && finished) {
    const finishedChallenge = fashionChallenges.find((c) => c.id === finished.challengeId) ?? fashionChallenges[0];
    return (
      <main className="app-shell">
        <Header />
        <section className="finish-page">
          <p className="eyebrow">YOUR FASHION CARD</p>
          <h1>Look Complete! ✨</h1>
          {newUnlock && <div className="unlock-banner">🎁 <strong>NEW REWARD UNLOCKED!</strong><span>{newUnlock}</span></div>}
          <div className="fashion-card">
            <div className="fashion-card-model"><KeriMannequin look={finished.look} features={finished.features ?? []} /></div>
            <div className="fashion-card-copy">
              <small>DESIGNED BY PEYTON</small>
              <h2>{finished.name}</h2>
              <p>{finishedChallenge.icon} {finishedChallenge.title}</p>
              {finished.features?.length ? (
                <p>✨ {finished.features.map((id) => fashionFeatures.find((f) => f.id === id)?.name).join(" • ")}</p>
              ) : null}
              {finishedChallenge.id !== "free" ? (
                <div className="challenge-result">
                  <strong>{"★".repeat(finished.challengeStars ?? 1)}{"☆".repeat(3 - (finished.challengeStars ?? 1))} · {finished.challengeScore}% match</strong>
                  <small>{finished.challengeMessage}</small>
                  {finished.matchedCues?.length ? (
                    <div className="match-feedback"><b>What worked in your design</b><ul>{finished.matchedCues.map((cue) => <li key={cue}>✓ {cue}</li>)}</ul></div>
                  ) : null}
                </div>
              ) : (
                <div className="free-design-result">💖 Free Design · completely Peyton's own</div>
              )}
              <span>♡ Design • Create • Express</span>
            </div>
          </div>
          {finishedChallenge.id !== "free" && nextReward && (
            <div className="next-reward-card"><span>{nextReward.icon}</span><div><small>NEXT STUDIO REWARD</small><strong>{nextReward.name}</strong><p>{rewardProgress(nextReward.rule, progression)} · {unlockLabel(nextReward.rule)}</p></div></div>
          )}
          <div className="finish-actions">
            <button className="reset-design" onClick={() => setScreen("gallery")}>View Gallery</button>
            <button className="finish-design" onClick={() => { reset(); setChallenge(fashionChallenges[0]); setNewUnlock(null); setScreen("design"); }}>Create Another →</button>
          </div>
        </section>
      </main>
    );
  }
  if (screen === "wardrobe")
    return (
      <main className="app-shell"><Header back /><section className="collection-page"><p className="eyebrow">WARDROBE</p><h1>Your Clothing Collection</h1><p>Challenge achievements unlock extra clothing. You have unlocked {allGarments.filter(unlocked).length} of {allGarments.length} pieces.</p><p>⭐ {progression.totalBestStars} best stars • {progression.completedChallenges} challenges completed • {progression.threeStarChallenges} three-star challenges</p><div className="wardrobe-section"><h2>Tops</h2><div className="wardrobe-grid">{tops.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`t${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...look, top: item.id }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div><div className="wardrobe-section"><h2>Bottoms</h2><div className="wardrobe-grid">{bottoms.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`b${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...look, bottom: item.id }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Dresses</h2><div className="wardrobe-grid">{dresses.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`d${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...look, dress: item.id }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Jackets</h2><div className="wardrobe-grid">{jackets.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`j${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...look, jacket: item.id }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Shoes</h2><div className="wardrobe-grid">{shoes.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`s${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...look, shoes: item.id }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      </section></main>
    );
  if (screen === "mystery")
    return (
      <main className="app-shell"><Header back /><section className="collection-page mystery-page"><p className="eyebrow">DESIGNER REWARDS</p><h1>Mystery Wardrobes 🎁</h1><p>Complete briefs and collect stars to discover new themed fashion collections.</p>
      {mysteryReveal&&<div className="mystery-reveal"><div className="mystery-reveal-card"><span>🎁✨</span><small>NEW WARDROBE OPENED</small><h2>{mysteryReveal.icon} {mysteryReveal.name}</h2><p>{mysteryReveal.tagline}</p><strong>{mysteryReveal.rewards}</strong><button onClick={()=>setMysteryReveal(null)}>Add to my studio ✓</button></div></div>}
      <div className="mystery-grid">{mysteryWardrobes.map((box)=>{const earned=progression.totalBestStars>=box.need,opened=!!openedMysteries[box.id];return <article className={`mystery-box ${earned?"mystery-earned":""} ${opened?"mystery-open":""}`} key={box.id}><span className="mystery-icon">{opened?box.icon:earned?"🎁":"🔒"}</span><small>{opened?"WARDROBE OPENED":earned?"READY TO OPEN":`${progression.totalBestStars}/${box.need} STARS`}</small><h2>{opened?box.name:earned?"Mystery Wardrobe Ready!":"Mystery Wardrobe"}</h2><p>{opened?box.tagline:earned?"You earned this collection. Open it to discover what is inside.":"Keep designing to reveal this collection."}</p><div className="mystery-rewards">{opened?box.rewards:"? • ? • ? • ?"}</div>{earned&&!opened&&<button className="open-mystery-button" onClick={()=>openMystery(box)}>Open Mystery Wardrobe 🎁</button>}</article>})}</div><p className="mystery-note">More collections will appear as Peyton's studio grows.</p></section></main>
    );
  if (screen === "gallery")
    return (
      <main className="app-shell"><Header back /><section className="collection-page"><p className="eyebrow">FASHION GALLERY</p><h1>Peyton's Collection</h1><p>Every finished design is saved here.</p>{gallery.length === 0 ? <div className="empty-gallery"><span>♡</span><strong>No designs yet</strong><span>Create your first look in the Design Studio.</span><button className="finish-design" onClick={() => setScreen("design")}>Start Designing →</button></div> : <div className="gallery-grid">{gallery.map((item) => <article className="gallery-card" key={item.id}><div className="gallery-model"><KeriMannequin look={item.look} features={item.features ?? []} /></div><strong>{item.name}</strong><small>{item.challengeId && item.challengeId !== "free" && item.challengeStars != null && item.challengeScore != null ? `${"★".repeat(item.challengeStars)}${"☆".repeat(3 - item.challengeStars)} · ${item.challengeScore}% · ${fashionChallenges.find((c) => c.id === item.challengeId)?.title ?? "Challenge"}` : "💖 Free Design"}</small></article>)}</div>}</section></main>
    );
  if (screen === "home") {
    const unlockedFeatureCount = fashionFeatures.filter((f) => meetsUnlock(f.rule, progression)).length;
    const unlockedColourCount = colourRewards.filter((r) => meetsUnlock(r.rule, progression)).length;
    const nextChallenge = fashionChallenges.filter((c) => c.id !== "free").find((c) => (challengeProgress[c.id]?.bestStars ?? 0) < 3) ?? fashionChallenges[1];
    return (
      <main className="app-shell">
        <Header />
        <section className="studio">
          <div className="welcome"><p className="eyebrow">WELCOME TO YOUR STUDIO</p><h1>Create something amazing.</h1><p className="welcome-text">Mix colours, add details, build outfits and save every design you love.</p></div>
          <div className="studio-floor">
            <button className="studio-area wardrobe-area" onClick={() => setScreen("wardrobe")}><span className="area-icon">👗</span><span className="area-title">Wardrobe</span><span className="area-description">{allGarments.filter(unlocked).length}/{allGarments.length} pieces unlocked</span></button>
            <button className="studio-area colours-area" onClick={() => setScreen("colours")}><span className="area-icon">🎨</span><span className="area-title">Colour Station</span><span className="area-description">{unlockedColourCount}/{colourRewards.length} special colours unlocked</span></button>
            <button className="studio-area features-area" onClick={() => setScreen("features")}><span className="area-icon">✨</span><span className="area-title">Feature Wall</span><span className="area-description">{unlockedFeatureCount}/{fashionFeatures.length} details unlocked</span></button>
            <button className="studio-area recipes-area" onClick={() => setScreen("recipes")}><span className="area-icon">📖</span><span className="area-title">Recipe Book</span><span className="area-description">{readRecipes().length} colour mixes discovered</span></button>
            <button className="studio-area gallery-area" onClick={() => setScreen("gallery")}><span className="area-icon">🖼️</span><span className="area-title">Fashion Gallery</span><span className="area-description">{gallery.length} looks saved</span></button>
            <button className="design-studio" onClick={() => setScreen("design")}><div className="mirror keri-home-mirror"><div className="mirror-shine" /><KeriMannequin look={look} features={features} /></div><div className="design-studio-label"><span className="design-icon">✦</span><div><strong>Design Studio</strong><small>Create a new fashion look</small></div><span className="arrow">→</span></div></button>
          </div>
          <div className="mystery-home-card"><span>🎁</span><div><small>MYSTERY WARDROBES</small><strong>Unlock new fashion collections</strong><p>{mysteryWardrobes.filter((box)=>openedMysteries[box.id]).length}/{mysteryWardrobes.length} wardrobes opened</p></div><button onClick={()=>setScreen("mystery")}>Explore →</button></div>
          <ChallengeCard challenge={nextChallenge} progress={challengeProgress[nextChallenge.id]} onStart={() => startChallenge(nextChallenge)} />
        </section>
        <footer className="studio-footer"><span>♡ Designed for Peyton</span><span>✦ Create • Experiment • Express</span></footer>
      </main>
    );
  }
  return (
    <main className="app-shell">
      <Header back />
      <section className="designer-page">
        <div className="designer-challenge"><span>{challenge.icon}</span><div><small>{challenge.id === "free" ? "FREE DESIGN" : "CURRENT CHALLENGE"}</small><strong>{challenge.title}</strong></div><button onClick={() => setChallenge(fashionChallenges[0])}>Change</button></div>
        <div className="designer-workspace"><div className="designer-summary"><small>YOUR LOOK</small><h2>{outfitMain}</h2><p>{outfitExtras}</p></div><div className="designer-mirror keri-mirror"><KeriMannequin look={look} features={features} /></div><div className="designer-tip"><span>♡</span><strong>There are no wrong designs.</strong><p>Experiment until the look feels like yours.</p></div></div>
        <div className="design-drawer"><div className="drawer-tabs"><button className={tab === "clothing" ? "active" : ""} onClick={() => setTab("clothing")}>👗 <span>Clothing</span></button><button className={tab === "style" ? "active" : ""} onClick={() => setTab("style")}>🎨 <span>Style</span></button><button className={tab === "details" ? "active" : ""} onClick={() => setTab("details")}>✨ <span>Details</span></button><button className={tab === "model" ? "active" : ""} onClick={() => setTab("model")}>♡ <span>Model</span></button></div>
          <div className="drawer-options">
            {tab === "clothing" && <div className="clothing-browser">
              <div className="clothing-category-tabs">
                {([
                  ["top","Tops"],["bottom","Bottoms"],["dress","Dresses"],["jacket","Jackets"],["shoes","Shoes"]
                ] as [Garment["category"],string][]).map(([category,label]) =>
                  <button key={category} className={clothingCategory===category?"active":""} onClick={()=>setClothingCategory(category)}>{label}</button>
                )}
              </div>
              <div className="option-group visual-group">
                <b>{clothingCategory.toUpperCase()}{clothingCategory==="dress"||clothingCategory==="shoes"?"ES":clothingCategory==="bottom"?"S":"S"}</b>
                <div className="visual-choice-row">
                  {(clothingCategory==="top"?tops:clothingCategory==="bottom"?bottoms:clothingCategory==="dress"?dresses:clothingCategory==="jacket"?jackets:shoes)
                    .map((item)=><GarmentChoice key={item.id} item={item} type={clothingCategory}/>)}
                </div>
              </div>
            </div>}
            {tab === "style" && <div className="details-drawer"><div className="details-heading"><b>COLOURS</b><span>Full Glam Girl colour library coming next</span></div><p className="welcome-text">The starter pack currently uses the original supplied colour for each garment. We’ll wire the purchased colour variants here next.</p></div>}
            {tab === "details" && <div className="details-drawer"><div className="details-heading"><b>FEATURES</b><span>{features.length}/3 selected</span></div><div className="detail-choice-row">{fashionFeatures.map((f) => { const active = features.includes(f.id), isUnlocked = meetsUnlock(f.rule, progression); return <button key={f.id} className={`detail-choice ${active ? "selected" : ""} ${!isUnlocked ? "locked-choice" : ""}`} onClick={() => toggleFeature(f.id)} disabled={!isUnlocked}><span>{isUnlocked ? f.icon : "🔒"}</span><strong>{f.name}</strong><small>{isUnlocked ? f.kind : unlockLabel(f.rule)}</small>{active && <i>✓</i>}</button>; })}</div><button className="feature-wall-link" onClick={() => setScreen("features")}>Open Feature Wall →</button></div>}
            {tab === "model" && <div className="option-group visual-group"><b>HAIRSTYLE</b><div className="visual-choice-row">{hairStyles.map((n) => <button key={n} className={`visual-choice model-choice ${look.hairStyle === n ? "selected" : ""}`} onClick={() => patch({ hairStyle: n })}><span className="choice-preview portrait-preview"><KeriMannequin portrait look={preview({ hairStyle: n })} /></span><strong>Style {n}</strong>{look.hairStyle === n && <i>✓</i>}</button>)}</div></div>}
          </div>
        </div>
        <div className="designer-actions"><button className="reset-design" onClick={reset}>↻ Start Again</button><button className="finish-design" onClick={finishDesign}>✓ Finish Design</button></div>
        <p className="asset-credit">Glam Girl character assets by Igra Studios</p>
      </section>
    </main>
  );
}

export default App;
