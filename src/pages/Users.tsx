import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Eye, 
  Edit, 
  Trash2,
  Plus, 
  Search, 
  User
} from "lucide-react";
import { toast } from "sonner";
import { User as UserType, userService } from "@/services/api-service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/Auth-context";

type DialogState = {
  isOpen: boolean;
  type: "create" | "edit" | "view" | "delete";
  user: Partial<UserType>;
};

export default function Users() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: "create",
    user: {}
  });

  // Queries
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    enabled: isAuthenticated,
  });
  console.log("Fetched users from backend:", users);

  // Mutations
  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeDialog();
    },
    onError: (error) => toast.error(`Error creating user: ${error.message}`)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string  }) =>
      userService.updateUser(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeDialog();
    },
    onError: (error) => toast.error(`Error updating user: ${error.message}`)
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeDialog();
    },
    onError: (error) => toast.error(`Error deleting user: ${error.message}`)
  });

  // Filter users based on search
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dialog functions
  const openDialog = (type: DialogState["type"], user?: UserType) => {
    setDialogState({
      isOpen: true,
      type,
      user: user || {}
    });
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      type: "create",
      user: {}
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as "admin" | "user";
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (dialogState.type === "create") {
      const userData = {
        name,
        email,
        password,
        passwordConfirm,
        role,
      };
      createMutation.mutate(userData);
    } else if (dialogState.type === "edit" && dialogState.user._id) {
      updateMutation.mutate({
        id: dialogState.user._id,
        name,
        
      });
    } else if (dialogState.type === "delete" && dialogState.user._id) {
      deleteMutation.mutate(dialogState.user._id);
    }
  };

  const renderDialogContent = () => {
    const { type, user } = dialogState;

    if (type === "delete") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user "{user.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button variant="destructive" onClick={() => user._id && deleteMutation.mutate(user._id)}>
              Delete
            </Button>
          </DialogFooter>
        </>
      );
    }

    const isViewMode = type === "view";

    return (
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Add New User" : type === "edit" ? "Edit User" : "User Details"}
          </DialogTitle>
          <DialogDescription>
            {type === "create" 
              ? "Fill in the details for a new user." 
              : type === "edit" 
                ? "Modify the user information." 
                : "View user information."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* User Photo */}
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 animate-scale-in">
              <AvatarImage src={user.photo} alt={user.name || "User"} />
              <AvatarFallback className="text-2xl">{(user.name || "User").charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Name (always show) */}
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name || ""}
              className="col-span-3"
              readOnly={isViewMode}
            />
          </div>

          {/* Email (show only for create and view) */}
          {type !== "edit" && (
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email || ""}
                className="col-span-3"
                readOnly={isViewMode}
              />
            </div>
          )}

          {/* Role (show only for create and view) */}
          {type !== "edit" && (
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="role" className="text-right">Role</Label>
              {isViewMode ? (
                <Input
                  id="role"
                  name="role"
                  defaultValue={user.role || ""}
                  className="col-span-3"
                  readOnly
                />
              ) : (
                <Select name="role" defaultValue={user.role || "user"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Password fields for create only */}
          {type === "create" && (
            <>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="passwordConfirm" className="text-right">Confirm Password</Label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  className="col-span-3"
                  required
                />
              </div>
            </>
          )}

          {/* Password Changed At (view only) */}
          {isViewMode && user.passwordChangedAt && (
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="passwordChangedAt" className="text-right">Password Changed</Label>
              <Input
                id="passwordChangedAt"
                value={new Date(user.passwordChangedAt).toLocaleDateString()}
                className="col-span-3"
                readOnly
              />
            </div>
          )}
        </div>

        {!isViewMode && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" className="bg-shopoPrimary hover:bg-shopoPrimary/90">
              {type === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        )}
      </form>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage your system users</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full md:w-[260px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => openDialog("create")}
              className="bg-shopoPrimary hover:bg-shopoPrimary/90 animate-scale-in"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin-slow">
              <User className="h-10 w-10 text-shopoPrimary" />
            </div>
            <span className="ml-3">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl font-medium mb-2">No Users Found</CardTitle>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No users match your search criteria."
                  : "Get started by adding a new user."
                }
              </p>
              {!searchTerm && (
                <Button
                  className="mt-4 bg-shopoPrimary hover:bg-shopoPrimary/90"
                  onClick={() => openDialog("create")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow 
                    key={user._id} 
                    className="hover:bg-muted/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.photo} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.role === "admin" ? "bg-shopoPrimary/20 text-shopoPrimary" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Actions</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="animate-scale-in">
                          <DropdownMenuItem 
                            className="cursor-pointer hover-lift"
                            onClick={() => openDialog("view", user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover-lift"
                            onClick={() => openDialog("edit", user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover-lift text-red-500 focus:text-red-500"
                            onClick={() => openDialog("delete", user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
