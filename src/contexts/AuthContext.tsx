import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

export interface Profile {
  username: string;
  avatar_url: string;
  website: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, user: null, profile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async (session: Session | null) => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select(`username, avatar_url, website`)
          .eq('id', session.user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await setData(session);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setData(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};