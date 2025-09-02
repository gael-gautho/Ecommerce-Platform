'use client'

import apiService from "@/libs/apiService";
import Image from "next/image";
import Link from "next/link";
import { ProductInterface } from "@/types";
import { useEffect, useState } from "react";

const res2 = {
  items: [
    {
      _id: "1",
      slug: "t-shirt-classic",
      name: "Classic T-Shirt",
      price: { price: 29.99 },
      media: {
        mainMedia: { image: { url: "/product1.jpg" } },
        items: [
          { image: { url: "/product1.jpg" } },
          { image: { url: "/product1-hover.jpg" } },
        ],
      },
    },
    {
      _id: "2",
      slug: "hoodie-cozy",
      name: "Cozy Hoodie",
      price: { price: 59.99 },
      media: {
        mainMedia: { image: { url: "/product2.jpg" } },
        items: [
          { image: { url: "/product2.jpg" } },
          { image: { url: "/product2-hover.jpg" } },
        ],
      },
    },
    {
      _id: "3",
      slug: "sneakers-trendy",
      name: "Trendy Sneakers",
      price: { price: 89.99 },
      media: {
        mainMedia: { image: { url: "/product3.jpg" } },
        items: [
          { image: { url: "/product3.jpg" } },
          { image: { url: "/product3-hover.jpg" } },
        ],
      },
    },
    {
      _id: "4",
      slug: "jeans-slimfit",
      name: "Slim Fit Jeans",
      price: { price: 49.99 },
      media: {
        mainMedia: { image: { url: "/product4.jpg" } },
        items: [
          { image: { url: "/product4.jpg" } },
          { image: { url: "/product4-hover.jpg" } },
        ],
      },
    },
  ],
};



const ProductList = () => {

  const [product, setProduct] = useState<ProductInterface[]>([])
  
  useEffect(()=>{
      const fetchproduct = async()=>{
      const tmpProducts = await apiService.get(`/product/get_productlist/`);	
      setProduct(tmpProducts.data);
      };
      fetchproduct()	
    }, [])

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {product.map((product) => (
        <Link
          href={"/products/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product.id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.main_image_url || "/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            {product.other_image_urls && (
              <Image
                src={product.other_image_urls[0] || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">${product.price}</span>
          </div>

          <button className="rounded-2xl ring-1 ring-red-600 text-red-600 w-max py-2 px-4 text-xs hover:bg-red-600 hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
