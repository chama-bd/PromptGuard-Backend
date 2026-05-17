import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ArrowRight, Cloud, Bitcoin, Share2, Smartphone, Monitor, Shield, Zap, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import api from '../services/api';

const AnimatedCounter = ({ value, duration = 2, decimals = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (start === end) {
      setCount(end);
      return;
    }
    
    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / Math.max(end, 1)) * (decimals === 0 ? 1 : 10);
    
    let timer = setInterval(() => {
      start += decimals === 0 ? 1 : 0.1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, Math.max(incrementTime, 10));
    
    return () => clearInterval(timer);
  }, [value, duration, decimals]);
  
  return <span>{prefix}{decimals === 0 ? Math.floor(count) : count.toFixed(decimals)}{suffix}</span>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function RssiDashboard() {
  const [stats, setStats] = useState({
    totalPrompts: 0,
    blockedPrompts: 0,
    anonymizedPrompts: 0,
    averageRiskScore: 0.0,
    incidentsByDepartment: {}
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/api/dashboard/stats');
        setStats(statsRes.data);

        const logsRes = await api.get('/api/dashboard/logs');
        setLogs(logsRes.data);
      } catch (error) {
        console.error("Error loading RSSI dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const safeTotal = stats.totalPrompts || 1;
  const safeAnonymized = stats.anonymizedPrompts || 0;
  const safeBlocked = stats.blockedPrompts || 0;
  const safeSecure = Math.max(0, safeTotal - safeAnonymized - safeBlocked);

  const donutData = [
    { name: 'Anonymisés', value: safeAnonymized, color: '#50CD89' },
    { name: 'Bloqués', value: safeBlocked, color: '#F1416C' },
    { name: 'Sûrs', value: safeSecure, color: '#009EF7' }
  ];

  const sparkline1 = [{ v: 40 }, { v: 60 }, { v: 45 }, { v: 90 }, { v: 75 }];
  const sparkline2 = [{ v: 30 }, { v: 45 }, { v: 35 }, { v: 65 }, { v: 50 }];
  const sparkline3 = [{ v: 50 }, { v: 80 }, { v: 65 }, { v: 95 }, { v: 85 }];

  const areaData = logs.slice(0, 10).map((log, idx) => ({
    name: log.createdAt ? new Date(log.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : `Log ${idx}`,
    v1: log.status === 'BLOCKED' ? 100 : log.status === 'ANONYMIZED' ? 70 : 40,
    v2: log.leakType ? 85 : 30
  })).reverse();

  if (areaData.length === 0) {
    areaData.push(
      { name: '10:00', v1: 60, v2: 40 },
      { name: '11:00', v1: 80, v2: 50 },
      { name: '12:00', v1: 45, v2: 70 },
      { name: '13:00', v1: 95, v2: 60 }
    );
  }

  const scatterData = logs.map((log, idx) => ({
    x: idx * 45 + 120,
    y: log.status === 'BLOCKED' ? 620 : log.status === 'ANONYMIZED' ? 380 : 160,
    color: log.status === 'BLOCKED' ? '#F1416C' : log.status === 'ANONYMIZED' ? '#7239EA' : '#50CD89'
  })).slice(0, 15);

  if (scatterData.length === 0) {
    scatterData.push(
      { x: 100, y: 200, color: '#50CD89' },
      { x: 300, y: 600, color: '#F1416C' },
      { x: 500, y: 400, color: '#FFC700' }
    );
  }

  const threatLevel = safeBlocked > 5 ? { label: 'Critique', color: '#F1416C' } :
                      safeBlocked > 1 ? { label: 'Élevé', color: '#FFC700' } :
                      { label: 'Stable', color: '#50CD89' };

  const healthScore = Math.max(50, 100 - (safeBlocked * 10));

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans h-full overflow-y-auto scrollbar-hide bg-[#F5F6FA]"
    >
      {/* Top Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center shadow-sm border border-[#E4E6EF] text-[#009EF7]">
              <Shield size={28} />
           </div>
           <div>
            <h1 className="text-[22px] font-black text-[#181C32] tracking-tight">Centre de Commandement de Sécurité</h1>
            <div className="flex items-center text-[13px] text-[#A1A5B7] font-bold uppercase tracking-wider">
              <span>Portail Principal</span>
              <span className="mx-2 text-[#E4E6EF]">•</span>
              <span className="text-[#009EF7]">Intelligence en Temps Réel</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ y: -2, backgroundColor: '#F9FAFB' }} 
            className="bg-white border border-[#E4E6EF] text-[#7E8299] text-[13px] font-bold px-5 py-3 rounded-[14px] cursor-pointer shadow-sm hover:border-[#009EF7]/30 transition-all flex items-center gap-2"
          >
            Niveau de Menace : <span style={{ color: threatLevel.color }}>{threatLevel.label}</span>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }} 
            whileTap={{ scale: 0.95 }} 
            className="px-6 py-3 bg-[#181C32] hover:bg-[#181C32]/90 transition-all text-white rounded-[14px] font-black text-[14px] shadow-lg shadow-[#181C32]/20 flex items-center gap-2"
          >
            <Plus size={18} /> Déployer une Sonde
          </motion.button>
        </div>
      </motion.div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-[30px]">
          {/* Blue Card with Animated Gradient & Rings */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8, boxShadow: "0 30px 60px -15px rgba(0,158,247,0.3)" }}
            className="bg-gradient-to-br from-[#009EF7] to-[#7239EA] rounded-[24px] p-8 flex flex-col justify-between h-[230px] relative overflow-hidden transition-all duration-500 cursor-pointer group"
          >
            {/* Animated background rings */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] border-[1px] border-dashed border-white rounded-full"
            ></motion.div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                    <Zap size={16} fill="currentColor" />
                 </div>
                 <span className="text-[12px] font-black text-white/80 uppercase tracking-widest">Total des Prompts</span>
              </div>
              <h2 className="text-[48px] font-black text-white leading-none mb-2 tracking-tighter">
                <AnimatedCounter value={stats.totalPrompts} />
              </h2>
              <p className="text-[14px] font-bold text-white/70">Flux total de prompts analysés par le proxy</p>
            </div>
            
            <div className="relative z-10 w-full mt-auto">
              <div className="flex items-center justify-between text-white text-[13px] font-black mb-3">
                <span>Santé de l'Infrastructure</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-[6px]">{healthScore}%</span>
              </div>
              <div className="w-full h-[8px] bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                  className="h-full bg-white rounded-full relative"
                >
                   <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                   />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* External Links with Magnetic Hover Effect */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[24px] p-8 shadow-sm border border-[#E4E6EF] h-[195px] flex flex-col transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-black text-[#181C32] uppercase tracking-wider">Actions Rapides</h3>
              <button className="w-[28px] h-[28px] bg-[#F5F8FA] rounded-[8px] flex items-center justify-center text-[#A1A5B7] hover:text-[#009EF7] transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Protocoles de Sécurité', val: 'Vérifié', color: '#50CD89' },
                { label: 'Intégrité du Système', val: 'Optimal', color: '#009EF7' },
                { label: 'Sync Cloud', val: 'En Direct', color: '#7239EA' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ x: 5 }} 
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <span className="text-[13px] font-bold text-[#A1A5B7] group-hover:text-[#181C32] transition-colors">{item.label}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[11px] font-black uppercase" style={{ color: item.color }}>{item.val}</span>
                     <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-[30px]">
          {/* Earnings Card with Shimmer & Animated Donut */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.08)" }}
            className="bg-white rounded-[24px] p-8 h-[230px] shadow-sm border border-[#E4E6EF] relative overflow-hidden transition-all duration-500 group"
          >
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-[#009EF7]/5 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex items-center gap-4 mb-2 relative z-10">
              <h2 className="text-[32px] font-black text-[#181C32] tracking-tighter leading-none">
                <AnimatedCounter value={stats.anonymizedPrompts} />
              </h2>
              <span className="text-[11px] font-black text-[#50CD89] bg-[#E8FFF3] px-2.5 py-1 rounded-[8px] flex items-center gap-1">
                <TrendingUp size={12} /> +{Math.max(1, Math.floor(stats.averageRiskScore * 10) / 10)}%
              </span>
            </div>
            <p className="text-[13px] font-bold text-[#A1A5B7] mb-8 relative z-10 uppercase tracking-wider">Prompts Anonymisés</p>
            
            <div className="flex items-center relative z-10 gap-8">
              <div className="w-[90px] h-[90px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} dataKey="value" stroke="none" animationDuration={2000}>
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-3">
                {[
                  { label: 'Anonymisés', value: stats.anonymizedPrompts, color: 'bg-[#50CD89]' },
                  { label: 'Bloqués', value: stats.blockedPrompts, color: 'bg-[#F1416C]' },
                  { label: 'Sûrs', value: safeSecure, color: 'bg-[#009EF7]' }
                ].map((item, idx) => (
                  <motion.div key={idx} whileHover={{ x: 5 }} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color} group-hover:scale-150 transition-transform`}></div>
                      <span className="text-[12px] font-bold text-[#A1A5B7] group-hover:text-[#181C32]">{item.label}</span>
                    </div>
                    <span className="text-[13px] font-black text-[#181C32]">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Highlights with Pulsing Pulse Indicators */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[24px] p-8 h-[195px] shadow-sm border border-[#E4E6EF] transition-all duration-300"
          >
            <h3 className="text-[16px] font-black text-[#181C32] mb-6 uppercase tracking-wider">Audit de Performance</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Score Moyen de Risque', val: `${(stats.averageRiskScore || 0).toFixed(1)}`, total: '%', icon: '↗', color: '#50CD89' },
                { label: 'Total des Alertes', val: `${stats.blockedPrompts}`, total: '', icon: '↘', color: '#F1416C' },
                { label: 'Statut Global Menaces', val: threatLevel.label, total: '', icon: '↗', color: threatLevel.color }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#A1A5B7]">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black animate-pulse-soft`} style={{ color: item.color || '#181C32' }}>{item.icon}</span>
                    <span className="text-[14px] font-black text-[#181C32]">
                      {item.val}<span className="text-[#A1A5B7] font-bold text-[11px] ml-1">{item.total}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Column 3: Achievements with Cinematic List Entrance */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[24px] p-8 shadow-sm border border-[#E4E6EF] h-full flex flex-col group"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-black text-[#181C32] uppercase tracking-wider">Statut des Départements</h3>
              <p className="text-[12px] font-bold text-[#A1A5B7] mt-1">Niveau d'exposition des entités</p>
            </div>
            <div className="w-10 h-10 bg-[#F5F8FA] rounded-[12px] flex items-center justify-center text-[#A1A5B7] group-hover:bg-[#009EF7] group-hover:text-white transition-all">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            {[
              { name: 'Équipe IT / Devs', loc: 'Alice Dev', rate: `${stats.incidentsByDepartment?.['IT_DEV'] || 0} incidents`, data: sparkline1, color: '#009EF7' },
              { name: 'Département RH', loc: 'Bob HR', rate: `${stats.incidentsByDepartment?.['HR'] || 0} incidents`, data: sparkline2, color: '#50CD89' },
              { name: 'Service Juridique', loc: 'Charlie Legal', rate: `${stats.incidentsByDepartment?.['LEGAL'] || 0} incidents`, data: sparkline3, color: '#7239EA' },
              { name: 'Administrateur RSSI', loc: 'Admin', rate: `${stats.incidentsByDepartment?.['RSSI'] || 0} incidents`, data: sparkline2, color: '#F1416C' }
            ].map((user, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                whileHover={{ x: 10, backgroundColor: '#F9FAFB' }} 
                className="flex items-center justify-between p-3 rounded-[16px] transition-all cursor-pointer border border-transparent hover:border-[#E4E6EF]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[44px] h-[44px] rounded-[12px] bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                    <img src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=F5F8FA&color=${user.color.replace('#', '')}&bold=true`} alt="Avatar" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-[#181C32]">{user.name}</span>
                    <span className="text-[12px] font-bold text-[#A1A5B7] uppercase tracking-tighter">{user.loc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-[50px] h-[20px] hidden sm:block">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={user.data}>
                        <Line type="monotone" dataKey="v" stroke={user.color} strokeWidth={3} dot={false} isAnimationActive={true} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-[13px] font-black text-[#181C32]">{user.rate}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2 - Advanced Charts with Cinematic Entrance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
        {/* Performance Scatter */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white rounded-[24px] p-10 shadow-sm border border-[#E4E6EF] h-[450px] flex flex-col transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-[18px] font-black text-[#181C32] tracking-tight">Intelligence de Performance</h3>
              <p className="text-[14px] text-[#A1A5B7] font-medium mt-1">Distribution des menaces multicanaux</p>
            </div>
            <div className="flex items-center bg-[#F5F8FA] rounded-[12px] p-1.5 border border-[#E4E6EF]">
              <button className="px-5 py-2 text-[12px] font-black text-[#181C32] bg-white rounded-[10px] shadow-md uppercase tracking-widest transition-all">Direct</button>
              <button className="px-5 py-2 text-[12px] font-black text-[#A1A5B7] hover:text-[#181C32] rounded-[10px] uppercase tracking-widest transition-all">Historique</button>
            </div>
          </div>

          <div className="flex-1 -mx-6">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F9" />
                <XAxis type="number" dataKey="x" axisLine={false} tickLine={false} tick={{ fill: '#A1A5B7', fontSize: 11, fontWeight: 'bold' }} domain={[0, 700]} />
                <YAxis type="number" dataKey="y" axisLine={false} tickLine={false} tick={{ fill: '#A1A5B7', fontSize: 11, fontWeight: 'bold' }} domain={[0, 700]} />
                <Tooltip cursor={{ strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px' }} />
                <Scatter data={scatterData} animationDuration={2000}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-xl cursor-pointer hover:scale-125 transition-transform" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Step Performance */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white rounded-[24px] p-10 shadow-sm border border-[#E4E6EF] h-[450px] flex flex-col transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-[18px] font-black text-[#181C32] tracking-tight">Flux d'Intégrité de Sécurité</h3>
              <p className="text-[14px] text-[#A1A5B7] font-medium mt-1">Métriques de santé système en temps réel</p>
            </div>
            <div className="w-12 h-12 bg-[#F1FAFF] rounded-[14px] flex items-center justify-center text-[#009EF7]">
               <AlertCircle size={24} className="animate-pulse" />
            </div>
          </div>

          <div className="flex-1 -mx-8 mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#50CD89" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#50CD89" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThrt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009EF7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#009EF7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A5B7', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A5B7', fontSize: 11, fontWeight: 'bold' }} domain={[0, 120]} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px' }} />
                <Area type="step" dataKey="v1" stroke="#50CD89" strokeWidth={4} fill="url(#colorSec)" animationDuration={2500} />
                <Area type="step" dataKey="v2" stroke="#009EF7" strokeWidth={4} fill="url(#colorThrt)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
