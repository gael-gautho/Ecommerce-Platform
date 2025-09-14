"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { CartItem } from "@/types";
import Image from "next/image";
import Link from "next/link";

const CartModal = () => {
  const { cart, isLoading, removeItem, updateItemQuantity } = useCartStore();
  const cartItems = cart?.cartItems

  const handleQuantity = (type: "i" | "d", item: CartItem) => {
    if (type === "d") {
      updateItemQuantity(item.id, item.quantity - 1);
    }
    if (type === "i") {
      updateItemQuantity(item.id, item.quantity + 1);
    }
  };


  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {!cart || !cartItems || cartItems?.length === 0 ? (
        <div className="">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>
          {/* LIST */}
          <div className="flex flex-col gap-8">
            {/* ITEM */}
            {cartItems.map((item) => (
              <div className="flex gap-4" key={item.id}>
                  <Image
                    src={item.variant.product_image_url}
                    alt={item.variant.product_name}
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                <div className="flex flex-col justify-between w-full">
                  {/* TOP */}
                  <div className="">
                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-32">
                      <h3 className="font-semibold">
                        {item.variant.product_name}
                      </h3>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                
                        {item.variant.price === item.variant.discounted_price ? (
                          <h2>${item.variant.price}</h2>
                        ) : (
                          <div className="flex items-center gap-4">
                            <h3 className="line-through">
                              ${item.variant.price}
                            </h3>
                            <h2 >
                              ${item.variant.discounted_price}
                            </h2>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* DESC */}
                    <div className="text-sm text-gray-500">
                      Color {item.variant.color} - Size {item.variant.size}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm">
                    <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-24">
                      <button
                        className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                        onClick={() => handleQuantity("d", item)}
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      {item.quantity} 
                      <button
                        className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                        onClick={() => handleQuantity("i", item)}
                        disabled={item.quantity === item.variant.stock_quantity}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-blue-500 cursor-pointer"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* BOTTOM */}
          <div className="">
            <div className="flex items-center justify-between font-semibold">
              <span className="">Subtotal</span>
              <span className="">${cart.cart_subtotal}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                View Cart
              </button>
              <Link href='/checkout'className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75">
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
