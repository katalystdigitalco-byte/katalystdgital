import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { Loader2 } from "lucide-react";
import { submitInquiry } from "@/lib/contact.functions";

type Errors = Partial<Record<"name" | "email" | "phone" | "company" | "project", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;

export function Contact() {
  const send = useServerFn(submitInquiry);
  const [values, setValues] = useState({ name: "", email: "", phone: "", company: "", project: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();
    const company = values.company.trim();
    const project = values.project.trim();
    if (!name) e.name = "Please share your name.";
    else if (name.length > 100) e.name = "Keep it under 100 characters.";
    if (!email) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email) || email.length > 255) e.email = "That email looks off.";
    if (phone && !PHONE_RE.test(phone)) e.phone = "That number looks off.";
    if (company.length > 120) e.company = "Keep it under 120 characters.";
    if (!project) e.project = "Tell us a bit about the project.";
    else if (project.length < 10) e.project = "A little more context, please (10+ chars).";
    else if (project.length > 2000) e.project = "Let's keep it under 2000 characters.";
    return e;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setStatus("sending");
    try {
      await send({
        data: {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          company: values.company.trim(),
          project: values.project.trim(),
        },
      });
      setStatus("sent");
    } catch (err) {
      console.error("inquiry failed", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden pt-32 pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_oklch(0.78_0.14_240)/0.15,_transparent_60%)]" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <h2 className="font-display text-[clamp(2.75rem,10vw,10rem)] font-medium leading-[0.9] tracking-tighter">
            <span data-cursor="text" className="block">Let's build</span>
            <span data-cursor="text" className="block italic text-muted-foreground">something together.</span>
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-16 md:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="space-y-10">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</div>
                <a href="mailto:hello@katalyst.digital" data-cursor="link" className="mt-3 block font-display text-2xl md:text-3xl">
                  hello@katalystdigital.co.in
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Studio</div>
                <p className="mt-3 font-display text-2xl md:text-3xl">Delhi · Chandigarh · Remote</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Follow</div>
                <div className="mt-4 flex gap-4">
                  {["Instagram", "LinkedIn", "Twitter", "Dribbble"].map((s) => (
                    <a key={s} href="#" data-cursor="link" className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground hover:text-background">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-card/40 p-8 backdrop-blur-xl md:p-10">
              {status === "sent" ? (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="font-display text-3xl">Thanks, {values.name.split(" ")[0] || "friend"} — we'll reply within 24h.</div>
                  <p className="mt-3 text-sm text-muted-foreground">Your inquiry is in our queue.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setValues({ name: "", email: "", phone: "", company: "", project: "" });
                      setErrors({});
                      setStatus("idle");
                    }}
                    data-cursor="link"
                    className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Name" name="name" placeholder="Jane Doe" value={values.name} onChange={set("name")} error={errors.name} />
                    <Field label="Email" name="email" type="email" placeholder="jane@company.com" value={values.email} onChange={set("email")} error={errors.email} />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Mobile number" name="phone" type="tel" placeholder="+91 9999999999" value={values.phone} onChange={set("phone")} error={errors.phone} />
                    <Field label="Company" name="company" placeholder="Katalyst Digital" value={values.company} onChange={set("company")} error={errors.company} />
                  </div>
                  <div>
                    <label htmlFor="project" className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Project</label>
                    <textarea
                      id="project"
                      rows={4}
                      maxLength={2000}
                      value={values.project}
                      onChange={set("project")}
                      placeholder="Tell us what you're building…"
                      data-cursor="text"
                      aria-invalid={!!errors.project}
                      className={[
                        "mt-3 w-full resize-none border-0 border-b bg-transparent pb-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none",
                        errors.project ? "border-destructive focus:border-destructive" : "border-border focus:border-foreground",
                      ].join(" ")}
                    />
                    {errors.project && <p className="mt-2 text-xs text-destructive">{errors.project}</p>}
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-destructive">Something went wrong. Try again in a moment.</p>
                  )}

                  <Magnetic strength={0.25}>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      data-cursor="view"
                      data-cursor-label="Send"
                      className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background transition-opacity disabled:opacity-60"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send inquiry
                          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </>
                      )}
                    </button>
                  </Magnetic>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", placeholder, value, onChange, error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        maxLength={type === "email" ? 255 : 120}
        placeholder={placeholder}
        data-cursor="text"
        aria-invalid={!!error}
        className={[
          "mt-3 w-full border-0 border-b bg-transparent pb-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none",
          error ? "border-destructive focus:border-destructive" : "border-border focus:border-foreground",
        ].join(" ")}
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
