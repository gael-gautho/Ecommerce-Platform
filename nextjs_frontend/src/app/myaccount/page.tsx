import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload, Order, UserProfile } from "@/types";
import apiService from "@/libs/apiService";
import MyAccountComponent from "@/components/MyAccountComponent";

const MyAccountServerWrapper = async () => {
  let user_id = "";
  const refreshToken = (await cookies()).get("session_refresh_token")?.value

  if (refreshToken) {
    user_id = jwtDecode<MyJwtPayload>(refreshToken).user_id
  };

  if (!user_id) {
    return <div className="">Not logged in!</div>;
  }

  const tmpOrder = await apiService.get('/order/get_myorders')
  const orderRes: Order[] = tmpOrder.data

  const tmpUser = await apiService.get('/get_profile/')
  const userProfile: UserProfile = tmpUser.data

  return <MyAccountComponent orderRes={orderRes} initialUserProfile={userProfile} />;
};

export default MyAccountServerWrapper;