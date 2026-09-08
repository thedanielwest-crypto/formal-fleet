"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function DashboardRouter() {
  const router = useRouter();
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
    } else if (profile?.role) {
      router.replace(`/dashboard/${profile.role}`);
    }
  }, [loading, session, profile, router]);

  return null;
}
