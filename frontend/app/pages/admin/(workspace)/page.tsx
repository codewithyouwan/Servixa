import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/lib/admin/constants";

/** /pages/admin has no dashboard of its own — user management is the landing screen. */
export default function AdminIndexPage() {
  redirect(ADMIN_ROUTES.users);
}
