import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Settings, Lock, Smartphone } from 'lucide-react';

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

export default function EmployeeProfile() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', role: '', department: '', securityScore: null, lastLogin: '' });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-[30px] font-sans"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-[22px] font-bold text-[#181C32] mb-1">Mon Profil</h1>
          <p className="text-[14px] text-[#A1A5B7] font-medium">Gérez vos informations et préférences de sécurité</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        {/* Left Column: Profile Card */}
        <div className="flex flex-col gap-[30px] lg:col-span-1">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(76,87,125,0.02)] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#009EF7]/10 to-transparent"></div>
            
            <div className="relative z-10 w-24 h-24 rounded-full bg-white p-1 shadow-md mb-4 mt-4">
              <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent((profile.firstName + ' ' + profile.lastName).trim() || 'Utilisateur')}&background=F1FAFF&color=009EF7&size=200`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#50CD89] border-2 border-white rounded-full"></div>
            </div>
            
            <h2 className="text-[20px] font-bold text-[#181C32] mb-1 relative z-10">{profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : '—'}</h2>
            <p className="text-[14px] font-medium text-[#A1A5B7] mb-6 relative z-10">{profile.role || 'Employé'}{profile.department ? ` • ${profile.department}` : ''}</p>

            <div className="w-full flex flex-col gap-3 relative z-10">
              <div className="flex items-center justify-between p-3 bg-[#F5F8FA] rounded-[8px]">
                <span className="text-[13px] font-bold text-[#7E8299]">Niveau de Sécurité</span>
                <span className="text-[13px] font-bold text-[#50CD89] bg-[#E8FFF3] px-2 py-1 rounded-[6px]">{profile.securityScore != null ? `${profile.securityScore}/100` : '—'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F5F8FA] rounded-[8px]">
                <span className="text-[13px] font-bold text-[#7E8299]">Dernière connexion</span>
                <span className="text-[13px] font-bold text-[#181C32]">{profile.lastLogin || '—'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-[#1E1E2D] rounded-[16px] p-8 shadow-[0_20px_40px_rgba(30,30,45,0.2)] relative overflow-hidden"
          >
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#F1416C]/20 rounded-full blur-[20px]"></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-[12px] flex items-center justify-center text-[#F1416C] mb-2 border border-white/10">
                <Shield size={24} />
              </div>
              <h3 className="text-[18px] font-bold text-white">Authentification Forte</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed">Votre compte est protégé par une authentification à deux facteurs (2FA). Ne partagez jamais vos codes de récupération.</p>
              <button className="mt-2 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-[13px] rounded-[8px] transition-colors border border-white/10">
                Gérer la 2FA
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Settings */}
        <div className="flex flex-col gap-[30px] lg:col-span-2">
          {/* Personal Info */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)] overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-[#E4E6EF] flex items-center gap-3">
              <User size={20} className="text-[#009EF7]" />
              <h2 className="text-[16px] font-bold text-[#181C32]">Informations Personnelles</h2>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#181C32] mb-2">Prénom</label>
                  <input type="text" value={profile.firstName} onChange={e => setProfile(p => ({...p, firstName: e.target.value}))} placeholder="Prénom" className="w-full bg-[#F5F8FA] border border-[#E4E6EF] text-[#181C32] rounded-[8px] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[#009EF7]" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#181C32] mb-2">Nom</label>
                  <input type="text" value={profile.lastName} onChange={e => setProfile(p => ({...p, lastName: e.target.value}))} placeholder="Nom de famille" className="w-full bg-[#F5F8FA] border border-[#E4E6EF] text-[#181C32] rounded-[8px] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[#009EF7]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-[#181C32] mb-2">Email d'entreprise</label>
                  <input type="email" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} placeholder="email@entreprise.com" className="w-full bg-[#F5F8FA] border border-[#E4E6EF] text-[#181C32] rounded-[8px] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[#009EF7]" />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="py-2.5 px-6 bg-[#009EF7] hover:bg-[#008de0] text-white font-bold text-[13px] rounded-[8px] transition-colors shadow-md">
                  Sauvegarder
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(76,87,125,0.02)] overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-[#E4E6EF] flex items-center gap-3">
              <Bell size={20} className="text-[#50CD89]" />
              <h2 className="text-[16px] font-bold text-[#181C32]">Préférences de Notification</h2>
            </div>
            <div className="p-8 flex flex-col gap-6">
              
              <div className="flex items-center justify-between p-4 border border-[#E4E6EF] rounded-[12px] hover:border-[#009EF7]/30 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-bold text-[#181C32]">Rapports de Sécurité Hebdomadaires</span>
                  <span className="text-[13px] font-medium text-[#A1A5B7]">Recevoir un résumé par email de vos interactions avec l'IA.</span>
                </div>
                <div 
                  className={`w-[46px] h-[24px] rounded-full p-1 cursor-pointer transition-colors duration-300 relative shrink-0 ${emailNotif ? 'bg-[#50CD89]' : 'bg-[#E4E6EF]'}`}
                  onClick={() => setEmailNotif(!emailNotif)}
                >
                  <motion.div 
                    className="w-[16px] h-[16px] bg-white rounded-full shadow-sm"
                    animate={{ x: emailNotif ? 22 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-[#E4E6EF] rounded-[12px] hover:border-[#009EF7]/30 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-bold text-[#181C32]">Alertes Critiques en Temps Réel</span>
                  <span className="text-[13px] font-medium text-[#A1A5B7]">Notifications Push lors d'un blocage de prompt sensible.</span>
                </div>
                <div 
                  className={`w-[46px] h-[24px] rounded-full p-1 cursor-pointer transition-colors duration-300 relative shrink-0 ${pushNotif ? 'bg-[#50CD89]' : 'bg-[#E4E6EF]'}`}
                  onClick={() => setPushNotif(!pushNotif)}
                >
                  <motion.div 
                    className="w-[16px] h-[16px] bg-white rounded-full shadow-sm"
                    animate={{ x: pushNotif ? 22 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
