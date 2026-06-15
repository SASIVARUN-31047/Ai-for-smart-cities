import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { AlertCircle, Car, CloudRain, Zap, Trash2, Activity } from 'lucide-react';

export default function Dashboard() {
  const [liveData, setLiveData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, histRes, recRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/v1/dashboard/live'),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/v1/dashboard/history?limit=20'),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/v1/recommendations')
        ]);
        setLiveData(liveRes.data);
        setHistoryData(histRes.data);
        setRecommendations(recRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate Aggregates
  const totalVehicles = liveData.reduce((acc, curr) => acc + curr.vehicle_count, 0);
  const avgPollution = liveData.length ? (liveData.reduce((acc, curr) => acc + curr.pollution_level, 0) / liveData.length).toFixed(1) : 0;
  const totalEnergy = liveData.reduce((acc, curr) => acc + curr.energy_consumption, 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Vehicles" value={totalVehicles} icon={<Car className="text-cyan-400" />} trend="+5.2%" color="cyan" />
        <StatCard title="Avg AQI" value={avgPollution} icon={<CloudRain className="text-emerald-400" />} trend="-1.2%" color="emerald" />
        <StatCard title="Total Power (MW)" value={totalEnergy} icon={<Zap className="text-yellow-400" />} trend="+2.4%" color="yellow" />
        <StatCard title="System Health" value="98%" icon={<Activity className="text-rose-400" />} trend="Stable" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Live Traffic & Congestion Prediction</h3>
            <div className="h-72">
            {historyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData[0].data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="time" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
                    <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
                    <Tooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6'}} />
                    <Legend />
                    <Line type="monotone" dataKey="vehicle_count" name="Vehicles" stroke="#22d3ee" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="traffic_speed" name="Avg Speed (km/h)" stroke="#fbbf24" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <Loader />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pollution Area Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Pollution Levels (AQI)</h3>
              <div className="h-60">
                {historyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData[0].data}>
                      <defs>
                        <linearGradient id="colorPollution" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false}/>
                      <XAxis dataKey="time" stroke="#9CA3AF" hide />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6'}} />
                      <Area type="monotone" dataKey="pollution_level" name="AQI" stroke="#10b981" fillOpacity={1} fill="url(#colorPollution)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <Loader />}
              </div>
            </div>

            {/* Energy Bar Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Energy Demand (MW)</h3>
              <div className="h-60">
                {historyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historyData[0].data.slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false}/>
                      <XAxis dataKey="time" stroke="#9CA3AF" hide />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6'}} cursor={{fill: '#374151'}} />
                      <Bar dataKey="energy_consumption" name="Demand" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <Loader />}
              </div>
            </div>
          </div>

        </div>

        {/* AI Recommendations Sidebar */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gray-900 border border-emerald-900/50 rounded-2xl p-5 shadow-xl shadow-emerald-900/10">
            <h3 className="text-lg font-medium text-emerald-400 mb-4 flex items-center">
              <Zap className="mr-2 h-5 w-5" /> AI Action Center
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {recommendations.length > 0 ? recommendations.map((rec, i) => (
                <div key={i} className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 flex items-start space-x-3 transition-transform hover:scale-[1.02]">
                  <AlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-500 italic">No critical alerts right now. City is operating optimally.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
             <h3 className="text-lg font-medium text-gray-200 mb-4">Zone AI Status Overview</h3>
             <div className="space-y-3">
               {liveData.map((zone) => (
                 <div key={zone.zone_id} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center border border-gray-700/50">
                    <div>
                      <h4 className="font-medium text-sm text-gray-200">{zone.zone_name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Waste Risk: {zone.predicted_waste_risk}</p>
                    </div>
                    <div className="flex space-x-2">
                       <Badge type={zone.predicted_pollution_risk === 'High' ? 'danger' : 'success'} text="AQI" />
                       <Badge type={zone.predicted_congestion > 0.6 ? 'warning' : 'success'} text="TRF" />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents
function StatCard({ title, value, icon, trend, color }) {
  const bgColors = {
    cyan: 'bg-cyan-500/10 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
    rose: 'bg-rose-500/10 border-rose-500/20'
  };
  
  return (
    <div className={`p-5 rounded-2xl border ${bgColors[color]} backdrop-blur-sm transition-all hover:shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-gray-800/50 rounded-lg backdrop-blur-md">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold bg-white bg-clip-text text-transparent">{value}</h2>
        <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-emerald-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function Badge({ type, text }) {
  const styles = {
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
  };
  return <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${styles[type]}`}>{text}</span>;
}

function Loader() {
  return <div className="w-full h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div></div>;
}
