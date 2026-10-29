import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MOCK_USERS } from '../../lib/mockData';

const AuthContext = createContext(null);

const STORAGE_KEY = 'devacademy_active_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial session
  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setProfile(prof || null);
          }
        } catch (err) {
          console.warn('Supabase auth session load error:', err);
        }
      } else {
        // Local demo mode
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setUser({ id: parsed.id, email: parsed.email });
            setProfile(parsed);
          } catch (e) {
            // default to student
            const defaultStudent = MOCK_USERS[0];
            setUser({ id: defaultStudent.id, email: defaultStudent.email });
            setProfile(defaultStudent);
          }
        } else {
          // Default to student for instant exploratory experience
          const defaultStudent = MOCK_USERS[0];
          setUser({ id: defaultStudent.id, email: defaultStudent.email });
          setProfile(defaultStudent);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudent));
        }
      }
      setLoading(false);
    }

    initAuth();

    // Listen to Supabase auth events if connected
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(prof || null);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Local demo mock login
      const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        // Allow demo login even for newly registered emails in localStorage
        const storedUsers = JSON.parse(localStorage.getItem('devacademy_registered_users') || '[]');
        const customFound = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (customFound) {
          setUser({ id: customFound.id, email: customFound.email });
          setProfile(customFound);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(customFound));
          return { user: customFound };
        }
        throw new Error('Invalid credentials. In demo mode, use alex.student@devacademy.pro, sarah.teacher@devacademy.pro, or register a new student account.');
      }
      setUser({ id: found.id, email: found.email });
      setProfile(found);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      return { user: found };
    }
  }, []);

  // Register
  const register = useCallback(async ({ fullName, email, password }) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'student', // Security rule: always default to student
          },
        },
      });
      if (error) throw error;

      // Create profile row in profiles table
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: 'student',
          xp: 0,
          level: 1,
          streak_days: 1,
        });
      }
      return data;
    } else {
      // Local demo registration
      const newStudent = {
        id: 'user-student-' + Date.now(),
        email,
        full_name: fullName,
        role: 'student', // strictly student
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
        bio: 'New developer ready to learn!',
        xp: 0,
        level: 1,
        streak_days: 1,
        created_at: new Date().toISOString(),
      };

      const storedUsers = JSON.parse(localStorage.getItem('devacademy_registered_users') || '[]');
      storedUsers.push(newStudent);
      localStorage.setItem('devacademy_registered_users', JSON.stringify(storedUsers));

      setUser({ id: newStudent.id, email: newStudent.email });
      setProfile(newStudent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStudent));
      return { user: newStudent };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setProfile(null);
  }, []);

  // Switch demo persona (student, teacher, admin)
  const switchDemoRole = useCallback((role) => {
    const matched = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    setUser({ id: matched.id, email: matched.email });
    setProfile(matched);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    if (isSupabaseConfigured && user) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
    } else {
      setProfile((prev) => {
        const next = { ...prev, ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, [user]);

  // Award XP helper
  const awardXP = useCallback(async (amount) => {
    if (!profile) return;
    const currentXp = (profile.xp || 0) + amount;
    const currentLevel = Math.floor(currentXp / 150) + 1;
    await updateProfile({ xp: currentXp, level: currentLevel });
  }, [profile, updateProfile]);

  const value = {
    user,
    profile,
    role: profile?.role || 'student',
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    switchDemoRole,
    updateProfile,
    awardXP,
    isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
