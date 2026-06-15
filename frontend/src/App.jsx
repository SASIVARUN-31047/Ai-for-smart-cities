import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DigitalTwin from './components/DigitalTwin';
import CitizenPortal from './components/CitizenPortal';
import { LayoutDashboard, Map, User } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              SmartCityOS
            </h1>
            <p className="text-sm text-gray-400 mt-1">AI-Powered Simulator</p>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <Link to="/" className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-cyan-400">
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link to="/digital-twin" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 rounded-xl transition-colors text-gray-300 hover:text-cyan-400">
              <Map size={20} />
              <span className="font-medium">Digital Twin</span>
            </Link>
            <Link to="/citizen" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 rounded-xl transition-colors text-gray-300 hover:text-cyan-400">
              <User size={20} />
              <span className="font-medium">Citizen Portal</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 flex items-center justify-between px-8 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-gray-200">System Overview</h2>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                AI Engine: Active
              </span>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                <User size={16} className="text-gray-400"/>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/digital-twin" element={<DigitalTwin />} />
              <Route path="/citizen" element={<CitizenPortal />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
