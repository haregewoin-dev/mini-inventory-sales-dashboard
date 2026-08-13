import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me`, {
    headers: { Authorization: `Bearer ${session?.access_token}` },
    cache: "no-store",
  });

  if (!res.ok) redirect("/login");

  const { user: dbUser } = await res.json();
  if (dbUser.role !== "ADMIN") redirect("/dashboard");

  return  <RegisterForm />
 ;
}