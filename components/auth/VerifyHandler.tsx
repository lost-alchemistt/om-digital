"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordForm from "./ResetPasswordForm";
import VerifyEmailHandler from "./VerifyEmailHandler";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyHandler() {
  const searchParams = useSearchParams();
  const mode = searchParams?.get("mode");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth/login");
      }
    };
    verifySession();
  }, []);

  if (!mounted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Initializing...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (mode === "resetPassword") {
    return <ResetPasswordForm />;
  }

  return <VerifyEmailHandler />;
}