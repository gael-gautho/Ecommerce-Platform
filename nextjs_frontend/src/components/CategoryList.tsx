import apiService from "@/libs/apiService";
import { CategoryInterface } from "@/types";
import Image from "next/image";
import Link from "next/link";

const cats = [
  {
    _id: "1",
    slug: "t-shirts",
    name: "T-Shirts",
    image: { url: "/cat1.jpg" },
  },
  {
    _id: "2",
    slug: "hoodies",
    name: "Hoodies",
    image: { url: "/cat2.jpg" },
  },
  {
    _id: "3",
    slug: "sneakers",
    name: "Sneakers",
    image: { url: "/cat3.jpg" },
  },
  {
    _id: "4",
    slug: "jeans",
    name: "Jeans",
    image: { url: "/cat4.jpg" },
  },
  {
    _id: "5",
    slug: "accessories",
    name: "Accessories",
    image: { url: "/cat5.jpg" },
  },
  {
    _id: "6",
    slug: "jackets",
    name: "Jackets",
    image: { url: "/cat6.jpg" },
  },
  
  {
    _id: "7",
    slug: "jackets",
    name: "Jackets",
    image: { url: "/cat6.jpg" },
  },
];

const CategoryList = async () => {

  const tmpProducts = await apiService.get(`/product/get_categories/`);	
  const categories: CategoryInterface[] = tmpProducts.data
  

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((cat) => (
          <Link
            href={`/list?cat=${cat.slug}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={cat.id}
          >
            <div className="relative bg-slate-100 w-full h-96">
              <Image
                src={cat.image_url}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">
              {cat.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
