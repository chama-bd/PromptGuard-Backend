import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Brain, 
  Clock, 
  Zap, 
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  CalendarDays,
  Target,
  Sparkles,
  MousePointer2,
  Filter
} from 'lucide-react';

import { usePortfolio } from '../context/PortfolioContext';

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

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

export default function EmployeePlanner() {
  const [view, setView] = useState('week'); // month, week, day
  const [activeDate, setActiveDate] = useState(new Date());
  const [aiInsights, setAiInsights] = useState([]);
  const { tasks, updateTaskStatus, addToPortfolio } = usePortfolio();

  const currentMonthLabel = activeDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const getTaskGridIndex = (taskIndex) => {
    if (taskIndex === 0) return 2;
    if (taskIndex === 1) return 24;
    if (taskIndex === 2) return 46;
    return 2 + taskIndex * 7;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex h-full bg-[#F5F6FA] overflow-hidden font-sans p-8 gap-8"
    >
      {/* Main Calendar Section (Left) */}
      <div className="flex-1 flex flex-col gap-8 overflow-hidden">
        
        {/* Top Header & Controls */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center shadow-sm border border-[#E4E6EF] text-[#009EF7]">
               <CalendarDays size={28} />
            </div>
            <div>
              <h1 className="text-[26px] font-black text-[#181C32] tracking-tight">Planning IA Intelligent</h1>
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#A1A5B7]">
                <span className="text-[#009EF7] uppercase tracking-wider">{currentMonthLabel}</span>
                <span className="opacity-30">•</span>
                <span>Optimisé par PromptGuard IA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-[20px] shadow-sm border border-[#E4E6EF]">
            <div className="flex bg-[#F5F8FA] rounded-[14px] p-1">
              {[
                { id: 'month', label: 'Mois', icon: LayoutGrid },
                { id: 'week', label: 'Semaine', icon: CalendarIcon },
                { id: 'day', label: 'Jour', icon: List },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-black transition-all ${view === v.id ? 'bg-white text-[#181C32] shadow-md' : 'text-[#A1A5B7] hover:text-[#181C32]'}`}
                >
                  <v.icon size={16} /> {v.label}
                </button>
              ))}
            </div>
            <div className="w-[1px] h-6 bg-[#E4E6EF] mx-2"></div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F8FA] rounded-[12px] text-[#181C32] transition-all border border-[#E4E6EF]"><ChevronLeft size={20} /></button>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F8FA] rounded-[12px] text-[#181C32] transition-all border border-[#E4E6EF]"><ChevronRight size={20} /></button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 px-6 py-2.5 bg-[#181C32] text-white rounded-[14px] font-black text-[13px] shadow-lg shadow-[#181C32]/20 flex items-center gap-2"
            >
              <Plus size={18} /> Ajouter un Événement
            </motion.button>
          </div>
        </motion.div>

        {/* The Calendar Grid */}
        <motion.div variants={itemVariants} className="flex-1 bg-white rounded-[32px] shadow-sm border border-[#E4E6EF] overflow-hidden flex flex-col group">
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-[#F1F3F9] bg-[#F9FAFB]/50">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="py-4 text-center text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest border-r border-[#F1F3F9] last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            
            {/* Hour labels overlay (only for week/day view) */}
            {(view === 'week' || view === 'day') && (
              <div className="absolute left-0 top-0 bottom-0 w-[80px] bg-white border-r border-[#F1F3F9] z-10 flex flex-col">
                {timeSlots.map(time => (
                  <div key={time} className="h-[80px] flex items-center justify-center text-[11px] font-black text-[#A1A5B7] border-b border-[#F1F3F9] last:border-b-0">
                    {time}
                  </div>
                ))}
              </div>
            )}

            {/* Grid Cells */}
            <div className={`grid ${view === 'month' ? 'grid-cols-7 grid-rows-5 h-full' : 'grid-cols-7 h-[800px] ml-[80px]'}`}>
              {view === 'month' ? (
                calendarDays.map((day) => (
                  <motion.div 
                    key={day}
                    whileHover={{ backgroundColor: '#F1FAFF' }}
                    className="border-r border-b border-[#F1F3F9] p-4 relative group cursor-pointer"
                  >
                    <span className={`text-[13px] font-black ${day === 12 ? 'text-white bg-[#009EF7] w-7 h-7 rounded-full flex items-center justify-center shadow-lg' : 'text-[#181C32]'}`}>
                      {day}
                    </span>
                  </motion.div>
                ))
              ) : (
                // Week View Slots
                Array.from({ length: 7 * 10 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-[#F1F3F9] h-[80px] relative group hover:bg-[#F9FAFB] transition-colors">
                    <div className="absolute inset-2 border-2 border-dashed border-[#009EF7]/20 rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {tasks.map((task, idx) => {
                      if (i === getTaskGridIndex(idx)) {
                        const isDone = task.status === 'TERMINEE';
                        const isEnCours = task.status === 'EN_COURS';
                        const bgColor = isDone ? '#E8FFF3' : isEnCours ? '#FFF8DD' : '#F1FAFF';
                        const textColor = isDone ? '#50CD89' : isEnCours ? '#F6C000' : '#009EF7';
                        const borderColor = isDone ? '#50CD89' : isEnCours ? '#F6C000' : '#009EF7';

                        return (
                          <motion.div 
                            key={task.id}
                            drag
                            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            whileHover={{ scale: 1.02, zIndex: 60 }}
                            whileDrag={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", zIndex: 60 }}
                            className="absolute -top-1 -left-1 -right-1 h-[140px] p-3 rounded-[16px] shadow-sm shadow-gray-200 cursor-grab active:cursor-grabbing border-l-[4px] bg-white z-20 flex flex-col gap-2 transition-all hover:shadow-lg"
                            style={{ borderLeftColor: borderColor }}
                          >
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: textColor }}></div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{task.time}</span>
                               </div>
                               {isDone && (
                                 <motion.div 
                                   initial={{ scale: 0 }}
                                   animate={{ scale: 1 }}
                                   className="bg-[#50CD89] text-white rounded-full p-0.5"
                                 >
                                   <CheckCircle2 size={12} />
                                 </motion.div>
                               )}
                             </div>
                             
                             <div className="flex flex-col">
                               <h4 className="text-[13px] font-black text-[#181C32] leading-tight line-clamp-1">{task.title}</h4>
                               <span className="text-[10px] font-bold text-gray-400 mt-0.5">{task.category}</span>
                             </div>

                             <div className="flex items-center gap-1 flex-wrap mt-auto">
                               {task.status !== 'TERMINEE' && task.status !== 'EN_COURS' && (
                                 <button 
                                   onClick={() => updateTaskStatus(task.id, 'EN_COURS')}
                                   className="text-[9px] font-black bg-[#F5F8FA] text-[#A1A5B7] hover:bg-[#FFF8DD] hover:text-[#F6C000] px-2 py-1 rounded-[6px] transition-all flex-1 text-center"
                                 >
                                   En cours
                                 </button>
                               )}
                               {task.status !== 'TERMINEE' && (
                                 <button 
                                   onClick={() => updateTaskStatus(task.id, 'TERMINEE')}
                                   className="text-[9px] font-black bg-[#F5F8FA] text-[#A1A5B7] hover:bg-[#E8FFF3] hover:text-[#50CD89] px-2 py-1 rounded-[6px] transition-all flex-1 text-center"
                                 >
                                   Terminer
                                 </button>
                               )}
                               {isDone && (
                                 <button 
                                   onClick={() => addToPortfolio(task)}
                                   className="text-[9px] font-black bg-[#181C32] text-white hover:bg-[#009EF7] px-2 py-1 rounded-[6px] transition-all w-full text-center shadow-sm"
                                 >
                                   + Portfolio
                                 </button>
                               )}
                             </div>
                          </motion.div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Helper Footer Overlay */}
          <div className="h-[60px] border-t border-[#F1F3F9] bg-white/80 backdrop-blur-md flex items-center px-8 gap-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#009EF7] animate-pulse"></div>
              <span className="text-[12px] font-black text-[#181C32]">Mode IA Optimisé Actif</span>
            </div>
            <div className="flex items-center gap-6 text-[12px] font-bold text-[#A1A5B7]">
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#009EF7]/20 border border-[#009EF7]/40"></div> Temps de Focus</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#F1416C]/20 border border-[#F1416C]/40"></div> Haute Priorité</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#50CD89]/20 border border-[#50CD89]/40"></div> Pic d'Efficacité</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Sidebar - AI Assistant & Productivity */}
      <div className="w-[380px] flex flex-col gap-8 shrink-0">
        
        {/* Productivity Radar / Energy */}
        <motion.div variants={itemVariants} className="bg-[#1E1E2D] rounded-[32px] p-8 shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#009EF7]/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#009EF7]/20 rounded-[14px] flex items-center justify-center text-[#009EF7] border border-white/10">
                     <Zap size={20} fill="currentColor" />
                  </div>
                  <h3 className="text-[16px] font-black tracking-tight">Flux d'Énergie</h3>
               </div>
               <span className="text-[11px] font-black text-[#50CD89] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Pic : 15:30</span>
            </div>

            <div className="flex items-end justify-between h-[80px] gap-1.5 mb-6">
              {[40, 20, 60, 90, 70, 30, 50, 80, 100, 60, 40, 20].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + (i * 0.05), duration: 1.5, ease: "circOut" }}
                  className={`flex-1 rounded-t-[6px] relative group/bar ${h > 80 ? 'bg-[#009EF7]' : h > 50 ? 'bg-[#009EF7]/40' : 'bg-white/10'}`}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#181C32] px-2 py-1 rounded-[6px] text-[10px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-lg">
                    {h}%
                  </div>
                </motion.div>
              ))}
            </div>
            
            <p className="text-[13px] text-gray-400 font-medium leading-relaxed italic">
              "Votre charge cognitive devrait culminer à 15h30. J'ai planifié du **Travail Profond** durant ce créneau."
            </p>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={itemVariants} className="flex-1 bg-white rounded-[32px] p-8 shadow-sm border border-[#E4E6EF] flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-black text-[#181C32]">Aperçus Intelligents</h3>
            <div className="w-9 h-9 rounded-[12px] bg-[#F1FAFF] flex items-center justify-center text-[#009EF7]">
               <Brain size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            {aiInsights.length === 0 ? (
              <div className="text-center py-8 bg-[#F9FAFB] rounded-[20px] border border-dashed border-[#E4E6EF]">
                <Sparkles size={24} className="mx-auto text-[#A1A5B7] mb-3" />
                <p className="text-[13px] font-bold text-[#A1A5B7]">Les aperçus IA apparaîtront ici.</p>
              </div>
            ) : (
              aiInsights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-[24px] border border-transparent hover:border-[#E4E6EF] transition-all flex flex-col gap-4 relative overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: insight.bg }}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center shadow-sm" style={{ color: insight.color }}>
                      <Target size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-black text-[#181C32]">{insight.title}</span>
                      <span className="text-[12px] font-bold text-[#7E8299] opacity-70">PromptGuard Assistant</span>
                    </div>
                  </div>
                  <p className="text-[13px] font-bold text-[#5E6278] leading-relaxed relative z-10">{insight.desc}</p>
                  <button className="w-full py-3 bg-white/80 backdrop-blur-md rounded-[14px] text-[12px] font-black text-[#181C32] shadow-sm hover:bg-[#181C32] hover:text-white transition-all relative z-10">
                    {insight.action}
                  </button>
                </motion.div>
              ))
            )}
          </div>

          <button className="w-full py-4 bg-[#F5F8FA] hover:bg-[#E4E6EF] rounded-[20px] text-[13px] font-black text-[#A1A5B7] transition-all uppercase tracking-widest border border-dashed border-[#E4E6EF]">
            Configurer les préférences IA
          </button>
        </motion.div>

        {/* Floating Productivity Hub Toggle (Mock) */}
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="bg-gradient-to-tr from-[#181C32] to-[#3F4254] p-5 rounded-[24px] shadow-2xl border border-white/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[#009EF7] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#009EF7]/20">
                <MousePointer2 size={18} />
             </div>
             <div className="flex flex-col">
                <span className="text-[13px] font-black text-white">Session de Focus</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inactif</span>
             </div>
          </div>
          <button className="px-5 py-2 bg-white text-[#181C32] rounded-[12px] font-black text-[12px] hover:scale-105 transition-all">Démarrer</button>
        </motion.div>

      </div>
    </motion.div>
  );
}
