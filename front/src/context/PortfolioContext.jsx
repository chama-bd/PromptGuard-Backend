import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchGithubProjects } from '../services/githubService';
import { fetchGitlabProjects } from '../services/gitlabService';
import { calculateSkillScore } from '../services/portfolioService';
import api from '../services/api';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [externalProjects, setExternalProjects] = useState([]);
  const [portfolioTasks, setPortfolioTasks] = useState([]);
  
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    jobTitle: '',
    department: '',
    githubUsername: '',
    gitlabUsername: '',
    linkedin: '',
    securityScore: null,
  });

  useEffect(() => {
    const loadData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        // 1. Fetch user profile & security score
        const profileRes = await api.get(`/api/dashboard/employees/${userId}/profile`);
        const p = profileRes.data;
        setUserProfile({
          fullName: p.name || '',
          jobTitle: p.role === 'ROLE_RSSI' ? 'RSSI' : 'Ingénieur Dev',
          department: p.department || '',
          githubUsername: 'alice-pg',
          gitlabUsername: 'alice-pg-lab',
          linkedin: 'linkedin.com/in/alice-dev',
          securityScore: p.securityScore
        });

        // 2. Fetch git projects
        const github = await fetchGithubProjects();
        const gitlab = await fetchGitlabProjects();

        // 3. Fetch real database portfolio projects
        const portfolioRes = await api.get(`/api/portfolio/${userId}`);
        const portData = portfolioRes.data;

        // Map SQL completed projects
        const sqlCompleted = (portData.completedProjects || []).map(proj => ({
          id: `sql-completed-${proj.id}`,
          title: proj.name,
          description: proj.description,
          source: proj.repositoryUrl.includes('gitlab') ? 'GitLab' : 'GitHub',
          githubUrl: proj.repositoryUrl,
          gitlabUrl: proj.repositoryUrl,
          status: 'COMPLETED',
          isCompleted: true,
          commits: 14,
          impact: 'Élevé',
          date: 'Mai 2026',
          technologies: ['Spring Boot', 'PostgreSQL', 'AI Security']
        }));

        // Map SQL active projects
        const sqlActive = (portData.activeProjects || []).map(proj => ({
          id: `sql-active-${proj.id}`,
          title: proj.name,
          description: proj.description,
          source: proj.repositoryUrl.includes('gitlab') ? 'GitLab' : 'GitHub',
          githubUrl: proj.repositoryUrl,
          gitlabUrl: proj.repositoryUrl,
          status: 'EN_COURS',
          isCompleted: false,
          commits: 3,
          impact: 'Moyen',
          date: 'En cours',
          technologies: ['PostgreSQL', 'Docker']
        }));

        setExternalProjects([...github, ...gitlab, ...sqlActive, ...sqlCompleted]);

        // 4. Fetch real tasks
        const plannerRes = await api.get(`/api/mock/planner/${userId}`);
        const mappedTasks = plannerRes.data.map(t => ({
          ...t,
          status: t.status === 'TO_DO' ? 'A_FAIRE' : t.status === 'IN_PROGRESS' ? 'EN_COURS' : 'TERMINEE',
          time: '09:00',
          category: 'Sécurité IA'
        }));
        setTasks(mappedTasks);

      } catch (error) {
        console.error("Failed to load initial data in context", error);
      }
    };
    loadData();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      let updatedTask = null;
      if (newStatus === 'EN_COURS' && task.status === 'A_FAIRE') {
        const response = await api.patch(`/api/mock/planner/${taskId}/advance`);
        updatedTask = response.data;
      } else if (newStatus === 'TERMINEE') {
        if (task.status === 'A_FAIRE') {
          await api.patch(`/api/mock/planner/${taskId}/advance`);
        }
        const response = await api.patch(`/api/mock/planner/${taskId}/advance`);
        updatedTask = response.data;
      }

      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === taskId 
              ? { 
                  ...t, 
                  status: updatedTask.status === 'TO_DO' ? 'A_FAIRE' : updatedTask.status === 'IN_PROGRESS' ? 'EN_COURS' : 'TERMINEE' 
                } 
              : t
          )
        );
        
        if (newStatus === 'TERMINEE') {
          toast.success("Tâche marquée comme terminée !");
        } else if (newStatus === 'EN_COURS') {
          toast.success("Tâche marquée en cours.");
        }
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      toast.error("Impossible de modifier le statut de la tâche.");
    }
  };

  const addToPortfolio = (task) => {
    if (task.status !== 'TERMINEE') {
      toast.error("Seules les tâches terminées peuvent être ajoutées.");
      return;
    }
    
    if (portfolioTasks.some(p => p.id === task.id)) {
      toast.error("Cette tâche est déjà dans votre portfolio.");
      return;
    }

    setPortfolioTasks(prev => [{...task, isCompleted: true}, ...prev]);
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold">Ajouté au Portfolio</span>
        <span className="text-sm opacity-90">{task.title}</span>
      </div>,
      { icon: '🚀' }
    );
  };

  // Derived state for Portfolio
  const allProjects = [...externalProjects, ...portfolioTasks];
  const activeProjects = externalProjects.filter(p => !p.isCompleted);
  const completedProjects = allProjects.filter(p => p.isCompleted);
  const activeTasks = tasks.filter(t => t.status === 'EN_COURS');
  
  const combinedActiveWork = [...activeProjects, ...activeTasks];
  
  const skills = calculateSkillScore(externalProjects, [...tasks, ...portfolioTasks]);

  return (
    <PortfolioContext.Provider value={{ 
      tasks, 
      updateTaskStatus, 
      addToPortfolio,
      userProfile,
      setUserProfile,
      allProjects,
      activeProjects,
      completedProjects,
      combinedActiveWork,
      skills
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
