import { useState } from 'react'
import './App.css'

type Clothing = {
  id: string
  name: string
  style: string
  shape: string
}

type Feature = {
  id: string
  name: string
  emoji: string
}

const clothing: Clothing[] = [
  { id: 'tshirt', name: 'T-Shirt', style: 'Casual • Sporty', shape: 'tshirt' },
  { id: 'blouse', name: 'Blouse', style: 'Elegant • Classic', shape: 'blouse' },
  { id: 'jeans', name: 'Jeans', style: 'Casual • Classic', shape: 'jeans' },
  { id: 'pleated-skirt', name: 'Pleated Skirt', style: 'Classic • Playful', shape: 'skirt' },
  { id: 'summer-dress', name: 'Summer Dress', style: 'Casual • Playful', shape: 'summer-dress' },
  { id: 'flowing-dress', name: 'Flowing Dress', style: 'Elegant • Glamorous', shape: 'flowing-dress' },
]

const colours = [
  { name: 'Red', value: '#e74c3c' },
  { name: 'Yellow', value: '#f5c542' },
  { name: 'Blue', value: '#3d7edb' },
  { name: 'Black', value: '#222222' },
  { name: 'White', value: '#ffffff' },
]

const features: Feature[] = [
  { id: 'trim', name: 'Contrast Trim', emoji: '〰️' },
  { id: 'pockets', name: 'Pockets', emoji: '▢' },
  { id: 'belt', name: 'Belt', emoji: '—' },
  { id: 'stripes', name: 'Stripes', emoji: '▥' },
  { id: 'floral', name: 'Floral Print', emoji: '🌸' },
  { id: 'sequins', name: 'Sequins', emoji: '✦' },
]

function App() {
  const [selectedClothing, setSelectedClothing] = useState(clothing[0])
  const [selectedColour, setSelectedColour] = useState(colours[0])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((current) => {
      if (current.includes(featureId)) {
        return current.filter((id) => id !== featureId)
      }

      if (current.length >= 3) {
        return current
      }

      return [...current, featureId]
    })
  }

  const resetDesign = () => {
    setSelectedClothing(clothing[0])
    setSelectedColour(colours[0])
    setSelectedFeatures([])
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <h1>Peyton's Fashion Studio</h1>
          <p>Design something amazing ✨</p>
        </div>

        <div className="designer-info">
          <span>Designer</span>
          <strong>Peyton</strong>
          <span className="stars">⭐ 0</span>
        </div>
      </header>

      <section className="design-page">

        <div className="design-header">
          <button className="back-button" onClick={() => window.location.reload()}>
            ← Studio
          </button>

          <div>
            <h2>🪞 Design Studio</h2>
            <p>Create a look you love!</p>
          </div>

          <div className="feature-counter">
            ✨ {selectedFeatures.length}/3 Features
          </div>
        </div>

        <div className="challenge-banner">
          <span>🎯</span>
          <div>
            <strong>WELCOME TO THE STUDIO</strong>
            <p>Create a look you love — there are no wrong answers!</p>
          </div>
        </div>

        <div className="design-workspace">

          <aside className="design-info">
            <h3>Your Design</h3>

            <div className="info-row">
              <span>👗 Clothing</span>
              <strong>{selectedClothing.name}</strong>
            </div>

            <div className="info-row">
              <span>🎨 Main Colour</span>
              <strong>{selectedColour.name}</strong>
            </div>

            <div className="info-row">
              <span>✨ Features</span>
              <strong>
                {selectedFeatures.length === 0
                  ? 'None yet'
                  : selectedFeatures
                      .map((id) => features.find((f) => f.id === id)?.name)
                      .join(', ')}
              </strong>
            </div>

            <div className="info-row">
              <span>💫 Natural Style</span>
              <strong>{selectedClothing.style}</strong>
            </div>
          </aside>

          <div className="fashion-stage">

            <div className="mirror-frame">
              <div className="mirror-top">✦</div>

              <div className={`fashion-garment ${selectedClothing.shape}`}>

                <div
                  className="garment-colour"
                  style={{ backgroundColor: selectedColour.value }}
                />

                {selectedFeatures.includes('trim') && (
                  <div className="garment-trim" />
                )}

                {selectedFeatures.includes('pockets') && (
                  <div className="pockets">
                    <span />
                    <span />
                  </div>
                )}

                {selectedFeatures.includes('belt') && (
                  <div className="belt-feature" />
                )}

                {selectedFeatures.includes('stripes') && (
                  <div className="stripe-feature">
                    <span />
                    <span />
                    <span />
                  </div>
                )}

                {selectedFeatures.includes('floral') && (
                  <div className="floral-feature">
                    🌸　🌼
                    <br />
                    🌺　🌸
                  </div>
                )}

                {selectedFeatures.includes('sequins') && (
                  <div className="sequin-feature">
                    ✦ ✧ ✦
                    <br />
                    ✧ ✦ ✧
                    <br />
                    ✦ ✧ ✦
                  </div>
                )}
              </div>

              <div className="mirror-label">YOUR DESIGN</div>
            </div>

            <div className="design-name">
              <span>✏️</span>
              <input
                type="text"
                placeholder="Name your design..."
              />
            </div>

          </div>
        </div>

        <div className="card-tray">

          <section className="card-section">
            <div className="tray-heading">
              <h3>👗 Clothing</h3>
              <span>Choose your outfit</span>
            </div>

            <div className="card-row">
              {clothing.map((item) => (
                <button
                  key={item.id}
                  className={`fashion-card ${
                    selectedClothing.id === item.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedClothing(item)}
                >
                  <div className={`mini-garment ${item.shape}`}>
                    <div className="mini-garment-colour" />
                  </div>

                  <strong>{item.name}</strong>
                  <small>{item.style}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="card-section">
            <div className="tray-heading">
              <h3>🎨 Colours</h3>
              <span>Choose your main colour</span>
            </div>

            <div className="colour-row">
              {colours.map((colour) => (
                <button
                  key={colour.name}
                  className={`colour-card ${
                    selectedColour.name === colour.name ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedColour(colour)}
                >
                  <span
                    className="colour-swatch"
                    style={{ backgroundColor: colour.value }}
                  />
                  <strong>{colour.name}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="card-section">
            <div className="tray-heading">
              <h3>✨ Features</h3>
              <span>Choose up to 3</span>
            </div>

            <div className="card-row feature-row">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  className={`feature-card ${
                    selectedFeatures.includes(feature.id) ? 'selected' : ''
                  }`}
                  onClick={() => toggleFeature(feature.id)}
                >
                  <span className="feature-icon">{feature.emoji}</span>
                  <strong>{feature.name}</strong>
                </button>
              ))}
            </div>
          </section>

        </div>

        <div className="design-actions">
          <button className="reset-button" onClick={resetDesign}>
            ↻ Start Again
          </button>

          <button className="finish-button">
            ✨ Finish Design
          </button>
        </div>

      </section>

      <footer>
        👗 Create &nbsp; • &nbsp; 🎨 Experiment &nbsp; • &nbsp; ✨ Discover &nbsp; • &nbsp; 💖 Have fun
      </footer>
    </main>
  )
}

export default App