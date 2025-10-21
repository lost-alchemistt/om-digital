"use client";
import { Suspense } from "react";
import VerifyEmailContent from "@/components/auth/VerifyEmailContent";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
