import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Edit, Trash2, Plus, Search, Package, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  getAllProducts,
  createProduct,
  updateOneProduct,
  deleteOneProduct,
} from "@/services/products-service";
import type { Product } from "@/services/api-service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type DialogState = {
  isOpen: boolean;
  type: "create" | "edit" | "view" | "delete";
  product: Partial<Product>;
};

export default function Products() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: "create",
    product: {},
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Queries
  const { data: productsData = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Defensive: extract products array from API response
  const products: Product[] = Array.isArray(productsData)
    ? productsData
    : productsData.data?.products || productsData.products || [];

  // Filter products based on search
  const filteredProducts = products.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.machineLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    },
    onError: (error: unknown) =>
      toast.error(`Error creating product: ${(error as Error).message}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateOneProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    },
    onError: (error: unknown) =>
      toast.error(`Error updating product: ${(error as Error).message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOneProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    },
    onError: (error: unknown) =>
      toast.error(`Error deleting product: ${(error as Error).message}`),
  });

  // Image handling functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Dialog functions
  const openDialog = (type: DialogState["type"], product?: Product) => {
    setDialogState({
      isOpen: true,
      type,
      product: product || {},
    });
    setSelectedImage(null);
    setPreviewUrl(product?.imageUrl || "");
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      type: "create",
      product: {},
    });
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setSelectedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (selectedImage) {
      formData.set("image", selectedImage);
    }
    // Debug: log all form data entries
    for (const [key, value] of formData.entries()) {
      console.log('FormData entry:', key, value);
    }
    if (dialogState.type === "create") {
      createMutation.mutate(formData);
    } else if (dialogState.type === "edit" && dialogState.product._id) {
      updateMutation.mutate({ id: dialogState.product._id, data: formData });
    } else if (dialogState.type === "delete" && dialogState.product._id) {
      deleteMutation.mutate(dialogState.product._id);
    }
  };

  const renderDialogContent = () => {
    const { type, product } = dialogState;
    if (type === "delete") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{product.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => product._id && deleteMutation.mutate(product._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </>
      );
    }
    const isViewMode = type === "view";
    return (
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <DialogHeader>
          <DialogTitle>
            {type === "create"
              ? "Add New Product"
              : type === "edit"
              ? "Edit Product"
              : "Product Details"}
          </DialogTitle>
          <DialogDescription>
            {type === "create"
              ? "Fill in the details for a new product."
              : type === "edit"
              ? "Modify the product information."
              : "View product information."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Product Image */}
          <div className="flex flex-col items-center mb-4">
            {(previewUrl || product.imageUrl) && (
              <div className="relative w-32 h-32 rounded-md overflow-hidden border mb-3 animate-scale-in">
                <img
                  src={previewUrl || product.imageUrl}
                  alt={product.name || "Product"}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/40";
                  }}
                />
              </div>
            )}
            {!isViewMode && (
              <div className="w-full flex justify-center">
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <div className="flex items-center gap-2 py-2 px-4 border rounded-md border-dashed hover:bg-muted transition-colors">
                    <Upload size={16} />
                    <span>
                      {selectedImage ? selectedImage.name : "Upload image"}
                    </span>
                  </div>
                  <input
                    id="imageUpload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              </div>
            )}
          </div>
          {/* Product Name */}
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={product.name || ""}
              className="col-span-3"
              readOnly={isViewMode}
              required
            />
          </div>
          {/* Price */}
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="price" className="text-right">
              Price ($)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product.price || ""}
              className="col-span-3"
              readOnly={isViewMode}
              required
            />
          </div>
          {/* Quantity */}
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              defaultValue={product.quantity || ""}
              className="col-span-3"
              readOnly={isViewMode}
              required
            />
          </div>
          {/* Machine Location */}
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="machineLocation" className="text-right">
              Location
            </Label>
            <Input
              id="machineLocation"
              name="machineLocation"
              defaultValue={product.machineLocation || ""}
              className="col-span-3"
              readOnly={isViewMode}
              required
            />
          </div>
        </div>
        {!isViewMode && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" primary>
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
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full md:w-[260px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => openDialog("create")} primary>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin-slow">
              <Package className="h-10 w-10 text-shopoPrimary" />
            </div>
            <span className="ml-3">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl font-medium mb-2">
                No Products Found
              </CardTitle>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No products match your search criteria."
                  : "Get started by adding a new product."}
              </p>
              {!searchTerm && (
                <Button
                  className="mt-4"
                  primary
                  onClick={() => openDialog("create")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow
                    key={product._id}
                    className="hover:bg-muted/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/40";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      {product.quantity === 0 ? (
                        <span className="text-red-500">Out of stock</span>
                      ) : product.quantity < 5 ? (
                        <span className="text-amber-500">
                          Low stock ({product.quantity})
                        </span>
                      ) : (
                        product.quantity
                      )}
                    </TableCell>
                    <TableCell>{product.machineLocation}</TableCell>
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
                        <DropdownMenuContent
                          align="end"
                          className="animate-scale-in"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer hover-lift"
                            onClick={() => openDialog("view", product)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover-lift"
                            onClick={() => openDialog("edit", product)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover-lift text-red-500 focus:text-red-500"
                            onClick={() => openDialog("delete", product)}
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

      <Dialog
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-[425px]">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
