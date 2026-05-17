import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('API Call: Login with', { email, password });
    // TODO: Call your Spring Boot Login Endpoint here
    // For now, redirecting based on hardcoded demo role logic is removed.
    // Assuming a successful login sets role from backend:
    // localStorage.setItem('userRole', fetchedRole);
    // navigate(fetchedRole === 'rssi' ? '/dashboard' : '/chat');
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F6FA] text-[#181C32] font-sans overflow-hidden">

      {/* LEFT SIDE - Premium 3D Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:block w-1/2 h-full bg-[#0B0B14] p-6 relative overflow-hidden"
      >
        <div className="w-full h-full rounded-[24px] relative bg-gradient-to-br from-[#1E1E2D] to-[#141421] border border-white/5 overflow-hidden flex items-center justify-center shadow-[0_10px_50px_rgba(0,0,0,0.4)]">

          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1E3A8A]/30 via-[#1D4ED8]/10 to-transparent blur-[50px] pointer-events-none"
          ></motion.div>

          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-[80%] h-[80%]"
          >
            <img src="/Robot.svg" alt="Smart Access Robot" className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(30,58,138,0.5)]" />
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 md:px-24 bg-white relative z-10 shadow-[-10px_0_40px_rgba(0,0,0,0.03)] border-l border-slate-100"
      >
        <div className="w-full max-w-[400px]">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center text-center mb-8"
          >
            <img src="/SafeRaqib.svg" alt="SafeRaqib Logo" className="w-40 h-auto mb-6 object-contain" />
            <h1 className="text-[28px] font-bold text-[#181C32] mb-2 tracking-tight">Bon retour</h1>
            <p className="text-[13px] text-slate-500">Entrez vos identifiants pour accéder à PromptGuard</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-[13px] font-semibold text-slate-600 mb-2">Email</label>
              <input
                type="email"
                placeholder="Entrez votre email"
                className="w-full bg-[#F5F6FA] border border-slate-200 rounded-[8px] px-4 py-3 text-[14px] text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[13px] font-semibold text-slate-600">Mot de passe</label>
              </div>
              <input
                type="password"
                placeholder="Entrez votre mot de passe"
                className="w-full bg-[#F5F6FA] border border-slate-200 rounded-[8px] px-4 py-3 text-[14px] text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between mt-1 mb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 bg-[#F5F6FA] border border-slate-300 rounded-[4px] flex items-center justify-center group-hover:border-[#1D4ED8] transition-colors">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4.5L3.5 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-transparent group-hover:text-slate-600 transition-colors" />
                  </svg>
                </div>
                <span className="text-[13px] text-slate-500 group-hover:text-slate-700 transition-colors">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-[13px] text-slate-500 hover:text-[#1D4ED8] transition-colors">Mot de passe oublié ?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-[8px] bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] text-white text-[15px] font-bold mt-2 shadow-[0_10px_30px_rgba(30,58,138,0.25)] transition-all"
            >
              Se connecter
            </motion.button>
          </motion.form>
        </div>
      </motion.div>

    </div>
  );
}