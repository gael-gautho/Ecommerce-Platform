import React from "react";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Image from "next/image";

const ListPage = async ({ searchParams }: { searchParams: any }) => {

  const {category, name, min, max, sort, page} = (await searchParams) ;
  console.log(category)
  const queryParams = new URLSearchParams;
  if (category) queryParams.set("category", category);
  if (name) queryParams.set("name", name);
  if (min) queryParams.set("min", min);
  if (max) queryParams.set("max", max);
  if (sort) queryParams.set("sort", sort);
  if (page) queryParams.set("page", page);



  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-red-500 text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>
      {/* FILTER */}
      <Filter />
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">Results for {queryParams.get("name")}</h1>
        <ProductList
        number_of_products={8}
        queryParams = {queryParams}
        />
    </div>
  );
};

export default ListPage;
