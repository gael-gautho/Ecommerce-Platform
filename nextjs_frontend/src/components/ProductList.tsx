// 'use client'

import apiService from "@/libs/apiService";
import Image from "next/image";
import Link from "next/link";
import { ProductInterface } from "@/types";
import Pagination from "./Pagination";
// import { useEffect, useState } from "react";


const ProductList = async(
  {number_of_products, queryParams}:{number_of_products:number, queryParams:URLSearchParams}
) => {
  
  const page_obj = await apiService.get(`/product/get_productlist/?number_of_products=${number_of_products}&${queryParams.toString()}`);	
  const product: ProductInterface[] = page_obj.data

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
            {product.other_images_urls && (
              <Image
                src={product.other_images_urls[0]}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">${product.lower_price}</span>
          </div>


        </Link>
      ))}

      {queryParams?.get('category') || queryParams?.get('name') ? (
        <Pagination
          currentPage={Number(queryParams.get('page')) || 1}
          hasPrev={page_obj.has_previous}
          hasNext={page_obj.has_next}
        />
      ) : null}

    </div>
  );
};

export default ProductList;
