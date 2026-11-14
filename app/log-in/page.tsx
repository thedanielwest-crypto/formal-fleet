"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Fleet Formal accounts are live now - this old placeholder URL just
// forwards to the real login page so any existing links/bookmarks keep working.
export default function LogInRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}
