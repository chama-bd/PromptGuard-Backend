import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchGithubProjects } from '../services/githubService';
import { fetchGitlabProjects } from '../services/gitlabService';
import { calculateSkillScore } from '../services/portfolioService';

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
    const loadProjects = async () => {
      try {
        const github = await fetchGithubProjects();
        const gitlab = await fetchGitlabProjects();
        setExternalProjects([...github, ...gitlab]);
      } catch (error) {
        console.error("Failed to load external projects", error);
      }
    };
    loadProjects();
  }, []);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    if(newStatus === 'TERMINEE') {
      toast.success("Tâche marquée comme terminée !");
    } else if (newStatus === 'EN_COURS') {
      toast.success("Tâche marquée en cours.");
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
