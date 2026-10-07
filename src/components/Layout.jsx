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

import { signOutUser } from '../utils/supabaseClient';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close dropdowns on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const authUserStr = localStorage.getItem('user');
  let isLoggedIn = false;
  let isAdmin = false;
  let parsedUser = { name: 'Guest User', email: '', role: '' };
  try {
    if (authUserStr) {
      parsedUser = JSON.parse(authUserStr);
      isLoggedIn = true;
      isAdmin = parsedUser.role === 'admin';
    }
  } catch {
    // Corrupted localStorage - ignore
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
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: Briefcase });
  }

  const handleLogout = async () => {
    await signOutUser();
    setIsUserMenuOpen(false);
    window.location.href = '/login';
  };

  const searchResults = navItems.filter((item) => item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())).slice(0, 5);

  return (
    <div className="w-full max-w-full min-h-screen overflow-x-hidden bg-[#1a1a1a] text-neutral-200 font-sans">
      <Chatbot />
      
      {/* Top Navigation */}
      <header className="w-full sticky top-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#262626] border-b border-[#333333] z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffa116] text-[#1a1a1a] flex items-center justify-center font-black text-xs shadow-md shadow-orange-500/20">
              TP
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">TechPrep</h1>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {[
              ['Practice', '/'],
              ['Courses', '/courses'],
              ['Mock Interview', '/interviews'],
              ['Coding Env', '/coding'],
              ['Voice AI', '/voice-interview'],
              ['Resume AI', '/resume'],
            ].map(([name, path]) => (
              <Link key={name} to={path} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${location.pathname === path ? 'text-white bg-[#333333]' : 'text-[#9ca3af] hover:text-white hover:bg-[#303030]'}`}>
                {name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <label className="flex items-center gap-2 bg-[#383838] rounded-full px-3 py-1.5 w-44 lg:w-52 text-[#9ca3af] text-xs focus-within:ring-1 focus-within:ring-[#00b8a3]">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search TechPrep..." aria-label="Search pages" className="w-full bg-transparent text-white text-xs placeholder:text-[#9ca3af] outline-none" />
            </label>
            {searchTerm.trim() && <div className="absolute top-11 right-0 w-56 overflow-hidden rounded-lg border border-[#383838] bg-[#262626] shadow-xl z-50">
              {searchResults.length > 0 ? searchResults.map((item) => <Link key={item.path} to={item.path} onClick={() => setSearchTerm('')} className="block px-3 py-2 text-xs text-[#d1d1d1] hover:bg-[#333333] hover:text-white">{item.name}</Link>) : <p className="px-3 py-2 text-xs text-[#8a8a8a]">No matching pages</p>}
            </div>}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setIsNotificationsOpen((open) => !open)} aria-label="Open notifications" className="relative p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#333333] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#00b8a3]" />
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 top-10 w-64 rounded-xl border border-[#383838] bg-[#262626] p-3 shadow-2xl z-50">
                <p className="text-xs font-bold text-white">Notifications</p>
                <p className="mt-2 text-xs text-[#8a8a8a]">You are all caught up! Keep practicing daily streaks.</p>
              </div>
            )}
          </div>

          {/* Auth State in Header */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#333333] hover:bg-[#3d3d3d] border border-white/10 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ffa116] to-[#00b8a3] text-black font-black flex items-center justify-center text-xs shadow-sm">
                  {(parsedUser.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
                  {parsedUser.name?.split(' ')[0] || 'User'}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-11 w-60 rounded-xl border border-[#383838] bg-[#22262f] p-2 shadow-2xl z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="font-bold text-white text-sm truncate">{parsedUser.name || 'User'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{parsedUser.email || 'user@techprep.ai'}</p>
                    {parsedUser.role && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 font-mono text-[10px] uppercase font-bold">
                        {parsedUser.role}
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-[#ffa116]" />
                      <span>My Profile & Settings</span>
                    </Link>
                    <Link
                      to="/analytics"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <BarChart2 className="w-4 h-4 text-[#00b8a3]" />
                      <span>Readiness & Analytics</span>
                    </Link>
                  </div>

                  <div className="border-t border-white/10 my-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 rounded-lg transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-bold text-xs hover:brightness-110 transition-all shadow-md shadow-teal-500/20"
            >
              <span>Log In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 text-white hover:bg-[#333333] rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-14 inset-x-0 z-40 bg-[#22262f] border-b border-[#333333] p-4 shadow-2xl">
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#9ca3af] hover:text-white hover:bg-[#303030] rounded-lg transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-[#ffa116]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of TechPrep</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-teal-500 text-black font-bold text-xs hover:bg-teal-400 transition-all"
              >
                <span>Log In / Create Account</span>
              </Link>
            )}
          </div>
        </div>
      )}

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
