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
  cartItems: CartItem[];
  total_items: number;
  cart_subtotal: number;
}


export interface CartItem {
  id: string;
  variant: Variant;
  quantity: number;
  item_subtotal: number;
}

export interface UserInfo{
  user_id: string;
  is_admin: boolean;
}

export interface MyJwtPayload {
  user_id: string;
  is_admin: string; 
}

export interface Order {
    id:string
    first_name:string
    last_name:string
    email:string
    address:string
    zipcode:string
    place:string
    phone:string
    stripe_token:string
    paid_amount:number
    order_items: OrderItem[]
    status:string
    created_at:string
}


export interface OrderItem {
    item_subtotal: number
    variant: Variant
    quantity: number
    order_id: string
}

export interface UserProfile {
  fullname: string
  phone_number: string
  address: string
}


export type FormState = {
  success: boolean;
  message: string;
  updatedUser?: UserProfile;
};
