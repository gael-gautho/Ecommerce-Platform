'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import apiService from './apiService';


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


export const updateUser = async (formData: FormData) => {

  const id = formData.get("id") as string;
  const username = formData.get("username") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  console.log(username)

  try {
    const response = await apiService.post('/account/edit_profile/','')
    console.log(response)
  } catch (err) {
    console.log(err);
  }
};


export async function logoutUser() {
  const cookieStore = await cookies();
  
  cookieStore.delete('session_access_token');
  cookieStore.delete('session_refresh_token');

  //redirect('/');
}
