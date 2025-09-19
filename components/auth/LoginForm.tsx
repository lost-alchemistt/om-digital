"use client";
import React, { useState, useCallback, memo } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabase/client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoginData {
  email: string;
  password: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
}

// Memoized Input Field Component
const InputField = memo(function InputField({
  name,
  label,
  type = "text",
  value,
  onChange,
  readOnly,
  disabled,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
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
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className="h-11"
        required
      />
    </div>
  );
});

// Form Container Components
const LoginFields = memo(function LoginFields({
  loginData,
  onChange,
}: {
  loginData: LoginData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <InputField
        name="email"
        label="Email address"
        type="email"
        value={loginData.email}
        onChange={onChange}
      />
      <InputField
        name="password"
        label="Password"
        type="password"
        value={loginData.password}
        onChange={onChange}
      />
    </>
  );
});

const ProfileFields = memo(function ProfileFields({
  userData,
  onChange,
  onGenderChange,
}: {
  userData: UserData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenderChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          name="firstName"
          label="First Name"
          value={userData.firstName}
          onChange={onChange}
        />
        <InputField
          name="lastName"
          label="Last Name"
          value={userData.lastName}
          onChange={onChange}
        />
      </div>

      <InputField
        name="mobile"
        label="Mobile Number"
        type="tel"
        value={userData.mobile}
        onChange={onChange}
      />


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium">
            Gender<span className="text-destructive">*</span>
          </Label>
          <Select
            value={userData.gender}
            onValueChange={onGenderChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
});

export default function LoginForm() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    mobile: "",
    gender: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const handleLoginChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginData((prev) => ({ ...prev, [name]: value }));
      setError("");
    },
    []
  );

  const handleUserDataChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUserData(prev => ({ ...prev, [name]: value }));
      setError("");
    },
    []
  );

  const handleGenderChange = useCallback((value: string) => {
    setUserData((prev) => ({ ...prev, gender: value }));
  }, []);

  const checkUserExists = async (uid: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', uid)
      .single();
    
    return !!data && !error;
  };

  const saveUserProfile = async (uid: string) => {
    const { error } = await supabase
      .from('users')
      .insert([{
        id: uid,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: loginData.email,
        mobile: userData.mobile,
        gender: userData.gender,
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
    
    if (error) throw error;
    
    if (referralCode) {
      const { data: referrerData, error: referralError } = await supabase
        .from('users')
        .select('id, coins')
        .eq('referral_code', referralCode)
        .single();
      
      if (!referralError && referrerData) {
        // Update referrer's coins
        await supabase
          .from('users')
          .update({ coins: referrerData.coins + 100 })
          .eq('id', referrerData.id);
        
        // Log the referral
        await supabase.from('referrals').insert([{
          referrer_id: referrerData.id,
          referred_id: uid,
          created_at: new Date().toISOString()
        }]);
      }
    }

    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
      }
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred with Google sign-in"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (needsProfile) {
        // Validate required fields
        if (!userData.firstName || !userData.lastName || !userData.mobile ||  !userData.gender) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setError("Authentication error. Please try again.");
          setLoading(false);
          return;
        }

        await saveUserProfile(user.id);
        router.push("/");
        return;
      }

      // Regular login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;
      
      // Check if user profile exists
      const userExists = await checkUserExists(data.user.id);
      if (!userExists) {
        setNeedsProfile(true);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (needsProfile) {
        setError(err instanceof Error ? err.message : "Failed to save profile");
      } else {
        setError(err instanceof Error ? err.message : "Failed to log in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="max-w-md w-full mx-auto border-0 shadow-xl bg-background/95 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        <CardHeader className="space-y-3 pb-2">
          {!needsProfile ? (
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 mr-2"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to home</span>
              </Button>
              <CardTitle className="text-2xl font-bold flex-1 text-center pr-8">
                Welcome back
              </CardTitle>
            </div>
          ) : (
            <CardTitle className="text-center text-2xl font-bold">
              Complete Your Profile
            </CardTitle>
          )}
          {!needsProfile && (
            <p className="text-center text-muted-foreground text-sm">
              Enter your credentials to access your account
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!needsProfile ? (
              <>
                <div className="space-y-4">
                  <LoginFields loginData={loginData} onChange={handleLoginChange} />
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <div className="relative h-[1px] bg-border">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="px-2 bg-background text-xs text-muted-foreground">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    onClick={handleGoogleSignIn}
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

                {error && (
                  <Alert variant="destructive" className="animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <>
                <ProfileFields
                  userData={userData}
                  onChange={handleUserDataChange}
                  onGenderChange={handleGenderChange}
                />

                <div className="space-y-2">
                  <Label htmlFor="referralCode">Have a referral code?</Label>
                  <Input
                    id="referralCode"
                    name="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code (optional)"
                    className="h-10"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving profile...
                    </div>
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              </>
            )}
          </form>
        </CardContent>
        
        {!needsProfile && (
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/signup" 
                className="text-primary hover:underline font-medium"
              >
                Create one
              </Link>
            </p>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot your password?
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}