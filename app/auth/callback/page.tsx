"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          // Check if this is an email verification callback
          if (session.user.email_confirmed_at) {
            setMessage("Email verified successfully! Redirecting...");
          }

          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, redirect to complete profile
            router.push('/auth/complete-profile');
            return;
          }

          if (profile) {
            // Profile exists, redirect to home with a small delay for better UX
            setTimeout(() => {
              router.push('/');
            }, 1000);
            return;
          }
        }

        // No session, redirect to login
        router.push('/auth/login');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4 max-w-md p-8">
        {message.includes("verified") ? (
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto animate-bounce" />
        ) : (
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        )}
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
