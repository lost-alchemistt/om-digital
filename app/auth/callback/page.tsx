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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          if (session.user.email_confirmed_at) {
            setMessage("Email verified successfully! Redirecting...");
          }

          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            router.push('/auth/complete-profile');
            return;
          }

          if (profile) {
            // Check for stored redirect URL
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
              sessionStorage.removeItem('redirectAfterLogin');
              setTimeout(() => {
                router.push(redirectUrl);
              }, 1000);
            } else {
              setTimeout(() => {
                router.push('/');
              }, 1000);
            }
            return;
          }
        }

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
