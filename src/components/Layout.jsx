import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  User,
  FileUp,
  Code,
  Briefcase,
  Trophy,
  Mic,
  Building2,
  BarChart2,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
} from 'lucide-react';
import Chatbot from './Chatbot';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
    { name: 'Courses & Tutorials', path: '/courses', icon: BookOpen },
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

  const searchResults = navItems.filter((item) => item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())).slice(0, 5);

  return (
    <div className="w-full max-w-full min-h-screen overflow-x-hidden bg-[#1a1a1a] text-neutral-200 font-sans">
      <Chatbot />
      
      {/* Top Navigation */}
      <header className="w-full sticky top-0 flex items-center justify-between px-6 py-3 bg-[#262626] border-b border-[#333333] z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ffa116] text-[#1a1a1a] flex items-center justify-center font-black text-xs">
            TP
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">TechPrep</h1>
          <nav className="hidden lg:flex items-center gap-1 ml-7">
            {[
              ['Practice', '/'],
              ['Courses', '/courses'],
              ['Mock Interview', '/interviews'],
              ['Coding Env', '/coding'],
              ['Voice AI', '/voice-interview'],
              ['Resume AI', '/resume'],
            ].map(([name, path]) => (
              <Link key={name} to={path} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === path ? 'text-white bg-[#333333]' : 'text-[#9ca3af] hover:text-white hover:bg-[#303030]'}`}>
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <label className="flex items-center gap-2 bg-[#383838] rounded-full px-3 py-1.5 w-48 text-[#9ca3af] text-sm focus-within:ring-1 focus-within:ring-[#00b8a3]">
              <Search className="w-4 h-4 shrink-0" />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search" aria-label="Search pages" className="w-full bg-transparent text-white placeholder:text-[#9ca3af] outline-none" />
            </label>
            {searchTerm.trim() && <div className="absolute top-11 right-0 w-56 overflow-hidden rounded-lg border border-[#383838] bg-[#262626] shadow-xl">
              {searchResults.length > 0 ? searchResults.map((item) => <Link key={item.path} to={item.path} onClick={() => setSearchTerm('')} className="block px-3 py-2 text-sm text-[#d1d1d1] hover:bg-[#333333] hover:text-white">{item.name}</Link>) : <p className="px-3 py-2 text-xs text-[#8a8a8a]">No matching pages</p>}
            </div>}
          </div>
          <div className="relative">
            <button onClick={() => setIsNotificationsOpen((open) => !open)} aria-label="Open notifications" className="relative p-1 text-[#9ca3af] hover:text-white"><Bell className="w-5 h-5" /><span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-[#00b8a3]" /></button>
            {isNotificationsOpen && <div className="absolute right-0 top-10 w-64 rounded-lg border border-[#383838] bg-[#262626] p-3 shadow-xl"><p className="text-sm font-semibold text-white">Notifications</p><p className="mt-2 text-xs text-[#8a8a8a]">You are all caught up.</p></div>}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#383838] text-white flex items-center justify-center text-xs font-bold">{(JSON.parse(authUserStr || '{"name":"U"}').name || 'U').charAt(0).toUpperCase()}</div>
          <Link to="/profile" className="hidden sm:block px-3 py-1 rounded-full bg-[#00b8a3] text-black text-xs font-semibold">Profile</Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white">{isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </header>

      {isMobileMenuOpen && <div className="lg:hidden absolute top-16 inset-x-0 z-40 bg-[#262626] border-b border-[#333333] p-3 grid grid-cols-2 gap-1">{navItems.map((item) => <Link key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-[#303030] rounded-lg">{item.name}</Link>)}</div>}

      {/* Main Content */}
      <main className="w-full min-w-0 bg-[#1a1a1a]">
        <div className="w-full min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
