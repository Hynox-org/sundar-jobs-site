"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

const protectedRoutes = ['/form', '/postjobs', '/drafts', '/preview', '/settings', '/templates', '/alljobs', '/jobs']; // Define protected routes

export function AuthChecker({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn && protectedRoutes.some(route => pathname.startsWith(route))) {
      router.replace('/login');
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (isLoggedIn || !protectedRoutes.some(route => pathname.startsWith(route))) {
    return <>{children}</>;
  }

  return null;
}
