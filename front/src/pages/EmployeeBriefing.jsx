import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, CheckCircle2, TrendingUp, Lightbulb } from 'lucide-react';

const areaData = [];

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

export default function EmployeeBriefing() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Briefing de Sécurité</h1>
          <p className="text-[14px] text-[#A1A5B7] font-medium">Votre bilan personnel de la semaine écoulée</p>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
        
        {/* Card 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
          className="bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] relative overflow-hidden transition-all duration-300 border border-white"
        >
          {/* Glassmorphism accent */}
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#F1416C]/10 rounded-full blur-[20px]"></div>
          
          <div className="w-12 h-12 bg-[#FFF5F8] text-[#F1416C] rounded-[10px] flex items-center justify-center mb-6">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-[32px] font-bold text-[#181C32] mb-1">3</h2>
          <p className="text-[14px] font-semibold text-[#A1A5B7]">Prompts risqués détectés</p>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
          className="bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] relative overflow-hidden transition-all duration-300"
        >
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#009EF7]/10 rounded-full blur-[20px]"></div>
          
          <div className="w-12 h-12 bg-[#F1FAFF] text-[#009EF7] rounded-[10px] flex items-center justify-center mb-6">
            <CheckCircle2 size={24} />
          </div>
          <h2 className="text-[32px] font-bold text-[#181C32] mb-1">2</h2>
          <p className="text-[14px] font-semibold text-[#A1A5B7]">Prompts automatiquement bloqués</p>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
          className="bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] relative overflow-hidden transition-all duration-300"
        >
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#50CD89]/10 rounded-full blur-[20px]"></div>
          
          <div className="w-12 h-12 bg-[#E8FFF3] text-[#50CD89] rounded-[10px] flex items-center justify-center mb-6">
            <TrendingUp size={24} />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[32px] font-bold text-[#181C32]">12%</h2>
            <span className="text-[12px] font-bold text-[#50CD89] bg-[#E8FFF3] px-2 py-1 rounded-[6px]">Amélioration</span>
          </div>
          <p className="text-[14px] font-semibold text-[#A1A5B7]">Évolution de votre score de sécurité</p>
        </motion.div>

      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] mt-2">
        
        {/* Chart */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-[18px] font-bold text-[#181C32]">Évolution de votre risque</h3>
            <p className="text-[13px] font-medium text-[#A1A5B7]">Tendance de vos interactions avec l'IA</p>
          </div>
          <div className="flex-1 min-h-[300px] -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009EF7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#009EF7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6EF" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A5B7', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A5B7', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#009EF7', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#009EF7" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#1E1E2D] rounded-[16px] p-8 shadow-[0_20px_40px_rgba(30,30,45,0.2)] relative overflow-hidden flex flex-col"
        >
          {/* 3D Glass Accent */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#009EF7]/20 via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-[12px] flex items-center justify-center mb-6 text-[#009EF7] border border-white/10">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-[18px] font-bold text-white mb-6">Recommandations IA</h3>
            
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-[12px] hover:bg-white/10 transition-colors">
                <span className="text-[12px] font-bold text-[#009EF7] uppercase tracking-wider mb-2 block">Astuce 1</span>
                <p className="text-[13px] text-gray-300 font-medium leading-relaxed">Privilégiez les fausses données lors de la génération de tests avec ChatGPT au lieu d'exporter la base client.</p>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-[12px] hover:bg-white/10 transition-colors">
                <span className="text-[12px] font-bold text-[#50CD89] uppercase tracking-wider mb-2 block">Astuce 2</span>
                <p className="text-[13px] text-gray-300 font-medium leading-relaxed">Vérifiez la présence de clés API (commençant par `AKIA...`) dans vos scripts avant de les coller dans l'IA.</p>
              </div>
            </div>
          </div>
          
          <button className="mt-auto relative z-10 w-full py-3.5 bg-[#009EF7] text-white font-bold text-[14px] rounded-[8px] hover:bg-[#008de0] transition-colors shadow-lg">
            Voir le guide complet
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}
