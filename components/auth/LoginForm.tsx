"use client";
import React, { useState, useCallback, memo, useEffect } from "react";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

// --- Supabase Initialization ---
// IMPORTANT: Replace these with your actual Supabase URL and Anon Key
// You should ideally use environment variables for this in a real project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// -----------------------------

interface LoginData {
  email: string;
  password: string;
}

const InputField = memo(function InputField({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}<span className="text-destructive">*</span>
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11"
        required
      />
    </div>
  );
});

// Add error type definitions
type AuthError = {
  message: string;
};

export default function LoginForm() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginData((prev) => ({ ...prev, [name]: value }));
      setError("");
    },
    []
  );

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message || "An error occurred with Google sign-in");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      // Check if profile exists
      const { error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, redirect to complete profile
        window.location.href = "/auth/complete-profile";
        return;
      }

      if (profileError) throw profileError;
      
      // Check for stored redirect URL
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else {
        // Profile exists, redirect to home
        window.location.href = "/";
      }

    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRedirect = (path: string) => {
    window.location.href = path;
  }

  return (
    <div className="w-full">
      <Card className="max-w-md w-full mx-auto border-0 shadow-xl bg-background/95 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 mr-2"
              onClick={() => handleRedirect("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to home</span>
            </Button>
            <CardTitle className="text-2xl font-bold flex-1 text-center pr-8">
              Welcome back
            </CardTitle>
          </div>
          <p className="text-center text-muted-foreground text-sm px-4">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <InputField
                name="email"
                label="Email address"
                type="email"
                value={loginData.email}
                onChange={handleChange}
              />
              <InputField
                name="password"
                label="Password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-4 pt-2">
                <Button 
                    type="submit" 
                    className="w-full h-11" 
                    disabled={loading}
                >
                    {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing in...</span>
                    </div>
                    ) : (
                    "Sign in"
                    )}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Google</span>
                    </div>
                </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a 
                href="/auth/signup" 
                className="text-primary hover:underline font-medium"
              >
                Create one
              </a>
            </p>
            <a
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot your password?
            </a>
        </CardFooter>
      </Card>
    </div>
  );
}

