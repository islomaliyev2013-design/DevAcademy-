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
            // default to admin
            const defaultAdmin = MOCK_USERS.find((u) => u.role === 'admin') || MOCK_USERS[2];
            setUser({ id: defaultAdmin.id, email: defaultAdmin.email });
            setProfile(defaultAdmin);
          }
        } else {
          // Default to admin as requested
          const defaultAdmin = MOCK_USERS.find((u) => u.role === 'admin') || MOCK_USERS[2];
          setUser({ id: defaultAdmin.id, email: defaultAdmin.email });
          setProfile(defaultAdmin);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAdmin));
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
  const login = useCallback(async (emailOrUsername, password) => {
    const cleanId = (emailOrUsername || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Admin login alias: admin / admin123
    if (cleanId === 'admin' || cleanId === 'admin@devacademy.pro') {
      if (cleanPass === 'admin123' || cleanPass === 'Password123!' || cleanPass.length >= 4) {
        const adminUser = MOCK_USERS.find((u) => u.role === 'admin') || MOCK_USERS[2];
        setUser({ id: adminUser.id, email: adminUser.email });
        setProfile(adminUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
        return { user: adminUser };
      } else {
        throw new Error('Parol noto‘g‘ri. Admin paroli: admin123');
      }
    }

    // 2. Pre-seeded demo account "bobur"
    if (cleanId === 'bobur' || cleanId === 'bobur@devacademy.pro') {
      const storedUsers = JSON.parse(localStorage.getItem('devacademy_registered_users') || '[]');
      let bobur = storedUsers.find((u) => u.username === 'bobur' || u.email === 'bobur@devacademy.pro');
      if (!bobur) {
        bobur = {
          id: 'user-student-bobur',
          username: 'bobur',
          email: 'bobur@devacademy.pro',
          password: cleanPass || '123456',
          full_name: 'Bobur Mirzo',
          role: 'student',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bobur',
          bio: 'Junior Software Engineer',
          xp: 25, // completed lesson 1
          level: 1,
          streak_days: 2,
          created_at: new Date().toISOString(),
        };
        storedUsers.push(bobur);
        localStorage.setItem('devacademy_registered_users', JSON.stringify(storedUsers));

        // Seed initial enrollment for Bobur
        const enrollments = JSON.parse(localStorage.getItem('devacademy_enrollments') || '[]');
        if (!enrollments.some((e) => e.student_id === bobur.id)) {
          enrollments.push({
            id: 'enr-bobur-1',
            student_id: bobur.id,
            course_id: 'course-react-arch',
            enrolled_at: new Date().toISOString(),
            progress_percent: 33,
            completed_at: null,
          });
          localStorage.setItem('devacademy_enrollments', JSON.stringify(enrollments));
        }
      }
      setUser({ id: bobur.id, email: bobur.email });
      setProfile(bobur);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bobur));
      return { user: bobur };
    }

    // 3. Pre-seeded demo account "ilhom" (starts completely fresh from 0!)
    if (cleanId === 'ilhom' || cleanId === 'ilhom@devacademy.pro') {
      const storedUsers = JSON.parse(localStorage.getItem('devacademy_registered_users') || '[]');
      let ilhom = storedUsers.find((u) => u.username === 'ilhom' || u.email === 'ilhom@devacademy.pro');
      if (!ilhom) {
        ilhom = {
          id: 'user-student-ilhom',
          username: 'ilhom',
          email: 'ilhom@devacademy.pro',
          password: cleanPass || '123456',
          full_name: 'Ilhom Karimov',
          role: 'student',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ilhom',
          bio: 'New coding enthusiast',
          xp: 0, // Starts at 0!
          level: 1,
          streak_days: 1,
          created_at: new Date().toISOString(),
        };
        storedUsers.push(ilhom);
        localStorage.setItem('devacademy_registered_users', JSON.stringify(storedUsers));
      }
      setUser({ id: ilhom.id, email: ilhom.email });
      setProfile(ilhom);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ilhom));
      return { user: ilhom };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: emailOrUsername, password });
      if (error) throw error;
      return data;
    } else {
      // 4. Any registered user from local storage
      const storedUsers = JSON.parse(localStorage.getItem('devacademy_registered_users') || '[]');
      const customFound = storedUsers.find(
        (u) =>
          (u.email && u.email.toLowerCase() === cleanId) ||
          (u.username && u.username.toLowerCase() === cleanId) ||
          (u.full_name && u.full_name.toLowerCase() === cleanId)
      );

      if (customFound) {
        if (customFound.password && cleanPass && customFound.password !== cleanPass) {
          throw new Error('Parol noto‘g‘ri kiritildi');
        }
        setUser({ id: customFound.id, email: customFound.email });
        setProfile(customFound);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customFound));
        return { user: customFound };
      }

      // 5. MOCK_USERS (Teacher Sarah, Student Alex)
      const found = MOCK_USERS.find(
        (u) =>
          u.email.toLowerCase() === cleanId ||
          u.role.toLowerCase() === cleanId ||
          u.full_name.toLowerCase() === cleanId
      );

      if (found) {
        setUser({ id: found.id, email: found.email });
        setProfile(found);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
        return { user: found };
      }

      throw new Error('Foydalanuvchi topilmadi. Yangi akkaunt ochish uchun Sign Up sahifasiga o‘ting.');
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
      // Local demo registration - starts 100% from 0!
      const cleanUsername = email.toLowerCase().trim();
      const newStudent = {
        id: 'user-' + cleanUsername.replace(/[^a-z0-9]/g, '') + '-' + Date.now(),
        username: cleanUsername,
        email: cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@devacademy.pro`,
        password: password,
        full_name: fullName,
        role: 'student', // strictly student
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
        bio: 'New developer ready to learn!',
        xp: 0, // 0 XP
        level: 1,
        streak_days: 0,
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

        // Sync with devacademy_registered_users so student changes persist across sessions
        const storedUsers = JSON.parse(localStorage.getItem('devacademy_registered_users') || '[]');
        const idx = storedUsers.findIndex((u) => u.id === next.id || u.email === next.email);
        if (idx >= 0) {
          storedUsers[idx] = { ...storedUsers[idx], ...next };
          localStorage.setItem('devacademy_registered_users', JSON.stringify(storedUsers));
        }

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
