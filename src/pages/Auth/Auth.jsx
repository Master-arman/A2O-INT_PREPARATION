import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authView, setAuthView] = useState('main'); // main, forgot_email, forgot_otp, forgot_new
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Instant login without delay
    localStorage.setItem('user', JSON.stringify({ 
      id: 'local_user', 
      name: formData.name || (formData.email ? formData.email.split('@')[0] : 'User'), 
      email: formData.email,
      role: formData.email === 'admin@gmail.com' ? 'admin' : 'user'
    }));
    navigate('/');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setIsSendingOtp(true);

    // Generate a random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);

    try {
      await emailjs.send(
        'service_m84sz3k',
        'template_67u7v28',
        {
          to_email: formData.email,
          message: code,
          otp: code,
          code: code
        },
        {
          publicKey: 'OixjxBF0drjYQQhSB'
        }
      );
      setAuthView('forgot_otp');
    } catch (err) {
      console.error('EmailJS Error:', err);
      // Display the actual error message from EmailJS in the UI
      setError(err?.text || err?.message || 'Failed to send OTP. Please check your configuration.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }
    setError('');
    setAuthView('forgot_new');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('Please enter a new password.');
      return;
    }
    setError('');
    setAuthView('main');
    setForgotMsg('Password reset successfully! Please sign in.');
    setFormData({ ...formData, password: '' });
  };

  const handleGoogleLogin = () => {
    setShowGoogleModal(true);
  };

  const selectGoogleAccount = (name, email) => {
    localStorage.setItem('user', JSON.stringify({ id: 'google_user', name, email }));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-2xl shadow-2xl border-t border-l border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-bold text-white">AI</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {authView === 'main'
                ? (isLogin ? 'Welcome Back' : 'Create Account')
                : authView === 'forgot_email' ? 'Reset Password'
                  : authView === 'forgot_otp' ? 'Enter OTP'
                    : 'New Password'}
            </h2>
            <p className="text-gray-400">
              {authView === 'main'
                ? (isLogin ? 'Enter your details to access your dashboard' : 'Start your interview prep journey today')
                : authView === 'forgot_email' ? 'Enter your email to receive an OTP'
                  : authView === 'forgot_otp' ? `We sent a 4-digit code to ${formData.email}`
                    : 'Create a new secure password'}
            </p>
          </div>

          {authView !== 'main' ? (
            <form onSubmit={authView === 'forgot_email' ? handleSendOtp : authView === 'forgot_otp' ? handleVerifyOtp : handleResetPassword} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {authView === 'forgot_email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all pl-11"
                      placeholder="name@example.com"
                      required
                    />
                    <div className="absolute left-4 top-3.5 text-gray-500"><Mail className="w-5 h-5" /></div>
                  </div>
                </div>
              )}

              {authView === 'forgot_otp' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">4-Digit OTP</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength="4"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white text-center tracking-[1em] focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="••••"
                      required
                    />
                  </div>
                </div>
              )}

              {authView === 'forgot_new' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all pl-11"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute left-4 top-3.5 text-gray-500"><Lock className="w-5 h-5" /></div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col gap-3">
                <button type="submit" disabled={isSendingOtp} className="w-full btn-primary py-3 disabled:opacity-50 flex justify-center items-center">
                  {isSendingOtp ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    authView === 'forgot_email' ? 'Send OTP' : authView === 'forgot_otp' ? 'Verify OTP' : 'Update Password'
                  )}
                </button>
                <button type="button" onClick={() => setAuthView('main')} className="text-gray-400 hover:text-white text-sm">
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                {forgotMsg && (
                  <div className="p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl text-sm font-medium">
                    {forgotMsg}
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pl-11"
                        placeholder="John Doe"
                        required
                      />
                      <div className="absolute left-4 top-3.5 text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pl-11"
                      placeholder="name@example.com"
                      required
                    />
                    <div className="absolute left-4 top-3.5 text-gray-500">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-400">Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => { setError(''); setAuthView('forgot_email'); }}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pl-11"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute left-4 top-3.5 text-gray-500">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-6 group">
                  {isLogin ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="my-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-800 after:h-px after:flex-1 after:bg-gray-800">
                <span className="text-sm text-gray-500">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#24292F] text-white rounded-xl font-medium hover:bg-[#1a1e22] transition-colors border border-gray-700">
                  <Globe className="w-5 h-5" />
                  Website
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:text-blue-300 font-medium">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Google Account Chooser Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-sm overflow-hidden text-gray-900 shadow-2xl">
            <div className="p-6 text-center border-b border-gray-100">
              <svg className="w-8 h-8 mx-auto mb-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <h3 className="text-xl font-medium mb-1">Sign in with Google</h3>
              <p className="text-sm text-gray-600">Choose an account to continue to TechPrep</p>
            </div>
            <div className="p-2 space-y-1">
              {[
                { name: 'Arman Singh', email: 'armansingh0421@gmail.com', img: 'A', color: 'bg-blue-600' },
                { name: 'Developer Account', email: 'dev.arman@gmail.com', img: 'D', color: 'bg-purple-600' },
                { name: 'Guest User', email: 'guest@example.com', img: 'G', color: 'bg-green-600' }
              ].map((acc, i) => (
                <button key={i} onClick={() => selectGoogleAccount(acc.name, acc.email)} className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                  <div className={`w-10 h-10 rounded-full ${acc.color} text-white flex items-center justify-center font-medium text-lg group-hover:scale-105 transition-transform`}>
                    {acc.img}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{acc.name}</p>
                    <p className="text-sm text-gray-500">{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer text-center border-t border-gray-200 transition-colors" onClick={() => setShowGoogleModal(false)}>
              Cancel
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Auth;
