/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = "https://mctasuvendingmachine.vercel.app/api";

export const getAllProducts = async () => {
    const response = await fetch(
      `${API_BASE_URL}/products`
    );
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  };
  
  export const getOneProduct= async (id: string) => {
    const response = await fetch(
      `${API_BASE_URL}/products/${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  };
  
  export const createProduct = async (data: FormData) => {
    // Debug: log all FormData entries before sending
    for (const [key, value] of data.entries()) {
      console.log('createProduct FormData entry:', key, value);
    }
    console.log('createProduct request body:', data);
    const response = await fetch(
      `${API_BASE_URL}/products`,
      {
        method: "POST",
        body: data,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error('createProduct error response:', errorText);
      throw new Error("Failed to create product");
    }
    const result = await response.json();
    console.log('createProduct success response:', result);
    return result;
  };
  
  export const updateOneProduct = async (id: string, data: FormData) => {
    console.log('updateOneProduct request body:', data);
    const response = await fetch(
      `${API_BASE_URL}/products/${id}`,
      {
        method: "PUT",
        body: data,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error('updateOneProduct error response:', errorText);
      throw new Error("Failed to update product");
    }
    const result = await response.json();
    console.log('updateOneProduct success response:', result);
    return result;
  };
  
  export const deleteOneProduct = async (id: string) => {
    const response = await fetch(
      `${API_BASE_URL}/products/${id}`,
      {
        method: "DELETE",
        // credentials: "include",
      }
    );
  
    if (!response.ok) throw new Error("Failed to delete product");
    // Handle empty response
    const text = await response.text();
    if (!text) return true;
    try {
      return JSON.parse(text);
    } catch {
      return true;
    }
  };