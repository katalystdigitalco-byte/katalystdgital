import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: any) => r.role);
  if (!roles.includes("admin") && !roles.includes("employee")) {
    throw new Error("Forbidden");
  }
}

const ServiceSchema = z.object({
  id: z.string().uuid().optional(),
  number_label: z.string().trim().max(8).default("01"),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(2000),
  points: z.array(z.string().trim().min(1).max(160)).max(10).default([]),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

const PackageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(280).default(""),
  price: z.string().trim().min(1).max(40),
  cadence: z.string().trim().max(40).default(""),
  features: z.array(z.string().trim().min(1).max(160)).max(15).default([]),
  cta: z.string().trim().min(1).max(40).default("Get in touch"),
  featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

const CaseStudySchema = z.object({
  id: z.string().uuid().optional(),
  tag: z.string().trim().max(40).default(""),
  title: z.string().trim().min(1).max(160),
  meta: z.string().trim().max(200).default(""),
  summary: z.string().trim().max(600).default(""),
  body: z.string().trim().max(8000).default(""),
  image_url: z.string().trim().max(500).optional().nullable(),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

const IdSchema = z.object({ id: z.string().uuid() });

function tableFns<T extends z.ZodTypeAny>(
  table: "services" | "packages" | "case_studies",
  schema: T,
) {
  const list = createServerFn({ method: "GET" }).handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

  const upsert = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((d: unknown) => schema.parse(d))
    .handler(async ({ data, context }) => {
      await assertStaff(context);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const payload = data as any;
      if (payload.id) {
        const { id, ...rest } = payload;
        const { error } = await supabaseAdmin.from(table).update(rest).eq("id", id);
        if (error) throw new Error(error.message);
        return { ok: true as const, id };
      } else {
        const { id: _omit, ...rest } = payload;
        const { data: created, error } = await supabaseAdmin
          .from(table)
          .insert(rest)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        return { ok: true as const, id: created.id };
      }
    });

  const remove = createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .validator((d: unknown) => IdSchema.parse(d))
    .handler(async ({ data, context }) => {
      await assertStaff(context);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from(table).delete().eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true as const };
    });

  return { list, upsert, remove };
}

export const servicesFns = tableFns("services", ServiceSchema);
export const packagesFns = tableFns("packages", PackageSchema);
export const caseStudiesFns = tableFns("case_studies", CaseStudySchema);

export const listServices = servicesFns.list;
export const upsertService = servicesFns.upsert;
export const deleteService = servicesFns.remove;

export const listPackages = packagesFns.list;
export const upsertPackage = packagesFns.upsert;
export const deletePackage = packagesFns.remove;

export const listCaseStudies = caseStudiesFns.list;
export const upsertCaseStudy = caseStudiesFns.upsert;
export const deleteCaseStudy = caseStudiesFns.remove;