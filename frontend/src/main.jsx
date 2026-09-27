import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeSyncManager } from './services/syncManager'
import { registerServiceWorker } from './pwa/registerSW'
import { LanguageProvider } from './context/LanguageContext'
import PlatformLanguageGate from './components/i18n/PlatformLanguageGate'

initializeSyncManager()
registerServiceWorker()

createRoot(document.getElementById('root')).render(

    <LanguageProvider>
      <PlatformLanguageGate>
        <App />
      </PlatformLanguageGate>
    </LanguageProvider>
 
)
