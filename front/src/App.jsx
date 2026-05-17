import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import Login from './pages/Login';
import EmployeeChat from './pages/EmployeeChat';
import EmployeeBriefing from './pages/EmployeeBriefing';
import EmployeeHistory from './pages/EmployeeHistory';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeePlanner from './pages/EmployeePlanner';
import EmployeeMessaging from './pages/EmployeeMessaging';
import EmployeePortfolio from './pages/EmployeePortfolio';

import RssiDashboard from './pages/RssiDashboard';
import RssiAlerts from './pages/RssiAlerts';
import RssiHeatmap from './pages/RssiHeatmap';
import RssiReports from './pages/RssiReports';
import RssiWorldMap from './pages/RssiWorldMap';
import RssiEmployees from './pages/RssiEmployees';
import RssiIncidents from './pages/RssiIncidents';
import RssiAnalytics from './pages/RssiAnalytics';

// Sidebars
import EmployeeSidebar from './components/EmployeeSidebar';
import RssiSidebar from './components/RssiSidebar';

// Common Components
import TopBar from './components/TopBar';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 15, filter: 'blur(8px)' },
  in: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
  out: { opacity: 0, scale: 1.02, y: -15, filter: 'blur(8px)' }
};

const pageTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1,
  duration: 0.5
};

// Layouts
const EmployeeLayout = ({ children }) => (
  <div className="flex h-screen w-full bg-[#F5F6FA] text-[#181C32] overflow-hidden font-sans">
    <EmployeeSidebar />
    <div className="flex flex-col flex-1 overflow-hidden relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto relative">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  </div>
);

const RssiLayout = ({ children }) => (
  <div className="flex h-screen w-full bg-[#F5F6FA] text-[#181C32] overflow-hidden font-sans">
    <RssiSidebar />
    <div className="flex flex-col flex-1 overflow-hidden relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto relative scrollbar-hide">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  </div>
);

const FullScreenPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="h-screen w-full"
  >
    {children}
  </motion.div>
);

import PageSkeleton from './components/LoadingSkeleton';
import { PortfolioProvider } from './context/PortfolioContext';

export default function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial SaaS-style fake loading for WOW factor
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <PageSkeleton />;

  return (
    <PortfolioProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<FullScreenPage><Login /></FullScreenPage>} />
          
          {/* Employee Portal */}
          <Route path="/chat" element={<EmployeeLayout><EmployeeChat /></EmployeeLayout>} />
          <Route path="/messaging" element={<EmployeeLayout><EmployeeMessaging /></EmployeeLayout>} />
          <Route path="/planner" element={<EmployeeLayout><EmployeePlanner /></EmployeeLayout>} />
          <Route path="/briefing" element={<EmployeeLayout><EmployeeBriefing /></EmployeeLayout>} />
          <Route path="/history" element={<EmployeeLayout><EmployeeHistory /></EmployeeLayout>} />
          <Route path="/portfolio" element={<EmployeeLayout><EmployeePortfolio /></EmployeeLayout>} />
          <Route path="/profile" element={<EmployeeLayout><EmployeeProfile /></EmployeeLayout>} />
          
          {/* RSSI Portal - ALL RSSI pages now use RssiLayout for consistency */}
          <Route path="/dashboard" element={<RssiLayout><RssiDashboard /></RssiLayout>} />
          <Route path="/alerts" element={<RssiLayout><RssiAlerts /></RssiLayout>} />
          <Route path="/heatmap" element={<RssiLayout><RssiHeatmap /></RssiLayout>} />
          <Route path="/reports" element={<RssiLayout><RssiReports /></RssiLayout>} />
          <Route path="/employees" element={<RssiLayout><RssiEmployees /></RssiLayout>} />
          <Route path="/incidents" element={<RssiLayout><RssiIncidents /></RssiLayout>} />
          <Route path="/analytics" element={<RssiLayout><RssiAnalytics /></RssiLayout>} />
          <Route path="/world-map" element={<RssiLayout><RssiWorldMap /></RssiLayout>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </PortfolioProvider>
  );
}
