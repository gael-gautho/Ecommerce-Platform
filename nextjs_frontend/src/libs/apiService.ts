import { getAccessToken } from "../libs/actions";
import { redirect } from 'next/navigation';


const apiService = {

get: async function (url: string): Promise<any> {
    console.log('get', url);
    
    const token = await getAccessToken();

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            }
        })
            .then(response => response.json())
            .then((json) => {
                console.log('Response:', json);

                resolve(json);
            })
            .catch((error => {
                reject(error);
            }))
    })
},



post: async function(url: string, data: any): Promise<any> {
    console.log('post', url, data);

    const token = await getAccessToken();

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`,
                //'Content-Type': 'application/json'

            }
        })
            .then(response => response.json())
            .then((json) => {
                console.log('Response:', json);

                resolve(json);
            })
            .catch((error => {
                reject(error);
            }))
        })
    },

postWithoutToken: async function(url: string, data: any): Promise<any> {
    console.log('post', url, data);

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(async(response) => {
                console.log('Response:', response);
                const parsedResponse = await response.json();
                resolve({
                status: response.status,
                data: parsedResponse
                });
            })
            .catch((error => {
                reject(error);
            }))
    })
},

delete: async function (url: string): Promise<any> {
    console.log('delete', url);
    
    const token = await getAccessToken();

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            }
        })
            .then(response => response.json())
            .then((json) => {
                console.log('Response:', json);

                resolve(json);
            })
            .catch((error => {
                reject(error);
            }))
    })
},

fetch_proxy : async function (method: string, url: string , data?: any): Promise<any> {

    try{
    const token = await getAccessToken();
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
    },
      body: method === "GET" || method === "HEAD" ? undefined : JSON.stringify(data)
    };

    const response = await fetch(`/api/${url}`, options);
    
    if (response.redirected && response.url ==='/login') {
    redirect(response.url); 
    }

    if (!response.ok) {
        const error = new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        throw error;
    }

    const json = await response.json();
    console.log('Response:', json);
    return json;

    } catch (err) {
    throw err;
    }


  },




}

export default apiService;

