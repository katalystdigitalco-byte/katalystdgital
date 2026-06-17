import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Cursor } from "@/components/Cursor";
import { supabase } from "@/integrations/supabase/client";
import { listAllReviews, updateReviewStatus, deleteReview } from "@/lib/reviews.functions";
import { listContacts } from "@/lib/contact.functions";
import { getMyRoles, createEmployee, listStaff } from "@/lib/admin.functions";
import {
  listServices, upsertService, deleteService,
  listPackages, upsertPackage, deletePackage,
  listCaseStudies, upsertCaseStudy, deleteCaseStudy,
} from "@/lib/cms.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Staff Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const myRoles = useServerFn(getMyRoles);
  const reviewsFn = useServerFn(listAllReviews);
  const contactsFn = useServerFn(listContacts);
  const staffFn = useServerFn(listStaff);
  const updateStatus = useServerFn(updateReviewStatus);
  const removeReview = useServerFn(deleteReview);
  const addEmployee = useServerFn(createEmployee);

  const rolesQ = useQuery({ queryKey: ["my-roles"], queryFn: () => myRoles() });
  const isAdmin = rolesQ.data?.roles.includes("admin") ?? false;
  const isStaff = isAdmin || (rolesQ.data?.roles.includes("employee") ?? false);

  const reviewsQ = useQuery({
    queryKey: ["all-reviews"], queryFn: () => reviewsFn(), enabled: isStaff,
  });
  const contactsQ = useQuery({
    queryKey: ["all-contacts"], queryFn: () => contactsFn(), enabled: isStaff,
  });
  const staffQ = useQuery({
    queryKey: ["staff"], queryFn: () => staffFn(), enabled: isAdmin,
  });

  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: "approved" | "rejected" | "pending" }) =>
      updateStatus({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-reviews"] });
      qc.invalidateQueries({ queryKey: ["approved-reviews"] });
    },
  });
  const del = useMutation({
    mutationFn: (id: string) => removeReview({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-reviews"] });
      qc.invalidateQueries({ queryKey: ["approved-reviews"] });
    },
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (rolesQ.isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isStaff) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl">No staff access</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account isn't assigned an admin or employee role. Ask the admin to create your account.
          </p>
          <button onClick={signOut} className="mt-6 rounded-full border border-border px-5 py-2 text-sm hover:bg-foreground hover:text-background">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Cursor />
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {isAdmin ? "Admin" : "Employee"} dashboard
            </div>
            <h1 className="mt-3 font-display text-4xl tracking-tight">Katalyst Staff</h1>
          </div>
          <div className="flex gap-2">
            <a href="/" data-cursor="link" className="rounded-full border border-border px-4 py-2 text-sm hover:bg-foreground hover:text-background">View site</a>
            <button onClick={signOut} data-cursor="link" className="rounded-full border border-border px-4 py-2 text-sm hover:bg-foreground hover:text-background">
              Sign out
            </button>
          </div>
        </header>

        {isAdmin && <CreateEmployeeForm addEmployee={addEmployee} onCreated={() => { qc.invalidateQueries({ queryKey: ["staff"] }); }} />}

        {isAdmin && (
          <Section title="Staff" subtitle="Admins & employees with access">
            {staffQ.isLoading ? <Empty>Loading…</Empty> : staffQ.data?.staff.length === 0 ? (
              <Empty>No staff yet.</Empty>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr><th className="p-3">Email</th><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Added</th></tr>
                  </thead>
                  <tbody>
                    {staffQ.data?.staff.map((s) => (
                      <tr key={s.user_id + s.role} className="border-t border-border">
                        <td className="p-3">{s.email}</td>
                        <td className="p-3">{s.display_name || "—"}</td>
                        <td className="p-3"><Pill>{s.role}</Pill></td>
                        <td className="p-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}

        <Section title="Reviews" subtitle={isAdmin ? "Approve, reject or delete submissions" : "All submitted reviews"}>
          {reviewsQ.isLoading ? <Empty>Loading…</Empty> : reviewsQ.data?.reviews.length === 0 ? (
            <Empty>No reviews yet.</Empty>
          ) : (
            <div className="grid gap-4">
              {reviewsQ.data?.reviews.map((r: any) => (
                <article key={r.id} className="rounded-xl border border-border bg-card/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-lg">{r.name}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{r.role_title || "—"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-accent">{"★".repeat(r.rating)}</span>
                      <Pill tone={r.status === "approved" ? "good" : r.status === "rejected" ? "bad" : "neutral"}>{r.status}</Pill>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">"{r.quote}"</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>{new Date(r.created_at).toLocaleString()}</span>
                    {isAdmin && (
                      <div className="flex gap-2">
                        {r.status !== "approved" && (
                          <button onClick={() => setStatus.mutate({ id: r.id, status: "approved" })} className="rounded-full border border-border px-3 py-1 hover:bg-foreground hover:text-background">Approve</button>
                        )}
                        {r.status !== "rejected" && (
                          <button onClick={() => setStatus.mutate({ id: r.id, status: "rejected" })} className="rounded-full border border-border px-3 py-1 hover:bg-foreground hover:text-background">Reject</button>
                        )}
                        <button onClick={() => { if (confirm("Delete this review?")) del.mutate(r.id); }} className="rounded-full border border-destructive/40 px-3 py-1 text-destructive hover:bg-destructive hover:text-destructive-foreground">Delete</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>

        <CmsSection
          title="Services"
          subtitle="Capabilities shown on the homepage"
          queryKey="cms-services"
          publicQueryKey="public-services"
          listFn={listServices}
          upsertFn={upsertService}
          deleteFn={deleteService}
          fields={[
            { key: "number_label", label: "Number", placeholder: "01" },
            { key: "title", label: "Title", placeholder: "Service title" },
            { key: "description", label: "Description", textarea: true },
            { key: "points", label: "Bullet points (one per line)", textarea: true, list: true },
            { key: "sort_order", label: "Order", number: true },
          ]}
          empty={() => ({ number_label: "01", title: "", description: "", points: [], sort_order: 0 })}
          summary={(r) => `${r.number_label} · ${r.title}`}
        />

        <CmsSection
          title="Packages"
          subtitle="Pricing tiers shown on the homepage"
          queryKey="cms-packages"
          publicQueryKey="public-packages"
          listFn={listPackages}
          upsertFn={upsertPackage}
          deleteFn={deletePackage}
          fields={[
            { key: "name", label: "Name" },
            { key: "tagline", label: "Tagline" },
            { key: "price", label: "Price", placeholder: "$2.4k" },
            { key: "cadence", label: "Cadence", placeholder: "/ project" },
            { key: "features", label: "Features (one per line)", textarea: true, list: true },
            { key: "cta", label: "CTA label" },
            { key: "featured", label: "Featured (true/false)", boolean: true },
            { key: "sort_order", label: "Order", number: true },
          ]}
          empty={() => ({ name: "", tagline: "", price: "", cadence: "", features: [], cta: "Get in touch", featured: false, sort_order: 0 })}
          summary={(r) => `${r.name} — ${r.price}${r.featured ? " · ★" : ""}`}
        />

        <CmsSection
          title="Case studies"
          subtitle="Shown on the homepage and /case-studies page"
          queryKey="cms-case-studies"
          publicQueryKey="public-case-studies-all"
          extraInvalidate={["public-case-studies-preview"]}
          listFn={listCaseStudies}
          upsertFn={upsertCaseStudy}
          deleteFn={deleteCaseStudy}
          fields={[
            { key: "tag", label: "Tag", placeholder: "Commerce" },
            { key: "title", label: "Title" },
            { key: "meta", label: "Meta line", placeholder: "Headless Shopify · +218% AOV" },
            { key: "summary", label: "Summary", textarea: true },
            { key: "body", label: "Body", textarea: true },
            { key: "image_url", label: "Image URL (optional)" },
            { key: "sort_order", label: "Order", number: true },
          ]}
          empty={() => ({ tag: "", title: "", meta: "", summary: "", body: "", image_url: "", sort_order: 0 })}
          summary={(r) => `${r.tag} · ${r.title}`}
        />

        <Section title="Contact form submissions" subtitle="Inquiries from the public site">
          {contactsQ.isLoading ? <Empty>Loading…</Empty> : contactsQ.data?.contacts.length === 0 ? (
            <Empty>No inquiries yet.</Empty>
          ) : (
            <div className="grid gap-4">
              {contactsQ.data?.contacts.map((c: any) => (
                <article key={c.id} className="rounded-xl border border-border bg-card/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-lg">{c.name}</div>
                      <a href={`mailto:${c.email}`} className="text-sm text-muted-foreground hover:text-foreground">{c.email}</a>
                      {c.company && <div className="text-xs text-muted-foreground">{c.company}</div>}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{c.project}</p>
                </article>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <div className="mb-5">
        <h2 className="font-display text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{children}</div>;
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "good" | "bad" | "neutral" }) {
  const cls =
    tone === "good"
      ? "border-accent/40 text-accent"
      : tone === "bad"
        ? "border-destructive/40 text-destructive"
        : "border-border text-muted-foreground";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${cls}`}>{children}</span>;
}

type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  list?: boolean;
  number?: boolean;
  boolean?: boolean;
};

function CmsSection({
  title, subtitle, queryKey, publicQueryKey, extraInvalidate, listFn, upsertFn, deleteFn, fields, empty, summary,
}: {
  title: string;
  subtitle?: string;
  queryKey: string;
  publicQueryKey: string;
  extraInvalidate?: string[];
  listFn: any;
  upsertFn: any;
  deleteFn: any;
  fields: FieldDef[];
  empty: () => any;
  summary: (row: any) => string;
}) {
  const qc = useQueryClient();
  const list = useServerFn(listFn);
  const upsert = useServerFn(upsertFn);
  const del = useServerFn(deleteFn);
  const q = useQuery({ queryKey: [queryKey], queryFn: () => list() });
  const [editing, setEditing] = useState<any | null>(null);

  const invalidatePublic = () => {
    qc.invalidateQueries({ queryKey: [publicQueryKey] });
    (extraInvalidate ?? []).forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  };

  const save = useMutation({
    mutationFn: (data: any) => upsert({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      invalidatePublic();
      setEditing(null);
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      invalidatePublic();
    },
  });

  return (
    <Section title={title} subtitle={subtitle}>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setEditing(empty())}
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-foreground hover:text-background"
        >
          + Add new
        </button>
      </div>

      {editing && (
        <EditorForm
          fields={fields}
          value={editing}
          saving={save.isPending}
          error={save.error ? String((save.error as any)?.message ?? save.error) : null}
          onCancel={() => setEditing(null)}
          onSubmit={(v) => save.mutate(v)}
        />
      )}

      {q.isLoading ? <Empty>Loading…</Empty> : (q.data?.items ?? []).length === 0 ? (
        <Empty>None yet.</Empty>
      ) : (
        <div className="grid gap-3">
          {q.data!.items.map((row: any) => (
            <div key={row.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/40 p-4">
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-base">{summary(row)}</div>
                <div className="text-xs text-muted-foreground">order {row.sort_order ?? 0}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing({ ...row })}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:bg-foreground hover:text-background"
                >Edit</button>
                <button
                  onClick={() => { if (confirm("Delete this item?")) remove.mutate(row.id); }}
                  className="rounded-full border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function EditorForm({
  fields, value, saving, error, onCancel, onSubmit,
}: {
  fields: FieldDef[];
  value: any;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (v: any) => void;
}) {
  const [draft, setDraft] = useState<any>(value);

  useEffect(() => { setDraft(value); }, [value]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const payload: any = { ...draft };
    fields.forEach((f) => {
      if (f.list && typeof payload[f.key] === "string") {
        payload[f.key] = payload[f.key].split("\n").map((s: string) => s.trim()).filter(Boolean);
      }
      if (f.number) payload[f.key] = Number(payload[f.key]) || 0;
      if (f.boolean) payload[f.key] = payload[f.key] === true || payload[f.key] === "true";
      if (f.key === "image_url" && payload[f.key] === "") payload[f.key] = null;
    });
    onSubmit(payload);
  };

  const set = (k: string, v: any) => setDraft((d: any) => ({ ...d, [k]: v }));

  return (
    <form onSubmit={submit} className="mb-6 grid gap-4 rounded-2xl border border-foreground/20 bg-card/60 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => {
          const raw = draft[f.key];
          const value = f.list && Array.isArray(raw) ? raw.join("\n") : (raw ?? "");
          if (f.textarea) {
            return (
              <label key={f.key} className="md:col-span-2 grid gap-1 text-xs uppercase tracking-wider text-muted-foreground">
                {f.label}
                <textarea
                  value={value}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.list ? 4 : 5}
                  className="rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </label>
            );
          }
          if (f.boolean) {
            return (
              <label key={f.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!raw}
                  onChange={(e) => set(f.key, e.target.checked)}
                />
                {f.label}
              </label>
            );
          }
          return (
            <label key={f.key} className="grid gap-1 text-xs uppercase tracking-wider text-muted-foreground">
              {f.label}
              <input
                type={f.number ? "number" : "text"}
                value={value}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none"
              />
            </label>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-destructive">{error}</div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-full bg-foreground px-5 py-2 text-sm text-background disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}

function CreateEmployeeForm({
  addEmployee,
  onCreated,
}: {
  addEmployee: ReturnType<typeof useServerFn<typeof createEmployee>>;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    setErr(null);
    try {
      await addEmployee({ data: { email, password, display_name: name } });
      setMsg(`Created employee ${email}`);
      setEmail(""); setPassword(""); setName("");
      onCreated();
    } catch (e: any) {
      setErr(e?.message ?? "Could not create employee");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="mt-12 rounded-2xl border border-border bg-card/40 p-6 md:p-8">
      <h2 className="font-display text-xl">Create employee account</h2>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin only · employees sign in via Employee Login</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-3">
        <input required type="email" placeholder="email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
          className="rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
        <input required type="text" placeholder="Display name (optional)" value={name} onChange={(e) => setName(e.target.value)} maxLength={120}
          className="rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
        <input required type="password" minLength={8} maxLength={72} placeholder="Password (≥ 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
        <div className="md:col-span-3 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={status === "loading"} className="rounded-full bg-foreground px-5 py-2 text-sm text-background disabled:opacity-60">
            {status === "loading" ? "Creating…" : "Create employee"}
          </button>
          {msg && <span className="text-xs text-accent">{msg}</span>}
          {err && <span className="text-xs text-destructive">{err}</span>}
        </div>
      </form>
    </section>
  );
}
