import { motion } from 'framer-motion';
import { FileText, Download, Eye, Clock, ShieldCheck, PieChart } from 'lucide-react';

const reports = [];

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

export default function RssiReports() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans h-full overflow-y-auto scrollbar-hide"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Conformité et Rapports</h1>
          <div className="flex items-center text-[13px] text-[#A1A5B7] font-medium">
            <span>Gouvernance</span>
            <span className="mx-2 text-[#E4E6EF]">-</span>
            <span className="text-[#009EF7]">Reporting Réglementaire</span>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#009EF7] text-white px-6 py-3 rounded-[12px] text-[14px] font-bold shadow-lg hover:bg-[#008de0] transition-all flex items-center gap-2"
        >
          Générer un Nouveau Rapport
        </motion.button>
      </motion.div>

      {/* Featured Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[25px]">
        {[
          { label: 'Total des Rapports', val: 124, icon: FileText, color: '#009EF7', bg: '#F1FAFF' },
          { label: 'Taux de Conformité', val: '98.2%', icon: ShieldCheck, color: '#50CD89', bg: '#E8FFF3' },
          { label: 'Données Analysées', val: '24.5 TB', icon: PieChart, color: '#7239EA', bg: '#F8F5FF' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="bg-white rounded-[16px] p-6 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border border-[#E4E6EF] flex items-center gap-5"
          >
            <div className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#A1A5B7] uppercase tracking-wider">{stat.label}</span>
              <span className="text-[22px] font-black text-[#181C32]">{stat.val}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reports History / List */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border border-[#E4E6EF] flex flex-col overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-[#E4E6EF] flex items-center justify-between bg-gray-50/50">
          <h2 className="text-[16px] font-bold text-[#181C32]">Documentation Récente</h2>
          <div className="flex items-center gap-2">
             <button className="text-[13px] font-bold text-[#009EF7] hover:underline">Voir l'Archive</button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[12px] font-bold text-[#A1A5B7] uppercase tracking-wider border-b border-[#E4E6EF]">
                <th className="py-4 px-8">Nom du Rapport</th>
                <th className="py-4 px-8">Date de Génération</th>
                <th className="py-4 px-8">Taille</th>
                <th className="py-4 px-8">Statut</th>
                <th className="py-4 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <motion.tr 
                  key={report.id}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                  className="border-b border-[#F1F1F4] group transition-colors"
                >
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[8px] bg-[#F5F8FA] flex items-center justify-center text-[#A1A5B7] group-hover:text-[#009EF7] transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#181C32]">{report.name}</span>
                        <span className="text-[11px] font-bold text-[#A1A5B7] uppercase">Document {report.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-[13px] font-medium text-[#7E8299]">{report.date}</td>
                  <td className="py-5 px-8 text-[13px] font-medium text-[#7E8299]">{report.size}</td>
                  <td className="py-5 px-8">
                    {report.status === 'ready' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FFF3] text-[#50CD89] text-[11px] font-bold">
                        <ShieldCheck size={12} /> Prêt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8DD] text-[#F6C000] text-[11px] font-bold">
                        <Clock size={12} className="animate-spin" /> Génération...
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-md bg-[#F5F8FA] flex items-center justify-center text-[#7E8299] hover:text-[#009EF7] transition-all border border-[#E4E6EF]">
                        <Eye size={16} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-md bg-[#F5F8FA] flex items-center justify-center text-[#7E8299] hover:text-[#50CD89] transition-all border border-[#E4E6EF]">
                        <Download size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty Preview Space (Simulated) */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-[30px]"
      >
        <div className="bg-[#1E1E2D] rounded-[16px] p-8 shadow-lg flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px]"></div>
          <h3 className="text-white text-[16px] font-bold">Export Rapide</h3>
          <p className="text-gray-400 text-[13px] leading-relaxed">Exportez instantanément votre tableau de bord de conformité en une présentation PDF de haute qualité pour examen exécutif.</p>
          <div className="flex gap-3">
             <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-[8px] font-bold text-[13px] border border-white/10 transition-all">Résumé Exécutif</button>
             <button className="flex-1 py-3 bg-[#009EF7] text-white rounded-[8px] font-bold text-[13px] transition-all">Historique Complet</button>
          </div>
        </div>
        
        <div className="bg-white rounded-[16px] p-8 border-2 border-dashed border-[#E4E6EF] flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:border-[#009EF7]/30 transition-all">
          <div className="w-16 h-16 rounded-full bg-[#F5F8FA] flex items-center justify-center text-[#A1A5B7] group-hover:scale-110 transition-transform">
            <Clock size={32} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#181C32]">Planifier un Rapport</h3>
            <p className="text-[13px] text-[#A1A5B7] font-medium">Automatisez votre flux de reporting de manière hebdomadaire ou mensuelle.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
