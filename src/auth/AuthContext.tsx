import { Session, User } from "@supabase/supabase-js";
import { router, useSegments } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { env, shouldUseMockApi } from "@/config/env";
import { apiClient } from "@/services/apiClient";

type Profile = {
  id: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  defaultArea?: string;
};

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function authRedirectUrl() {
  return env.siteUrl?.replace(/\/$/, "");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (shouldUseMockApi()) {
      setProfile({ id: "mock-user", fullName: "Hermes User", defaultArea: "Bodija" });
      return;
    }
    const nextProfile = await apiClient.get<Profile>("/me/profile");
    setProfile(nextProfile);
  };

  useEffect(() => {
    if (shouldUseMockApi()) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session) void refreshProfile();
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) void refreshProfile();
      else setProfile(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(() => ({
    user: session?.user ?? null,
    session,
    profile,
    loading,
    refreshProfile,
    signIn: async (email: string, password: string) => {
      if (shouldUseMockApi()) return;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signUp: async (fullName: string, email: string, password: string) => {
      if (shouldUseMockApi()) return { needsEmailConfirmation: false };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: authRedirectUrl()
        }
      });
      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        await refreshProfile();
      }
      return { needsEmailConfirmation: !data.session };
    },
    signOut: async () => {
      if (!shouldUseMockApi()) await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      router.replace("/");
    },
    resetPassword: async (email: string) => {
      if (shouldUseMockApi()) return;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: authRedirectUrl() });
      if (error) throw error;
    }
  }), [loading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function ProtectedRoutes() {
  const { session, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading || shouldUseMockApi()) return;
    const inAuthGroup = segments[0] === "(auth)" || segments[0] === undefined;
    if (!session && !inAuthGroup) router.replace("/login");
    if (session && (segments[0] === "(auth)" || segments[0] === undefined)) router.replace("/home");
  }, [loading, segments, session]);

  return null;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
