import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BarChart2, Grid, Moon, Sparkles, Bell } from 'lucide-react';

export default function TopBar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'employee';
  const userName = localStorage.getItem('userName') || (role === 'rssi' ? 'Administrateur SOC' : 'Utilisateur');
  const userDept = localStorage.getItem('userDept') || (role === 'rssi' ? 'SECURITY' : 'IT_DEV');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="h-[70px] bg-white border-b border-[#EFF2F5] flex items-center justify-between px-8 shrink-0 relative z-30 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
      
      {/* Left Menu Links - REMOVED AS REQUESTED */}
      <div className="flex items-center h-full">
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2">
        {/* AI "Thinking" State Search */}
        <div className="hidden md:flex items-center bg-[#F5F8FA] rounded-[10px] px-3 py-1.5 border border-transparent focus-within:bg-white focus-within:border-[#E4E6EF] transition-all duration-300 mr-4 group">
          <Search size={16} className="text-[#A1A5B7] group-focus-within:text-[#009EF7]" />
          <input 
            type="text" 
            placeholder="Recherche IA Rapide..." 
            className="bg-transparent border-none focus:ring-0 text-[12px] font-medium px-2 w-[150px] placeholder-[#A1A5B7]"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="text-[#009EF7]/40"
          >
            <Sparkles size={12} />
          </motion.div>
        </div>

        <motion.button whileHover={{ scale: 1.1, y: -2 }} className="w-9 h-9 rounded-md flex items-center justify-center text-[#A1A5B7] hover:bg-[#F1FAFF] hover:text-[#009EF7] transition-all">
          <BarChart2 size={18} />
        </motion.button>
        
        <motion.button whileHover={{ scale: 1.1, y: -2 }} className="w-9 h-9 rounded-md flex items-center justify-center text-[#A1A5B7] hover:bg-[#F1FAFF] hover:text-[#009EF7] transition-all relative">
          <Bell size={18} />
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-2 right-2 w-[8px] h-[8px] bg-[#F1416C] rounded-full border-2 border-white"
          />
        </motion.button>

        <motion.button whileHover={{ scale: 1.1, y: -2 }} className="w-9 h-9 rounded-md flex items-center justify-center text-[#A1A5B7] hover:bg-[#F1FAFF] hover:text-[#009EF7] transition-all mr-2">
          <Moon size={18} />
        </motion.button>
        
        <div className="h-6 w-[1px] bg-[#E4E6EF] mx-2"></div>

        {/* User Avatar with Profile Details */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 ml-2 cursor-pointer group"
          onClick={handleLogout}
        >
          <div className="flex flex-col items-end hidden sm:flex">
             <span className="text-[12px] font-black text-[#181C32]">{userName}</span>
             <span className="text-[10px] font-bold text-[#50CD89] uppercase tracking-wider">{userDept}</span>
          </div>
          <div className="w-[38px] h-[38px] rounded-[10px] bg-[#F5F8FA] flex items-center justify-center border border-[#E4E6EF] overflow-hidden shadow-sm group-hover:shadow-md transition-all">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=${role === 'rssi' ? 'F1416C' : '181C32'}&color=fff&bold=true`} 
              alt="User" 
              className="w-full h-full object-cover" 
            />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
