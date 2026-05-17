import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RssiSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  const links = [
    { path: '/dashboard', label: 'Tableau de Bord SOC', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z' },
    { path: '/alerts', label: 'Menaces en Direct', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
    { path: '/heatmap', label: 'Heatmap des Risques', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' },
    { path: '/world-map', label: 'Trafic Global', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
    { path: '/employees', label: 'Monitor Employés', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
    { path: '/incidents', label: 'Journal Incidents', icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01' },
    { path: '/analytics', label: 'Analytiques SOC', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12' },
    { path: '/reports', label: 'Conformité', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' }
  ];

  return (
    <div className="w-[265px] bg-[#1E1E2D] flex flex-col shrink-0 text-white font-sans h-full shadow-[5px_0_15px_rgba(0,0,0,0.1)] relative z-20">
      {/* Logo Area */}
      <div className="h-[70px] border-b border-[#2B2B40] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute top-1/2 left-4 w-[40px] h-[40px] bg-[#009EF7]/20 blur-[15px] -translate-y-1/2 pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10 cursor-pointer" onClick={() => navigate('/login')}>
          <div className="w-8 h-8 rounded-lg bg-[#F1416C] flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[18px] font-bold tracking-tight">SOC Central</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 scrollbar-hide">
        <div className="mb-6 px-3">
          <h3 className="text-[11px] font-bold text-[#A1A5B7] uppercase tracking-wider mb-4">Ops Sécurité</h3>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((item) => (
            <motion.div 
              key={item.path}
              whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-[10px] cursor-pointer transition-all duration-300
                ${isActive(item.path) 
                  ? 'bg-[#009EF7] text-white font-bold shadow-[0_4px_15px_rgba(0,158,247,0.3)]' 
                  : 'text-[#9899AC] hover:text-white font-medium'
                }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d={item.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13px]">{item.label}</span>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom RSSI Branding */}
      <div className="p-6 border-t border-[#2B2B40] bg-[#1A1A27]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F1416C]/10 flex items-center justify-center border border-[#F1416C]/20">
            <span className="text-[#F1416C] font-black text-xs">SOC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-white">Tableau de Bord RSSI</span>
            <span className="text-[11px] font-medium text-[#50CD89]">Surveillance en Direct</span>
          </div>
        </div>
      </div>
    </div>
  );
}
