"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  gender: string;
  role: string;
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    gender: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.push("/auth/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        if (profile) {
          setUserData(profile);
          setIsAdmin(profile.role === 'admin');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (name: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          mobile: userData.mobile,
          gender: userData.gender,
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-start justify-center px-0 sm:px-4 pt-16 sm:pt-24 pb-8">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-7xl space-y-4 sm:space-y-6">
        {/* Header Card */}
        <div 
          className={`
            rounded-none sm:rounded-xl bg-background/95 backdrop-blur-xl px-4 py-4 sm:p-6
            ${theme === "dark" ? "border-b sm:border border-white/10" : "border-b sm:border border-black/10"}
            shadow-lg sm:shadow-2xl
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push("/")}

              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to home</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">My Profile</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {isAdmin && (
                <Button
                  className="hidden sm:flex bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                  onClick={() => router.push('/admin')}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-4"
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                    router.push("/");
                  } catch (error) {
                    console.error("Error signing out:", error);
                    setError("Failed to sign out");
                  }
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {/* Account Overview Card */}
          <div 
            className={`
              col-span-1 rounded-xl bg-background/95 backdrop-blur-xl p-4 sm:p-6
              ${theme === "dark" ? "border border-white/10" : "border border-black/10"}
              shadow-lg sm:shadow-2xl space-y-4 sm:space-y-6
            `}
          >
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">Account Overview</h2>
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-base sm:text-lg font-bold capitalize">{userData.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full h-9 sm:h-10 text-sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>

          {/* Personal Information Card */}
          <div 
            className={`
              lg:col-span-2 rounded-xl bg-background/95 backdrop-blur-xl
              ${theme === "dark" ? "border border-white/10" : "border border-black/10"}
              shadow-lg sm:shadow-2xl
            `}
          >
            <div className="p-4 sm:p-6 border-b flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold">Personal Information</h2>
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm"
                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Edit Profile"
                )}
              </Button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Full Name</Label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Input
                          value={userData.first_name}
                          onChange={(e) => handleInputChange("first_name", e.target.value)}
                          placeholder="First Name"
                          className="h-9 sm:h-10 text-sm"
                        />
                        <Input
                          value={userData.last_name}
                          onChange={(e) => handleInputChange("last_name", e.target.value)}
                          placeholder="Last Name"
                          className="h-9 sm:h-10 text-sm"
                        />
                      </div>
                    ) : (
                      <p className="text-base sm:text-lg font-medium">{userData.first_name} {userData.last_name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Email Address</Label>
                    <p className="text-base sm:text-lg font-medium break-all">{userData.email}</p>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Mobile Number</Label>
                    {isEditing ? (
                      <Input
                        value={userData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        placeholder="Mobile Number"
                        className="h-9 sm:h-10 text-sm"
                      />
                    ) : (
                      <p className="text-base sm:text-lg font-medium">{userData.mobile}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Gender</Label>
                    {isEditing ? (
                      <Select
                        value={userData.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                      >
                        <SelectTrigger className="h-9 sm:h-10 text-sm">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-base sm:text-lg font-medium capitalize">{userData.gender}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Role</Label>
                    <p className="text-base sm:text-lg font-medium capitalize">{userData.role}</p>
                  </div>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mt-4 sm:mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {isEditing && (
                <div className="mt-4 sm:mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="h-8 sm:h-9 text-xs sm:text-sm mr-3"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Delete Account</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(false)}
              className="w-full sm:w-auto h-9 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full sm:w-auto h-9 text-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}