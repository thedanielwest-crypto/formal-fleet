"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The old Founders page is now the Admin page, which uses the same email +
// password login as drivers. Keep this URL working for old bookmarks.
export default function FoundersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return null;
}
