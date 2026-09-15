import { StrictMode, useState, type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ColourStation from './ColourStation.tsx'

function StudioRoot(){
  const [page,setPage]=useState<'studio'|'colours'>('studio')
  if(page==='colours') return <ColourStation onBack={()=>setPage('studio')} onRecipes={()=>setPage('studio')}/>
  const intercept=(event:MouseEvent<HTMLDivElement>)=>{
    const target=event.target as HTMLElement
    if(target.closest('.colours-area')){
      event.preventDefault()
      event.stopPropagation()
      setPage('colours')
    }
  }
  return <div onClickCapture={intercept}><App/></div>
}

createRoot(document.getElementById('root')!).render(<StrictMode><StudioRoot/></StrictMode>)
