import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tnjgdroymslzunvdgjam.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_86pQ0RkfAt4wKQeutZvDjQ_OLm7WiqW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// Helper: Sign up new user with Email and Password
export const signUpWithEmail = async (email, password, name = '') => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name: name,
        }
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Supabase SignUp error:', err);
    return { data: null, error: err };
  }
};

// Helper: Sign in existing user with Email and Password
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Supabase SignIn error:', err);
    return { data: null, error: err };
  }
};

// Helper: Sign in with OAuth (e.g. Google)
export const signInWithGoogleOAuth = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Supabase OAuth error:', err);
    return { data: null, error: err };
  }
};

// Helper: Sign Out
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error('Supabase SignOut error:', err);
  } finally {
    localStorage.removeItem('user');
  }
};

// Helper: Send password reset email
export const resetPasswordForEmail = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Supabase ResetPassword error:', err);
    return { data: null, error: err };
  }
};

// Helper: Get Current Session / User
export const getSessionUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.user;
  } catch (err) {
    console.error('Error fetching session:', err);
    return null;
  }
};

// Database helper: Sync User Profile to Supabase
export const syncProfileToDatabase = async (userId, profileData) => {
  try {
    if (!userId) return;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        updated_at: new Date().toISOString(),
        ...profileData
      });

    if (error) {
      console.warn('Profiles table sync warning (create table if needed):', error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn('Supabase DB sync error:', err.message);
  }
};

// Database helper: Sync Solved Questions to Supabase
export const syncSolvedQuestionsToDB = async (userId, solvedList) => {
  try {
    if (!userId) return;
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        solved_questions: solvedList,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.warn('User progress sync warning:', error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn('Supabase progress sync error:', err.message);
  }
};
