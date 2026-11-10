import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_URL as URL,
  SUPABASE_ANON_KEY as KEY,
  supabaseConfigured
} from "@/lib/supabase/config";

const configured = supabaseConfigured();

/**
 * Protects every /admin route except /admin/login and the auth callback.
 * Refreshes the Supabase session cookie on each request.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/auth");

  // If Supabase is not configured, let pages render their own setup notice.
  if (!configured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(URL, KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin/login";
    redirect.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirect);
  }

  if (user && isLogin) {
    const dash = request.nextUrl.clone();
    dash.pathname = "/admin";
    dash.search = "";
    return NextResponse.redirect(dash);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
