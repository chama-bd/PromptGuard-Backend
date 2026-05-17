import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Bell, Search, Filter, ShieldCheck, MoreVertical } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

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

export default function RssiAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const mapIncident = (inc) => {
    let icon = '🛡️';
    if (inc.threatType?.toLowerCase().includes('leak') || inc.threatType?.toLowerCase().includes('data')) {
      icon = '🔓';
    } else if (inc.threatType?.toLowerCase().includes('injection') || inc.threatType?.toLowerCase().includes('prompt')) {
      icon = '💉';
    } else if (inc.threatType?.toLowerCase().includes('jailbreak')) {
      icon = '💥';
    }

    return {
      id: inc.id || Math.random().toString(),
      type: inc.threatType || 'Violation de Politique',
      severity: inc.severity === 'CRITICAL' ? 'Critical' : inc.severity === 'HIGH' ? 'High' : 'Medium',
      emp: inc.username || 'Collaborateur Anonyme',
      time: inc.timestamp ? new Date(inc.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : 'Récemment',
      score: inc.riskScore || 50,
      status: (inc.actionTaken || 'bloqué').toLowerCase(),
      icon: icon
    };
  };

  useEffect(() => {
    // 1. Fetch recent incidents via API
    const fetchIncidents = async () => {
      try {
        const response = await api.get('/api/security/incidents');
        const mapped = response.data.map(mapIncident);
        setAlerts(mapped);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };
    fetchIncidents();

    // 2. Open Server-Sent Events (SSE) stream for real-time alerts!
    const eventSource = new EventSource('http://localhost:8080/api/alerts/live');
    
    eventSource.onmessage = (event) => {
      try {
        const liveIncident = JSON.parse(event.data);
        const mappedLive = mapIncident(liveIncident);
        setAlerts(prev => [mappedLive, ...prev]);
        toast.error(`⚠️ SOC ALERT : ${mappedLive.type} détecté par ${mappedLive.emp} !`, {
          duration: 6000,
          position: 'top-right',
          style: {
            background: '#FFF5F8',
            color: '#F1416C',
            fontWeight: 'bold',
            border: '1px solid #F1416C'
          }
        });
      } catch (err) {
        console.error("Error parsing live alert event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("SSE connection error, closing or retrying...", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const critCount = alerts.filter(a => a.severity === 'Critical').length;
  const activeCount = alerts.filter(a => a.status === 'bloqué' || a.status === 'blocked').length;
  const anonymizedCount = alerts.filter(a => a.status === 'anonymized' || a.status === 'anonymisé').length;

  const statBoxes = [
    { label: 'Alertes Critiques', val: critCount, color: '#F1416C', bg: '#FFF5F8' },
    { label: 'Menaces Bloquées', val: activeCount, color: '#009EF7', bg: '#F1FAFF' },
    { label: 'Anonymisations', val: anonymizedCount, color: '#7239EA', bg: '#F8F5FF' },
    { label: 'Incidents Récents', val: alerts.length, color: '#50CD89', bg: '#E8FFF3' },
  ];

  const filteredAlerts = alerts.filter(a => 
    a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.emp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans h-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Surveillance des Menaces en Direct</h1>
          <div className="flex items-center text-[13px] text-[#A1A5B7] font-medium">
            <span>Portail SOC</span>
            <span className="mx-2 text-[#E4E6EF]">-</span>
            <span className="text-[#009EF7]">Alertes en Temps Réel</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7]" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher des menaces..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-[#E4E6EF] rounded-[8px] pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-[#009EF7] transition-all w-[240px] shadow-sm"
            />
          </div>
          <button className="bg-white border border-[#E4E6EF] p-2.5 rounded-[8px] text-[#A1A5B7] hover:text-[#009EF7] transition-colors shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </motion.div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px]">
        {statBoxes.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="bg-white rounded-[12px] p-6 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] border-b-2"
            style={{ borderBottomColor: stat.color }}
          >
            <span className="text-[12px] font-bold text-[#A1A5B7] uppercase tracking-wider">{stat.label}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[24px] font-black text-[#181C32]">{stat.val}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <Bell size={16} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Alert Feed */}
      <motion.div variants={itemVariants} className="flex-1 bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)] overflow-hidden flex flex-col border border-[#E4E6EF]">
        <div className="px-8 py-6 border-b border-[#E4E6EF] flex items-center justify-between bg-gray-50/50">
          <h2 className="text-[16px] font-bold text-[#181C32]">Flux d'Incidents en Direct</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#50CD89] animate-pulse"></span>
            <span className="text-[12px] font-bold text-[#50CD89] uppercase tracking-wider">Système Actif</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-[#A1A5B7] font-bold">Aucune alerte de sécurité à afficher.</div>
          ) : (
            filteredAlerts.map((alert) => (
              <motion.div 
                key={alert.id}
                whileHover={{ backgroundColor: '#F9FAFB' }}
                className={`px-8 py-6 flex items-center justify-between gap-6 transition-all border-b border-[#F1F1F4] cursor-pointer group ${alert.severity === 'Critical' ? 'relative' : ''}`}
              >
                {/* Glowing Indicator for Critical */}
                {alert.severity === 'Critical' && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#F1416C] shadow-[0_0_10px_#F1416C]"></div>
                )}

                <div className="flex items-center gap-6 flex-1">
                  <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center text-[20px] shadow-sm
                    ${alert.severity === 'Critical' ? 'bg-[#FFF5F8] border border-[#F1416C]/10' : 'bg-[#F1FAFF] border border-[#009EF7]/10'}`}
                  >
                    {alert.icon}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[14px] font-bold text-[#181C32]">{alert.type}</h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-[4px] uppercase tracking-tighter
                        ${alert.severity === 'Critical' ? 'bg-[#F1416C] text-white shadow-sm' : 
                          alert.severity === 'High' ? 'bg-[#E88B11] text-white' : 
                          'bg-[#F5F8FA] text-[#7E8299]'}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#A1A5B7]">
                      <span className="text-[#181C32] font-bold">{alert.emp}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#A1A5B7] uppercase mb-1">Score de Risque</span>
                    <span className={`text-[15px] font-black ${alert.score > 90 ? 'text-[#F1416C]' : 'text-[#181C32]'}`}>{alert.score}</span>
                  </div>
                  
                  <div className="w-[100px] flex justify-center">
                    {alert.status === 'bloqué' || alert.status === 'blocked' ? (
                      <div className="flex items-center gap-1.5 text-[#F1416C] font-bold text-[12px]">
                        <ShieldAlert size={14} /> BLOQUÉ
                      </div>
                    ) : alert.status === 'résolu' || alert.status === 'anonymized' || alert.status === 'anonymisé' ? (
                      <div className="flex items-center gap-1.5 text-[#50CD89] font-bold text-[12px]">
                        <ShieldCheck size={14} /> SÉCURISÉ
                      </div>
                    ) : (
                      <div className="text-[#A1A5B7] font-bold text-[12px] uppercase">{alert.status}</div>
                    )}
                  </div>

                  <button className="text-[#A1A5B7] hover:text-[#009EF7] transition-colors p-1">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
