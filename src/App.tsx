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
const partyDressVariants = [
  { dress: 4, style: 2, name: "Electric Blue" },
  { dress: 4, style: 5, name: "Midnight Sparkle" },
  { dress: 4, style: 8, name: "Pearl White" },
  { dress: 5, style: 3, name: "Ruby Red" },
  { dress: 5, style: 7, name: "Golden Yellow" },
  { dress: 5, style: 12, name: "Powder Blue" },
];
const partyShoeVariants = [
  { shoes: 2, style: 4, name: "Celebration Shoes" },
  { shoes: 2, style: 8, name: "Party Shoes" },
  { shoes: 4, style: 3, name: "Dinner Shoes" },
  { shoes: 4, style: 10, name: "Statement Heels" },
];
const partyJewellery = [
  { key: "necklace" as const, value: 2, name: "Party Necklace" },
  { key: "necklace" as const, value: 6, name: "Sparkle Necklace" },
  { key: "earrings" as const, value: 2, name: "Party Earrings" },
  { key: "earrings" as const, value: 7, name: "Sparkle Earrings" },
  { key: "bracelet" as const, value: 3, name: "Party Bracelet" },
  { key: "bracelet" as const, value: 9, name: "Sparkle Bracelet" },
];
const dinnerDressVariants = [
  { dress: 6, style: 6, name: "Dinner Plum" },
  { dress: 6, style: 10, name: "Dinner Pearl" },
  { dress: 7, style: 8, name: "Evening Blue" },
  { dress: 7, style: 14, name: "Evening Wine" },
];
const dinnerJacketVariants = [
  { jacket: 3, style: 3, name: "Polished Blazer" },
  { jacket: 3, style: 4, name: "Dinner Blazer" },
];
const dinnerShoeVariants = [
  { shoes: 6, style: 1, name: "Classic Heels" },
  { shoes: 6, style: 6, name: "Dinner Heels" },
  { shoes: 6, style: 17, name: "Evening Heels" },
];
const dinnerJewellery = [
  { key: "necklace" as const, value: 1, set: 2, name: "Dinner Necklace" },
  { key: "necklace" as const, value: 9, set: 2, name: "Pearl Necklace" },
  { key: "earrings" as const, value: 11, set: 2, name: "Dinner Earrings" },
  { key: "earrings" as const, value: 16, set: 2, name: "Evening Earrings" },
];
const everydayCasual = {
  tops: [
    { id: 201, style: 1, set: 3, name: "White T-Shirt" },
    { id: 2, style: 7, set: 2, name: "Relaxed Mint Top" },
    { id: 3, style: 7, set: 2, name: "Mint Cami" },
    { id: 3, style: 19, set: 2, name: "Sky Blue Cami" },
  ],
  bottoms: [
    { id: 101, style: 1, name: "Blue Denim Jeans" },
    { id: 101, style: 5, name: "Dark Denim Jeans" },
    { id: 102, style: 10, name: "Mint Casual Shorts" },
    { id: 102, style: 14, name: "Pink Casual Shorts" },
    { id: 103, style: 15, name: "Charcoal Leggings" },
  ],
  jackets: [{ id: 4, style: 13, name: "Light Casual Jacket" }],
  shoes: [
    { id: 1, style: 2, name: "Black Casual Shoes" },
    { id: 1, style: 8, name: "Navy Casual Shoes" },
    { id: 5, style: 18, name: "Black Flats" },
  ],
};
const mysteryWardrobes:{id:MysteryId;icon:string;name:string;tagline:string;need:number;rewards:string}[]=[
 {id:"party",icon:"🎉",name:"Party Time",tagline:"Birthday dinners, celebrations and sparkle.",need:2,rewards:"6 dress colourways • 4 shoe colourways • 6 jewellery pieces"},
 {id:"dinner",icon:"🍽️",name:"Dinner Out",tagline:"A polished collection for somewhere special.",need:4,rewards:"4 dress colourways • 2 blazers • 3 heels • 4 jewellery pieces"},
 {id:"winter",icon:"❄️",name:"Winter Style",tagline:"Layer up and make cold weather fashionable.",need:6,rewards:"Coats • scarves • gloves • boots • stockings"},
 {id:"summer",icon:"🌴",name:"Summer Escape",tagline:"Holiday looks for sunshine and adventure.",need:8,rewards:"Shorts • light tops • swimwear • glasses"},
 {id:"city",icon:"🏙️",name:"City Style",tagline:"Smart, confident looks for a day in the city.",need:10,rewards:"Jackets • trousers • skirts • bags • glasses"},
 {id:"redcarpet",icon:"✨",name:"Red Carpet",tagline:"Create a show-stopping special-event look.",need:12,rewards:"Eveningwear • statement shoes • jewellery • glam colours"},
 {id:"fantasy",icon:"👑",name:"Fantasy Fashion",tagline:"The designer vault where anything can happen.",need:15,rewards:"Capes • statement pieces • metallics • surprise accessories"},
];

const appAsset = (src: string) => `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;

const safeStorageGet = (key: string, fallback: string) => {
  try {
    return typeof window !== "undefined" && window.localStorage
      ? window.localStorage.getItem(key) || fallback
      : fallback;
  } catch {
    return fallback;
  }
};
const safeStorageSet = (key: string, value: string) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem(key, value);
  } catch {
    // Safari private/restricted storage must never crash the game.
  }
};
const readGallery = (): SavedLook[] => {
  try {
    const value = JSON.parse(safeStorageGet("peyton-fashion-gallery", "[]"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
const readRecipes = (): string[] => {
  try {
    const value = JSON.parse(safeStorageGet("peyton-colour-recipes", "[]"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
const readFeatures = (): string[] => {
  try {
    const value = JSON.parse(safeStorageGet("peyton-selected-features", "[]"));
    return Array.isArray(value) ? value : [];
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
    [openedMysteries, setOpenedMysteries] = useState<MysteryOpened>(()=>{try{const value=JSON.parse(safeStorageGet("pfs-mystery-opened","{}")); return value && typeof value==="object" && !Array.isArray(value) ? value : {}}catch{return {}}}),
    [mysteryReveal, setMysteryReveal] = useState<(typeof mysteryWardrobes)[number]|null>(null),
    [look, setLook] = useState<KeriLook>(defaultKeriLook),
    [gallery, setGallery] = useState<SavedLook[]>(readGallery),
    [finished, setFinished] = useState<SavedLook | null>(null),
    [newUnlock, setNewUnlock] = useState<string | null>(null),
    [features, setFeatures] = useState<string[]>(readFeatures),
    [challenge, setChallenge] = useState<FashionChallenge>(fashionChallenges[0]);
  const progression = getProgression(gallery);
  const unlocked = (g: Garment) => meetsUnlock(g.rule, progression);
  const permanentCasualCount = everydayCasual.tops.length + everydayCasual.bottoms.length + everydayCasual.jackets.length + everydayCasual.shoes.length;
  const wardrobeOwnedCount = allGarments.filter(unlocked).length + permanentCasualCount;
  const wardrobeTotalCount = allGarments.length + permanentCasualCount;
  const partyOpened = !!openedMysteries.party;
  const dinnerOpened = !!openedMysteries.dinner;
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
    safeStorageSet("peyton-selected-features", "[]");
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
    safeStorageSet("peyton-selected-features", JSON.stringify(next));
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
    safeStorageSet("peyton-fashion-gallery", JSON.stringify(next));
    setFinished(saved);
    setNewUnlock([...garmentUnlocks, ...colourUnlocks, ...featureUnlocks].join(" • ") || null);
    setScreen("finished");
  };
  const openMystery=(box:(typeof mysteryWardrobes)[number])=>{
    if(progression.totalBestStars<box.need||openedMysteries[box.id])return;
    const next={...openedMysteries,[box.id]:true}; setOpenedMysteries(next);
    safeStorageSet("pfs-mystery-opened",JSON.stringify(next)); setMysteryReveal(box);
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
      selected = look[type] === item.id && (
        type === "top" ? look.topSet === 1 :
        type === "bottom" ? look.bottomSet === 1 :
        type === "jacket" ? look.jacketSet === 1 :
        type === "shoes" ? look.shoesSet === 1 : true
      );
    const standardChange: Partial<KeriLook> =
      type === "top" ? { top: item.id, topStyle: 1, topSet: 1, dress: 0 } :
      type === "bottom" ? { bottom: item.id, bottomStyle: 1, bottomSet: 1, dress: 0 } :
      type === "jacket" ? { jacket: item.id, jacketStyle: 1, jacketSet: 1 } :
      type === "shoes" ? { shoes: item.id, shoesStyle: 1, shoesSet: 1 } :
      { dress: item.id, dressStyle: 1 };
    return (
      <button
        className={`visual-choice ${selected ? "selected" : ""} ${!isUnlocked ? "locked-choice" : ""}`}
        onClick={() => isUnlocked && patch(standardChange)}
        disabled={!isUnlocked}
      >
        <span className={`choice-preview ${type==="shoes"?"standard-shoe-preview":""}`}>
          {type==="shoes"
            ? <img className="standard-shoe-image" src={appAsset(`/glamgirl/shoes/shoes-${item.id}_1.png`)} alt="" />
            : <KeriMannequin look={{ ...defaultKeriLook, ...standardChange }} />}
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
      <main className="app-shell"><Header back /><section className="collection-page"><p className="eyebrow">WARDROBE</p><h1>Your Clothing Collection</h1><p>Challenge achievements unlock extra clothing. You have unlocked {wardrobeOwnedCount} of {wardrobeTotalCount} permanent pieces.</p><p>⭐ {progression.totalBestStars} best stars • {progression.completedChallenges} challenges completed • {progression.threeStarChallenges} three-star challenges</p><div className="wardrobe-section"><h2>Tops</h2><div className="wardrobe-grid">{tops.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`t${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...defaultKeriLook, top: item.id, topStyle: 1, topSet: 1, dress: 0 }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div><div className="wardrobe-section"><h2>Everyday Casual Tops</h2><div className="wardrobe-grid">{everydayCasual.tops.map((item)=>{const set=item.set??2;return <article className="wardrobe-card" key={`ct-${item.id}-${item.style}-${set}`}><div className="gallery-model"><KeriMannequin look={{...defaultKeriLook,top:item.id,topStyle:item.style,topSet:set,dress:0}} /></div><strong>{item.name}</strong><small>Always available</small></article>})}</div></div><div className="wardrobe-section"><h2>Bottoms</h2><div className="wardrobe-grid">{bottoms.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`b${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...defaultKeriLook, bottom: item.id, bottomStyle: 1, bottomSet: 1, dress: 0 }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Everyday Casual Bottoms</h2><div className="wardrobe-grid">{everydayCasual.bottoms.map((item)=><article className="wardrobe-card" key={`cb-${item.id}-${item.style}`}><div className="gallery-model"><KeriMannequin look={{...defaultKeriLook,bottom:item.id,bottomStyle:item.style,bottomSet:2,dress:0}} /></div><strong>{item.name}</strong><small>Always available</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Dresses</h2><div className="wardrobe-grid">{dresses.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`d${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...defaultKeriLook, dress: item.id, dressStyle: 1 }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Jackets</h2><div className="wardrobe-grid">{jackets.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`j${item.id}`}><div className="gallery-model"><KeriMannequin look={{ ...defaultKeriLook, jacket: item.id, jacketStyle: 1, jacketSet: 1 }} />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Everyday Casual Layers</h2><div className="wardrobe-grid">{everydayCasual.jackets.map((item)=><article className="wardrobe-card" key={`cj-${item.id}-${item.style}`}><div className="gallery-model"><KeriMannequin look={{...defaultKeriLook,jacket:item.id,jacketStyle:item.style,jacketSet:2}} /></div><strong>{item.name}</strong><small>Always available</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Shoes</h2><div className="wardrobe-grid">{shoes.map((item) => <article className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`} key={`s${item.id}`}><div className="gallery-model wardrobe-shoe-preview"><img src={appAsset(`/glamgirl/shoes/shoes-${item.id}_1.png`)} alt="" />{!unlocked(item) && <span className="wardrobe-lock">🔒</span>}</div><strong>{item.name}</strong><small>{unlocked(item) ? "In your wardrobe" : unlockLabel(item.rule)}</small></article>)}</div></div>
      <div className="wardrobe-section"><h2>Everyday Casual Shoes</h2><div className="wardrobe-grid">{everydayCasual.shoes.map((item)=><article className="wardrobe-card" key={`cs-${item.id}-${item.style}`}><div className="gallery-model wardrobe-shoe-preview"><img src={appAsset(`/glamgirl/everyday-casual/shoes-${item.id}_${item.style}.png`)} alt="" /></div><strong>{item.name}</strong><small>Always available</small></article>)}</div></div>
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
                  {clothingCategory==="jacket"&&<button className={`visual-choice no-option-choice ${look.jacket===0?"selected":""}`} onClick={()=>patch({jacket:0})}><span className="choice-preview"><KeriMannequin look={preview({jacket:0})}/><span className="no-option-slash" aria-hidden="true"/></span><strong>No Jacket</strong>{look.jacket===0&&<i>✓</i>}</button>}
                  {(clothingCategory==="top"?tops:clothingCategory==="bottom"?bottoms:clothingCategory==="dress"?dresses:clothingCategory==="jacket"?jackets:shoes)
                    .map((item)=><GarmentChoice key={item.id} item={item} type={clothingCategory}/>)}
                </div>
              </div>
            </div>}
            {tab === "clothing" && <div className="details-drawer">
              <div className="details-heading"><b>EVERYDAY CASUAL</b><span>Always available · garden, outdoor and weekend looks</span></div>
              <div className="option-group visual-group"><b>CASUAL TOPS</b><div className="visual-choice-row">{everydayCasual.tops.map((v)=>{const set=v.set??2;return <button key={"casual-top-"+v.id+"-"+v.style+"-"+set} className={"visual-choice "+(look.top===v.id&&look.topStyle===v.style&&look.topSet===set?"selected":"")} onClick={()=>patch({top:v.id,topStyle:v.style,topSet:set,dress:0})}><span className="choice-preview"><KeriMannequin look={preview({top:v.id,topStyle:v.style,topSet:set,dress:0})}/></span><strong>{v.name}</strong></button>})}</div></div>
              <div className="option-group visual-group"><b>CASUAL BOTTOMS</b><div className="visual-choice-row">{everydayCasual.bottoms.map((v)=><button key={"casual-bottom-"+v.id+"-"+v.style} className={"visual-choice "+(look.bottom===v.id&&look.bottomStyle===v.style&&look.bottomSet===2?"selected":"")} onClick={()=>patch({bottom:v.id,bottomStyle:v.style,bottomSet:2,dress:0})}><span className="choice-preview"><KeriMannequin look={{...defaultKeriLook,bottom:v.id,bottomStyle:v.style,bottomSet:2,dress:0}}/></span><strong>{v.name}</strong></button>)}</div></div>
              <div className="option-group visual-group"><b>LIGHT LAYER</b><div className="visual-choice-row">{everydayCasual.jackets.map((v)=><button key={"casual-jacket-"+v.id+"-"+v.style} className={"visual-choice "+(look.jacket===v.id&&look.jacketStyle===v.style&&look.jacketSet===2?"selected":"")} onClick={()=>patch({jacket:v.id,jacketStyle:v.style,jacketSet:2})}><span className="choice-preview"><KeriMannequin look={{...defaultKeriLook,jacket:v.id,jacketStyle:v.style,jacketSet:2}}/></span><strong>{v.name}</strong></button>)}</div></div>
              <div className="option-group visual-group"><b>CASUAL SHOES</b><div className="visual-choice-row">{everydayCasual.shoes.map((v)=>{const src="/glamgirl/everyday-casual/shoes-"+v.id+"_"+v.style+".png";return <button key={"casual-shoe-"+v.id+"-"+v.style} className={"visual-choice shoe-variant-choice "+(look.shoes===v.id&&look.shoesStyle===v.style&&look.shoesSet===2?"selected":"")} onClick={()=>patch({shoes:v.id,shoesStyle:v.style,shoesSet:2})}><span className="shoe-preview"><img src={appAsset(src)} alt="" /></span><strong>{v.name}</strong></button>})}</div></div>
            </div>}
            {tab === "style" && <div className="details-drawer">
              <div className="details-heading"><b>PARTY TIME COLLECTION</b><span>{partyOpened ? "Mystery Wardrobe opened ✓" : "Open the Party Time Mystery Wardrobe to use these rewards"}</span></div>
              {!partyOpened ? <p className="welcome-text">🎁 Earn 2 challenge stars, then open Party Time from Mystery Wardrobes.</p> : <>
                <div className="option-group visual-group"><b>DRESS COLOURWAYS</b><div className="visual-choice-row">{partyDressVariants.map((v)=><button key={`dress-${v.dress}-${v.style}`} className={`visual-choice ${look.dress===v.dress&&look.dressStyle===v.style?"selected":""}`} onClick={()=>patch({dress:v.dress,dressStyle:v.style})}><span className="choice-preview"><KeriMannequin look={preview({dress:v.dress,dressStyle:v.style})}/></span><strong>{v.name}</strong></button>)}</div></div>
                <div className="option-group visual-group"><b>SHOE COLOURWAYS</b><div className="visual-choice-row">{partyShoeVariants.map((v)=>{const src=`/glamgirl/party-time/shoes-${v.shoes}_${v.style}.png`;return <button key={`shoe-${v.shoes}-${v.style}`} className={`visual-choice shoe-variant-choice ${look.shoes===v.shoes&&look.shoesStyle===v.style?"selected":""}`} onClick={()=>patch({shoes:v.shoes,shoesStyle:v.style})}><span className="shoe-preview"><img src={appAsset(src)} alt="" /></span><strong>{v.name}</strong>{look.shoes===v.shoes&&look.shoesStyle===v.style&&<i>✓</i>}</button>})}</div></div>
                <div className="details-heading"><b>JEWELLERY</b><span>Mix and match your Party Time accessories</span></div>
                <div className="detail-choice-row">{partyJewellery.map((item)=>{const active=look[item.key]===item.value&&((item.key==="necklace"?look.necklaceSet:look.earringsSet)||1)===1;const src=`/glamgirl/party-time/${item.key==="earrings"?"earrings-1":item.key==="necklace"?"necklace-1":"bracelet-1"}_${item.value}.png`;return <button key={`${item.key}-${item.value}`} className={`detail-choice jewellery-choice jewellery-${item.key} ${active?"selected":""}`} onClick={()=>patch(item.key==="necklace"?{necklace:active?0:item.value,necklaceSet:1}:item.key==="earrings"?{earrings:active?0:item.value,earringsSet:1}:{bracelet:active?0:item.value})}><span className="jewellery-preview"><img src={appAsset(src)} alt="" /></span><strong>{item.name}</strong>{active&&<i>✓</i>}</button>})}{(["necklace","earrings","bracelet"] as const).map((key)=><button key={`no-${key}`} className={`detail-choice no-option-choice ${look[key]===0?"selected":""}`} onClick={()=>patch({[key]:0})}><span className="no-option-symbol">／</span><strong>No {key.charAt(0).toUpperCase()+key.slice(1)}</strong>{look[key]===0&&<i>✓</i>}</button>)}</div>
              </>}
              <div className="details-heading"><b>DINNER OUT COLLECTION</b><span>{dinnerOpened ? "Mystery Wardrobe opened ✓" : "Open the Dinner Out Mystery Wardrobe to use these rewards"}</span></div>
              {!dinnerOpened ? <p className="welcome-text">🍽️ Earn 4 challenge stars, then open Dinner Out from Mystery Wardrobes.</p> : <>
                <div className="option-group visual-group"><b>DRESS COLOURWAYS</b><div className="visual-choice-row">{dinnerDressVariants.map((v)=><button key={`dinner-dress-${v.dress}-${v.style}`} className={`visual-choice ${look.dress===v.dress&&look.dressStyle===v.style?"selected":""}`} onClick={()=>patch({dress:v.dress,dressStyle:v.style})}><span className="choice-preview"><KeriMannequin look={preview({dress:v.dress,dressStyle:v.style})}/></span><strong>{v.name}</strong></button>)}</div></div>
                <div className="option-group visual-group"><b>BLAZERS</b><div className="visual-choice-row">{dinnerJacketVariants.map((v)=><button key={`dinner-jacket-${v.jacket}-${v.style}`} className={`visual-choice ${look.jacket===v.jacket&&look.jacketStyle===v.style?"selected":""}`} onClick={()=>patch({jacket:v.jacket,jacketStyle:v.style})}><span className="choice-preview"><KeriMannequin look={preview({jacket:v.jacket,jacketStyle:v.style})}/></span><strong>{v.name}</strong></button>)}</div></div>
                <div className="option-group visual-group"><b>HEELS</b><div className="visual-choice-row">{dinnerShoeVariants.map((v)=>{const src=`/glamgirl/dinner-out/shoes-${v.shoes}_${v.style}.png`;return <button key={`dinner-shoe-${v.shoes}-${v.style}`} className={`visual-choice shoe-variant-choice ${look.shoes===v.shoes&&look.shoesStyle===v.style?"selected":""}`} onClick={()=>patch({shoes:v.shoes,shoesStyle:v.style})}><span className="shoe-preview"><img src={appAsset(src)} alt="" /></span><strong>{v.name}</strong>{look.shoes===v.shoes&&look.shoesStyle===v.style&&<i>✓</i>}</button>})}</div></div>
                <div className="details-heading"><b>JEWELLERY</b><span>Polished accessories for Dinner Out</span></div>
                <div className="detail-choice-row">{dinnerJewellery.map((item)=>{const active=look[item.key]===item.value&&((item.key==="necklace"?look.necklaceSet:look.earringsSet)||1)===item.set;const src=`/glamgirl/dinner-out/${item.key==="earrings"?"earrings-2":"necklace-2"}_${item.value}.png`;return <button key={`dinner-${item.key}-${item.value}`} className={`detail-choice jewellery-choice jewellery-${item.key} ${active?"selected":""}`} onClick={()=>patch(item.key==="necklace"?{necklace:active?0:item.value,necklaceSet:item.set}:{earrings:active?0:item.value,earringsSet:item.set})}><span className="jewellery-preview"><img src={appAsset(src)} alt="" /></span><strong>{item.name}</strong>{active&&<i>✓</i>}</button>})}{(["necklace","earrings"] as const).map((key)=><button key={`dinner-no-${key}`} className={`detail-choice no-option-choice ${look[key]===0?"selected":""}`} onClick={()=>patch({[key]:0})}><span className="no-option-symbol">／</span><strong>No {key.charAt(0).toUpperCase()+key.slice(1)}</strong>{look[key]===0&&<i>✓</i>}</button>)}</div>
              </>}
            </div>}
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
