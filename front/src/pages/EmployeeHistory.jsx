import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MessageSquare, Calendar, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const mockHistory = [];

export default function EmployeeHistory() {
  const [search, setSearch] = useState('');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans"
    >
      {/* Header & Controls */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)]">
        <div>
          <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Historique des Conversations</h1>
          <p className="text-[14px] text-[#A1A5B7] font-medium">Retrouvez toutes vos interactions avec l'IA d'entreprise</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7] group-hover:text-[#009EF7] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un prompt..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[300px] bg-[#F5F8FA] border border-[#E4E6EF] text-[#181C32] rounded-[8px] pl-12 pr-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[#009EF7] focus:ring-1 focus:ring-[#009EF7] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#F5F8FA] border border-[#E4E6EF] px-4 py-3 rounded-[8px] text-[13px] font-bold text-[#7E8299] hover:text-[#009EF7] hover:border-[#009EF7]/30 transition-all">
            <Filter size={16} />
            Filtrer
          </button>
        </div>
      </motion.div>

      {/* History List */}
      <div className="flex flex-col gap-4">
        {mockHistory.map((item, idx) => (
          <motion.div 
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
            className="bg-white rounded-[12px] p-6 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border border-transparent hover:border-[#009EF7]/20 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-start gap-5">
              <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 shadow-sm
                ${item.status === 'blocked' ? 'bg-[#FFF5F8] text-[#F1416C]' : 'bg-[#F1FAFF] text-[#009EF7]'}`}
              >
                <MessageSquare size={24} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[16px] font-bold text-[#181C32] group-hover:text-[#009EF7] transition-colors">{item.title}</h3>
                  {item.status === 'blocked' && (
                    <span className="text-[11px] font-bold bg-[#FFF5F8] text-[#F1416C] px-2 py-0.5 rounded-[6px] border border-[#F1416C]/20">BLOQUÉ</span>
                  )}
                </div>
                <p className="text-[13px] text-[#A1A5B7] font-medium max-w-[600px] truncate mb-3">"{item.snippet}"</p>
                <div className="flex items-center gap-6 text-[12px] font-bold text-[#B5B5C3]">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {item.date}</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#B5B5C3]"></span> {item.tokens} tokens</span>
                </div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#F5F8FA] flex items-center justify-center text-[#A1A5B7] group-hover:bg-[#009EF7] group-hover:text-white transition-all shadow-sm">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
