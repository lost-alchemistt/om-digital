"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    gender: "",
    email: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/auth/login");
          return;
        }

        setUserId(session.user.id);

        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (existingProfile) {
          // Profile already exists, redirect to home
          router.push('/');
          return;
        }

        // Pre-fill with OAuth data if available
        const metadata = session.user.user_metadata;
        const fullName = metadata.full_name || metadata.name || "";
        const nameParts = fullName.split(' ');
        
        setFormData({
          firstName: metadata.given_name || nameParts[0] || "",
          lastName: metadata.family_name || nameParts.slice(1).join(' ') || "",
          email: session.user.email || "",
          mobile: metadata.phone || "",
          gender: "",
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        setError("Failed to load user data");
      } finally {
        setInitializing(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.gender) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, update the user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile: formData.mobile || null,
          gender: formData.gender,
        }
      });

      if (updateError) throw updateError;

      // Check if profile was created by trigger
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Profile exists, update it
        const { error: profileUpdateError } = await supabase
          .from('users')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            mobile: formData.mobile || null,
            gender: formData.gender,
          })
          .eq('id', userId);

        if (profileUpdateError) throw profileUpdateError;
      } else {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            mobile: formData.mobile || null,
            gender: formData.gender,
            role: 'user',
          });

        if (insertError) throw insertError;
      }

      router.push('/');
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-background/95 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Complete Your Profile</CardTitle>
          <p className="text-center text-muted-foreground text-sm mt-2">
            Just a few more details to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="Optional"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                required
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

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating profile...</span>
                </div>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
