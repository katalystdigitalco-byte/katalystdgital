import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Katalyst" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setStatus("idle");
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Link to="/" className="mb-10 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
        <h1 className="font-display text-4xl tracking-tight">Set a new password</h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">New password</label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-base focus:border-foreground focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-60"
          >
            {status === "loading" ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
