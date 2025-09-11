'use client'
import { createContext, useContext } from "react";
import { UserInfo } from "@/types";

const UserContext = createContext<UserInfo>({ user_id: "", is_admin: false });

export function UserProvider({
  children,
  userInfo,
}: {    
  children: React.ReactNode;
  userInfo: UserInfo;
}) {
  return (
    <UserContext.Provider value={userInfo}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
