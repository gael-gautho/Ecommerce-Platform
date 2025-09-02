
export interface ProductInterface {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  main_image_url: string;
  other_image_urls: string[];
}