import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

/**
 * Google sign-in, portable across hosts.
 * - On Lovable-hosted domains (editor preview / *.lovable.app) the Lovable broker is used,
 *   because the preview runs inside an iframe.
 * - Everywhere else (e.g. https://news-hti.vercel.app, localhost) it uses Supabase Auth directly:
 *   Supabase → Google → Supabase callback → back to the current origin.
 * The redirect always comes from window.location.origin, so no host URL is hardcoded here.
 */
function isLovableHost(hostname: string) {
  return hostname.endsWith(".lovable.app") || hostname.endsWith(".lovableproject.com");
}

export async function signInWithGoogle(): Promise<{ error: Error | null; redirected: boolean }> {
  const origin = window.location.origin;

  if (isLovableHost(window.location.hostname)) {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: origin });
    return {
      error: result.error ? (result.error as Error) : null,
      redirected: Boolean("redirected" in result && result.redirected),
    };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/` },
  });
  return { error: error ?? null, redirected: !error };
}
