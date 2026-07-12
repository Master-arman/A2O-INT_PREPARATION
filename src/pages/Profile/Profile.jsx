import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Globe, Bookmark, CheckCircle2, Loader2 } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    targetRole: 'frontend'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const authUserStr = localStorage.getItem('user');
    let authData = { name: 'User', email: 'user@example.com' };
    
    if (authUserStr) {
      authData = JSON.parse(authUserStr);
    }
    
    const userEmail = authData.email;
    const allProfiles = JSON.parse(localStorage.getItem('allProfiles') || '{}');
    const savedProfile = allProfiles[userEmail];

    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      // If no saved profile for this specific user, create one from auth data
      const nameParts = (authData.name || '').split(' ');
      setProfile({
        firstName: nameParts[0] || 'User',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userEmail,
        targetRole: 'frontend'
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      // Save this specific user's profile
      const allProfiles = JSON.parse(localStorage.getItem('allProfiles') || '{}');
      allProfiles[profile.email] = profile;
      localStorage.setItem('allProfiles', JSON.stringify(allProfiles));
      
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 600);
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Manage your personal information and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-4xl font-bold text-white">
                  {(profile.firstName?.[0] || '')}{(profile.lastName?.[0] || '')}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-gray-800 border border-gray-600 rounded-full text-gray-300 hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-400 text-sm mb-4 capitalize">
              {profile.targetRole === 'ai' ? 'AI/ML Engineer' : `${profile.targetRole} Engineer`}
            </p>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#0a66c2] transition-colors">
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                  <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} required className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                  <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} required className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <div className="relative">
                  <input type="email" value={profile.email} disabled className="w-full bg-black/20 border border-gray-800 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed pl-10" />
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Target Role</label>
                <div className="relative">
                  <select name="targetRole" value={profile.targetRole} onChange={handleChange} className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none pl-10">
                    <option value="frontend">Frontend Engineer</option>
                    <option value="backend">Backend Engineer</option>
                    <option value="fullstack">Full Stack Engineer</option>
                    <option value="ai">AI/ML Engineer</option>
                  </select>
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button type="submit" disabled={isSaving} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 active:scale-95 transition-all">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
                {isSaved && (
                  <span className="text-green-400 text-sm flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="w-4 h-4" /> Saved Successfully!
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
