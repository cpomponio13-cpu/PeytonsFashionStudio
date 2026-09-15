import { useState } from 'react'
import './App.css'

type Screen = 'home' | 'design' | 'wardrobe' | 'colours' | 'features' | 'recipes' | 'gallery'

function Mannequin() {
  return <div className="mannequin"><div className="mannequin-head"/><div className="mannequin-neck"/><div className="mannequin-body"/><div className="mannequin-skirt"/></div>
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')

  if (screen === 'design') {
    return <main className="app-shell"><header className="top-bar"><div className="brand"><span className="brand-icon">✦</span>Fashion Studio</div><button className="home-button" onClick={() => setScreen('home')}>← Studio</button><div className="star-count">⭐ 0</div></header><section className="placeholder-page"><div className="placeholder-icon">🪞</div><h1>Design Studio</h1><p>The new simplified designer is coming next.</p><div className="large-mirror"><div className="mirror-shine"/><Mannequin/></div><button className="back-button" onClick={() => setScreen('home')}>← Back to Studio</button></section></main>
  }

  if (screen !== 'home') {
    return <main className="app-shell"><header className="top-bar"><div className="brand"><span className="brand-icon">✦</span>Fashion Studio</div><div className="designer">Designer</div><div className="star-count">⭐ 0</div></header><section className="placeholder-page"><div className="placeholder-icon">✨</div><h1>{screen}</h1><p>We're building this part of the studio soon.</p><button className="back-button" onClick={() => setScreen('home')}>← Back to Studio</button></section></main>
  }

  return <main className="app-shell"><header className="top-bar"><div className="brand"><span className="brand-icon">✦</span>Fashion Studio</div><div className="designer">Designer</div><div className="star-count">⭐ 0</div></header><section className="studio"><div className="welcome"><p className="eyebrow">WELCOME, DESIGNER</p><h1>Your Fashion Studio</h1><p className="welcome-text">Create outfits, discover colours and build your own fashion collection.</p></div><div className="studio-floor"><button className="studio-area wardrobe-area" onClick={() => setScreen('wardrobe')}><span className="area-icon">👗</span><span className="area-title">Wardrobe</span><span className="area-description">Your clothing collection</span></button><button className="studio-area colours-area" onClick={() => setScreen('colours')}><span className="area-icon">🎨</span><span className="area-title">Colour Station</span><span className="area-description">Colours & mixing</span></button><button className="studio-area features-area" onClick={() => setScreen('features')}><span className="area-icon">✨</span><span className="area-title">Feature Wall</span><span className="area-description">Details & decorations</span></button><button className="studio-area recipes-area" onClick={() => setScreen('recipes')}><span className="area-icon">📖</span><span className="area-title">Recipe Book</span><span className="area-description">Your colour discoveries</span></button><button className="studio-area gallery-area" onClick={() => setScreen('gallery')}><span className="area-icon">🖼️</span><span className="area-title">Fashion Gallery</span><span className="area-description">Your finished designs</span></button><button className="design-studio" onClick={() => setScreen('design')}><div className="mirror"><div className="mirror-shine"/><Mannequin/></div><div className="design-studio-label"><span className="design-icon">🪞</span><div><strong>Design Studio</strong><small>Tap the mannequin to start designing</small></div><span className="arrow">→</span></div></button></div><div className="first-challenge"><div className="challenge-icon">🎯</div><div className="challenge-copy"><span>YOUR FIRST CHALLENGE</span><strong>Create a Look You Love!</strong><p>No rules for your first design.</p></div><button className="challenge-button" onClick={() => setScreen('design')}>Start Designing <span>→</span></button></div></section><footer className="studio-footer"><span>👗 Create</span><span>🎨 Experiment</span><span>✨ Discover</span><span>💖 Have fun</span></footer></main>
}

export default App
