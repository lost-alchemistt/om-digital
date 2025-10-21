"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AuthPageGuard from "@/components/auth/AuthPageGuard";
import { Loader2 } from "lucide-react";

const AnimatedBackground = dynamic(
  () => import("@/components/AnimatedBackground"),
  { ssr: false }
);

const SignupForm = dynamic(
  () => import("@/components/auth/SignupForm"),
  {
    ssr: false,
    loading: () => <LoadingFallback />
  }
);

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default function Signup() {
  return (
    <AuthPageGuard>
      <main className="min-h-screen relative">
        <Suspense fallback={<LoadingFallback />}>
          <div className="absolute inset-0">
            <AnimatedBackground />
          </div>
          <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <SignupForm />
          </div>
        </Suspense>
      </main>
    </AuthPageGuard>
  );
}
