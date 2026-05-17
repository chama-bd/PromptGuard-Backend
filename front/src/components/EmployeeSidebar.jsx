import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  const links = [
    { path: '/chat', label: 'Chat IA', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
    { path: '/messaging', label: 'Messagerie', icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' },
    { path: '/planner', label: 'Planning IA', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
    { path: '/briefing', label: 'Briefing', icon: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7' },
    { path: '/history', label: 'Historique', icon: 'M12 8v4l3 3 M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z' },
    { path: '/portfolio', label: 'Portfolio', icon: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M3 8h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z' },
    { path: '/profile', label: 'Profil', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' }
  ];

  return (
    <div className="w-[260px] bg-white border-r border-[#E4E6EF] flex flex-col shrink-0 font-sans h-full shadow-[2px_0_10px_rgba(0,0,0,0.02)] relative z-20">
      {/* Logo Area */}
      <div className="h-[70px] border-b border-[#E4E6EF] flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/login')}>
          <div className="w-8 h-8 rounded-lg bg-[#185FA5] flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[18px] font-bold text-[#0C447C]">PromptGuard</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="mb-6 px-3">
          <h3 className="text-[11px] font-bold text-[#A1A5B7] uppercase tracking-wider mb-4">Workspace</h3>
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((item) => (
            <motion.div 
              key={item.path}
              whileHover={{ x: 5, backgroundColor: '#F1F5F9' }}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-[12px] cursor-pointer transition-all duration-200
                ${isActive(item.path) 
                  ? 'bg-[#E6F1FB] text-[#185FA5] font-bold shadow-sm' 
                  : 'text-[#5E6278] hover:text-[#185FA5] font-medium'
                }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d={item.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[14px]">{item.label}</span>
              {isActive(item.path) && (
                <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
              )}
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Hint */}
      <div className="p-6 border-t border-[#E4E6EF] bg-[#F9FAFB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
            <img src="https://ui-avatars.com/api/?name=Alex+Lao&background=185FA5&color=fff" alt="User" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#181C32]">Alex Lao</span>
            <span className="text-[11px] font-medium text-[#A1A5B7]">Employé • DEV</span>
          </div>
        </div>
      </div>
    </div>
  );
}
