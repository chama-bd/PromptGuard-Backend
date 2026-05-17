import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, Bookmark, ShieldAlert, Send, Paperclip, AlertTriangle, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const initialMessages = [];
const history = [];

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function EmployeeChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [showRiskPopup, setShowRiskPopup] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingText]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Check for sensitive keywords
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('aws') || lowerInput.includes('jwt') || lowerInput.includes('password') || lowerInput.includes('mot de passe')) {
      setInput('');
      setTimeout(() => setShowRiskPopup(true), 500);
      return;
    }

    setInput('');
    setIsTyping(true);

    // Simulate AI response with streaming effect
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = "J'ai analysé votre demande. Conformément à nos protocoles de sécurité internes, voici une stratégie d'implémentation sécurisée qui prévient les fuites de données potentielles tout en maintenant des performances élevées...";
      setStreamingText(aiResponse);
    }, 1500);
  };

  const handleStreamingComplete = () => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      text: streamingText
    }]);
    setStreamingText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex h-[calc(100vh-70px)] bg-[#F5F6FA] p-8 gap-[30px] font-sans overflow-hidden"
    >
      {/* Background Particles Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 10 + i * 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute bg-[#009EF7]/10 blur-[60px] rounded-full"
            style={{ 
              width: 200 + i * 50, 
              height: 200 + i * 50, 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>

      {/* Internal Chat Sidebar */}
      <motion.div 
        initial={{ x: -30, opacity: 0, filter: 'blur(10px)' }}
        animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-[300px] bg-white rounded-[24px] p-8 shadow-sm border border-[#E4E6EF] flex flex-col shrink-0 relative z-10"
      >
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#181C32] text-white font-black py-4 px-6 rounded-[16px] flex items-center justify-center gap-3 mb-10 hover:bg-[#181C32]/90 transition-all shadow-xl shadow-[#181C32]/10"
        >
          <Sparkles size={20} className="text-[#009EF7]" />
          Nouvelle Discussion
        </motion.button>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest mb-6 px-2">Intelligence Récente</h3>
          <div className="flex flex-col gap-3 mb-10">
            {history.map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ x: 5, backgroundColor: '#F1FAFF' }}
                className="flex items-center gap-4 px-4 py-3 text-[#5E6278] hover:text-[#009EF7] rounded-[14px] cursor-pointer transition-all group border border-transparent hover:border-[#009EF7]/10"
              >
                <div className="w-8 h-8 rounded-[10px] bg-[#F5F8FA] flex items-center justify-center group-hover:bg-white transition-all">
                   <Clock size={16} className="opacity-70" />
                </div>
                <span className="text-[13px] font-bold truncate">{item}</span>
              </motion.div>
            ))}
          </div>

          <h3 className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest mb-6 px-2">Insights Sauvegardés</h3>
          <div className="flex flex-col gap-3">
            <motion.div 
              whileHover={{ x: 5, backgroundColor: '#F8F5FF' }}
              className="flex items-center gap-4 px-4 py-3 text-[#5E6278] hover:text-[#7239EA] rounded-[14px] cursor-pointer transition-all group border border-transparent hover:border-[#7239EA]/10"
            >
              <div className="w-8 h-8 rounded-[10px] bg-[#F5F8FA] flex items-center justify-center group-hover:bg-white transition-all">
                 <Bookmark size={16} className="opacity-70" />
              </div>
              <span className="text-[13px] font-bold truncate">Générer Doc Sécurité API</span>
            </motion.div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-[#E4E6EF]">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#E8FFF3] border border-[#50CD89]/30 rounded-[20px] p-5 flex items-start gap-4 cursor-pointer hover:shadow-lg hover:shadow-[#50CD89]/10 transition-all"
          >
            <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center text-[#50CD89] shadow-sm">
               <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[13px] font-black text-[#181C32]">Session Protégée</p>
              <p className="text-[11px] font-bold text-[#50CD89] uppercase tracking-wider">Garde IA Actif</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div 
        initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
        className="flex-1 bg-white rounded-[24px] shadow-sm border border-[#E4E6EF] flex flex-col overflow-hidden relative z-10"
      >
        <div className="h-[80px] border-b border-[#E4E6EF] flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] bg-[#F1FAFF] flex items-center justify-center border border-[#009EF7]/10 relative group">
              <MessageSquare size={22} className="text-[#009EF7]" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-[#50CD89] rounded-full border-2 border-white"
              />
            </div>
            <div>
              <h2 className="text-[18px] font-black text-[#181C32] tracking-tight">Assistant d'Entreprise</h2>
              <div className="flex items-center gap-2">
                 <span className="text-[12px] font-bold text-[#A1A5B7]">Modèle : Llama 3 (Sécurisé)</span>
                 <div className="w-1 h-1 rounded-full bg-[#E4E6EF]"></div>
                 <span className="text-[11px] font-black text-[#009EF7] uppercase tracking-widest">Actif</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#F5F8FA] rounded-full">
                <Zap size={14} className="text-[#F6C000]" fill="currentColor" />
                <span className="text-[11px] font-black text-[#7E8299] uppercase tracking-wider">Mode Haute Vitesse</span>
             </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          <div className="max-w-[900px] mx-auto flex flex-col gap-10">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-6 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 shadow-lg ${msg.type === 'user' ? 'bg-[#181C32] text-white' : 'bg-gradient-to-tr from-[#009EF7] to-[#7239EA] text-white'}`}>
                    {msg.type === 'user' ? 'ME' : <Sparkles size={20} />}
                  </div>
                  <div className={`p-6 rounded-[24px] max-w-[80%] text-[15px] leading-relaxed shadow-sm border ${msg.type === 'user' ? 'bg-[#F9FAFB] text-[#181C32] border-[#E4E6EF] rounded-tr-none' : 'bg-white border-[#E4E6EF] text-[#181C32] rounded-tl-none font-medium'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-[#009EF7] to-[#7239EA] text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles size={20} className="animate-spin-slow" />
                  </div>
                  <div className="p-6 rounded-[24px] bg-white border border-[#E4E6EF] rounded-tl-none flex items-center gap-3 shadow-sm">
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 rounded-full bg-[#009EF7]"></motion.div>
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full bg-[#009EF7]"></motion.div>
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full bg-[#009EF7]"></motion.div>
                  </div>
                </motion.div>
              )}

              {streamingText && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-[#009EF7] to-[#7239EA] text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <div className="p-6 rounded-[24px] bg-white border border-[#E4E6EF] rounded-tl-none text-[15px] leading-relaxed shadow-sm font-medium">
                    <TypewriterText text={streamingText} onComplete={handleStreamingComplete} />
                    <motion.span 
                      animate={{ opacity: [0, 1, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 h-4 bg-[#009EF7] ml-1"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white border-t border-[#E4E6EF] sticky bottom-0">
          <form onSubmit={handleSend} className="max-w-[900px] mx-auto relative group">
            <button type="button" className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A5B7] hover:text-[#009EF7] transition-all p-2 rounded-[10px] hover:bg-[#F5F8FA]">
              <Paperclip size={22} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Demandez n'importe quoi ou collez du code (essayez 'mot de passe' pour la détection en direct)..."
              className="w-full bg-[#F5F8FA] border border-transparent text-[#181C32] rounded-[20px] pl-16 pr-16 py-6 text-[15px] font-bold placeholder-[#A1A5B7] focus:bg-white focus:border-[#009EF7] focus:ring-[4px] focus:ring-[#009EF7]/5 shadow-inner transition-all duration-300"
            />
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              type="submit" 
              disabled={!input.trim() || isTyping || streamingText} 
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white bg-[#009EF7] p-3 rounded-[12px] hover:bg-[#008de0] transition-all disabled:opacity-30 shadow-lg shadow-[#009EF7]/20"
            >
              <Send size={20} />
            </motion.button>
          </form>
          <div className="flex items-center justify-center gap-6 mt-4">
             <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-[#50CD89]" />
                <span className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-wider">Chiffrement de bout en bout</span>
             </div>
             <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#7239EA]" />
                <span className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-wider">Politique IA Active</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Detection Popup Modal (Polished) */}
      <AnimatePresence>
        {showRiskPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#181C32]/80 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0.9, y: 30, opacity: 0, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white rounded-[32px] w-full max-w-[550px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-[#F1416C]/30"
            >
              <div className="bg-gradient-to-br from-[#F1416C] to-[#E22E58] p-10 text-white flex items-center justify-center flex-col relative overflow-hidden text-center">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-6 relative z-10 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30"
                >
                  <AlertTriangle size={40} />
                </motion.div>
                <h2 className="text-[28px] font-black relative z-10 tracking-tight leading-tight">BLOCAGE DE SÉCURITÉ CRITIQUE</h2>
                <p className="text-[16px] font-bold text-white/80 mt-2 relative z-10">Exportation de données sensibles détectée par PromptGuard</p>
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px] translate-x-1/4 -translate-y-1/4"></div>
              </div>
              
              <div className="p-10">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#E4E6EF]">
                  <span className="text-[14px] font-black text-[#A1A5B7] uppercase tracking-[0.2em]">Évaluation du Risque</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[42px] font-black text-[#F1416C] leading-none tracking-tighter">94.8</span>
                    <span className="text-[18px] font-bold text-[#A1A5B7] mt-2">SCORE</span>
                  </div>
                </div>

                <div className="mb-10">
                  <span className="text-[11px] font-black text-[#A1A5B7] uppercase tracking-widest block mb-4">MENACES IDENTIFIÉES</span>
                  <div className="flex flex-wrap gap-3">
                    {['Clé d\'Accès Cloud', 'Token d\'Authentification JWT', 'Identifiant Admin Interne'].map((t, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2 + (i * 0.1) }} 
                        key={i} 
                        className="px-4 py-2 bg-[#FFF5F8] border border-[#F1416C]/20 text-[#F1416C] text-[13px] font-black rounded-[12px] flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F1416C]"></div>
                        {t}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#181C32] rounded-[20px] p-6 flex flex-col gap-2 mb-10 border border-white/10">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Action du Protocole</span>
                  <p className="text-[14px] font-bold text-white leading-relaxed">
                    Soumission du prompt **automatiquement interrompue**. Menace enregistrée dans le centre de commande RSSI. Chiffrement local déclenché.
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRiskPopup(false)}
                  className="w-full py-5 bg-[#F5F8FA] hover:bg-[#E4E6EF] text-[#181C32] font-black rounded-[20px] transition-all text-[15px] uppercase tracking-widest"
                >
                  Confirmer la Conformité
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
