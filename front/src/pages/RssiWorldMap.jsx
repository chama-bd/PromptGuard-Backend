import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Globe, Zap, Activity, 
  Lock, Unlock, Target, AlertCircle, RefreshCw, 
  MousePointer2, Eye, LayoutGrid 
} from 'lucide-react';

// Simplified but elegant world map dots for cinematic look
const generateWorldDots = () => {
  const dots = [];
  // Roughly construct continents
  const clusters = [
    { cx: 250, cy: 150, rx: 100, ry: 60, density: 0.6 }, // NA
    { cx: 300, cy: 300, rx: 60, ry: 80, density: 0.5 },  // SA
    { cx: 550, cy: 150, rx: 80, ry: 50, density: 0.7 },  // EU
    { cx: 580, cy: 300, rx: 60, ry: 80, density: 0.4 },  // AF
    { cx: 750, cy: 180, rx: 120, ry: 70, density: 0.8 }, // ASIA
    { cx: 800, cy: 350, rx: 40, ry: 30, density: 0.3 },  // OC
  ];

  clusters.forEach(c => {
    for (let i = 0; i < 200 * c.density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random();
      dots.push({
        x: c.cx + Math.cos(angle) * radius * c.rx,
        y: c.cy + Math.sin(angle) * radius * c.ry,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  });
  return dots;
};

const attackFlows = [];

export default function RssiWorldMap() {
  const [isProtected, setIsProtected] = useState(false);
  const [threatCount, setThreatCount] = useState(1204);
  const worldDots = useMemo(() => generateWorldDots(), []);

  // Simulate real-time threat activity
  useEffect(() => {
    if (!isProtected) {
      const interval = setInterval(() => {
        setThreatCount(prev => prev + Math.floor(Math.random() * 5));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isProtected]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col p-8 gap-[30px] font-sans h-full bg-[#0D0D12] overflow-hidden relative"
    >
      {/* Background Cinematic Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: isProtected ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05],
            scale: isProtected ? [1, 1.2, 1] : [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className={`absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full blur-[120px] ${isProtected ? 'bg-[#50CD89]' : 'bg-[#009EF7]'}`}
        ></motion.div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#7239EA]/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Top Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-30">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-[18px] flex items-center justify-center border border-white/10 text-white shadow-2xl">
              <Globe size={28} className={isProtected ? "text-[#50CD89]" : "text-[#009EF7] animate-pulse"} />
           </div>
           <div>
            <h1 className="text-[26px] font-black text-white tracking-tight">Vecteurs d'Attaque Globaux</h1>
            <div className="flex items-center text-[13px] text-gray-500 font-bold uppercase tracking-wider">
              <span className={isProtected ? "text-[#50CD89]" : "text-gray-500"}>SOC Central</span>
              <span className="mx-2 text-white/10">•</span>
              <span className={isProtected ? "text-white" : "text-[#F1416C]"}>{isProtected ? "Infrastructure Sécurisée" : "Surveillance en Temps Réel"}</span>
            </div>
          </div>
        </div>
        
        {/* Protection Toggle - REDESIGNED */}
        <div 
          onClick={() => setIsProtected(!isProtected)}
          className={`group flex items-center gap-6 px-6 py-4 rounded-[20px] backdrop-blur-2xl border transition-all duration-700 cursor-pointer shadow-2xl
            ${isProtected 
              ? 'bg-[#50CD89]/10 border-[#50CD89]/30' 
              : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
        >
          <div className="flex flex-col items-end">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isProtected ? 'text-[#50CD89]' : 'text-gray-500'}`}>
              Protection Enterprise
            </span>
            <span className={`text-[14px] font-black ${isProtected ? 'text-white' : 'text-gray-400'}`}>
              {isProtected ? 'ACTIVÉE' : 'DÉSACTIVÉE'}
            </span>
          </div>
          
          <div className={`w-[60px] h-[32px] rounded-full p-1.5 transition-colors duration-500 relative ${isProtected ? 'bg-[#50CD89]' : 'bg-gray-800'}`}>
            <motion.div 
              className="w-5 h-5 bg-white rounded-full shadow-2xl flex items-center justify-center text-black"
              animate={{ x: isProtected ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {isProtected ? <Lock size={12} /> : <Unlock size={12} />}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Map Content Area */}
      <div className="flex-1 relative rounded-[32px] border border-white/5 overflow-hidden bg-black/40 backdrop-blur-sm group">
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Holographic Side Panels */}
        <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!isProtected ? (
              <motion.div 
                key="threats"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="bg-white/5 backdrop-blur-2xl px-6 py-5 rounded-[24px] border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#F1416C] animate-pulse"></div>
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Flux de Menaces</span>
                  </div>
                  <h2 className="text-[36px] font-black text-white tracking-tighter leading-none mb-1">{threatCount.toLocaleString()}</h2>
                  <p className="text-[12px] font-bold text-[#F1416C]">+12% depuis l'heure dernière</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-2xl px-6 py-5 rounded-[24px] border border-white/10 shadow-2xl">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Régions à Haut Risque</span>
                  <div className="flex flex-col gap-3">
                    {['Asie Orientale', 'Europe de l\'Est', 'Amérique du Nord'].map((region, i) => (
                      <div key={region} className="flex items-center justify-between gap-8">
                        <span className="text-[12px] font-bold text-gray-300">{region}</span>
                        <div className={`w-12 h-1 bg-white/10 rounded-full overflow-hidden`}>
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${80 - i * 20}%` }}
                            className="h-full bg-[#F1416C]"
                           />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="secure"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="bg-[#50CD89]/5 backdrop-blur-2xl px-8 py-8 rounded-[32px] border border-[#50CD89]/20 shadow-[0_0_50px_rgba(80,205,137,0.1)] flex flex-col items-center text-center max-w-[300px]"
              >
                <div className="w-16 h-16 bg-[#50CD89] rounded-full flex items-center justify-center text-black mb-6 shadow-[0_0_30px_rgba(80,205,137,0.5)]">
                   <ShieldCheck size={32} />
                </div>
                <h3 className="text-white text-[18px] font-black mb-3">Bouclier Actif</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  Tous les flux de données sont désormais encryptés et routés via notre tunnel sécurisé IA.
                </p>
                <div className="mt-8 flex flex-col gap-3 w-full">
                   <div className="flex items-center justify-between text-[11px] font-black text-[#50CD89] uppercase tracking-widest">
                      <span>Intégrité</span>
                      <span>100%</span>
                   </div>
                   <div className="w-full h-1 bg-[#50CD89]/20 rounded-full overflow-hidden">
                      <motion.div animate={{ width: '100%' }} className="h-full bg-[#50CD89]" />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Right Analytics */}
        <div className="absolute bottom-8 right-8 z-20">
           <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/5 backdrop-blur-md p-6 rounded-[24px] border border-white/10 flex flex-col gap-4 shadow-2xl"
           >
              <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">État du Réseau</h4>
              <div className="flex gap-6">
                 <div className="flex flex-col">
                    <span className="text-[18px] font-black text-white">2.4ms</span>
                    <span className="text-[10px] font-bold text-gray-500">LATENCE</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[18px] font-black text-[#50CD89]">692Gbps</span>
                    <span className="text-[10px] font-bold text-gray-500">DÉBIT</span>
                 </div>
              </div>
              <div className="h-[40px] flex items-end gap-1">
                 {[40, 60, 45, 90, 70, 50, 85, 30, 60, 40].map((h, i) => (
                   <motion.div 
                    key={i}
                    animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className={`w-1.5 rounded-full ${isProtected ? 'bg-[#50CD89]/30' : 'bg-[#009EF7]/30'}`}
                   />
                 ))}
              </div>
           </motion.div>
        </div>

        {/* THE WORLD MAP VISUALIZATION */}
        <div className="absolute inset-0 flex items-center justify-center p-20">
          
          {/* Map Base - Dots */}
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <AnimatePresence>
              {worldDots.map((dot, i) => (
                <motion.circle 
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.size}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isProtected ? dot.opacity * 0.4 : dot.opacity,
                    fill: isProtected ? '#50CD89' : '#ffffff'
                  }}
                  transition={{ duration: 1.5, delay: (dot.x + dot.y) * 0.001 }}
                />
              ))}
            </AnimatePresence>

            {/* Attack flows */}
            <AnimatePresence>
              {!isProtected && attackFlows.map((flow) => (
                <g key={flow.id}>
                  {/* The Path Beam */}
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 2 }}
                    d={`M ${flow.start.x} ${flow.start.y} Q ${(flow.start.x + flow.end.x) / 2} ${Math.min(flow.start.y, flow.end.y) - 100} ${flow.end.x} ${flow.end.y}`}
                    stroke={flow.color}
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Moving Particle */}
                  <motion.circle 
                    r="3" 
                    fill={flow.color}
                    initial={{ offset: 0 }}
                    animate={{ offset: [0, 1] }}
                    transition={{ duration: flow.duration, repeat: Infinity, ease: "linear" }}
                  >
                    <animateMotion 
                      dur={`${flow.duration}s`} 
                      repeatCount="indefinite"
                      path={`M ${flow.start.x} ${flow.start.y} Q ${(flow.start.x + flow.end.x) / 2} ${Math.min(flow.start.y, flow.end.y) - 100} ${flow.end.x} ${flow.end.y}`}
                    />
                  </motion.circle>
                </g>
              ))}
            </AnimatePresence>
          </svg>

          {/* Cinematic Protection Transition Layers */}
          <AnimatePresence>
            {isProtected && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* Expanding Pulse Ring */}
                <motion.div 
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-[300px] h-[300px] border-[10px] border-[#50CD89] rounded-full"
                ></motion.div>
                
                {/* Secondary Pulse */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                  className="absolute w-[400px] h-[400px] bg-[#50CD89]/30 rounded-full blur-[40px]"
                ></motion.div>

                {/* Main Central Shield Icon */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative"
                >
                   <ShieldCheck size={180} className="text-[#50CD89] drop-shadow-[0_0_50px_rgba(80,205,137,0.8)]" strokeWidth={1} />
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-40px] border border-dashed border-[#50CD89]/40 rounded-full"
                   ></motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nodes - Interactive Points */}
          {!isProtected && [
            { x: '25%', y: '30%', color: '#009EF7' },
            { x: '75%', y: '35%', color: '#F1416C' },
            { x: '55%', y: '30%', color: '#7239EA' },
            { x: '30%', y: '60%', color: '#F1416C' },
          ].map((node, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ left: node.x, top: node.y }}
              className="absolute w-4 h-4"
            >
               <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className="absolute inset-[-10px] rounded-full"
                style={{ backgroundColor: node.color }}
               />
               <div className="w-2 h-2 rounded-full shadow-[0_0_15px_currentColor] relative z-10" style={{ color: node.color, backgroundColor: node.color }}></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="h-[60px] bg-white/5 backdrop-blur-xl rounded-[20px] border border-white/10 flex items-center justify-between px-8 relative z-30 overflow-hidden shadow-2xl"
      >
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <RefreshCw size={16} className={`text-gray-500 ${!isProtected ? 'animate-spin' : ''}`} />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Dernier Scan: <span className="text-white">Il y a 2s</span></span>
           </div>
           <div className="h-4 w-[1px] bg-white/10"></div>
           <div className="flex items-center gap-3">
              <Target size={16} className="text-[#F1416C]" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Attaques Bloquées: <span className="text-white">1,402</span></span>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isProtected ? 'bg-[#50CD89]' : 'bg-[#F1416C] animate-pulse'}`}></div>
           <span className="text-[11px] font-black text-white uppercase tracking-widest">
             {isProtected ? 'Système Impénétrable' : 'Menaces Détectées'}
           </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
