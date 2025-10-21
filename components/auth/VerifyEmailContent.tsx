"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  const handleResendEmail = async () => {
    if (!email) return;
    
    setResending(true);
    setError("");
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error('Error resending email:', error);
      setError("Failed to resend email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.email_confirmed_at) {
        router.push('/');
      }
    };

    checkVerification();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-background/95 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a confirmation email to
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Please check your inbox and click the verification link to activate your account.
              The link will expire in 24 hours.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive the email? Check your spam folder or
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resending || resent}
            >
              {resending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : resent ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Email Sent!</span>
                </div>
              ) : (
                "Resend Verification Email"
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="pt-4 border-t space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Once verified, you&apos;ll be automatically redirected to the homepage
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Return to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
