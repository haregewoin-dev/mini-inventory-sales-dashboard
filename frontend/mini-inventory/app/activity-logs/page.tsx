import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/SideBar";
import { ActivityLogsView } from "./ActivityLogsView";
import { AppShell } from "@/components/AppShell";



export default async function ActivityLogsPage() {
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
  const isAdmin = dbUser.role === "ADMIN";

  return (
   <AppShell userName={dbUser.name} userRole={dbUser.role} isAdmin={isAdmin}>
     <ActivityLogsView />
     </AppShell>
       
    
  );
}