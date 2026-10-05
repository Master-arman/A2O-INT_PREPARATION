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
      console.warn('Profiles table sync warning:', error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn('Supabase DB sync error:', err.message);
  }
};

// Database helper: Fetch User Profile from Supabase
export const fetchUserProfileFromSupabase = async (userId) => {
  try {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Profile fetch note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase profile fetch error:', err.message);
    return null;
  }
};

// Database helper: Sync Solved Questions & Progress to Supabase Storage
export const syncSolvedQuestionsToDB = async (userId, progressData) => {
  try {
    if (!userId) return;
    
    // Accept array of solved questions or full progress payload
    const payload = Array.isArray(progressData) ? {
      user_id: userId,
      solved_questions: progressData,
      total_solved: progressData.length,
      updated_at: new Date().toISOString()
    } : {
      user_id: userId,
      solved_questions: progressData.solved_questions || [],
      total_solved: progressData.solved_questions ? progressData.solved_questions.length : (progressData.total_solved || 0),
      interviews_taken: progressData.interviews_taken || 0,
      avg_score: progressData.avg_score || 0,
      coding_accuracy: progressData.coding_accuracy || 0,
      activity_map: progressData.activity_map || {},
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(payload);

    if (error) {
      console.warn('User progress sync warning:', error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn('Supabase progress sync error:', err.message);
  }
};

// Database helper: Fetch User Progress & Solved Questions from Supabase
export const fetchUserProgressFromSupabase = async (userId) => {
  try {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('User progress fetch note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase progress fetch error:', err.message);
    return null;
  }
};
