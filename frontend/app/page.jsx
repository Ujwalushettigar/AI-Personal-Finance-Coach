"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-text-muted font-medium text-sm">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to FinPilot...</span>
      </div>
    </div>
  );
}

