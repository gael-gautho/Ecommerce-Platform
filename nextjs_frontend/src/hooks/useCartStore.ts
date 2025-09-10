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
  removeItem: (itemId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  isLoading: false,
  counter: 0,
  getCart: async () => {
    try {
      const cartItems = await apiService.get('')
      set({
        cartItems: cartItems || [],
        isLoading: false,
        counter: cartItems?.lineItems.length || 0,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  addItem: async (productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await apiService.fetch_proxy('POST','/product/add_to_cart/',
        { variantId, quantity });
    if (response.status==='Added'){
      toast.success("Product added to cart")
    }

    set({
      cartItems: response.data,
      counter: response.data?.length,
      isLoading: false,
    });
  },

  removeItem: async (itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await apiService.delete('')

    set({
      cartItems: response.cartItems,
      counter: response.cartItems?.lineItems.length,
      isLoading: false,
    });
  },
}));
