import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Briefcase,
  Globe,
  Bookmark,
  CheckCircle2,
  Loader2,
  Shield,
  Sliders,
  GraduationCap,
  Code2,
  Flame,
  Award,
  Bell,
  MapPin,
  Phone,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Trash2,
  Link as LinkIcon,
  Check,
  Database,
  CloudCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { syncProfileToDatabase, fetchUserProfileFromSupabase, fetchUserProgressFromSupabase } from '../../utils/supabaseClient';
import { getSolvedQuestions, syncFromSupabaseCloud, calculateStreak } from '../../utils/activityTracker';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PROFILE_OPTIONS = [
  { id: 'personal', name: 'Personal Information', icon: User, desc: 'Name, email, avatar & bio' },
  { id: 'preferences', name: 'Interview Preferences', icon: Sliders, desc: 'Target roles, companies & level' },
  { id: 'experience', name: 'Experience & Education', icon: GraduationCap, desc: 'Work history, college & skills' },
  { id: 'social', name: 'Social & Portfolio Links', icon: Globe, desc: 'GitHub, LinkedIn & portfolio' },
  { id: 'saved', name: 'Saved & Bookmarks', icon: Bookmark, desc: 'Saved questions & prep items' },
  { id: 'security', name: 'Account & Security', icon: Shield, desc: 'Privacy, password & notifications' },
];

const TARGET_COMPANIES_LIST = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber', 'Stripe', 'Airbnb', 'Salesforce'
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    location: 'San Francisco, CA',
    bio: 'Software engineer focusing on building scalable web applications and mastering algorithmic problem solving.',
    targetRole: 'frontend',
    experienceLevel: 'intermediate',
    primaryLanguage: 'JavaScript',
    weeklyGoalHours: '10',
    targetCompanies: ['Google', 'Meta', 'Amazon'],
    currentCompany: 'Tech Corp',
    currentTitle: 'Frontend Developer',
    university: 'Stanford University',
    gradYear: '2025',
    skills: 'React, TypeScript, Node.js, Next.js, Tailwind CSS, Python',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    portfolioUrl: 'https://portfolio.dev',
    leetcodeUsername: 'techprep_master',
    notifications: {
      mockReminders: true,
      weeklyReport: true,
      productUpdates: false,
    },
  });

  const [savedQuestionsList, setSavedQuestionsList] = useState([]);
  const [solvedList, setSolvedList] = useState([]);
  const [solvedStats, setSolvedStats] = useState({ total: 1, easy: 1, medium: 0, hard: 0, streak: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(true);

  useEffect(() => {
    const authUserStr = localStorage.getItem('user');
    let authData = { name: 'User', email: 'user@example.com' };

    if (authUserStr) {
      try {
        authData = JSON.parse(authUserStr);
      } catch (e) {
        console.error(e);
      }
    }

    const userEmail = authData.email || 'user@example.com';
    const allProfiles = JSON.parse(localStorage.getItem('allProfiles') || '{}');
    const savedProfile = allProfiles[userEmail];

    if (savedProfile) {
      setProfile((prev) => ({ ...prev, ...savedProfile }));
    } else {
      const nameParts = (authData.name || 'User').split(' ');
      setProfile((prev) => ({
        ...prev,
        firstName: nameParts[0] || 'User',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userEmail,
        username: (authData.name || 'user').toLowerCase().replace(/\s+/g, '.'),
      }));
    }

    // Refresh Solved stats from storage
    const refreshStats = () => {
      const solvedSet = getSolvedQuestions();
      const solvedArr = Array.from(solvedSet);
      setSolvedList(solvedArr);
      const streakInfo = calculateStreak();
      
      // Calculate breakdown
      let easy = 0, med = 0, hard = 0;
      solvedArr.forEach(id => {
        if (id.includes('algo-1') || id.includes('algo-4') || id.includes('Easy')) easy++;
        else if (id.includes('Hard') || id.includes('algo-2') || id.includes('algo-6')) hard++;
        else med++;
      });
      if (easy === 0 && med === 0 && hard === 0 && solvedArr.length > 0) easy = solvedArr.length;

      setSolvedStats({
        total: solvedArr.length,
        easy: Math.max(1, easy),
        medium: med,
        hard: hard,
        streak: streakInfo.currentStreak || 1
      });
    };

    refreshStats();

    // Sync latest profile & progress from Supabase Cloud
    if (authData.id && authData.id !== 'local_user') {
      syncFromSupabaseCloud(authData.id).then(() => {
        refreshStats();
        setIsCloudSynced(true);
      });
    }

    // Load saved questions
    try {
      const savedIds = JSON.parse(localStorage.getItem('saved_questions') || '[]');
      setSavedQuestionsList(savedIds);
    } catch {
      setSavedQuestionsList(['algo-1', 'algo-2', 'design-1']);
    }

    const handleSolvedUpdate = () => refreshStats();
    window.addEventListener('solved-questions-updated', handleSolvedUpdate);
    return () => window.removeEventListener('solved-questions-updated', handleSolvedUpdate);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('notif_')) {
      const notifKey = name.replace('notif_', '');
      setProfile((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notifKey]: checked,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    setIsSaved(false);
  };

  const toggleTargetCompany = (comp) => {
    setProfile((prev) => {
      const current = prev.targetCompanies || [];
      const updated = current.includes(comp) ? current.filter((c) => c !== comp) : [...current, comp];
      return { ...prev, targetCompanies: updated };
    });
    setIsSaved(false);
  };

  const removeBookmark = (id) => {
    const updated = savedQuestionsList.filter((item) => item !== id);
    setSavedQuestionsList(updated);
    localStorage.setItem('saved_questions', JSON.stringify(updated));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const allProfiles = JSON.parse(localStorage.getItem('allProfiles') || '{}');
      allProfiles[profile.email] = profile;
      localStorage.setItem('allProfiles', JSON.stringify(allProfiles));

      // Also update auth user name
      const authUserStr = localStorage.getItem('user');
      let userId = null;
      if (authUserStr) {
        try {
          const authData = JSON.parse(authUserStr);
          authData.name = `${profile.firstName} ${profile.lastName}`.trim();
          userId = authData.id;
          localStorage.setItem('user', JSON.stringify(authData));
        } catch (e) {
          console.error(e);
        }
      }

      // Sync to Supabase Database
      if (userId) {
        await syncProfileToDatabase(userId, {
          first_name: profile.firstName,
          last_name: profile.lastName,
          email: profile.email,
          username: profile.username,
          target_role: profile.targetRole,
          bio: profile.bio,
          skills: profile.skills,
          university: profile.university,
          current_company: profile.currentCompany
        });
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.warn("Supabase profile sync warning:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 px-4 py-6 text-neutral-200">
      {/* Header */}
      <header className="flex flex-col justify-between gap-3 border-b border-[#383838] pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">My Profile & Settings</h1>
          <p className="mt-1 text-sm text-[#8a8a8a]">Manage your personal information, interview preferences, and account configuration.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-lg border border-[#383838] bg-[#282828] px-3.5 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:bg-[#333333] hover:text-white"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-[#ffa116] px-4 py-2 text-xs font-bold text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_14px_rgba(255,161,22,0.4)] active:scale-95"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>Save All Changes</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Left Profile Card & Options, Right Form Content */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card + Option Navigation Tabs */}
        <div className="col-span-12 space-y-5 lg:col-span-4">
          {/* Main User Card */}
          <div className="rounded-xl border border-[#383838] bg-[#262626] p-6 text-center shadow-lg">
            <div className="relative mx-auto mb-4 w-24">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#ffa116] via-[#ff6b00] to-[#9333ea] text-3xl font-black text-white shadow-md shadow-[#ffa116]/20">
                {(profile.firstName?.[0] || 'U')}{(profile.lastName?.[0] || '')}
              </div>
              <button
                title="Change Avatar"
                className="absolute bottom-0 right-0 rounded-full border border-[#444] bg-[#1a1a1a] p-1.5 text-[#ffa116] transition-colors hover:border-[#ffa116] hover:bg-[#2d2d2d]"
              >
                <User className="h-3.5 w-3.5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white">
              {profile.firstName} {profile.lastName || ''}
            </h2>
            <p className="text-xs font-mono text-[#8a8a8a]">@{profile.username || 'developer'}</p>
            
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#ffa116]/30 bg-[#ffa116]/10 px-3 py-1 text-xs font-medium text-[#ffa116]">
              <Briefcase className="h-3 w-3" />
              <span className="capitalize">{profile.targetRole} Engineer</span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#a3a3a3]">
              {profile.bio}
            </p>

            {/* Profile Completion Bar */}
            <div className="mt-5 border-t border-[#383838] pt-4 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8a8a8a]">Profile Strength</span>
                <span className="font-semibold text-[#00b8a3]">90% Complete</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#383838]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#ffa116] to-[#00b8a3]" style={{ width: '90%' }} />
              </div>
            </div>

            {/* Social Link Quick Badges */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[#383838] bg-[#2d2d2d] p-2 text-[#8a8a8a] transition-colors hover:border-white hover:text-white">
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[#383838] bg-[#2d2d2d] p-2 text-[#8a8a8a] transition-colors hover:border-[#0a66c2] hover:text-[#0a66c2]">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
              {profile.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[#383838] bg-[#2d2d2d] p-2 text-[#8a8a8a] transition-colors hover:border-[#00b8a3] hover:text-[#00b8a3]">
                  <Globe className="h-4 w-4" />
                </a>
              )}
              <Link to="/resume" className="rounded-lg border border-[#383838] bg-[#2d2d2d] p-2 text-[#8a8a8a] transition-colors hover:border-[#ffa116] hover:text-[#ffa116]" title="Upload Resume">
                <Layers className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Supabase Storage / Solved Questions Cloud Card */}
          <div className="rounded-xl border border-[#383838] bg-[#262626] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#383838] pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-[#00b8a3]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Supabase Cloud Progress</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00b8a3] bg-[#00b8a3]/10 px-2 py-0.5 rounded-full border border-[#00b8a3]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b8a3] animate-pulse" /> Cloud Synced
              </span>
            </div>

            {/* Solved Count Stat */}
            <div className="bg-[#1a1a1a] p-3.5 rounded-xl border border-[#383838] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#8a8a8a]">Total Questions Solved</p>
                <p className="text-2xl font-black text-white mt-0.5">{solvedStats.total} <span className="text-xs font-normal text-[#8a8a8a]">/ 120</span></p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> {solvedStats.streak} Day Streak
                </span>
                <Link to="/coding" className="text-[11px] text-[#00b8a3] hover:underline font-semibold flex items-center gap-0.5">
                  Practice More <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Difficulty Breakdown Pills */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#1f2923] p-2 rounded-lg border border-emerald-500/20">
                <p className="text-[10px] uppercase font-bold text-emerald-400">Easy</p>
                <p className="text-sm font-bold text-white mt-0.5">{solvedStats.easy}</p>
              </div>
              <div className="bg-[#2d2518] p-2 rounded-lg border border-amber-500/20">
                <p className="text-[10px] uppercase font-bold text-amber-400">Medium</p>
                <p className="text-sm font-bold text-white mt-0.5">{solvedStats.medium}</p>
              </div>
              <div className="bg-[#2d181e] p-2 rounded-lg border border-rose-500/20">
                <p className="text-[10px] uppercase font-bold text-rose-400">Hard</p>
                <p className="text-sm font-bold text-white mt-0.5">{solvedStats.hard}</p>
              </div>
            </div>

            {/* Solved Badges Preview */}
            {solvedList.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-[#8a8a8a] mb-2">Saved Solved Problems in Supabase:</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {solvedList.map((qId, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-emerald-300">
                      <Check className="w-3 h-3 text-emerald-400" />
                      {qId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Options List / Tab Navigation */}
          <div className="rounded-xl border border-[#383838] bg-[#262626] p-2 shadow-lg">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">Profile Options</p>
            <div className="space-y-1">
              {PROFILE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = activeTab === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveTab(option.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-all duration-200 ease-out ${
                      isActive
                        ? 'border border-[#ffa116]/40 bg-[#ffa116]/15 font-semibold text-[#ffa116] shadow-sm'
                        : 'border border-transparent text-[#a3a3a3] hover:border-[#383838] hover:bg-[#2d2d2d] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-md p-1.5 ${isActive ? 'bg-[#ffa116] text-black' : 'bg-[#333333] text-[#8a8a8a]'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-xs ${isActive ? 'text-[#ffa116]' : 'text-neutral-200'}`}>{option.name}</p>
                        <p className="text-[10px] text-[#8a8a8a]">{option.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isActive ? 'translate-x-0.5 text-[#ffa116]' : 'text-[#666]'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Option Form Content */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-xl border border-[#383838] bg-[#262626] p-6 shadow-xl">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Option 1: Personal Information */}
              {activeTab === 'personal' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#383838] pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-[#ffa116]" /> Personal Information
                    </h3>
                    <p className="text-xs text-[#8a8a8a]">Basic profile details that identify you across TechPrep mock interviews.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a]/60 px-3.5 py-2.5 pl-9 text-xs text-[#8a8a8a] cursor-not-allowed outline-none"
                        />
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#666]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Username / Handle</label>
                      <input
                        type="text"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Phone Number (Optional)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={profile.phone}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 pl-9 text-xs text-white outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116]"
                        />
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#666]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Location</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="location"
                          value={profile.location}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 pl-9 text-xs text-white outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116]"
                        />
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#666]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-neutral-300">Professional Bio & Headline</label>
                    <textarea
                      name="bio"
                      rows="3"
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-3 text-xs text-white outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116]"
                      placeholder="Tell recruiters and mock interviewers about your technical background..."
                    />
                  </div>
                </div>
              )}

              {/* Option 2: Interview Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#383838] pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-[#ffa116]" /> Interview & Prep Preferences
                    </h3>
                    <p className="text-xs text-[#8a8a8a]">Tailor mock interview question generation to your career goals.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Target Role</label>
                      <select
                        name="targetRole"
                        value={profile.targetRole}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      >
                        <option value="frontend">Frontend Engineer</option>
                        <option value="backend">Backend Engineer</option>
                        <option value="fullstack">Full Stack Engineer</option>
                        <option value="ai">AI / ML Engineer</option>
                        <option value="systems">Systems & DevOps Engineer</option>
                        <option value="mobile">Mobile (iOS / Android) Engineer</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Experience Level</label>
                      <select
                        name="experienceLevel"
                        value={profile.experienceLevel}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      >
                        <option value="entry">Entry Level / Intern (0-2 YOE)</option>
                        <option value="intermediate">Mid-Level Engineer (3-5 YOE)</option>
                        <option value="senior">Senior Engineer (5-8 YOE)</option>
                        <option value="lead">Staff / Principal (8+ YOE)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Primary Coding Language</label>
                      <select
                        name="primaryLanguage"
                        value={profile.primaryLanguage}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      >
                        <option value="JavaScript">JavaScript (ES6+)</option>
                        <option value="TypeScript">TypeScript</option>
                        <option value="Python">Python 3</option>
                        <option value="Java">Java</option>
                        <option value="C++">C++</option>
                        <option value="Go">Go</option>
                        <option value="Rust">Rust</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Weekly Target Prep (Hours)</label>
                      <input
                        type="number"
                        name="weeklyGoalHours"
                        value={profile.weeklyGoalHours}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-neutral-300">Target Companies</label>
                    <div className="flex flex-wrap gap-2">
                      {TARGET_COMPANIES_LIST.map((comp) => {
                        const isSelected = (profile.targetCompanies || []).includes(comp);
                        return (
                          <button
                            type="button"
                            key={comp}
                            onClick={() => toggleTargetCompany(comp)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                              isSelected
                                ? 'border-[#ffa116] bg-[#ffa116] text-black shadow-sm'
                                : 'border-[#383838] bg-[#1a1a1a] text-[#8a8a8a] hover:border-[#555] hover:text-white'
                            }`}
                          >
                            {isSelected ? `✓ ${comp}` : `+ ${comp}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Option 3: Experience & Education */}
              {activeTab === 'experience' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#383838] pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-[#ffa116]" /> Experience & Education
                    </h3>
                    <p className="text-xs text-[#8a8a8a]">Your technical background used for AI resume and voice mock simulations.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Current / Most Recent Company</label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={profile.currentCompany}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Current Role / Job Title</label>
                      <input
                        type="text"
                        name="currentTitle"
                        value={profile.currentTitle}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">University / College</label>
                      <input
                        type="text"
                        name="university"
                        value={profile.university}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Graduation Year</label>
                      <input
                        type="text"
                        name="gradYear"
                        value={profile.gradYear}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-neutral-300">Key Technical Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={profile.skills}
                      onChange={handleChange}
                      placeholder="e.g. React, Node.js, GraphQL, PostgreSQL, Docker"
                      className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#ffa116]"
                    />
                  </div>
                </div>
              )}

              {/* Option 4: Social & Portfolio Links */}
              {activeTab === 'social' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#383838] pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe className="h-5 w-5 text-[#ffa116]" /> Social & Portfolio Links
                    </h3>
                    <p className="text-xs text-[#8a8a8a]">Link your coding repositories and professional portfolios.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">GitHub Profile URL</label>
                      <div className="relative">
                        <input
                          type="url"
                          name="githubUrl"
                          value={profile.githubUrl}
                          onChange={handleChange}
                          placeholder="https://github.com/your-username"
                          className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 pl-9 text-xs text-white outline-none focus:border-[#ffa116]"
                        />
                        <GithubIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#8a8a8a]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">LinkedIn Profile URL</label>
                      <div className="relative">
                        <input
                          type="url"
                          name="linkedinUrl"
                          value={profile.linkedinUrl}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/your-profile"
                          className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 pl-9 text-xs text-white outline-none focus:border-[#ffa116]"
                        />
                        <LinkedinIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#0a66c2]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">Personal Portfolio / Website</label>
                      <div className="relative">
                        <input
                          type="url"
                          name="portfolioUrl"
                          value={profile.portfolioUrl}
                          onChange={handleChange}
                          placeholder="https://yourportfolio.dev"
                          className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 pl-9 text-xs text-white outline-none focus:border-[#ffa116]"
                        />
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-[#00b8a3]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-300">LeetCode Username</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="leetcodeUsername"
                          value={profile.leetcodeUsername}
                          onChange={handleChange}
                          placeholder="leetcode_handle"
                          className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3.5 py-2.5 pl-9 text-xs text-white outline-none focus:border-[#ffa116]"
                        />
                        <Code2 className="absolute left-3 top-2.5 h-4 w-4 text-[#ffa116]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Option 5: Saved & Bookmarks */}
              {activeTab === 'saved' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#383838] pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-[#ffa116]" /> Saved Questions & Bookmarks
                    </h3>
                    <p className="text-xs text-[#8a8a8a]">Quickly jump back into the problems you flagged during practice.</p>
                  </div>

                  {savedQuestionsList.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#383838] p-8 text-center text-xs text-[#8a8a8a]">
                      No bookmarked questions yet. Click the bookmark icon on any problem in the Practice dashboard to save it here.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedQuestionsList.map((qid) => (
                        <div key={qid} className="flex items-center justify-between rounded-lg border border-[#383838] bg-[#1a1a1a] px-4 py-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <Bookmark className="h-4 w-4 fill-[#ffa116] text-[#ffa116]" />
                            <span className="font-semibold text-white">Problem ID: {qid}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to="/coding"
                              className="rounded-md bg-[#ffa116] px-3 py-1 text-[11px] font-bold text-black hover:bg-[#e08e13]"
                            >
                              Practice
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeBookmark(qid)}
                              className="rounded-md p-1 text-[#8a8a8a] hover:bg-[#2d2d2d] hover:text-[#ff375f]"
                              title="Remove Bookmark"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Option 6: Account & Security */}
              {activeTab === 'security' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-[#383838] pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#ffa116]" /> Account & Security Settings
                    </h3>
                    <p className="text-xs text-[#8a8a8a]">Manage communication preferences and account privacy.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-lg border border-[#383838] bg-[#1a1a1a] p-3 text-xs cursor-pointer hover:bg-[#222222]">
                      <div>
                        <p className="font-semibold text-white">Mock Interview Reminders</p>
                        <p className="text-[11px] text-[#8a8a8a]">Receive notifications before scheduled AI mock sessions.</p>
                      </div>
                      <input
                        type="checkbox"
                        name="notif_mockReminders"
                        checked={profile.notifications?.mockReminders ?? true}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#ffa116]"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-lg border border-[#383838] bg-[#1a1a1a] p-3 text-xs cursor-pointer hover:bg-[#222222]">
                      <div>
                        <p className="font-semibold text-white">Weekly Readiness & Progress Digest</p>
                        <p className="text-[11px] text-[#8a8a8a]">Get an algorithmic streak summary and recommended problem sets.</p>
                      </div>
                      <input
                        type="checkbox"
                        name="notif_weeklyReport"
                        checked={profile.notifications?.weeklyReport ?? true}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#ffa116]"
                      />
                    </label>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your local cache?')) {
                          localStorage.removeItem('saved_questions');
                          setSavedQuestionsList([]);
                          alert('Local practice cache cleared.');
                        }
                      }}
                      className="text-xs text-[#ff375f] hover:underline"
                    >
                      Clear Saved Question Cache
                    </button>
                  </div>
                </div>
              )}

              {/* Form Action Submit Button */}
              <div className="flex items-center gap-3 border-t border-[#383838] pt-5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#ffa116] px-5 py-2.5 text-xs font-bold text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_14px_rgba(255,161,22,0.4)] active:scale-95"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </button>

                {isSaved && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#00b8a3] animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

