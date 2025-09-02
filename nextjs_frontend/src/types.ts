
export interface ProductInterface {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discounted_price: number;
  main_image_url: string;
  other_image_urls: string[]; 
}

export interface ProductDetailInterface extends ProductInterface {
  product_variant?: {
    id: number;
    color: string;
    size: string;
    stock_quantity: number;
    price_override?: number;
  }[];
}