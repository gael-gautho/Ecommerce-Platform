"use client";

import { useEffect, useState } from "react";
import Add from "./Add";
import { ProductDetailInterface } from "@/types";

const CustomizeProducts = ({
  product, 

}: {
  product: ProductDetailInterface;
  
}) => {
  const [selectedColor, setSelectedColor] = useState<string >(product.product_variant[0].color);
  const [selectedSize, setSelectedSize] = useState<string >(product.product_variant[0].size);
  const [selectedVariant, setSelectedVariant] = useState<ProductDetailInterface["product_variant"][number]>(product.product_variant[0]);
  
  useEffect(() => {
    if (!selectedColor || !selectedSize || !product.product_variant) return;

    const variant = product.product_variant.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );

    variant && setSelectedVariant(variant);

  }, [selectedColor, selectedSize]);

  const isVariantInStock = (color: string, size: string ): boolean => {

    return product.product_variant.some((v) => {
      const matchColor = v.color === color ;
      const matchSize = v.size === size ;
      const inStock = v.stock_quantity > 0;
      return matchColor && matchSize && inStock;
    });
  };




  return (
    <>
      {/* PRICES */}

      {selectedVariant.price === selectedVariant.discounted_price ? (
          <h2 className="font-medium text-2xl">${selectedVariant.price}</h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${selectedVariant.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ${selectedVariant.discounted_price}
            </h2>
          </div>
        )}
        <div className="h-[2px] bg-gray-100" />

    <div className="flex flex-col gap-6">
      {/* COLORS */}

        <div className="flex flex-col gap-4">
        <h4 className="font-medium">Choose a color</h4>
        <ul className="flex items-center gap-3">
          {product.color_options.map((color) => {
            const disabled = !isVariantInStock(color, selectedSize);
            
            return(
            <li
              key={color}
              onClick={() =>!disabled && setSelectedColor(color)}
              className={`w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative`}
              style={{ backgroundColor: color, 
                       cursor: disabled ? "not-allowed" : "pointer", 
                       opacity: disabled ? 0.5 : 1,}}
                      
            >
              {selectedColor === color && (
                <div className="absolute w-10 h-10 rounded-full ring-2 ring-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </li>
          )}
          )}
        </ul>
      </div>

      {/* SIZES */}
        <div className="flex flex-col gap-4">
        <h4 className="font-medium">Choose a size</h4>
        <ul className="flex items-center gap-3">
          {product.size_options?.map((size) => {
            
            const disabled = !isVariantInStock(selectedColor, size);
            const selected = selectedSize === size;

            return(
            <li
              key={size}
              onClick={() => !disabled && setSelectedSize(size)}
              className={`ring-1 rounded-md py-1 px-4 text-sm ${
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    style={{
                      backgroundColor: selected
                        ? "#f35c7a"
                        : disabled
                        ? "#FBCFE8"
                        : "white",
                      color: selected || disabled ? "white" : "#f35c7a",
                      borderColor: "#f35c7a",
                    }}
            >
              {size}
            </li>
          )}
        )}
        </ul>
      </div>
    </div>

    <Add 
    productId={product.id} 
    variantId={selectedVariant?.id || product.product_variant[0].id} 
    stockNumber={selectedVariant.stock_quantity}/>

  </>
  );
};

export default CustomizeProducts;
