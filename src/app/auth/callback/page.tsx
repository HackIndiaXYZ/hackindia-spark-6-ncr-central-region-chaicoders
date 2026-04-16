"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleAuth() {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";

      if (code) {
        // Exchange the code for a session on the client side
        // This will pick up the code_verifier from localStorage automatically!
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Error exchanging code for session:", error.message);
          router.push(`/login?error=${encodeURIComponent(error.message)}`);
        } else if (session) {
          // Check if profile is complete
          const { data: profile } = await supabase
            .from("users")
            .select("institution, career_goal")
            .eq("id", session.user.id)
            .single();

          if (!profile || !profile.institution || !profile.career_goal) {
            router.push("/setup-profile");
          } else {
            router.push(next);
          }
        }
      } else {
        // No code found, check if we already have a session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check if profile is complete
          const { data: profile } = await supabase
            .from("users")
            .select("institution, career_goal")
            .eq("id", session.user.id)
            .single();

          if (!profile || !profile.institution || !profile.career_goal) {
            router.push("/setup-profile");
          } else {
            router.push(next);
          }
        } else {
          router.push("/login?error=no_auth_code");
        }
      }
    }

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-medium">Authenticating...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium">Connecting to account...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
