import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Search, Filter, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const incidentsData = [];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function RssiIncidents() {
  const [search, setSearch] = useState('');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'bloqué':
        return <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#F1416C] bg-[#FFF5F8] px-2.5 py-1 rounded-[6px] border border-[#F1416C]/20"><ShieldAlert size={14} /> BLOQUÉ</span>;
      case 'en cours':
        return <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#F6C000] bg-[#FFF8DD] px-2.5 py-1 rounded-[6px] border border-[#F6C000]/20"><Clock size={14} /> ENQUÊTE</span>;
      case 'résolu':
        return <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#50CD89] bg-[#E8FFF3] px-2.5 py-1 rounded-[6px] border border-[#50CD89]/20"><CheckCircle2 size={14} /> RÉSOLU</span>;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critique': return 'bg-[#F1416C]';
      case 'Haute': return 'bg-[#E88B11]';
      case 'Moyenne': return 'bg-[#F6C000]';
      case 'Basse': return 'bg-[#009EF7]';
      default: return 'bg-gray-400';
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans h-full overflow-hidden"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)] shrink-0">
        <div>
          <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Gestion des Incidents</h1>
          <p className="text-[14px] text-[#A1A5B7] font-medium">Examiner et résoudre les tentatives de fuite de données IA</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7] group-hover:text-[#009EF7] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher des incidents..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[300px] bg-[#F5F8FA] border border-[#E4E6EF] text-[#181C32] rounded-[8px] pl-12 pr-4 py-2.5 text-[13px] font-medium focus:outline-none focus:border-[#009EF7] focus:ring-1 focus:ring-[#009EF7] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#F5F8FA] border border-[#E4E6EF] px-4 py-2.5 rounded-[8px] text-[13px] font-bold text-[#7E8299] hover:text-[#009EF7] hover:border-[#009EF7]/30 transition-all">
            <Filter size={16} />
            Filtrer
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="flex flex-col gap-4">
          {incidentsData.map((inc, idx) => (
            <motion.div 
              key={inc.id}
              whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
              className="bg-white rounded-[12px] p-6 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border-l-4 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{ borderLeftColor: inc.severity === 'Critique' ? '#F1416C' : inc.severity === 'Haute' ? '#E88B11' : '#F6C000' }}
            >
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-bold text-[#009EF7] bg-[#F1FAFF] px-2 py-1 rounded-[6px]">{inc.id}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getSeverityColor(inc.severity)}`}></span>
                    <span className="text-[13px] font-bold text-[#181C32]">{inc.severity} Sévérité</span>
                  </div>
                  <span className="text-[13px] font-medium text-[#A1A5B7] flex items-center gap-1"><Clock size={14} /> {inc.time}</span>
                </div>
                
                <div>
                  <h3 className="text-[16px] font-bold text-[#181C32] mb-1">{inc.type}</h3>
                  <p className="text-[14px] text-[#7E8299] font-medium">"{inc.desc}"</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#A1A5B7]">Impliqué :</span>
                  <span className="text-[13px] font-bold text-[#181C32] bg-[#F5F8FA] px-2 py-0.5 rounded">{inc.emp}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 shrink-0">
                {getStatusBadge(inc.status)}
                
                {inc.status === 'blocked' && (
                  <button className="text-[13px] font-bold text-white bg-[#009EF7] hover:bg-[#008de0] px-4 py-2 rounded-[8px] transition-colors shadow-sm">
                    Démarrer l'Enquête
                  </button>
                )}
                {inc.status === 'investigating' && (
                  <button className="text-[13px] font-bold text-white bg-[#50CD89] hover:bg-[#47BE7D] px-4 py-2 rounded-[8px] transition-colors shadow-sm">
                    Marquer comme Résolu
                  </button>
                )}
                {inc.status === 'resolved' && (
                  <button className="text-[13px] font-bold text-[#7E8299] bg-[#F5F8FA] hover:bg-[#E4E6EF] px-4 py-2 rounded-[8px] transition-colors">
                    Voir le Rapport
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
