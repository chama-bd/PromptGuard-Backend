import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

const employeesData = [];

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

export default function RssiEmployees() {
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);

  return (
    <div className="relative flex h-full font-sans overflow-hidden">
      
      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col p-8 gap-[30px]"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border border-white/50">
          <div>
            <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Surveillance des Employés</h1>
            <p className="text-[14px] text-[#A1A5B7] font-medium">Gérer et examiner les scores de sécurité des employés</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7] group-hover:text-[#009EF7] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un employé..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[250px] bg-[#F5F8FA] border border-[#E4E6EF] text-[#181C32] rounded-[8px] pl-12 pr-4 py-2.5 text-[13px] font-medium focus:outline-none focus:border-[#009EF7] focus:ring-1 focus:ring-[#009EF7] transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-[#F5F8FA] border border-[#E4E6EF] px-4 py-2.5 rounded-[8px] text-[13px] font-bold text-[#7E8299] hover:text-[#009EF7] hover:border-[#009EF7]/30 transition-all">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)] overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E6EF] text-[12px] font-bold text-[#A1A5B7] uppercase tracking-wider bg-[#F9FAFB]">
                  <th className="py-4 px-6">Nom</th>
                  <th className="py-4 px-6">Département</th>
                  <th className="py-4 px-6">Niveau de Risque</th>
                  <th className="py-4 px-6">Incidents</th>
                  <th className="py-4 px-6">Dernière Activité</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeesData.map((emp, idx) => (
                  <motion.tr 
                    key={emp.id}
                    whileHover={{ backgroundColor: '#F5F8FA' }}
                    onClick={() => setSelectedEmp(emp)}
                    className="border-b border-[#E4E6EF] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${emp.name.replace(' ', '+')}&background=${emp.avatarBg}&color=${emp.avatarColor}`} alt="Avatar" className="w-[40px] h-[40px] rounded-[8px] shadow-sm" />
                        <span className="text-[14px] font-bold text-[#181C32] group-hover:text-[#009EF7] transition-colors">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[13px] font-bold text-[#7E8299]">{emp.dept}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] h-[6px] bg-[#E4E6EF] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${emp.risk === 'Critique' ? 'bg-[#F1416C]' : emp.risk === 'Moyen' ? 'bg-[#F6C000]' : 'bg-[#50CD89]'}`} 
                            style={{ width: `${emp.score}%` }}
                          ></div>
                        </div>
                        <span className={`text-[12px] font-bold ${emp.risk === 'Critique' ? 'text-[#F1416C]' : emp.risk === 'Moyen' ? 'text-[#F6C000]' : 'text-[#50CD89]'}`}>
                          {emp.score}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[13px] font-bold px-2 py-1 rounded-[6px] ${emp.incidents > 10 ? 'bg-[#FFF5F8] text-[#F1416C]' : emp.incidents > 4 ? 'bg-[#FFF8DD] text-[#F6C000]' : 'bg-[#E8FFF3] text-[#50CD89]'}`}>
                        {emp.incidents}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[13px] font-medium text-[#A1A5B7]">
                      {emp.lastActive}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-[13px] font-bold text-[#009EF7] hover:text-[#008de0] bg-[#F1FAFF] px-3 py-1.5 rounded-[6px] transition-colors">
                        Voir Détails
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {selectedEmp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmp(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
            ></motion.div>

            {/* Slide-in Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 w-[400px] h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 flex flex-col"
            >
              <div className="h-[70px] border-b border-[#E4E6EF] flex items-center justify-between px-6 shrink-0 bg-[#F9FAFB]">
                <h2 className="text-[16px] font-bold text-[#181C32]">Détails de l'Employé</h2>
                <button onClick={() => setSelectedEmp(null)} className="w-8 h-8 rounded-full bg-white border border-[#E4E6EF] flex items-center justify-center text-[#A1A5B7] hover:text-[#F1416C] transition-colors shadow-sm">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                <div className="flex flex-col items-center text-center">
                  <img src={`https://ui-avatars.com/api/?name=${selectedEmp.name.replace(' ', '+')}&background=${selectedEmp.avatarBg}&color=${selectedEmp.avatarColor}&size=200`} alt="Avatar" className="w-24 h-24 rounded-[16px] shadow-md mb-4" />
                  <h2 className="text-[22px] font-bold text-[#181C32] mb-1">{selectedEmp.name}</h2>
                  <span className="text-[13px] font-bold text-[#009EF7] bg-[#F1FAFF] px-3 py-1 rounded-full">{selectedEmp.dept}</span>
                </div>

                <div className="bg-[#F5F8FA] rounded-[12px] p-6 border border-[#E4E6EF]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-bold text-[#A1A5B7] uppercase tracking-wider">Score de Sécurité</span>
                    <span className={`text-[18px] font-bold ${selectedEmp.risk === 'Critique' ? 'text-[#F1416C]' : selectedEmp.risk === 'Moyen' ? 'text-[#F6C000]' : 'text-[#50CD89]'}`}>
                      {selectedEmp.score}/100
                    </span>
                  </div>
                  <div className="w-full h-[8px] bg-[#E4E6EF] rounded-full overflow-hidden mb-6">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedEmp.score}%` }}
                      transition={{ delay: 0.2, duration: 1 }}
                      className={`h-full rounded-full ${selectedEmp.risk === 'Critique' ? 'bg-[#F1416C]' : selectedEmp.risk === 'Moyen' ? 'bg-[#F6C000]' : 'bg-[#50CD89]'}`} 
                    ></motion.div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {selectedEmp.risk === 'Critique' ? (
                      <ShieldAlert size={20} className="text-[#F1416C]" />
                    ) : (
                      <CheckCircle2 size={20} className="text-[#50CD89]" />
                    )}
                    <span className="text-[13px] font-medium text-[#7E8299]">
                      {selectedEmp.risk === 'Critique' ? 'Nécessite une formation de sécurité immédiate.' : 'L\'employé respecte les directives de sécurité.'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[14px] font-bold text-[#181C32] mb-4">Incidents Récents</h3>
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="bg-white border border-[#E4E6EF] rounded-[8px] p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-[#181C32]">Tentative de Fuite de Clé AWS</span>
                          <span className="text-[11px] font-bold text-[#F1416C] bg-[#FFF5F8] px-2 py-0.5 rounded border border-[#F1416C]/20">BLOQUÉ</span>
                        </div>
                        <span className="text-[12px] font-medium text-[#A1A5B7]">Mar 14, 2024 - 14:30</span>
                      </div>
                    )).slice(0, selectedEmp.incidents > 3 ? 3 : selectedEmp.incidents)}
                    {selectedEmp.incidents === 0 && (
                      <p className="text-[13px] text-[#A1A5B7] italic">Aucun incident récent.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#E4E6EF] bg-[#F9FAFB] shrink-0 flex gap-3">
                <button className="flex-1 py-3 bg-white border border-[#E4E6EF] text-[#181C32] font-bold text-[13px] rounded-[8px] hover:bg-[#F5F8FA] transition-colors shadow-sm">
                  Envoyer Avertissement
                </button>
                <button className="flex-1 py-3 bg-[#F1416C] text-white font-bold text-[13px] rounded-[8px] hover:bg-[#D9214E] transition-colors shadow-md">
                  Restreindre l'Accès
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
