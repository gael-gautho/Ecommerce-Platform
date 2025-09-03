
export interface ProductInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discounted_price: number;
  total_stock: number;
  main_image_url: string;
  other_images_urls: string[];
  color_options: string[];
  size_options: string[]; 
}

export interface ProductDetailInterface extends ProductInterface {
  product_variant: {
    id: string;
    color: string;
    size: string;
    stock_quantity: number;
    price_override?: number;
  }[];
}