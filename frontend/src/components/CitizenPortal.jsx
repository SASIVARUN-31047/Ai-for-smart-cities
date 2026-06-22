import React, { useState } from 'react';
import axios from 'axios';
import { LocateFixed, Navigation, ShieldCheck, Settings } from 'lucide-react';
import { API_BASE } from "../api";

export default function CitizenPortal() {
  const [formData, setFormData] = useState({ origin: '', destination: '', preference: 'fastest' });
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const zones = ["Downtown", "Suburb", "Industrial", "Commercial", "Residential"];

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI route fetch. An actual application would use A* pathfinding combined with our zone penalties
    setTimeout(async () => {
        try {
            // Fake hitting route prediction API
            // For now we'll just check live status to inject real context
            const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/v1/dashboard/live`);
            const liveData = res.data;
            
            const originStatus = liveData.find(z => z.zone_name === formData.origin);
            const destStatus = liveData.find(z => z.zone_name === formData.destination);
            
            let suggestion = "";
            let travelTime = "25 mins";
            let co2Saved = "0 kg";
            
            if (formData.preference === "eco") {
                 suggestion = "Taking the Metro Line B via Suburb avoids high-emission Industrial Zone.";
                 travelTime = "35 mins";
                 co2Saved = "2.4 kg";
            } else if (formData.preference === "fastest") {
                 if (originStatus && originStatus.predicted_congestion > 0.6) {
                     suggestion = `Heavy congestion detected at ${formData.origin}. Rerouting via Highway 20.`;
                     travelTime = "30 mins";
                 } else {
                     suggestion = "Clear roads ahead. Direct route generated.";
                 }
            } else {
                 if (destStatus && destStatus.predicted_pollution_risk === "High") {
                     suggestion = `High pollution at ${formData.destination}. Use car AC on recirculation mode or take underground paths.`;
                 } else {
                     suggestion = "Pollution levels are safe along your route. You can walk or bike!";
                     co2Saved = "3.1 kg";
                 }
            }
            
            setRouteResult({
                origin: formData.origin,
                destination: formData.destination,
                suggestion,
                travelTime,
                co2Saved,
                avoided: formData.preference === "eco" ? "Industrial" : null
            });
            setLoading(false);
        } catch(e) {
            console.error(e);
            setLoading(false);
        }
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 h-full p-4">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent inline-flex items-center">
            <Settings className="mr-3 text-cyan-400" />
            Citizen Personalization System
        </h2>
        <p className="text-gray-400 mt-2">Get AI-driven smart travel and lifestyle recommendations based on real-time city conditions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Navigation size={150} />
           </div>
           
           <h3 className="text-xl font-medium text-white mb-6">Plan Your Journey</h3>
           <form onSubmit={handlePredict} className="space-y-5">
               <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Origin Zone</label>
                   <select 
                      required
                      value={formData.origin} 
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                   >
                       <option value="" disabled>Select Starting Point...</option>
                       {zones.map(z => <option key={z} value={z}>{z}</option>)}
                   </select>
               </div>
               
               <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Destination Zone</label>
                   <select 
                      required
                      value={formData.destination} 
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                   >
                       <option value="" disabled>Select Destination...</option>
                       {zones.map(z => <option key={z} value={z}>{z}</option>)}
                   </select>
               </div>

               <div>
                   <label className="block text-sm font-medium text-gray-400 mb-2">Optimization Preference</label>
                   <div className="grid grid-cols-3 gap-3">
                       <button type="button" onClick={() => setFormData({...formData, preference: 'fastest'})} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${formData.preference === 'fastest' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500'}`}>Fastest</button>
                       <button type="button" onClick={() => setFormData({...formData, preference: 'eco'})} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${formData.preference === 'eco' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500'}`}>Eco-Friendly</button>
                       <button type="button" onClick={() => setFormData({...formData, preference: 'safe'})} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${formData.preference === 'safe' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500'}`}>Low Pollution</button>
                   </div>
               </div>

               <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 mt-4 disabled:opacity-70 flex justify-center items-center"
               >
                   {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Generate Smart Route"}
               </button>
           </form>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-900 border border-emerald-900/40 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
            {routeResult ? (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center space-x-3 text-emerald-400 border-b border-gray-800 pb-4">
                        <ShieldCheck size={28} />
                        <h3 className="text-xl font-bold text-white">Route Optimized</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Est. Time</p>
                            <p className="text-2xl font-bold text-gray-200 mt-1">{routeResult.travelTime}</p>
                        </div>
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">CO2 Saved</p>
                            <p className="text-2xl font-bold text-emerald-400 mt-1">{routeResult.co2Saved}</p>
                        </div>
                    </div>

                    <div className="bg-cyan-900/20 border border-cyan-800/50 rounded-xl p-4">
                        <p className="text-sm text-cyan-200 leading-relaxed font-medium">
                            {routeResult.suggestion}
                        </p>
                    </div>

                    {routeResult.avoided && (
                        <div className="flex items-center space-x-2 text-xs text-emerald-500/80 bg-emerald-950/20 px-3 py-2 rounded border border-emerald-900/30">
                            <LocateFixed size={14} />
                            <span>Successfully avoided high-risk area: <b>{routeResult.avoided}</b></span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <LocateFixed size={32} className="text-gray-500 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300">Awaiting Input</h3>
                    <p className="text-sm text-gray-500 mt-2">Enter your origin, destination, and preferences to receive an AI curated smart route.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
