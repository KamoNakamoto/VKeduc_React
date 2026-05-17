import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!
// ! — non-null assertion, говорим TS что элемент точно существует

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)