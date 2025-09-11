export interface CategoryInterface {
  id: number;
  name: string;
  slug: string;
  image_url: string;
}

export interface ProductInterface {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string;
  lower_price: number;
  main_image_url: string;
  other_images_urls: string[];
  color_options: string[];
  size_options: string[]; 
}

export interface Variant {
  id: string;
  color: string;
  size: string;
  stock_quantity: number;
  price: number;
  discounted_price?: number;
  product_name: string;
  product_image_url: string;
}


export interface ProductDetailInterface extends ProductInterface {
  product_variant: Variant[];
}

export interface Cart {
  id: string;
  items: CartItem;
  total_items: number;
  cart_subtotal: number;
}


export interface CartItem {
  id: string;
  variant: Variant;
  quantity: number;
  subtotal: number;
}