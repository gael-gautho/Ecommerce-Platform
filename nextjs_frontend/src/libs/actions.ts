'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import apiService from './apiService';
import { FormState, UserProfile } from '@/types';



export async function handleLogin(accessToken: string, refreshToken: string) {
    
    (await cookies()).set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 1, // 1 minutes
        path: '/'
    });

    (await cookies()).set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 1, // One day
        path: '/'
    });

    //redirect('/');
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;
    return accessToken;
}


export const updateUser = async (prevState: FormState, formData: FormData): Promise<FormState> => {
  
    try {
      const response = await apiService.post('/edit_profile/', formData);
      console.log(response);

      if (response.message === 'information updated') {
        return { success: true, message: "Profile updated successfully!", updatedUser: response.user };
      } else {
        return { success: false, message: response.message || "An unknown error occurred." };
      }
    } catch (err) {
      console.error("Update user error:", err);
      return { success: false, message: "Failed to update profile. Please try again later." };
    }
  };

export async function logoutUser() {
  const cookieStore = await cookies();
  
  cookieStore.delete('session_access_token');
  cookieStore.delete('session_refresh_token');

  //redirect('/');
}
