"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";
import { useCartStore } from "@/hooks/useCartStore";
import { useUser } from "@/app/userContext";
import { logoutUser } from "@/libs/actions";
import { toast } from "sonner";


const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { resetStore, counter, getCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const { user_id, is_admin } = useUser();

  const router = useRouter();
  let isLoggedIn = false;

  if (user_id) { isLoggedIn = true }

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    console.log('effect------')
    if (isLoggedIn) {getCart()};
  }, [getCart]);

  
  const handleLogout = async () => {
    
    setIsLoading(true);     
    await logoutUser();
    resetStore();
    toast.success('Successfully logged out');
    setIsLoading(false);
    setIsProfileOpen(false);
    
    router.push('/');
              
  };



  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/profile">Profile</Link>
          <div 
          onClick={handleLogout}
          className="mt-2 cursor-pointer">
            {isLoading ? "Logging out" : "Logout"}
          </div>
        </div>
      )}
      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-5 h-5 bg-red-500 rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;
