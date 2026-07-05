import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for an active session when the app first loads
    supabase.auth.getSession().then((response) => {
      const currentSession = response.data.session;
      setSession(currentSession);
      
      if (currentSession !== null) {
        setUser(currentSession.user);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // 2. Listen for changes (like when the user clicks 'Sign In' or 'Sign Out')
    const response = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      
      if (newSession !== null) {
        setUser(newSession.user);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // 3. Clean up the listener when the component is removed
    return () => {
      response.data.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
