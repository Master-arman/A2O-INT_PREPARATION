import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, FileUp, Code, Briefcase, Trophy, Mic, Building2, BarChart2, LogOut, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Chatbot from './Chatbot';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const authUserStr = localStorage.getItem('user');
  let isAdmin = false;
  if (authUserStr) {
    isAdmin = JSON.parse(authUserStr).role === 'admin';
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Interviews', path: '/interviews', icon: Briefcase },
    { name: 'Coding Env', path: '/coding', icon: Code },
    { name: 'Company Prep', path: '/company', icon: Building2 },
    { name: 'Voice AI', path: '/voice-interview', icon: Mic },
    { name: 'Resume AI', path: '/resume', icon: FileUp },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: Briefcase }); // Or a generic admin icon
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
      <Chatbot />
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-white/10 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/30">
            AI
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            TechPrep
          </h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 w-64 glass-panel border-r border-[#1e293b]/50 m-4 flex flex-col justify-between rounded-2xl shadow-2xl z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[150%] md:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">
              AI
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              TechPrep
            </h1>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                    isActive 
                      ? 'text-white bg-white/10 shadow-inner' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <Link to="/auth" onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
