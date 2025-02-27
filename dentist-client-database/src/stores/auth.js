import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../supabase';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const session = ref(null);
  const loading = ref(true);
  const returnUrl = ref('/');

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  
  const userRole = computed(() => {
    if (!user.value) return null;
    return user.value.user_metadata?.role || 'staff';
  });

  // Actions
  async function initialize() {
    try {
      loading.value = true;
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        session.value = currentSession;
        user.value = currentSession.user;
        
        // Fetch user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        if (profile) {
          // Attach profile data to user
          user.value = {
            ...user.value,
            profile
          };
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      loading.value = false;
    }
  }

  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      session.value = data.session;
      user.value = data.user;
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            role: userData.role || 'staff'
          }
        }
      });
      
      if (error) throw error;
      
      // If signUp is successful, we also need to create a profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: userData.fullName || '',
          role: userData.role || 'staff',
          email: email
        });
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      user.value = null;
      session.value = null;
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async function resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async function updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async function refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (data.session) {
        session.value = data.session;
        user.value = data.session.user;
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Set up auth listener
  supabase.auth.onAuthStateChange((event, currentSession) => {
    session.value = currentSession;
    user.value = currentSession?.user || null;
    
    if (event === 'SIGNED_IN' && currentSession) {
      // Fetch user profile on sign in
      supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile) {
            user.value = {
              ...user.value,
              profile
            };
          }
        });
    }
  });

  return {
    // State
    user,
    session,
    loading,
    returnUrl,
    
    // Getters
    isAuthenticated,
    userRole,
    
    // Actions
    initialize,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession
  };
});