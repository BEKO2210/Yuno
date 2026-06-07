/**
 * The single admin allowed to upload/manage assets.
 * Must match the email used in `public.is_admin()` in supabase/schema.sql.
 */
export const ADMIN_EMAIL = "belkis.aslani@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
