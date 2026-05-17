import { motion } from 'framer-motion';
import { 
  Download, 
  ShieldCheck, 
  Github,
  Gitlab,
  Linkedin,
  Activity,
  GitPullRequest,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Code2,
  ExternalLink,
  Shield,
  Server,
  TerminalSquare,
  Award
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const certifications = [];

export default function EmployeePortfolio() {
  const { 
    userProfile, 
    completedProjects, 
    combinedActiveWork, 
    skills 
  } = usePortfolio();

  const skillConfig = [
    { key: 'cybersecurity', label: 'Cybersecurity', icon: ShieldCheck, color: '#50CD89' },
    { key: 'aiSecurity', label: 'AI Security', icon: Lock, color: '#009EF7' },
    { key: 'springboot', label: 'Spring Boot', icon: Database, color: '#7239EA' },
    { key: 'react', label: 'React', icon: Code2, color: '#F6C000' },
    { key: 'cloud', label: 'Cloud Security', icon: Globe, color: '#F1416C' },
    { key: 'postgresql', label: 'PostgreSQL', icon: Server, color: '#181C32' }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE':
      case 'EN_COURS':
        return <span className="px-2.5 py-1 bg-[#FFF8DD] text-[#F6C000] text-[10px] font-black rounded-[6px] border border-[#F6C000]/20 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12}/> En cours</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 bg-[#F8F5FF] text-[#7239EA] text-[10px] font-black rounded-[6px] border border-[#7239EA]/20 uppercase tracking-widest flex items-center gap-1.5"><GitPullRequest size={12}/> Review</span>;
      default:
        return <span className="px-2.5 py-1 bg-[#E8FFF3] text-[#50CD89] text-[10px] font-black rounded-[6px] border border-[#50CD89]/20 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12}/> Réalisé</span>;
    }
  };

  const getSecurityBadge = (level) => {
    if (!level) return null;
    const color = level === 'CRITICAL' ? 'text-[#F1416C] bg-[#FFF5F8] border-[#F1416C]/20' : 
                  level === 'HIGH' ? 'text-[#F6C000] bg-[#FFF8DD] border-[#F6C000]/20' : 
                  'text-[#50CD89] bg-[#E8FFF3] border-[#50CD89]/20';
    return (
      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-[4px] border ${color}`}>
        Sec Level: {level}
      </span>
    );
  };

  const handleExportPDF = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    window.open(`http://localhost:8080/api/portfolio/${userId}/export`, '_blank');
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col p-8 gap-8 font-sans h-full overflow-y-auto bg-[#F9FAFB] text-[#181C32]"
    >
      {/* SECTION 1: PROFIL & SECTION 6: EXPORT */}
      <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-8 shadow-sm border border-[#E4E6EF] flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-[16px] border border-[#E4E6EF] shadow-sm overflow-hidden bg-gray-50 flex items-center justify-center p-1">
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.fullName || 'Utilisateur')}&background=181C32&color=fff&size=256&bold=true`} alt={userProfile.fullName || 'Utilisateur'} className="w-full h-full object-cover rounded-[12px]" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
               <h1 className="text-[28px] font-black tracking-tight leading-none">{userProfile.fullName || '—'}</h1>
               {userProfile.securityScore != null && (
                 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F1FAFF] text-[#009EF7] rounded-[6px] border border-[#009EF7]/10">
                   <Shield size={14} />
                   <span className="text-[11px] font-black uppercase tracking-wider">Score Sécurité IA : {userProfile.securityScore}</span>
                 </div>
               )}
            </div>
            
            {(userProfile.jobTitle || userProfile.department) && (
              <p className="text-[15px] font-bold text-[#5E6278] flex items-center gap-3">
                {userProfile.jobTitle}
                {userProfile.jobTitle && userProfile.department && <span className="w-1 h-1 rounded-full bg-[#E4E6EF]"></span>}
                {userProfile.department && <span className="text-[#A1A5B7]">{userProfile.department}</span>}
              </p>
            )}

            <div className="flex items-center gap-4 mt-2">
               {userProfile.githubUsername && <a href={`https://github.com/${userProfile.githubUsername}`} className="flex items-center gap-2 text-[13px] font-bold text-[#5E6278] hover:text-[#181C32] transition-colors"><Github size={16}/> {userProfile.githubUsername}</a>}
               {userProfile.gitlabUsername && <a href={`https://gitlab.com/${userProfile.gitlabUsername}`} className="flex items-center gap-2 text-[13px] font-bold text-[#5E6278] hover:text-[#FC6D26] transition-colors"><Gitlab size={16}/> {userProfile.gitlabUsername}</a>}
               {userProfile.linkedin && <a href={`https://${userProfile.linkedin}`} className="flex items-center gap-2 text-[13px] font-bold text-[#5E6278] hover:text-[#0077B5] transition-colors"><Linkedin size={16}/> LinkedIn</a>}
            </div>
          </div>
        </div>

        <button 
          onClick={handleExportPDF}
          className="px-6 py-3 bg-[#181C32] hover:bg-[#2b304d] text-white rounded-[12px] font-black text-[13px] flex items-center gap-2 transition-all shadow-sm shrink-0 border border-[#181C32]/10"
        >
          <Download size={16} /> Exporter Portfolio PDF
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: SKILLS & CERTIFICATIONS */}
        <div className="xl:col-span-1 flex flex-col gap-8">
          
          {/* SECTION 2: SKILLS */}
          <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E4E6EF] flex flex-col gap-6">
            <h2 className="text-[16px] font-black text-[#181C32] border-b border-[#F1F3F9] pb-4 flex items-center gap-2">
              <TerminalSquare size={18} className="text-[#009EF7]"/> Compétences Techniques
            </h2>
            
            <div className="flex flex-col gap-5">
              {skillConfig.map((skill, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#5E6278] font-bold text-[12px]">
                      <skill.icon size={14} style={{ color: skill.color }} />
                      {skill.label}
                    </div>
                    <span className="text-[12px] font-black" style={{ color: skill.color }}>{skills[skill.key]}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F5F8FA] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skills[skill.key]}%` }}
                      transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 5: CERTIFICATIONS */}
          <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-6 shadow-sm border border-[#E4E6EF] flex flex-col gap-6">
            <h2 className="text-[16px] font-black text-[#181C32] border-b border-[#F1F3F9] pb-4 flex items-center gap-2">
              <Award size={18} className="text-[#7239EA]"/> Certifications
            </h2>
            
            <div className="flex flex-col gap-3">
              {certifications.length === 0 ? (
                <div className="text-center py-6 bg-[#F9FAFB] rounded-[12px] border border-dashed border-[#E4E6EF]">
                  <p className="text-[13px] font-bold text-[#A1A5B7]">Aucune certification enregistrée.</p>
                </div>
              ) : (
                certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 bg-[#F9FAFB] rounded-[10px] border border-[#E4E6EF] flex flex-col gap-1">
                    <span className="text-[13px] font-black text-[#181C32] leading-tight">{cert.title}</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px] font-bold text-[#A1A5B7]">{cert.issuer}</span>
                      <span className="text-[10px] font-black text-[#5E6278] bg-white px-2 py-0.5 rounded-[4px] border border-[#E4E6EF]">{cert.year}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: PROJECTS */}
        <div className="xl:col-span-3 flex flex-col gap-8">
          
          {/* SECTION 3: PROJETS RÉALISÉS */}
          <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-8 shadow-sm border border-[#E4E6EF] flex flex-col gap-6">
            <h2 className="text-[18px] font-black text-[#181C32] border-b border-[#F1F3F9] pb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#50CD89]"/> Projets Techniques Validés
            </h2>

            <div className="flex flex-col gap-4">
              {completedProjects.length === 0 ? (
                <div className="text-center py-8 bg-[#F9FAFB] rounded-[12px] border border-dashed border-[#E4E6EF]">
                  <p className="text-[13px] font-bold text-[#A1A5B7]">Aucun projet technique validé.</p>
                </div>
              ) : (
                completedProjects.map((project, idx) => (
                  <div key={idx} className="p-6 bg-white rounded-[12px] border border-[#E4E6EF] hover:border-[#181C32]/20 transition-all flex flex-col gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#E4E6EF] group-hover:bg-[#50CD89] transition-colors"></div>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                           <h3 className="text-[16px] font-black text-[#181C32]">{project.title}</h3>
                           {getSecurityBadge(project.securityLevel)}
                        </div>
                        <p className="text-[13px] text-[#5E6278] font-medium leading-relaxed max-w-[80%]">{project.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                         {getStatusBadge('COMPLETED')}
                         {project.source === 'GitHub' && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-black text-[#181C32] bg-[#F5F8FA] hover:bg-[#E4E6EF] px-3 py-1.5 rounded-[6px] transition-colors">
                              <Github size={12}/> Repository
                            </a>
                         )}
                         {project.source === 'GitLab' && (
                            <a href={project.gitlabUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-black text-[#181C32] bg-[#F5F8FA] hover:bg-[#E4E6EF] px-3 py-1.5 rounded-[6px] transition-colors">
                              <Gitlab size={12}/> Repository
                            </a>
                         )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#F1F3F9]">
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || project.tech || []).map((t, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white border border-[#E4E6EF] text-[#7E8299] text-[10px] font-black rounded-[4px]">
                            {t}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-5 text-[11px] font-bold text-[#A1A5B7]">
                         {project.commits && <span className="flex items-center gap-1"><GitPullRequest size={12}/> {project.commits} commits</span>}
                         {project.impact && <span>Impact: <strong className="text-[#181C32]">{project.impact}</strong></span>}
                         <span>{project.date || project.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* SECTION 4: PROJETS EN COURS */}
          <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-8 shadow-sm border border-[#E4E6EF] flex flex-col gap-6">
            <h2 className="text-[18px] font-black text-[#181C32] border-b border-[#F1F3F9] pb-4 flex items-center gap-2">
              <Activity size={20} className="text-[#F6C000]"/> Travaux & Audits En Cours
            </h2>

            <div className="flex flex-col gap-3">
              {combinedActiveWork.length === 0 ? (
                <div className="text-center py-6 bg-[#F9FAFB] rounded-[12px] border border-[#E4E6EF]">
                  <p className="text-[13px] font-bold text-[#A1A5B7]">Aucun audit ou projet en cours.</p>
                </div>
              ) : (
                combinedActiveWork.map((work, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border border-[#E4E6EF] rounded-[10px] hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      {work.source === 'GitHub' ? <Github size={16} className="text-[#181C32]"/> : 
                       work.source === 'GitLab' ? <Gitlab size={16} className="text-[#FC6D26]"/> : 
                       <Activity size={16} className="text-[#009EF7]"/>}
                      
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-[#181C32]">{work.title}</span>
                        <span className="text-[11px] font-bold text-[#A1A5B7]">
                          {(work.technologies || work.tech || []).slice(0, 3).join(' • ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getSecurityBadge(work.securityLevel)}
                      {getStatusBadge(work.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
}
