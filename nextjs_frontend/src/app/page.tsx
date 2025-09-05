import Image from "next/image";
import Slider from "@/components/Slider";
import ProductList from "@/components/ProductList";
import CategoryList from "@/components/CategoryList";
import { Suspense } from "react";
import Skeleton from "@/components/Skeleton";

export default function Home() {
  return (
    <div className="">
      <Slider/>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
          category="Featured"
          limit={4}
          />
        </Suspense>
      </div>

      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">
          Categories
        </h1>
          <CategoryList />
      </div>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">New Products</h1>
          <Suspense fallback={<Skeleton />}>
          <ProductList
          category="Latest"
          limit={4}
          />
        </Suspense>
      </div>


    </div>
  );
}
