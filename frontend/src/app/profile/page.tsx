"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    interests: [] as string[],
    avatar: "",
    social: {
      twitter: "",
      linkedin: "",
      github: ""
    },
    company: {
      name: "",
      position: "",
      website: ""
    }
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.email) {
      fetchProfile();
    }
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile`);
      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...data.profile,
          interests: data.profile.interests || [],
          social: data.profile.social || { twitter: "", linkedin: "", github: "" },
          company: data.profile.company || { name: "", position: "", website: "" }
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (response.ok) {
        toast({
          title: "Profile updated successfully",
          variant: "default",
        });
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, avatar: data.avatar }));
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center p-8"><Icons.spinner className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Icons.user className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  <Icons.camera className="w-4 h-4 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
              <p className="text-sm text-muted-foreground">{profile.company.position} at {profile.company.name}</p>
            </div>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general" className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!isEditing}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Interests</label>
                <Input
                  value={profile.interests.join(", ")}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    interests: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
                  })}
                  disabled={!isEditing}
                  placeholder="Technology, Startups, Innovation"
                />
              </div>
            </TabsContent>

            <TabsContent value="work" className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <Input
                  value={profile.company.name}
                  onChange={(e) => setProfile({
                    ...profile,
                    company: { ...profile.company, name: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Input
                  value={profile.company.position}
                  onChange={(e) => setProfile({
                    ...profile,
                    company: { ...profile.company, position: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="Your role"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Website</label>
                <Input
                  value={profile.company.website}
                  onChange={(e) => setProfile({
                    ...profile,
                    company: { ...profile.company, website: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="https://example.com"
                />
              </div>
            </TabsContent>

            <TabsContent value="social" className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <Input
                  value={profile.social.twitter}
                  onChange={(e) => setProfile({
                    ...profile,
                    social: { ...profile.social, twitter: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <Input
                  value={profile.social.linkedin}
                  onChange={(e) => setProfile({
                    ...profile,
                    social: { ...profile.social, linkedin: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="LinkedIn profile URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <Input
                  value={profile.social.github}
                  onChange={(e) => setProfile({
                    ...profile,
                    social: { ...profile.social, github: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="GitHub username"
                />
              </div>
            </TabsContent>

            {isEditing && (
              <div className="p-6 border-t">
                <Button type="submit" disabled={loading}>
                  {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Tabs>
      </Card>
    </div>
  );
} 