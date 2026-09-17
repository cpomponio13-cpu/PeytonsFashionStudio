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
  | "finished";
type Tab = "clothing" | "style" | "details" | "model";
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
  category: "top" | "bottom";
};
const tops: Garment[] = wardrobeUnlocks
  .filter((x) => x.category === "top")
  .map((x) => ({ ...x, category: "top" }));
const bottoms: Garment[] = wardrobeUnlocks
  .filter((x) => x.category === "bottom")
  .map((x) => ({ ...x, category: "bottom" }));
const styles = [
  { id: 1, name: "Original" },
  { id: 2, name: "Ocean" },
  { id: 3, name: "Berry" },
  { id: 4, name: "Midnight" },
  { id: 5, name: "Pop" },
  { id: 6, name: "Fresh" },
];
const skinTones = ["#f8dfcc", "#efd0b4", "#d9a77f", "#b97c55", "#875237"];
const hairColours = [
  { id: 1, name: "Blonde" },
  { id: 2, name: "Honey" },
  { id: 3, name: "Copper" },
  { id: 4, name: "Auburn" },
  { id: 5, name: "Brown" },
  { id: 6, name: "Dark" },
];
const hairStyles = [1, 2, 3, 4, 5];
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
    [look, setLook] = useState<KeriLook>(defaultKeriLook),
    [gallery, setGallery] = useState<SavedLook[]>(readGallery),
    [finished, setFinished] = useState<SavedLook | null>(null),
    [newUnlock, setNewUnlock] = useState<string | null>(null),
    [features, setFeatures] = useState<string[]>(readFeatures),
    [challenge, setChallenge] = useState<FashionChallenge>(
      fashionChallenges[0],
    );
  const progression = getProgression(gallery);
  const unlocked = (g: Garment) => meetsUnlock(g.rule, progression);
  const nextReward = [
    ...wardrobeUnlocks.map((x) => ({ name: x.name, icon: "👗", rule: x.rule })),
    ...colourRewards.map((x) => ({ name: x.name, icon: "🎨", rule: x.rule })),
    ...featureRewards.map((x) => ({ name: x.name, icon: "✨", rule: x.rule })),
  ].find((r) => r.rule.kind !== "starter" && !meetsUnlock(r.rule, progression));
  const challengeProgress: ChallengeProgress = gallery.reduce((acc, item) => {
    if (
      !item.challengeId ||
      item.challengeId === "free" ||
      item.challengeScore == null ||
      item.challengeStars == null
    )
      return acc;
    const current = acc[item.challengeId] ?? {
      attempts: 0,
      bestStars: 0,
      bestScore: 0,
    };
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
    return !f || meetsUnlock(f.rule, progression);
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
    bottomName = bottoms.find((x) => x.id === look.bottom)?.name ?? "Bottom";
  const finishDesign = () => {
    const result =
      challenge.id === "free"
        ? null
        : scoreChallenge(challenge, look, features);
    const saved: SavedLook = {
      id: Date.now(),
      name: `${topName} + ${bottomName}`,
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
    const garmentUnlocks = [...tops, ...bottoms]
      .filter(
        (g) =>
          !meetsUnlock(g.rule, progression) &&
          meetsUnlock(g.rule, nextProgression),
      )
      .map((g) => `👗 ${g.name}`);
    const colourUnlocks = colourRewards
      .filter(
        (r) =>
          !meetsUnlock(r.rule, progression) &&
          meetsUnlock(r.rule, nextProgression),
      )
      .map((r) => `🎨 ${r.name}`);
    const featureUnlocks = featureRewards
      .filter(
        (r) =>
          !meetsUnlock(r.rule, progression) &&
          meetsUnlock(r.rule, nextProgression),
      )
      .map((r) => `✨ ${r.name}`);
    setGallery(next);
    localStorage.setItem("peyton-fashion-gallery", JSON.stringify(next));
    setFinished(saved);
    setNewUnlock(
      [...garmentUnlocks, ...colourUnlocks, ...featureUnlocks].join(" • ") ||
        null,
    );
    setScreen("finished");
  };
  const Header = ({ back = false }: { back?: boolean }) => (
    <header className="top-bar">
      {back ? (
        <button className="home-button" onClick={() => setScreen("home")}>
          ← Studio
        </button>
      ) : (
        <div className="brand">
          <span className="brand-icon">✦</span>Peyton's Fashion Studio
        </div>
      )}
      <div className="designer">Designer Peyton</div>
      <div className="star-count" title="Best challenge stars">
        ⭐ {progression.totalBestStars}
      </div>
    </header>
  );
  const GarmentChoice = ({
    item,
    type,
  }: {
    item: Garment;
    type: "top" | "bottom";
  }) => {
    const isUnlocked = unlocked(item),
      selected = look[type] === item.id;
    return (
      <button
        className={`visual-choice ${selected ? "selected" : ""} ${!isUnlocked ? "locked-choice" : ""}`}
        onClick={() => isUnlocked && patch({ [type]: item.id })}
        disabled={!isUnlocked}
      >
        <span className="choice-preview">
          <KeriMannequin look={preview({ [type]: item.id })} />
          {!isUnlocked && (
            <span className="lock-cover">
              🔒<small>{unlockLabel(item.rule)}</small>
            </span>
          )}
        </span>
        <strong>{item.name}</strong>
        {selected && isUnlocked && <i>✓</i>}
      </button>
    );
  };
  if (screen === "colours")
    return (
      <ColourStation
        onBack={() => setScreen("home")}
        onRecipes={() => setScreen("recipes")}
      />
    );
  if (screen === "recipes")
    return (
      <RecipeBook
        onBack={() => setScreen("home")}
        onMix={() => setScreen("colours")}
      />
    );
  if (screen === "features")
    return (
      <FeatureWall
        top={look.top}
        bottom={look.bottom}
        onBack={() => {
          syncFeatures();
          setScreen("home");
        }}
        onDesign={() => {
          syncFeatures();
          setTab("details");
          setScreen("design");
        }}
      />
    );
  if (screen === "finished" && finished) {
    const finishedChallenge =
      fashionChallenges.find((c) => c.id === finished.challengeId) ??
      fashionChallenges[0];
    return (
      <main className="app-shell">
        <Header />
        <section className="finish-page">
          <p className="eyebrow">YOUR FASHION CARD</p>
          <h1>Look Complete! ✨</h1>
          {newUnlock && (
            <div className="unlock-banner">
              🎁 <strong>NEW REWARD UNLOCKED!</strong>
              <span>{newUnlock}</span>
            </div>
          )}
          <div className="fashion-card">
            <div className="fashion-card-model">
              <KeriMannequin
                look={finished.look}
                features={finished.features ?? []}
              />
            </div>
            <div className="fashion-card-copy">
              <small>DESIGNED BY PEYTON</small>
              <h2>{finished.name}</h2>
              <p>
                {finishedChallenge.icon} {finishedChallenge.title}
              </p>
              {finished.features?.length ? (
                <p>
                  ✨{" "}
                  {finished.features
                    .map((id) => fashionFeatures.find((f) => f.id === id)?.name)
                    .join(" • ")}
                </p>
              ) : null}
              {finishedChallenge.id !== "free" ? (
                <div className="challenge-result">
                  <strong>
                    {"★".repeat(finished.challengeStars ?? 1)}
                    {"☆".repeat(3 - (finished.challengeStars ?? 1))} ·{" "}
                    {finished.challengeScore}% match
                  </strong>
                  <small>{finished.challengeMessage}</small>
                  {finished.matchedCues?.length ? (
                    <div className="match-feedback">
                      <b>What worked in your design</b>
                      <ul>
                        {finished.matchedCues.map((cue) => (
                          <li key={cue}>✓ {cue}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="free-design-result">
                  💖 Free Design · completely Peyton's own
                </div>
              )}
              <span>♡ Design • Create • Express</span>
            </div>
          </div>
          {finishedChallenge.id !== "free" && nextReward && (
            <div className="next-reward-card">
              <span>{nextReward.icon}</span>
              <div>
                <small>NEXT STUDIO REWARD</small>
                <strong>{nextReward.name}</strong>
                <p>
                  {rewardProgress(nextReward.rule, progression)} ·{" "}
                  {unlockLabel(nextReward.rule)}
                </p>
              </div>
            </div>
          )}
          <div className="finish-actions">
            <button
              className="reset-design"
              onClick={() => setScreen("gallery")}
            >
              View Gallery
            </button>
            <button
              className="finish-design"
              onClick={() => {
                reset();
                setChallenge(fashionChallenges[0]);
                setNewUnlock(null);
                setScreen("design");
              }}
            >
              Create Another →
            </button>
          </div>
        </section>
      </main>
    );
  }
  if (screen === "wardrobe")
    return (
      <main className="app-shell">
        <Header back />
        <section className="collection-page">
          <p className="eyebrow">WARDROBE</p>
          <h1>Your Clothing Collection</h1>
          <p>
            Challenge achievements unlock extra clothing. You have unlocked{" "}
            {tops.filter(unlocked).length + bottoms.filter(unlocked).length} of{" "}
            {tops.length + bottoms.length} pieces.
          </p>
          <p>
            ⭐ {progression.totalBestStars} best stars •{" "}
            {progression.completedChallenges} challenges completed •{" "}
            {progression.threeStarChallenges} three-star challenges
          </p>
          <div className="wardrobe-section">
            <h2>Tops</h2>
            <div className="wardrobe-grid">
              {tops.map((item) => (
                <article
                  className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`}
                  key={`t${item.id}`}
                >
                  <div className="gallery-model">
                    <KeriMannequin look={{ ...look, top: item.id }} />
                    {!unlocked(item) && (
                      <span className="wardrobe-lock">🔒</span>
                    )}
                  </div>
                  <strong>{item.name}</strong>
                  <small>
                    {unlocked(item)
                      ? "In your wardrobe"
                      : unlockLabel(item.rule)}
                  </small>
                </article>
              ))}
            </div>
          </div>
          <div className="wardrobe-section">
            <h2>Bottoms</h2>
            <div className="wardrobe-grid">
              {bottoms.map((item) => (
                <article
                  className={`wardrobe-card ${!unlocked(item) ? "wardrobe-locked" : ""}`}
                  key={`b${item.id}`}
                >
                  <div className="gallery-model">
                    <KeriMannequin look={{ ...look, bottom: item.id }} />
                    {!unlocked(item) && (
                      <span className="wardrobe-lock">🔒</span>
                    )}
                  </div>
                  <strong>{item.name}</strong>
                  <small>
                    {unlocked(item)
                      ? "In your wardrobe"
                      : unlockLabel(item.rule)}
                  </small>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  if (screen === "gallery")
    return (
      <main className="app-shell">
        <Header back />
        <section className="collection-page">
          <p className="eyebrow">FASHION GALLERY</p>
          <h1>Peyton's Collection</h1>
          <p>Every finished design is saved here.</p>
          {gallery.length === 0 ? (
            <div className="empty-gallery">
              🖼️<strong>No designs yet</strong>
              <span>Finish your first look to start the collection.</span>
              <button
                className="challenge-button"
                onClick={() => startChallenge(fashionChallenges[0])}
              >
                Start Designing →
              </button>
            </div>
          ) : (
            <div className="gallery-grid">
              {gallery.map((item) => {
                const itemChallenge = fashionChallenges.find(
                  (c) => c.id === item.challengeId,
                );
                return (
                  <article className="gallery-card" key={item.id}>
                    <div className="gallery-model">
                      <KeriMannequin
                        look={item.look}
                        features={item.features ?? []}
                      />
                    </div>
                    <strong>{item.name}</strong>
                    <small>
                      {itemChallenge && itemChallenge.id !== "free"
                        ? `${"★".repeat(item.challengeStars ?? 1)} ${itemChallenge.title}`
                        : item.features?.length
                          ? `✨ ${item.features.length} details`
                          : "Free Design"}
                    </small>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    );
  if (screen === "design")
    return (
      <main className="app-shell">
        <Header back />
        <section className="designer-page">
          <ChallengeCard
            active={challenge}
            onChange={setChallenge}
            progress={challengeProgress}
          />
          <div className="designer-workspace keri-workspace">
            <div className="designer-summary">
              <small>CURRENT LOOK</small>
              <h2>Your Outfit</h2>
              <p>
                {topName} • {bottomName}
              </p>
              <p>
                {features.length
                  ? `✨ ${features.length}/3 details added`
                  : "Mix, match and make it yours ✨"}
              </p>
            </div>
            <div className="designer-mirror keri-mirror">
              <div className="mirror-shine" />
              <KeriMannequin look={look} features={features} />
            </div>
            <div className="designer-tip">
              <span>♡</span>
              <strong>Design • Create • Express</strong>
              <p>There are no wrong designs.</p>
            </div>
          </div>
          <div className="design-drawer">
            <div className="drawer-tabs four-tabs">
              <button
                className={tab === "clothing" ? "active" : ""}
                onClick={() => setTab("clothing")}
              >
                👗 <span>Clothing</span>
              </button>
              <button
                className={tab === "style" ? "active" : ""}
                onClick={() => setTab("style")}
              >
                🎨 <span>Style</span>
              </button>
              <button
                className={tab === "details" ? "active" : ""}
                onClick={() => setTab("details")}
              >
                ✨ <span>Details {features.length}/3</span>
              </button>
              <button
                className={tab === "model" ? "active" : ""}
                onClick={() => setTab("model")}
              >
                💇 <span>Model</span>
              </button>
            </div>
            <div className="drawer-options keri-options">
              {tab === "clothing" && (
                <>
                  <div className="option-group visual-group">
                    <b>TOPS</b>
                    <div className="visual-choice-row">
                      {tops.map((item) => (
                        <GarmentChoice key={item.id} item={item} type="top" />
                      ))}
                    </div>
                  </div>
                  <div className="option-group visual-group">
                    <b>BOTTOMS</b>
                    <div className="visual-choice-row">
                      {bottoms.map((item) => (
                        <GarmentChoice
                          key={item.id}
                          item={item}
                          type="bottom"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
              {tab === "style" && (
                <>
                  <div className="option-group visual-group">
                    <b>TOP COLOUR / STYLE</b>
                    <div className="visual-choice-row">
                      {styles.map((item) => (
                        <button
                          key={item.id}
                          className={`visual-choice style-choice ${look.topStyle === item.id ? "selected" : ""}`}
                          onClick={() => patch({ topStyle: item.id })}
                        >
                          <span className="choice-preview">
                            <KeriMannequin
                              look={preview({ topStyle: item.id })}
                            />
                          </span>
                          <strong>{item.name}</strong>
                          {look.topStyle === item.id && <i>✓</i>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="option-group visual-group">
                    <b>BOTTOM COLOUR / STYLE</b>
                    <div className="visual-choice-row">
                      {styles.map((item) => (
                        <button
                          key={item.id}
                          className={`visual-choice style-choice ${look.bottomStyle === item.id ? "selected" : ""}`}
                          onClick={() => patch({ bottomStyle: item.id })}
                        >
                          <span className="choice-preview">
                            <KeriMannequin
                              look={preview({ bottomStyle: item.id })}
                            />
                          </span>
                          <strong>{item.name}</strong>
                          {look.bottomStyle === item.id && <i>✓</i>}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {tab === "details" && (
                <div className="details-drawer">
                  <div className="details-heading">
                    <b>FEATURES</b>
                    <span>{features.length}/3 selected</span>
                  </div>
                  <div className="detail-choice-row">
                    {fashionFeatures.map((f) => {
                      const active = features.includes(f.id),
                        isUnlocked = meetsUnlock(f.rule, progression);
                      return (
                        <button
                          key={f.id}
                          className={`detail-choice ${active ? "selected" : ""} ${!isUnlocked ? "locked-choice" : ""}`}
                          onClick={() => toggleFeature(f.id)}
                          disabled={!isUnlocked}
                        >
                          <span>{isUnlocked ? f.icon : "🔒"}</span>
                          <strong>{f.name}</strong>
                          <small>
                            {isUnlocked ? f.kind : unlockLabel(f.rule)}
                          </small>
                          {active && <i>✓</i>}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="feature-wall-link"
                    onClick={() => setScreen("features")}
                  >
                    Open Feature Wall →
                  </button>
                </div>
              )}
              {tab === "model" && (
                <>
                  <div className="option-group visual-group">
                    <b>HAIRSTYLE</b>
                    <div className="visual-choice-row">
                      {hairStyles.map((n) => (
                        <button
                          key={n}
                          className={`visual-choice model-choice ${look.hairStyle === n ? "selected" : ""}`}
                          onClick={() => patch({ hairStyle: n })}
                        >
                          <span className="choice-preview portrait-preview">
                            <KeriMannequin
                              portrait
                              look={preview({ hairStyle: n })}
                            />
                          </span>
                          <strong>Style {n}</strong>
                          {look.hairStyle === n && <i>✓</i>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="option-group model-settings">
                    <b>HAIR COLOUR</b>
                    <div className="model-pills">
                      {hairColours.map((item) => (
                        <button
                          key={item.id}
                          className={
                            look.hairColour === item.id ? "selected" : ""
                          }
                          onClick={() => patch({ hairColour: item.id })}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                    <b>SKIN TONE</b>
                    <div className="skin-row">
                      {skinTones.map((colour, i) => (
                        <button
                          key={i}
                          aria-label={`Skin tone ${i + 1}`}
                          className={look.skin === i + 1 ? "selected" : ""}
                          onClick={() => patch({ skin: i + 1 })}
                          style={{ background: colour }}
                        >
                          {look.skin === i + 1 ? "✓" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="designer-actions">
            <button className="reset-design" onClick={reset}>
              ↻ Start Again
            </button>
            <button className="finish-design" onClick={finishDesign}>
              ✓ Finish Design
            </button>
          </div>
          <p className="asset-credit">
            Keri character artwork by Konett • CC BY
          </p>
        </section>
      </main>
    );
  if (screen !== "home")
    return (
      <main className="app-shell">
        <Header />
        <section className="placeholder-page">
          <div className="placeholder-icon">✨</div>
          <h1>{screen}</h1>
          <p>We're building this part of the studio soon.</p>
          <button className="back-button" onClick={() => setScreen("home")}>
            ← Back to Studio
          </button>
        </section>
      </main>
    );
  const recipeCount = readRecipes().length;
  const scoredChallenges = fashionChallenges.filter((c) => c.id !== "free");
  const nextChallenge =
    scoredChallenges.find((c) => !challengeProgress[c.id]?.attempts) ??
    [...scoredChallenges].sort(
      (a, b) =>
        (challengeProgress[a.id]?.bestStars ?? 0) -
        (challengeProgress[b.id]?.bestStars ?? 0),
    )[0];
  return (
    <main className="app-shell">
      <Header />
      <section className="studio">
        <div className="welcome">
          <p className="eyebrow">WELCOME, DESIGNER</p>
          <h1>Your Fashion Studio</h1>
          <p className="welcome-text">
            Create outfits, discover colours and build your own fashion
            collection.
          </p>
        </div>
        <div className="studio-floor">
          <button
            className="studio-area wardrobe-area"
            onClick={() => setScreen("wardrobe")}
          >
            <span className="area-icon">👗</span>
            <span className="area-title">Wardrobe</span>
            <span className="area-description">
              {tops.filter(unlocked).length + bottoms.filter(unlocked).length}/
              {tops.length + bottoms.length} pieces unlocked
            </span>
          </button>
          <button
            className="studio-area colours-area"
            onClick={() => setScreen("colours")}
          >
            <span className="area-icon">🎨</span>
            <span className="area-title">Colour Station</span>
            <span className="area-description">Mix & discover colours</span>
          </button>
          <button
            className="studio-area features-area"
            onClick={() => setScreen("features")}
          >
            <span className="area-icon">✨</span>
            <span className="area-title">Feature Wall</span>
            <span className="area-description">Choose up to 3 details</span>
          </button>
          <button
            className="studio-area recipes-area"
            onClick={() => setScreen("recipes")}
          >
            <span className="area-icon">📖</span>
            <span className="area-title">Recipe Book</span>
            <span className="area-description">
              {recipeCount} colours discovered
            </span>
          </button>
          <button
            className="studio-area gallery-area"
            onClick={() => setScreen("gallery")}
          >
            <span className="area-icon">🖼️</span>
            <span className="area-title">Fashion Gallery</span>
            <span className="area-description">
              {gallery.length} saved {gallery.length === 1 ? "look" : "looks"}
            </span>
          </button>
          <button
            className="design-studio"
            onClick={() => startChallenge(fashionChallenges[0])}
          >
            <div className="mirror keri-home-mirror">
              <div className="mirror-shine" />
              <KeriMannequin look={look} />
            </div>
            <div className="design-studio-label">
              <span className="design-icon">🪞</span>
              <div>
                <strong>Design Studio</strong>
                <small>Tap the model to start designing</small>
              </div>
              <span className="arrow">→</span>
            </div>
          </button>
        </div>
        <div className="first-challenge">
          <div className="challenge-icon">{nextChallenge.icon}</div>
          <div className="challenge-copy">
            <span>
              CHALLENGE PROGRESS · {progression.completedChallenges}/
              {scoredChallenges.length} TRIED · ⭐ {progression.totalBestStars}/
              {scoredChallenges.length * 3}
            </span>
            <strong>{nextChallenge.title}</strong>
            <p>{nextChallenge.brief}</p>
          </div>
          <button
            className="challenge-button"
            onClick={() => startChallenge(nextChallenge)}
          >
            {challengeProgress[nextChallenge.id]?.attempts
              ? "Try Again →"
              : "Start Challenge →"}
          </button>
        </div>
      </section>
      <footer className="studio-footer">
        <span>👗 Create</span>
        <span>🎨 Experiment</span>
        <span>✨ Discover</span>
        <span>💖 Have fun</span>
      </footer>
    </main>
  );
}
export default App;
