'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


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

    redirect('/');
}