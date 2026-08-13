import "dotenv/config"
import { createClient } from "./supabase/client";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


async function  getAuthHeader () {
    const supabase = createClient();
    const {data} = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token? {Authorization: `Bearer ${token}`} : {};

}


    export async function apiFetch(path:string, options: RequestInit = {}){

        const authHeader = await getAuthHeader();

        const res = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers:{
                "Content-Type": "application/json",
                ...authHeader,
                ...options.headers,

            },
        });

         if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  if (res.status === 403) {
    throw new Error("Forbidden");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
   if (res.status === 204) {
    return null; 
  }

  return res.json();
}
    
    
