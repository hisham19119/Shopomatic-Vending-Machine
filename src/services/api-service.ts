const API_BASE_URL = "https://mctasuvendingmachine.vercel.app/api";
import { toast } from "sonner";

// Types
export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  machineLocation: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role: "admin" | "user";
  passwordChangedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role?: "admin" | "user";
}

export interface AuthResponse {
  status: string;
  token: string;
  data?: {
    user: User;
  };
}

// Error handling helper
const handleApiError = (error: unknown, message: string): never => {
  console.error(error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
  toast.error(`${message}: ${errorMessage}`);
  throw new Error(`${message}: ${errorMessage}`);
};

// Authentication Service
export const authService = {
  // Register a new user
  register: async (userData: RegisterData): Promise<User> => {
    try {
      console.log('Register request body:', userData);
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        // credentials: 'include', // To handle cookies
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Register error response:', errorText);
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      const authResponse: AuthResponse = await response.json();
      
      // Store token in localStorage for frontend access
      localStorage.setItem("jwt", authResponse.token);
      
      toast.success("Registration successful!");
      return authResponse.data.user;
    } catch (error) {
      return handleApiError(error, "Registration failed");
    }
  },
  
  // Login user
  login: async (credentials: LoginCredentials): Promise<void> => {
    try {
      console.log('Login request body:', credentials);
      const response = await fetch(`${API_BASE_URL}/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        // credentials: 'include', // To handle cookies
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      const authResponse: { token: string } = await response.json();
      console.log('Login backend response:', authResponse);
      // Store token in localStorage for frontend access
      if (authResponse.token) {
        localStorage.setItem("jwt", authResponse.token);
      } else {
        throw new Error('Login failed: No token returned from server');
      }
      // No user data is expected or returned from this function
      toast.success("Login successful!");
    } catch (error) {
      handleApiError(error, "Login failed");
    }
  },
  
  // Logout user
  logout: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: "GET",
        credentials: 'include', // To handle cookies
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      // Clear stored token and user data
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      
      toast.success("Logout successful!");
      return true;
    } catch (error) {
      // Fallback in development
      if (import.meta.env.DEV) {
        console.warn("Using mock logout in development mode");
        
        // Clear stored token and user data
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        
        toast.success("Logout successful (mock)!");
        return true;
      }
      return handleApiError(error, "Logout failed");
    }
  },
  
  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("jwt");
  },
  
  // Get current user from local storage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      return null;
    }
  },
  
  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem("jwt");
  }
};

// Product Service
export const productService = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.data.products;
    } catch (error) {
      return handleApiError(error, "Failed to fetch products");
    }
  },
  
  // Get a product by ID
  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      // Fallback to mock data in development
      if (import.meta.env.DEV) {
        console.warn("Using mock product data in development mode");
        return mockProducts.find(product => product._id === id);
      }
      return handleApiError(error, "Failed to fetch product");
    }
  },
  
  // Create a product
  createProduct: async (product: Omit<Product, '_id'>): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      const newProduct = await response.json();
      toast.success("Product created successfully");
      return newProduct;
    } catch (error) {
      // Fallback in development
      if (import.meta.env.DEV) {
        console.warn("Using mock product creation in development mode");
        const newProduct = {
          ...product,
          _id: `prod_${Math.random().toString(36).substring(2, 15)}`
        };
        mockProducts.push(newProduct);
        toast.success("Product created successfully (mock)");
        return newProduct;
      }
      return handleApiError(error, "Failed to create product");
    }
  },
  
  // Update a product
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      const updatedProduct = await response.json();
      toast.success("Product updated successfully");
      return updatedProduct;
    } catch (error) {
      // Fallback in development
      if (import.meta.env.DEV) {
        console.warn("Using mock product update in development mode");
        const index = mockProducts.findIndex(p => p._id === id);
        if (index === -1) throw new Error("Product not found");
        
        mockProducts[index] = { ...mockProducts[index], ...product };
        toast.success("Product updated successfully (mock)");
        return mockProducts[index];
      }
      return handleApiError(error, "Failed to update product");
    }
  },
  
  // Delete a product
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      toast.success("Product deleted successfully");
      return true;
    } catch (error) {
      // Fallback in development
      if (import.meta.env.DEV) {
        console.warn("Using mock product deletion in development mode");
        const index = mockProducts.findIndex(p => p._id === id);
        if (index === -1) return false;
        
        mockProducts.splice(index, 1);
        toast.success("Product deleted successfully (mock)");
        return true;
      }
      return handleApiError(error, "Failed to delete product");
    }
  },
  
  // Upload product image
  uploadProductImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/uploads/products`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      toast.success("Image uploaded successfully");
      return data.imageUrl;
    } catch (error) {
      // Fallback in development
      if (import.meta.env.DEV) {
        console.warn("Using mock image upload in development mode");
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo purposes, use placeholder images
        const placeholderUrls = [
          "https://res.cloudinary.com/dhcbudcec/image/upload/v1745826881/uploads/jllr1jleahu66myhnjqe.png",
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
          "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
        ];
        
        const randomUrl = placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)];
        toast.success("Image uploaded successfully (mock)");
        return randomUrl;
      }
      return handleApiError(error, "Failed to upload image");
    }
  }
};

// User Service
export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.data.users;
    } catch (error) {
      return handleApiError(error, "Failed to fetch users");
    }
  },
  
  // Get a user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${API_BASE_URL}/users/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.data.user;
    } catch (error) {
      return handleApiError(error, "Failed to fetch user");
    }
  },
  
  // Create a user (only required fields)
  createUser: async (user: { name: string; email: string; password: string; passwordConfirm: string; role: "admin" | "user" }): Promise<User> => {
    try {
      const token = localStorage.getItem("jwt");
      console.log('createUser request payload:', user);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('createUser error response:', errorText);
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('createUser success response:', data);
      return data.data.user;
    } catch (error) {
      return handleApiError(error, "Failed to create user");
    }
  },
  
  // Update a user by ID (PATCH, only name)
  updateUser: async (id: string, user: { name: string  }): Promise<User> => {
    try {
      const token = localStorage.getItem("jwt");
      console.log('updateUser request payload:', { id, ...user });
      const response = await fetch(`${API_BASE_URL}/users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name: user.name }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error('updateUser error response:', errorText);
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('updateUser success response:', data);
      return data.data.user;
    } catch (error) {
      return handleApiError(error, "Failed to update user");
    }
  },
  
  // Delete a user by ID
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${API_BASE_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      return true;
    } catch (error) {
      return handleApiError(error, "Failed to delete user");
    }
  },
  
  // Upload user photo
  uploadUserPhoto: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch(`${API_BASE_URL}/uploads/users`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      toast.success("Photo uploaded successfully");
      return data.photoUrl;
    } catch (error) {
      // Fallback in development
      if (import.meta.env.DEV) {
        console.warn("Using mock photo upload in development mode");
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo purposes, use placeholder images
        const placeholderUrls = [
          "https://res.cloudinary.com/dhcbudcec/image/upload/v1745833967/users/user-680f3ebcfe30188703724d36.jpg",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        ];
        
        const randomUrl = placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)];
        toast.success("Photo uploaded successfully (mock)");
        return randomUrl;
      }
      return handleApiError(error, "Failed to upload photo");
    }
  },

  // Get current user info (self)
  getSelf: async (): Promise<User> => {
    try {
      const token = localStorage.getItem("jwt");
      console.log("JWT token used for /users/me:", token);
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.data.user;
    } catch (error) {
      return handleApiError(error, "Failed to fetch current user info");
    }
  },

  // Update current user info (self)
  updateSelf: async (user: { name?: string; photo?: string }): Promise<User> => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${API_BASE_URL}/users/update-self`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('updateSelf error response:', errorText);
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.data.user;
    } catch (error) {
      return handleApiError(error, "Failed to update current user info");
    }
  },
};

// Analytics Service
export interface AnalyticsData {
  revenue: {
    total: number;
    lastMonth: number;
    trend: number;
  };
  sales: {
    total: number;
    lastMonth: number;
    trend: number;
  };
  users: {
    total: number;
    lastMonth: number;
    trend: number;
  };
  products: {
    total: number;
    outOfStock: number;
  };
  revenueByMonth: Array<{ month: string; revenue: number }>;
  salesByProduct: Array<{ name: string; sales: number }>;
  userGrowth: Array<{ month: string; users: number }>;
}

// Analytics Service
export const analyticsService = {
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      // Fallback in development
      if (import.meta.env.DEV) {
        console.warn("Using mock analytics data in development mode");
        // Generate mock analytics data based on current mock products and users
        return {
          revenue: {
            total: 28950,
            lastMonth: 4320,
            trend: 12.5
          },
          sales: {
            total: 1245,
            lastMonth: 245,
            trend: 8.7
          },
          users: {
            total: mockUsers.length,
            lastMonth: 15,
            trend: 5.3
          },
          products: {
            total: mockProducts.length,
            outOfStock: mockProducts.filter(p => p.quantity === 0).length
          },
          revenueByMonth: [
            { month: "Jan", revenue: 2100 },
            { month: "Feb", revenue: 2400 },
            { month: "Mar", revenue: 1800 },
            { month: "Apr", revenue: 2800 },
            { month: "May", revenue: 3200 },
            { month: "Jun", revenue: 2900 },
            { month: "Jul", revenue: 3800 },
            { month: "Aug", revenue: 4100 },
            { month: "Sep", revenue: 3600 },
            { month: "Oct", revenue: 4320 },
            { month: "Nov", revenue: 0 },
            { month: "Dec", revenue: 0 },
          ],
          salesByProduct: mockProducts.map(p => ({
            name: p.name,
            sales: Math.floor(Math.random() * 100) + 50
          })),
          userGrowth: [
            { month: "Jan", users: 10 },
            { month: "Feb", users: 15 },
            { month: "Mar", users: 20 },
            { month: "Apr", users: 28 },
            { month: "May", users: 35 },
            { month: "Jun", users: 42 },
            { month: "Jul", users: 50 },
            { month: "Aug", users: 65 },
            { month: "Sep", users: 80 },
            { month: "Oct", users: 95 },
            { month: "Nov", users: 0 },
            { month: "Dec", users: 0 }
          ]
        };
      }
      return handleApiError(error, "Failed to fetch analytics data");
    }
  }
};

// Mock data for development/fallback
const mockProducts: Product[] = [
  {
    _id: "680f3442ba91c1639b666658",
    name: "Water",
    price: 5,
    quantity: 10,
    imageUrl: "https://res.cloudinary.com/dhcbudcec/image/upload/v1745826881/uploads/jllr1jleahu66myhnjqe.png",
    machineLocation: "A1"
  },
  {
    _id: "680f3442ba91c1639b666659",
    name: "Cola",
    price: 8,
    quantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    machineLocation: "A2"
  },
  {
    _id: "680f3442ba91c1639b666660",
    name: "Coffee",
    price: 10,
    quantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    machineLocation: "B1"
  },
  {
    _id: "680f3442ba91c1639b666661",
    name: "Snack Bar",
    price: 7,
    quantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    machineLocation: "B2"
  },
  {
    _id: "680f3442ba91c1639b666662",
    name: "Chips",
    price: 6,
    quantity: 25,
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    machineLocation: "C1"
  }
];

const mockUsers: User[] = [
  {
    _id: "680f3ebcfe30188703724d36",
    name: "Admin",
    email: "admin@vendingmachine.gp",
    photo: "https://res.cloudinary.com/dhcbudcec/image/upload/v1745833967/users/user-680f3ebcfe30188703724d36.jpg",
    role: "admin",
    passwordChangedAt: "2025-04-28T08:44:09.662Z"
  },
  {
    _id: "680f3ebcfe30188703724d37",
    name: "John Doe",
    email: "john@vendingmachine.gp",
    photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    role: "user"
  },
  {
    _id: "680f3ebcfe30188703724d38",
    name: "Jane Smith",
    email: "jane@vendingmachine.gp",
    photo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    role: "user"
  }
];
