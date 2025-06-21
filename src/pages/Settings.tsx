import { useState, useEffect } from "react";
import { 
  Save,
  Settings as SettingsIcon,
  User,
  Bell,
  ShieldAlert,
  Key
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { userService } from "@/services/api-service";

export default function Settings() {
  const [profileFormSubmitting, setProfileFormSubmitting] = useState(false);
  const [securityFormSubmitting, setSecurityFormSubmitting] = useState(false);
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    role: string;
    photo?: string;
  }>(null);
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    userService.getSelf().then((u) => {
      setUser(u);
      setName(u.name);
      setPhotoUrl(u.photo || "");
    });
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileFormSubmitting(true);
    try {
      let uploadedPhotoUrl = photoUrl;
      if (photoFile) {
        uploadedPhotoUrl = await userService.uploadUserPhoto(photoFile);
      }
      const updated = await userService.updateSelf({
        name,
        photo: uploadedPhotoUrl,
      });
      setUser(updated);
      setPhotoUrl(updated.photo || "");
      setPhotoFile(null);
      toast.success("Profile settings updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setProfileFormSubmitting(false);
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSecurityFormSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSecurityFormSubmitting(false);
      toast.success("Security settings updated successfully");
    }, 1000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 w-full md:w-[600px] mb-8">
            <TabsTrigger value="profile" className="flex gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            {/* <TabsTrigger value="notifications" className="flex gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger> */}
          </TabsList>
          
          <TabsContent value="profile" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal information and profile settings
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={photoUrl || undefined} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-center sm:text-left">
                      <h3 className="font-medium text-base">Profile Photo</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a new photo or remove the current one
                      </p>
                      <div className="flex gap-2 justify-center sm:justify-start mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-shopoPrimary/10 file:text-shopoPrimary hover:file:bg-shopoPrimary/20"
                        />
                        {photoUrl && (
                          <Button type="button" variant="outline" size="sm" onClick={() => { setPhotoUrl(""); setPhotoFile(null); }}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email || ""} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={user?.role || ""} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        defaultValue="Admin user for Shopomatic System"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-shopoPrimary hover:bg-shopoPrimary/90" type="submit" disabled={profileFormSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {profileFormSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* <TabsContent value="notifications" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <h3 className="font-medium text-base">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <h3 className="font-medium text-base">Sales Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new sales and transactions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <h3 className="font-medium text-base">Inventory Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified when product inventory is running low
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <h3 className="font-medium text-base">System Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about system updates and maintenance
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-shopoPrimary hover:bg-shopoPrimary/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security and authentication settings
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSecuritySubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-base flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <h3 className="font-medium text-base">Two-factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-shopoPrimary hover:bg-shopoPrimary/90" type="submit" disabled={securityFormSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {securityFormSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-base">Theme</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select your preferred theme
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 cursor-pointer hover-lift bg-white">
                      <div className="h-20 bg-white border rounded-md mb-2"></div>
                      <p className="text-center text-sm font-medium">Light</p>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer hover-lift bg-zinc-950">
                      <div className="h-20 bg-zinc-800 border border-zinc-700 rounded-md mb-2"></div>
                      <p className="text-center text-sm font-medium text-white">Dark</p>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer hover-lift bg-gradient-to-br from-white to-zinc-950">
                      <div className="h-20 bg-gradient-to-br from-white to-zinc-800 rounded-md mb-2"></div>
                      <p className="text-center text-sm font-medium">System</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-base">Accent Color</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose your accent color for buttons and highlights
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="w-8 h-8 rounded-full bg-shopoPrimary cursor-pointer ring-2 ring-shopoPrimary ring-offset-2"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2"></div>
                    <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-green-500 hover:ring-offset-2"></div>
                    <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer hover:ring-2 hover:ring-red-500 hover:ring-offset-2"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer hover:ring-2 hover:ring-purple-500 hover:ring-offset-2"></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-shopoPrimary hover:bg-shopoPrimary/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
