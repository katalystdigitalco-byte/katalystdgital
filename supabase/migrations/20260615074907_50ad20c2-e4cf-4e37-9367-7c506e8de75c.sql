
-- Reusable timestamp trigger already exists (touch_updated_at)

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number_label text NOT NULL DEFAULT '01',
  title text NOT NULL,
  description text NOT NULL,
  points text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff writes services" ON public.services FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- PACKAGES
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  price text NOT NULL,
  cadence text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  cta text NOT NULL DEFAULT 'Get in touch',
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads packages" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff writes packages" ON public.packages FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CASE STUDIES
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL DEFAULT '',
  title text NOT NULL,
  meta text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads case_studies" ON public.case_studies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff writes case_studies" ON public.case_studies FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_case_studies_updated BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed initial content matching the current static site
INSERT INTO public.services (number_label, title, description, points, sort_order) VALUES
('01','E-Commerce & Retail Scale','End-to-end commerce management — storefronts, ops, conversion engineering, and growth systems that compound month over month.',ARRAY['Shopify / Headless builds','Catalog & ops automation','CRO & retention loops'],1),
('02','Custom IT Systems & Web Dev','Production-grade applications, internal platforms, and modern architectures designed for resilience, speed, and scale.',ARRAY['SaaS & internal tools','Cloud-native platforms','AI-augmented workflows'],2),
('03','Digital Marketing & Social Growth','Brand systems, performance media, and the social engine that turns attention into pipeline and pipeline into revenue.',ARRAY['Brand & identity systems','Paid & lifecycle media','Content & social ops'],3);

INSERT INTO public.packages (name, tagline, price, cadence, features, cta, featured, sort_order) VALUES
('Launch','For founders shipping their first serious product.','$2.4k','/ project',ARRAY['Brand identity essentials','5-page responsive site','Basic SEO + analytics','2 weeks of polish'],'Start small',false,1),
('Scale','Our most-picked engagement for growing teams.','$8.9k','/ project',ARRAY['Full brand + design system','Custom web app or storefront','CMS, integrations, dashboards','Performance + SEO suite','6 weeks of dedicated build'],'Build with us',true,2),
('Engineered','Bespoke IT systems & long-term partnership.','Custom','from $18k',ARRAY['Discovery + product strategy','Multi-platform engineering','Cloud / DevOps / AI integrations','Quarterly roadmap & retainer'],'Talk to engineering',false,3);

INSERT INTO public.case_studies (tag, title, meta, summary, sort_order) VALUES
('Commerce','Lumen Apparel','Headless Shopify · +218% AOV','A full headless rebuild that lifted AOV 218% and doubled returning-customer rate in two quarters.',1),
('Platform','Northwind OS','Internal SaaS · 14 teams','Internal operations platform unifying 14 teams onto a single workflow and analytics surface.',2),
('Brand','Halo Robotics','Identity & launch site','Brand identity and launch site for a robotics company entering the consumer market.',3),
('Growth','Cinder Studio','Paid + lifecycle · 6.4× ROAS','Performance and lifecycle program delivering 6.4× ROAS within the first 90 days.',4);
