import { useState } from 'react'
import Header  from './components/layout/Header'
import TabBar  from './components/layout/TabBar'
import Sidebar from './components/layout/Sidebar'
import AnalysePage  from './pages/AnalysePage'
import MetricsPage  from './pages/MetricsPage'

export default function App() {
  const [activeTab, setActiveTab] = useState('analyse')

  return (
    <div className="min-h-screen bg-[#020617]">

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <Header />

        <div className="flex flex-col lg:flex-row gap-5">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <TabBar active={activeTab} onChange={setActiveTab} />
            {activeTab === 'analyse' && <AnalysePage />}
            {activeTab === 'metrics' && <MetricsPage />}
          </div>

          {/* Info sidebar */}
          <Sidebar />
        </div>

        <footer className="mt-8 text-center text-[11px] text-slate-600">
          FraudGuard AI · Vehicle Insurance Fraud Detection · Powered by Random Forest
        </footer>
      </div>
    </div>
  )
}
