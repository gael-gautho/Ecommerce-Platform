'use client'

import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import apiService from "@/libs/apiService";
import { ProductDetailInterface } from "@/types";
import React from "react";
import { useEffect, useState } from "react";


const product2 = {
  _id: "1",
  name: "Classic White T-Shirt",
  description: "A timeless white t-shirt made from 100% organic cotton. Comfortable, breathable, and perfect for everyday wear.",
  price: {
    price: 29.99,
    discountedPrice: 19.99,
  },
  variants: [
    { id: "v1", name: "Size", options: ["S", "M", "L", "XL"] },
    { id: "v2", name: "Color", options: ["White", "Black", "Gray"] },
  ],
  productOptions: [
    { option: "Size", values: ["S", "M", "L", "XL"] },
    { option: "Color", values: ["White", "Black", "Gray"] },
  ],
  additionalInfoSections: [
    {
      title: "Material",
      description: "100% organic cotton.",
    },
    {
      title: "Care Instructions",
      description: "Machine wash cold, tumble dry low.",
    },
  ],
};


const ProductDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
 
  const { slug } = React.use(params);
  const [product, setProduct] = useState<ProductDetailInterface | null>(null);
    const fetchProduct = async () => {
        const tmpProduct = await apiService.get(`/product/get_productdetail/${slug}`)	
        setProduct(tmpProduct.data)
      };
  
    useEffect(() => {
      fetchProduct();
    }, []);

  if (!product) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages  
        main_image_url={product.main_image_url}
        other_images_urls ={product.other_images_urls} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />
        {product.price === product.discounted_price ? (
          <h2 className="font-medium text-2xl">${product.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${product.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ${product.discounted_price}
            </h2>
          </div>
        )}
        <div className="h-[2px] bg-gray-100" />
        {product.product_variant ? (
          <CustomizeProducts
          product = {product}
          color_options = {product.color_options}
          size_options = {product.size_options}      
          />
        ) : (
          <Add
              productId={product.id}
              variantId=""
              stockNumber={product.total_stock} 
           />
        )}
        
        <div className="h-[2px] bg-gray-100" />
        {/* {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <p>{section.description}</p>
          </div>
        ))} */}
        <div className="h-[2px] bg-gray-100" />
      </div>
    </div>
  );
};

export default ProductDetailPage;
