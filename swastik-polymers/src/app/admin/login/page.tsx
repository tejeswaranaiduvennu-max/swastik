"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const configured = supabaseConfigured();

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    const to = params.get("redirectedFrom") || "/admin";
    router.replace(to);
    router.refresh();
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/admin/login`
          : undefined
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Password reset link sent. Check your email inbox.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-beige/50 px-5">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Image src="/logo.svg" alt="Swastik Polymers" width={220} height={50} />
        </div>
        <div className="card p-8">
          <h1 className="text-center text-xl font-bold text-brand-brown">
            Admin {mode === "forgot" ? "Password Reset" : "Login"}
          </h1>
          <p className="mt-1 text-center text-sm text-brand-charcoal/60">
            Authorized personnel only.
          </p>

          {!configured && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Supabase is not configured. Add your keys to{" "}
              <code className="font-mono">.env.local</code> and restart.
            </div>
          )}
          {params.get("denied") && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              This account is not authorized for admin access.
            </div>
          )}

          <form
            onSubmit={mode === "login" ? onLogin : onForgot}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="admin@swastikpolymers.in"
              />
            </div>

            {mode === "login" && (
              <div>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>
            )}

            {status === "error" && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {message}
              </p>
            )}
            {status === "sent" && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !configured}
              className="btn-primary w-full"
            >
              {status === "loading"
                ? "Please wait…"
                : mode === "login"
                  ? "Sign In"
                  : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "forgot" : "login");
                setStatus("idle");
                setMessage("");
              }}
              className="text-sm font-medium text-brand-gold hover:underline"
            >
              {mode === "login" ? "Forgot password?" : "Back to login"}
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-brand-charcoal/50">
          Swastik Polymers Admin · Return to{" "}
          <a href="/" className="font-medium text-brand-brown hover:underline">
            website
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
