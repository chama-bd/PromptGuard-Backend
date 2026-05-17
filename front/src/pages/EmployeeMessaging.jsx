import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, 
  Send, 
  Plus, 
  Search, 
  AtSign, 
  Smile, 
  Paperclip, 
  ShieldAlert, 
  Brain,
  Zap,
  Check,
  Video,
  Phone,
  Settings,
  MoreVertical,
  MessageSquare,
  FileText,
  Lock,
  ArrowRight,
  ShieldCheck,
  SearchIcon,
  Bell,
  Sparkles
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const channels = [];
const messages = [];

export default function EmployeeMessaging() {
  const [inputText, setInputText] = useState('');
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [activeChannel, setActiveChannel] = useState(2);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInput = (e) => {
    const val = e.target.value;
    setInputText(val);
    
    // Non-aggressive real-time detection simulation
    if (val.toLowerCase().includes('sk-') || val.toLowerCase().includes('password')) {
      setShowSecurityWarning(true);
    } else {
      setShowSecurityWarning(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex h-full bg-[#F5F6FA] overflow-hidden font-sans"
    >
      
      {/* Premium Sidebar (Channels & DMs) */}
      <div className="w-[300px] bg-white border-r border-[#E4E6EF] flex flex-col shrink-0 relative z-20 group">
        <div className="p-8 border-b border-[#E4E6EF] bg-white group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#181C32] rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-[#181C32]/10">
                   <Lock size={18} />
                </div>
                <span className="text-[18px] font-black text-[#181C32] tracking-tight">Espace de Travail</span>
             </div>
             <Settings size={18} className="text-[#A1A5B7] cursor-pointer hover:text-[#181C32] transition-colors" />
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A5B7] group-focus-within:text-[#009EF7] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Aller à..." 
              className="w-full bg-[#F5F8FA] border border-transparent focus:bg-white focus:border-[#E4E6EF] rounded-[14px] pl-12 pr-4 py-3 text-[13px] font-bold transition-all placeholder-[#A1A5B7]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Channels Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between px-3 mb-6">
              <h3 className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-[0.2em]">Canaux</h3>
              <Plus size={16} className="text-[#A1A5B7] cursor-pointer hover:text-[#181C32]" />
            </div>
            <div className="flex flex-col gap-1.5">
              {channels.map(ch => (
                <motion.div 
                  key={ch.id} 
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-[16px] cursor-pointer group transition-all relative
                    ${activeChannel === ch.id ? 'bg-[#181C32] text-white shadow-xl shadow-[#181C32]/20' : 'text-[#5E6278] hover:bg-[#F9FAFB]'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {ch.type === 'protected' ? <ShieldCheck size={16} className={activeChannel === ch.id ? 'text-[#009EF7]' : 'text-[#50CD89]'} /> : <Hash size={16} className="opacity-50" />}
                    <span className="text-[14px] font-bold">{ch.name}</span>
                  </div>
                  {ch.unread > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeChannel === ch.id ? 'bg-[#009EF7] text-white' : 'bg-[#F1416C] text-white'}`}>
                      {ch.unread}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* DMs Section */}
          <div>
            <div className="flex items-center justify-between px-3 mb-6">
              <h3 className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-[0.2em]">Membres Privés</h3>
              <Plus size={16} className="text-[#A1A5B7] cursor-pointer hover:text-[#181C32]" />
            </div>
            <div className="flex flex-col gap-4">
              {['Sarah Chen', 'Marc Durand', 'Elena Ross', 'AI Guard'].map((name, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="flex items-center gap-4 px-3 py-2 rounded-[16px] cursor-pointer text-[#5E6278] hover:bg-[#F9FAFB] transition-all group">
                  <div className="relative">
                    <img src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=${i % 2 === 0 ? '7239EA' : '50CD89'}&color=fff&bold=true`} className="w-10 h-10 rounded-[14px] border-2 border-white shadow-sm" alt={name} />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#50CD89] border-4 border-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-[#181C32]">{name}</span>
                    <span className="text-[11px] font-bold text-[#A1A5B7]">En ligne</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative shadow-2xl z-10">
        
        {/* Immersive Chat Header */}
        <div className="h-[90px] border-b border-[#E4E6EF] px-10 flex items-center justify-between bg-white/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#F1FAFF] rounded-[20px] flex items-center justify-center text-[#009EF7] border border-[#009EF7]/10 relative group">
              <ShieldCheck size={26} className="group-hover:rotate-12 transition-transform" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -inset-1 border border-dashed border-[#009EF7]/20 rounded-[22px] pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                 <h2 className="text-[20px] font-black text-[#181C32] tracking-tight">#security-alerts</h2>
                 <span className="px-3 py-1 bg-[#E8FFF3] text-[#50CD89] text-[10px] font-black uppercase rounded-[8px] tracking-widest border border-[#50CD89]/20">Protégé</span>
              </div>
              <p className="text-[13px] text-[#A1A5B7] font-bold mt-0.5">Flux de surveillance des menaces haute-intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-[#F5F8FA] rounded-[16px] p-1.5 border border-[#E4E6EF]">
                <button className="w-10 h-10 flex items-center justify-center rounded-[12px] hover:bg-white hover:shadow-md transition-all text-[#7E8299] hover:text-[#181C32]"><Phone size={18} /></button>
                <button className="w-10 h-10 flex items-center justify-center rounded-[12px] hover:bg-white hover:shadow-md transition-all text-[#7E8299] hover:text-[#181C32]"><Video size={18} /></button>
             </div>
             <div className="w-[1px] h-8 bg-[#E4E6EF] mx-2"></div>
             <button className="w-12 h-12 bg-[#F1FAFF] rounded-[16px] flex items-center justify-center text-[#009EF7] hover:bg-[#009EF7] hover:text-white transition-all shadow-sm"><Sparkles size={22} /></button>
          </div>
        </div>

        {/* Message Feed with Cinematic Flow */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-10 flex flex-col gap-10 custom-scrollbar relative">
          
          {/* Abstract background subtle glow */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#009EF7]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#7239EA]/5 rounded-full blur-[80px] pointer-events-none"></div>

          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              key={msg.id} 
              className={`flex gap-8 max-w-[900px] group ${msg.type === 'ai-insight' ? 'bg-gradient-to-tr from-[#F1FAFF] to-white p-8 rounded-[32px] border border-[#009EF7]/10 shadow-sm' : ''}`}
            >
              <div className="relative shrink-0">
                <img src={msg.avatar} alt={msg.user} className="w-12 h-12 rounded-[18px] shadow-md border-2 border-white" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${msg.type === 'ai-insight' ? 'bg-[#009EF7]' : 'bg-[#50CD89]'}`}></div>
              </div>
              
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`text-[15px] font-black tracking-tight ${msg.type === 'ai-insight' ? 'text-[#009EF7]' : 'text-[#181C32]'}`}>
                    {msg.user}
                  </span>
                  <span className="px-2 py-0.5 rounded-[6px] bg-[#F5F8FA] text-[#A1A5B7] text-[10px] font-black uppercase tracking-tighter border border-[#E4E6EF]">
                    {msg.role}
                  </span>
                  <span className="text-[11px] font-bold text-[#A1A5B7] ml-2">{msg.time}</span>
                </div>

                <div className="relative">
                  {msg.type === 'file' ? (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-6 p-5 rounded-[24px] bg-[#F5F8FA] border border-[#E4E6EF] max-w-[400px] cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className="w-14 h-14 bg-white rounded-[16px] flex items-center justify-center text-[#F1416C] shadow-sm">
                         <FileText size={28} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[14px] font-black text-[#181C32]">{msg.fileName}</span>
                         <span className="text-[12px] font-bold text-[#A1A5B7]">{msg.fileSize} • PDF Document</span>
                      </div>
                      <ArrowRight size={18} className="text-[#A1A5B7] ml-auto" />
                    </motion.div>
                  ) : (
                    <p className={`text-[16px] leading-relaxed font-medium ${msg.type === 'ai-insight' ? 'text-[#0C447C] font-bold' : 'text-[#5E6278]'}`}>
                      {msg.content}
                    </p>
                  )}
                  
                  {/* Message Reactions */}
                  {msg.type !== 'ai-insight' && (
                    <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="px-3 py-1 bg-white border border-[#E4E6EF] rounded-full text-[12px] flex items-center gap-2 hover:bg-[#F5F8FA] transition-colors shadow-sm">
                          👍 <span className="font-bold text-[#A1A5B7]">12</span>
                       </button>
                       <button className="px-3 py-1 bg-white border border-[#E4E6EF] rounded-full text-[12px] flex items-center gap-2 hover:bg-[#F5F8FA] transition-colors shadow-sm">
                          🔥 <span className="font-bold text-[#A1A5B7]">4</span>
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Predictive & Secure Input Area */}
        <div className="p-10 bg-white border-t border-[#E4E6EF] relative z-20">
          
          {/* Real-time Contextual Security Assistant */}
          <AnimatePresence>
            {showSecurityWarning && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute left-10 right-10 bottom-full mb-6 bg-[#181C32] rounded-[24px] p-8 shadow-2xl border border-white/10 flex items-start gap-8 overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F1416C]/10 rounded-full blur-[30px] group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 bg-[#F1416C] rounded-[20px] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#F1416C]/30 animate-pulse">
                   <ShieldAlert size={32} />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                     <h4 className="text-[20px] font-black text-white tracking-tight">Alerte d'Intelligence de Sécurité</h4>
                     <span className="px-3 py-1 bg-[#F1416C]/20 text-[#F1416C] text-[10px] font-black uppercase rounded-[6px] tracking-widest border border-[#F1416C]/20">CRITIQUE</span>
                  </div>
                  <p className="text-[15px] text-gray-300 font-medium leading-relaxed max-w-[600px]">
                    Alex, le contenu que vous rédigez contient des motifs correspondant à des **Clés API d'Entreprise**. Pour prévenir une violation potentielle du périmètre, ce message a été marqué contextuellement.
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                     <button className="px-6 py-2.5 bg-[#F1416C] text-white rounded-[14px] text-[13px] font-black hover:bg-[#d93a61] transition-all">Censurer Automatiquement</button>
                     <button className="px-6 py-2.5 bg-white/10 text-white border border-white/20 rounded-[14px] text-[13px] font-black hover:bg-white/20 transition-all" onClick={() => setShowSecurityWarning(false)}>Ignorer l'Alerte</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-[1000px] mx-auto">
            <div className="bg-[#F5F8FA] rounded-[32px] p-2 border-2 border-transparent focus-within:bg-white focus-within:border-[#E4E6EF] focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 relative">
              <textarea 
                value={inputText}
                onChange={handleInput}
                placeholder="Message sécurisé vers #security-alerts..."
                className="w-full bg-transparent border-none focus:ring-0 px-8 py-6 text-[16px] font-bold text-[#181C32] placeholder-[#A1A5B7] resize-none h-[100px] custom-scrollbar"
              />
              <div className="flex items-center justify-between px-6 pb-4">
                <div className="flex items-center gap-6 text-[#A1A5B7]">
                  <motion.button whileHover={{ scale: 1.1, color: '#181C32' }} className="p-2 hover:bg-gray-100 rounded-[12px] transition-all"><Plus size={22} /></motion.button>
                  <div className="w-[1px] h-8 bg-[#E4E6EF]"></div>
                  <motion.button whileHover={{ scale: 1.1, color: '#F6C000' }} className="p-2 hover:bg-gray-100 rounded-[12px] transition-all"><Smile size={22} /></motion.button>
                  <motion.button whileHover={{ scale: 1.1, color: '#009EF7' }} className="p-2 hover:bg-gray-100 rounded-[12px] transition-all"><Paperclip size={22} /></motion.button>
                  <motion.button whileHover={{ scale: 1.1, color: '#7239EA' }} className="p-2 hover:bg-gray-100 rounded-[12px] transition-all"><AtSign size={22} /></motion.button>
                </div>
                <div className="flex items-center gap-5">
                   <div className="flex flex-col items-end mr-4">
                      <span className="text-[10px] font-black text-[#50CD89] uppercase tracking-widest flex items-center gap-1">
                         <div className="w-1.5 h-1.5 bg-[#50CD89] rounded-full animate-pulse"></div> Surveillance Active
                      </span>
                      <span className="text-[11px] font-bold text-[#A1A5B7]">Chiffré de Bout en Bout</span>
                   </div>
                   <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,158,247,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-[#009EF7] rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-[#009EF7]/20 transition-all group"
                   >
                    <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Right Intelligence Panel */}
      <div className="w-[380px] bg-[#F5F6FA] flex flex-col p-10 overflow-y-auto hidden 2xl:flex gap-10">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-[20px] font-black text-[#181C32] tracking-tight">Intelligence IA</h3>
           <Sparkles size={22} className="text-[#009EF7]" />
        </div>

        <div className="flex flex-col gap-8">
          {/* AI Activity Pulse */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-[#E4E6EF] relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#009EF7]/5 rounded-full blur-[20px]"></div>
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#F1FAFF] rounded-[16px] flex items-center justify-center text-[#009EF7] shadow-sm">
                   <Zap size={24} fill="currentColor" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[14px] font-black text-[#181C32]">Pouls du Canal</span>
                   <span className="text-[11px] font-bold text-[#50CD89] uppercase tracking-widest">Optimisé</span>
                </div>
             </div>
             <p className="text-[14px] text-[#5E6278] font-bold leading-relaxed mb-6">
               "Alex, j'ai analysé les **48 derniers messages**. L'équipe discute actuellement de la **Scalabilité de l'Architecture**."
             </p>
             <button className="w-full py-3 bg-[#181C32] text-white rounded-[16px] text-[12px] font-black shadow-lg shadow-[#181C32]/20 hover:scale-105 transition-all">Voir Carte de Contexte</button>
          </motion.div>

          {/* Members List with Extended Details */}
          <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between px-2">
                <h4 className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-[0.2em]">Collaborateurs Actifs</h4>
                <span className="text-[11px] font-black text-[#009EF7] bg-[#F1FAFF] px-2 py-0.5 rounded-[4px]">12 en ligne</span>
             </div>
             <div className="flex flex-col gap-6">
               {[
                 { name: 'Sarah Chen', status: 'En Réunion', role: 'Sécurité' },
                 { name: 'Marc Durand', status: 'Concentré', role: 'ML Ops' },
                 { name: 'Elena Ross', status: 'En ligne', role: 'Dev' },
               ].map((m, i) => (
                 <motion.div key={i} whileHover={{ x: 5 }} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={`https://ui-avatars.com/api/?name=${m.name.replace(' ', '+')}&background=F5F8FA&color=181C32&bold=true`} className="w-11 h-11 rounded-[14px] border-2 border-white shadow-sm" alt={m.name} />
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-4 border-white ${m.status === 'Active' ? 'bg-[#50CD89]' : 'bg-[#F6C000]'}`}></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-[#181C32] group-hover:text-[#009EF7] transition-colors">{m.name}</span>
                        <span className="text-[11px] font-bold text-[#A1A5B7]">{m.status}</span>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E4E6EF] group-hover:bg-[#009EF7] transition-all"></div>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
