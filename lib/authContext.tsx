"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type Role = "driver" | "school" | "student";

// Captured before supabase-js processes and clears the URL hash, so we can
// tell when someone has just arrived from an invite email.
const ARRIVED_FROM_INVITE =
  typeof window !== "undefined" && /type=invite/.test(window.location.hash);

export type Profile = {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string | null;
  suburb: string | null;
  postcode: string | null;
  school_name: string | null;
};

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function loadProfile(userId: string) {
    const [{ data }, { data: adminRow }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle(),
    ]);
    setProfile((data as Profile) ?? null);
    setIsAdmin(!!adminRow);
  }

  async function refreshProfile() {
    if (session?.user?.id) await loadProfile(session.user.id);
  }

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      setSession(session);
      if (session?.user) await loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      // Invited users (e.g. new admins) have no password yet: send them to
      // choose one before anything else.
      if (
        newSession &&
        ARRIVED_FROM_INVITE &&
        !window.location.pathname.startsWith("/reset-password")
      ) {
        window.location.replace("/reset-password?welcome=1");
        return;
      }
      if (newSession?.user) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, isAdmin, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
