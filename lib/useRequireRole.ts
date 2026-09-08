"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type Role } from "@/lib/authContext";

/** Redirects away if the signed-in user isn't the expected role. Returns the
 * auth state so pages can gate rendering until it settles. */
export function useRequireRole(role: Role) {
  const router = useRouter();
  const auth = useAuth();
  const { session, profile, loading } = auth;

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
    } else if (profile && profile.role !== role) {
      router.replace(`/dashboard/${profile.role}`);
    }
  }, [loading, session, profile, role, router]);

  return auth;
}
