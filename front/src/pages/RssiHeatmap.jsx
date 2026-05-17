import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, Info, Download, Filter, TrendingUp, AlertTriangle, ShieldCheck, Zap, MousePointer2, Activity } from 'lucide-react';

const xLabels = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'];
const yLabels = ['DÉVELOPPEMENT', 'FINANCE & OPS', 'RESSOURCES HUMAINES', 'JURIDIQUE & RISK', 'MARKETING'];

const generateGrid = () => {
  return Array(5).fill(Array(7).fill(0));
};

const getColor = (val) => {
  if (val < 0.2) return 'rgba(0, 158, 247, 0.05)'; 
  if (val < 0.4) return 'rgba(0, 158, 247, 0.2)';
  if (val < 0.6) return 'rgba(114, 57, 234, 0.4)';
  if (val < 0.8) return 'rgba(241, 65, 108, 0.6)'; 
  return 'rgba(241, 65, 108, 0.9)'; 
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function RssiHeatmap() {
  const [grid, setGrid] = useState(generateGrid());
  const [hoveredCell, setHoveredCell] = useState(null);
  const [activeDepartment, setActiveDepartment] = useState('Tous');

  // Simulate real-time updates for "alive" feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prev => prev.map(row => row.map(cell => {
        const change = (Math.random() - 0.5) * 0.1;
        return Math.max(0, Math.min(1, cell + change));
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans h-full bg-[#F5F6FA] overflow-y-auto scrollbar-hide"
    >
      {/* Header with Cinematic Blur */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center shadow-sm border border-[#E4E6EF] text-[#F1416C]">
              <Grid3X3 size={28} />
           </div>
           <div>
            <h1 className="text-[24px] font-black text-[#181C32] tracking-tight">Intelligence des Risques IA</h1>
            <div className="flex items-center text-[13px] text-[#A1A5B7] font-bold uppercase tracking-wider">
              <span>Analytiques SOC</span>
              <span className="mx-2 text-[#E4E6EF]">•</span>
              <span className="text-[#009EF7]">Distribution de Menaces Avancée</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-white border border-[#E4E6EF] rounded-[14px] p-1 mr-4 shadow-sm">
            {['Tous', 'Critique', 'Stable'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveDepartment(tab)}
                className={`px-5 py-2 text-[12px] font-black rounded-[10px] transition-all ${activeDepartment === tab ? 'bg-[#181C32] text-white' : 'text-[#7E8299] hover:text-[#181C32]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            className="bg-white border border-[#E4E6EF] px-5 py-3 rounded-[14px] text-[13px] font-black text-[#7E8299] hover:text-[#009EF7] transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={18} /> Exporter
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            className="bg-[#181C32] text-white px-5 py-3 rounded-[14px] text-[13px] font-black shadow-lg shadow-[#181C32]/20 transition-all flex items-center gap-2"
          >
            <Filter size={18} /> Rapports IA
          </motion.button>
        </div>
      </motion.div>

      {/* Main Grid & Side Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[30px]">
        
        {/* Left Stats Column */}
        <div className="lg:col-span-1 flex flex-col gap-[30px]">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[24px] p-8 shadow-sm border border-[#E4E6EF] relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={60} />
            </div>
            <span className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest mb-2 block">Score de Risque Global</span>
            <div className="flex items-end gap-2">
               <h2 className="text-[42px] font-black text-[#181C32] tracking-tighter leading-none">64.2</h2>
               <span className="text-[13px] font-black text-[#F1416C] mb-1 flex items-center gap-1">
                 <TrendingUp size={14} /> +8.4%
               </span>
            </div>
            <p className="text-[13px] font-bold text-[#A1A5B7] mt-4 leading-relaxed">Augmentation des tentatives de fuites PII détectées cette semaine.</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-[#1E1E2D] rounded-[24px] p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(0,158,247,0.15),transparent)] pointer-events-none"></div>
            <h3 className="text-white text-[15px] font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity size={18} className="text-[#009EF7]" /> Tendances SOC
            </h3>
            <div className="flex flex-col gap-5">
               {[
                 { label: 'Déviations IA', val: 'Haute', color: '#F1416C' },
                 { label: 'Alertes Critiques', val: '12', color: '#F1416C' },
                 { label: 'Stabilité Système', val: '98%', color: '#50CD89' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                   <span className="text-[13px] font-bold text-gray-400">{item.label}</span>
                   <span className="text-[13px] font-black uppercase px-2 py-0.5 rounded-[6px] bg-white/5" style={{ color: item.color }}>{item.val}</span>
                 </div>
               ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-[12px] bg-white/10 hover:bg-white/15 text-white text-[12px] font-black uppercase tracking-widest transition-all border border-white/5">
              Analyse Profonde
            </button>
          </motion.div>
        </div>

        {/* Heatmap Centerpiece */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-3 bg-white rounded-[24px] p-10 shadow-sm border border-[#E4E6EF] flex flex-col relative overflow-hidden"
        >
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#181C32 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#F1FAFF] rounded-[12px] flex items-center justify-center text-[#009EF7]">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-black text-[#181C32] tracking-tight uppercase">Matrice d'Intelligence des Menaces</h2>
                <p className="text-[13px] text-[#A1A5B7] font-bold">Basé sur 24 502 vecteurs d'attaque simulés en temps réel</p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-[#F8F9FA] px-5 py-3 rounded-[14px] border border-[#E4E6EF]">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#009EF7]/20 border border-[#009EF7]/40"></div>
                  <span className="text-[11px] font-black text-[#7E8299] uppercase tracking-tighter">Stable</span>
               </div>
               <div className="w-[1px] h-4 bg-[#E4E6EF]"></div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F1416C] shadow-[0_0_10px_rgba(241,65,108,0.5)]"></div>
                  <span className="text-[11px] font-black text-[#7E8299] uppercase tracking-tighter">Critique</span>
               </div>
            </div>
          </div>

          {/* Heatmap visualization */}
          <div className="flex flex-col relative z-10">
            {/* Header Labels */}
            <div className="flex mb-6 pl-[180px]">
               {xLabels.map((label, idx) => (
                 <div key={idx} className="flex-1 text-center">
                    <span className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest">{label}</span>
                 </div>
               ))}
            </div>

            <div className="flex flex-col gap-4">
              {grid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex items-center">
                  <div className="w-[180px] shrink-0">
                     <span className="text-[12px] font-black text-[#181C32] uppercase tracking-tight">{yLabels[rowIdx]}</span>
                  </div>
                  <div className="flex-1 flex gap-4">
                    {row.map((val, colIdx) => (
                      <motion.div 
                        key={colIdx}
                        onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx, val })}
                        onMouseLeave={() => setHoveredCell(null)}
                        whileHover={{ scale: 1.1, zIndex: 10, borderRadius: '8px' }}
                        className="flex-1 aspect-[1.5/1] rounded-[6px] relative cursor-crosshair group transition-all duration-500 border border-white/10"
                        style={{ backgroundColor: getColor(val) }}
                      >
                         {/* Cell Shimmer Effect */}
                         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         
                         {/* Active Pulse for high risk cells */}
                         {val > 0.8 && (
                           <motion.div 
                            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-[#F1416C]/20 rounded-[6px]"
                           />
                         )}

                         <AnimatePresence>
                           {hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10, scale: 0.9 }}
                               animate={{ opacity: 1, y: -45, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.9 }}
                               className="absolute left-1/2 -translate-x-1/2 w-[120px] bg-[#181C32] text-white rounded-[12px] p-3 shadow-2xl pointer-events-none"
                             >
                               <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Intensité</span>
                                  <span className="text-[16px] font-black">{(val * 100).toFixed(1)}%</span>
                                  <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-[#009EF7]" style={{ width: `${val * 100}%` }}></div>
                                  </div>
                               </div>
                               <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#181C32] rotate-45"></div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E4E6EF] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`} alt="user" />
                   </div>
                 ))}
               </div>
               <span className="text-[13px] font-bold text-[#A1A5B7]">Dernière révision par l'équipe SOC il y a 5 mins</span>
            </div>
            
            <button className="text-[13px] font-black text-[#009EF7] hover:text-[#008de0] flex items-center gap-2 group transition-all">
              VOIR LE JOURNAL D'AUDIT COMPLET <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer Floating Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] mb-8">
        {[
          { label: 'Temps de Réaction', val: '1.2s', desc: 'Moyenne SOC globale', icon: Zap, color: '#009EF7' },
          { label: 'Anomalies Bloquées', val: '4,892', desc: 'Ce dernier mois', icon: ShieldCheck, color: '#50CD89' },
          { label: 'Alerte Critique', val: 'Sarah C.', desc: 'Déviance comportementale', icon: AlertTriangle, color: '#F1416C' },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E4E6EF] flex items-center gap-5"
          >
            <div className="w-14 h-14 rounded-[18px] bg-[#F5F8FA] flex items-center justify-center" style={{ color: item.color }}>
               <item.icon size={24} />
            </div>
            <div>
               <span className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest">{item.label}</span>
               <div className="flex items-center gap-2">
                 <span className="text-[18px] font-black text-[#181C32]">{item.val}</span>
                 <span className="text-[12px] font-bold text-[#7E8299]">{item.desc}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ArrowRight({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
