import apiService from "@/libs/apiService";
import { Cart, CartItem } from "@/types";
import { create } from "zustand";
import { toast } from "sonner";


type CartState = {
  cartItems: CartItem[];
  isLoading: boolean;
  counter: number;
  getCart: () => void;
  addItem: ( productId: string, variantId: string, quantity: number ) => void;
  updateItemQuantity: (itemId: string, newQuantity: number) => void; 
  removeItem: (itemId: string) => void;
};

export const useCartStore = create<CartState>((set,get) => ({
  cartItems: [],
  isLoading: false,
  counter: 0,
  getCart: async () => {
    
    const response = await apiService.fetch_proxy('GET','/product/get_cartitems/');
    set({
    cartItems: response.data,
    counter: response.data?.length,
    isLoading: false,
  });

  },
  addItem: async (productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await apiService.fetch_proxy('POST','/product/add_to_cart/',
        { variantId, quantity });
    if (response.message==='Added'){
      toast.success("Product added to cart")
    }

    set({
      cartItems: response.data,
      counter: response.data?.length,
      isLoading: false,
    });
  },
  updateItemQuantity: async (itemId, newQuantity) => {
    
    const originalCartItems = get().cartItems;
    const updatedItems = originalCartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0); // Supprime si la quantité est 0

    set({ cartItems: updatedItems, counter: updatedItems.length });

    try {
    const response = await apiService.fetch_proxy(
        'PUT', 
        `/product/update_cartitem/${itemId}/`, 
        { quantity: newQuantity }
      );
      
    set({
      cartItems: response.data,
      counter: response.data?.length,
      isLoading: false,
    });


    } catch (error) {
      toast.error("Failed to update quantity.");
      // En cas d'erreur, on restaure l'état précédent
      set({ cartItems: originalCartItems, counter: originalCartItems.length });
    }
  },

  removeItem: async (itemId) => {
    const originalCartItems = get().cartItems;
    const updatedItems = originalCartItems.filter(item => item.id !== itemId);
    set({ cartItems: updatedItems, counter: updatedItems.length });

    try {
      await apiService.fetch_proxy('DELETE', `/product/delete_cartitem/${itemId}/`);
      toast.success("Product removed from cart");
    } catch (error) {
        toast.error("Failed to remove item.");
        set({ cartItems: originalCartItems, counter: originalCartItems.length });
    }
  },
}));
