import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitReview } from "@/lib/reviews.functions";

export function WriteReview() {
  const [open, setOpen] = useState(false);
  const send = useServerFn(submitReview);
  const [values, setValues] = useState({ name: "", role_title: "", quote: "", rating: 5 });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (values.quote.trim().length < 10) {
      setErr("Please share at least 10 characters.");
      return;
    }
    setStatus("sending");
    try {
      await send({
        data: {
          name: values.name.trim(),
          role_title: values.role_title.trim(),
          quote: values.quote.trim(),
          rating: values.rating,
        },
      });
      setStatus("sent");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to submit");
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setStatus("idle"); setErr(null); }}
        data-cursor="link"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm backdrop-blur-md transition-colors hover:bg-foreground hover:text-background"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Write a Review
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-background/80 p-4 backdrop-blur-md" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl">Share your experience</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">Reviews appear after admin approval</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {status === "sent" ? (
              <div className="py-12 text-center">
                <div className="font-display text-2xl">Thanks!</div>
                <p className="mt-2 text-sm text-muted-foreground">Your review is in review.</p>
                <button onClick={() => setOpen(false)} className="mt-6 rounded-full bg-foreground px-5 py-2 text-sm text-background">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-5">
                <Input label="Name" value={values.name} onChange={(v) => setValues((s) => ({ ...s, name: v }))} required maxLength={100} />
                <Input label="Role / Company" value={values.role_title} onChange={(v) => setValues((s) => ({ ...s, role_title: v }))} maxLength={120} placeholder="VP Growth, Acme Inc." />
                <div>
                  <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Rating</label>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setValues((s) => ({ ...s, rating: n }))}
                        className={`text-2xl transition-colors ${n <= values.rating ? "text-accent" : "text-muted-foreground/40"}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Review</label>
                  <textarea required rows={4} minLength={10} maxLength={1000}
                    value={values.quote}
                    onChange={(e) => setValues((s) => ({ ...s, quote: e.target.value }))}
                    placeholder="What was working with Katalyst like?"
                    className="mt-2 w-full resize-none rounded-md border border-border bg-transparent p-3 text-sm focus:border-foreground focus:outline-none" />
                </div>
                {err && <p className="text-sm text-destructive">{err}</p>}
                <button type="submit" disabled={status === "sending"} className="w-full rounded-full bg-foreground px-6 py-3 text-sm text-background disabled:opacity-60">
                  {status === "sending" ? "Submitting…" : "Submit review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Input({ label, value, onChange, required, maxLength, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; maxLength?: number; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <input type={type} required={required} maxLength={maxLength} placeholder={placeholder}
        value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-base focus:border-foreground focus:outline-none" />
    </div>
  );
}
