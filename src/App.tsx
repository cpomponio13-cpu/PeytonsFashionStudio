import { useState } from 'react'
import './App.css'

type Screen = 'home' | 'design' | 'wardrobe' | 'colours' | 'features' | 'recipes' | 'gallery'
type Tab = 'clothing' | 'colour' | 'details'

const clothes = [
  { id: 'tshirt', name: 'T-Shirt', style: 'Casual • Sporty' },
  { id: 'blouse', name: 'Blouse', style: 'Elegant • Classic' },
  { id: 'jeans', name: 'Jeans', style: 'Casual • Classic' },
  { id: 'skirt', name: 'Pleated Skirt', style: 'Classic • Playful' },
  { id: 'summer', name: 'Summer Dress', style: 'Casual • Playful' },
  { id: 'flowing', name: 'Flowing Dress', style: 'Elegant • Glamorous' },
]
const colours = [
  { name: 'Red', value: '#e74c3c' }, { name: 'Yellow', value: '#f5c542' },
  { name: 'Blue', value: '#3d7edb' }, { name: 'Black', value: '#222222' },
  { name: 'White', value: '#ffffff' },
]
const details = [
  { id: 'trim', name: 'Contrast Trim', icon: '〰️' }, { id: 'pockets', name: 'Pockets', icon: '▢' },
  { id: 'belt', name: 'Belt', icon: '➖' }, { id: 'stripes', name: 'Stripes', icon: '▥' },
  { id: 'floral', name: 'Floral Print', icon: '🌸' }, { id: 'sequins', name: 'Sequins', icon: '✦' },
]

function Mannequin({ colour = '#8b589e', outfit = 'flowing', features = [] as string[] }) {
  return <div className="mannequin designer-mannequin">
    <div className="mannequin-head"/><div className="mannequin-neck"/>
    <div className={`designer-outfit outfit-${outfit}`} style={{ '--outfit-colour': colour } as React.CSSProperties}>
      <div className="outfit-top"/><div className="outfit-bottom"/>
      {features.includes('trim') && <div className="design-trim"/>}
      {features.includes('belt') && <div className="design-belt"/>}
      {features.includes('pockets') && <div className="design-pockets"><i/><i/></div>}
      {features.includes('stripes') && <div className="design-pattern stripes-pattern"/>}
      {features.includes('floral') && <div className="design-pattern floral-pattern">🌸 🌼<br/>🌺 🌸</div>}
      {features.includes('sequins') && <div className="design-pattern sequin-pattern">✦ ✧ ✦<br/>✧ ✦ ✧</div>}
    </div>
  </div>
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [tab, setTab] = useState<Tab>('clothing')
  const [clothing, setClothing] = useState(clothes[5])
  const [colour, setColour] = useState(colours[2])
  const [features, setFeatures] = useState<string[]>([])

  const toggleFeature = (id: string) => setFeatures(current => current.includes(id) ? current.filter(x => x !== id) : current.length < 3 ? [...current, id] : current)

  if (screen === 'design') {
    return <main className="app-shell"><header className="top-bar"><button className="home-button" onClick={() => setScreen('home')}>← Studio</button><div className="brand"><span className="brand-icon">✦</span>Design Studio</div><div className="star-count">⭐ 0</div></header>
      <section className="designer-page">
        <div className="designer-challenge"><span>🎯</span><div><small>YOUR CHALLENGE</small><strong>Create a Look You Love!</strong></div><button title="What does this mean?">💡</button></div>
        <div className="designer-workspace">
          <div className="designer-summary"><small>YOUR DESIGN</small><h2>{clothing.name}</h2><p>{clothing.style}</p><div className="summary-colour"><i style={{background: colour.value}}/> {colour.name}</div><p>{features.length ? features.map(id => details.find(d => d.id === id)?.name).join(' • ') : 'Add some details ✨'}</p></div>
          <div className="designer-mirror"><div className="mirror-shine"/><Mannequin colour={colour.value} outfit={clothing.id} features={features}/></div>
          <div className="designer-tip"><span>✨</span><p>Tap the choices below and watch your design change.</p></div>
        </div>
        <div className="design-drawer">
          <div className="drawer-tabs"><button className={tab === 'clothing' ? 'active' : ''} onClick={() => setTab('clothing')}>👗<span>Clothing</span></button><button className={tab === 'colour' ? 'active' : ''} onClick={() => setTab('colour')}>🎨<span>Colour</span></button><button className={tab === 'details' ? 'active' : ''} onClick={() => setTab('details')}>✨<span>Details</span><b>{features.length}/3</b></button></div>
          <div className="drawer-options">
            {tab === 'clothing' && clothes.map(item => <button key={item.id} className={`choice-tile ${clothing.id === item.id ? 'selected' : ''}`} onClick={() => setClothing(item)}><span className={`clothing-icon icon-${item.id}`}>👗</span><strong>{item.name}</strong></button>)}
            {tab === 'colour' && colours.map(item => <button key={item.name} className={`colour-choice ${colour.name === item.name ? 'selected' : ''}`} onClick={() => setColour(item)}><i style={{background:item.value}}/><strong>{item.name}</strong></button>)}
            {tab === 'details' && details.map(item => <button key={item.id} className={`choice-tile detail-choice ${features.includes(item.id) ? 'selected' : ''}`} onClick={() => toggleFeature(item.id)}><span>{item.icon}</span><strong>{item.name}</strong></button>)}
          </div>
        </div>
        <div className="designer-actions"><button className="reset-design" onClick={() => {setClothing(clothes[5]);setColour(colours[2]);setFeatures([])}}>↻ Start Again</button><button className="finish-design">✨ Finish Design</button></div>
      </section></main>
  }

  if (screen !== 'home') return <main className="app-shell"><header className="top-bar"><div className="brand"><span className="brand-icon">✦</span>Fashion Studio</div><div className="designer">Designer</div><div className="star-count">⭐ 0</div></header><section className="placeholder-page"><div className="placeholder-icon">✨</div><h1>{screen}</h1><p>We're building this part of the studio soon.</p><button className="back-button" onClick={() => setScreen('home')}>← Back to Studio</button></section></main>

  return <main className="app-shell"><header className="top-bar"><div className="brand"><span className="brand-icon">✦</span>Fashion Studio</div><div className="designer">Designer</div><div className="star-count">⭐ 0</div></header><section className="studio"><div className="welcome"><p className="eyebrow">WELCOME, DESIGNER</p><h1>Your Fashion Studio</h1><p className="welcome-text">Create outfits, discover colours and build your own fashion collection.</p></div><div className="studio-floor"><button className="studio-area wardrobe-area" onClick={() => setScreen('wardrobe')}><span className="area-icon">👗</span><span className="area-title">Wardrobe</span><span className="area-description">Your clothing collection</span></button><button className="studio-area colours-area" onClick={() => setScreen('colours')}><span className="area-icon">🎨</span><span className="area-title">Colour Station</span><span className="area-description">Colours & mixing</span></button><button className="studio-area features-area" onClick={() => setScreen('features')}><span className="area-icon">✨</span><span className="area-title">Feature Wall</span><span className="area-description">Details & decorations</span></button><button className="studio-area recipes-area" onClick={() => setScreen('recipes')}><span className="area-icon">📖</span><span className="area-title">Recipe Book</span><span className="area-description">Your colour discoveries</span></button><button className="studio-area gallery-area" onClick={() => setScreen('gallery')}><span className="area-icon">🖼️</span><span className="area-title">Fashion Gallery</span><span className="area-description">Your finished designs</span></button><button className="design-studio" onClick={() => setScreen('design')}><div className="mirror"><div className="mirror-shine"/><Mannequin/></div><div className="design-studio-label"><span className="design-icon">🪞</span><div><strong>Design Studio</strong><small>Tap the mannequin to start designing</small></div><span className="arrow">→</span></div></button></div><div className="first-challenge"><div className="challenge-icon">🎯</div><div className="challenge-copy"><span>YOUR FIRST CHALLENGE</span><strong>Create a Look You Love!</strong><p>No rules for your first design.</p></div><button className="challenge-button" onClick={() => setScreen('design')}>Start Designing <span>→</span></button></div></section><footer className="studio-footer"><span>👗 Create</span><span>🎨 Experiment</span><span>✨ Discover</span><span>💖 Have fun</span></footer></main>
}

export default App
