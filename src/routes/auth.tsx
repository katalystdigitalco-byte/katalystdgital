import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Employee Login — Katalyst Digital" },
      { name: "description", content: "Sign in to the Katalyst staff dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setStatus("loading");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
        const { data } = await supabase.auth.getSession();
        if (data.session) navigate({ to: "/dashboard" });
        else setInfo("Account created. Check your email if confirmation is required, then sign in.");
        setStatus("done");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setInfo("If an account exists for that email, a reset link is on the way.");
        setStatus("done");
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Link to="/" className="mb-10 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
        <h1 className="font-display text-4xl tracking-tight">
          {mode === "signin" ? "Employee Login" : mode === "signup" ? "Create account" : "Reset password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Staff access to reviews & inquiries."
            : mode === "signup"
              ? "Used once to bootstrap the seeded admin email."
              : "We'll send a reset link to your email."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-base focus:border-foreground focus:outline-none"
              maxLength={255}
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-base focus:border-foreground focus:outline-none"
                maxLength={72}
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-muted-foreground">{info}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-60"
          >
            {status === "loading"
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-2 text-xs text-muted-foreground">
          {mode !== "signin" && (
            <button onClick={() => { setMode("signin"); setError(null); setInfo(null); }} className="text-left hover:text-foreground">
              ← Back to sign in
            </button>
          )}
          {mode === "signin" && (
            <>
              <button onClick={() => { setMode("forgot"); setError(null); setInfo(null); }} className="text-left hover:text-foreground">
                Forgot password?
              </button>
              <button onClick={() => { setMode("signup"); setError(null); setInfo(null); }} className="text-left hover:text-foreground">
                First-time admin? Create the seeded account →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
