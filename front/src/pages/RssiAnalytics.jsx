import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Shield, Users, AlertCircle } from 'lucide-react';

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

export default function RssiAnalytics() {
  const [riskTrendData, setRiskTrendData] = useState([]);
  const [deptComparisonData, setDeptComparisonData] = useState([]);
  const [threatTypeData, setThreatTypeData] = useState([]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans h-full overflow-y-auto"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Analyses SOC Avancées</h1>
          <p className="text-[14px] text-[#A1A5B7] font-medium">Analyse approfondie des métriques de sécurité IA de l'entreprise</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E4E6EF] px-4 py-2 rounded-[8px] text-[13px] font-bold text-[#7E8299] hover:bg-[#F5F8FA] transition-colors">Exporter en PDF</button>
          <button className="bg-[#009EF7] text-white px-4 py-2 rounded-[8px] text-[13px] font-bold shadow-md hover:bg-[#008de0] transition-colors">Partager le Rapport</button>
        </div>
      </motion.div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
        
        {/* Risk Score Evolution */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border border-white/50 h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F1FAFF] rounded-[10px] flex items-center justify-center text-[#009EF7]">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-[16px] font-bold text-[#181C32]">Évolution du Score de Risque</h3>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009EF7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#009EF7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6EF" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A1A5B7', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#A1A5B7', fontSize: 12}} dx={-10} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#009EF7" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Threat Distribution */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border border-white/50 h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFF5F8] rounded-[10px] flex items-center justify-center text-[#F1416C]">
                <Shield size={20} />
              </div>
              <h3 className="text-[16px] font-bold text-[#181C32]">Catégories de Menaces</h3>
            </div>
          </div>
          <div className="flex-1 w-full flex items-center">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {threatTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[150px] flex flex-col gap-4">
              {threatTypeData.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-[12px] font-bold text-[#181C32]">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#A1A5B7] ml-4">{item.value} détections</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Department Comparison */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border border-white/50 h-[400px] flex flex-col lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F8F5FF] rounded-[10px] flex items-center justify-center text-[#7239EA]">
                <Users size={20} />
              </div>
              <h3 className="text-[16px] font-bold text-[#181C32]">Comparaison de la Conformité par Département</h3>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6EF" />
                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{fill: '#A1A5B7', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#A1A5B7', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: '#F5F8FA'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="incidents" fill="#009EF7" radius={[4, 4, 0, 0]} barSize={30} name="Total des Incidents" />
                <Bar dataKey="risk" fill="#F1416C" radius={[4, 4, 0, 0]} barSize={30} name="Facteur de Risque (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Compliance Insights */}
      <motion.div 
        variants={itemVariants}
        className="bg-[#1E1E2D] rounded-[16px] p-8 shadow-[0_20px_40px_rgba(30,30,45,0.2)] flex items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-[#009EF7]/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[#50CD89] mb-2">
            <AlertCircle size={24} />
            <span className="text-[18px] font-bold">Statut de Conformité : Optimisé</span>
          </div>
          <p className="text-gray-400 text-[14px] max-w-[600px] leading-relaxed">
            La conformité de la sécurité IA a augmenté de **18%** ce mois-ci. Les filtres de prévention des fuites de données (DLP) bloquent avec succès **94%** des tentatives de données sensibles en temps réel.
          </p>
        </div>
        <div className="relative z-10">
          <button className="bg-[#50CD89] hover:bg-[#47BE7D] text-white px-8 py-3 rounded-[12px] font-bold text-[14px] transition-all shadow-lg hover:shadow-[#50CD89]/30">
            Voir le Rapport de Conformité
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
