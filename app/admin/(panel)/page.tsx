import { redirect } from "next/navigation";
import { ADMIN_HOME_HREF } from "@/lib/admin-nav";

export default function AdminIndexPage() {
  redirect(ADMIN_HOME_HREF);
}
