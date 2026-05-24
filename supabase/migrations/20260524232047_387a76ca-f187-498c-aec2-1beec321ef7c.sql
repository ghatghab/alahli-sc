
-- Helper function: check if user has any of the given roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles app_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  )
$$;

-- ============ CMS tables: admin | editor | cms_editor ============
DROP POLICY IF EXISTS "Editors manage articles" ON public.news_articles;
CREATE POLICY "CMS editors manage articles" ON public.news_articles
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

DROP POLICY IF EXISTS "Published articles public read" ON public.news_articles;
CREATE POLICY "Published articles public read" ON public.news_articles
  FOR SELECT TO public
  USING (published = true OR public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

DROP POLICY IF EXISTS "Editors manage categories" ON public.news_categories;
CREATE POLICY "CMS editors manage categories" ON public.news_categories
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

DROP POLICY IF EXISTS "Editors manage translations" ON public.news_translations;
CREATE POLICY "CMS editors manage translations" ON public.news_translations
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

DROP POLICY IF EXISTS "Editors manage players" ON public.players;
CREATE POLICY "CMS editors manage players" ON public.players
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

DROP POLICY IF EXISTS "Players public read" ON public.players;
CREATE POLICY "Players public read" ON public.players
  FOR SELECT TO public
  USING (active OR public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

DROP POLICY IF EXISTS "Editors manage photos" ON public.photos;
CREATE POLICY "CMS editors manage photos" ON public.photos
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

-- ============ Sports tables: admin | editor | sports_editor ============
DROP POLICY IF EXISTS "Editors manage competitions" ON public.competitions;
CREATE POLICY "Sports editors manage competitions" ON public.competitions
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]));

DROP POLICY IF EXISTS "Editors manage sport teams" ON public.sport_teams;
CREATE POLICY "Sports editors manage sport teams" ON public.sport_teams
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]));

DROP POLICY IF EXISTS "Editors manage fixtures" ON public.fixtures;
CREATE POLICY "Sports editors manage fixtures" ON public.fixtures
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]));

DROP POLICY IF EXISTS "Editors manage standings" ON public.standings;
CREATE POLICY "Sports editors manage standings" ON public.standings
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','editor','sports_editor']::app_role[]));

-- ============ Sync runs: admin only (write), public read kept ============
DROP POLICY IF EXISTS "Editors manage sync runs" ON public.sync_runs;
CREATE POLICY "Admins manage sync runs" ON public.sync_runs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============ Storage buckets: align with new roles ============
-- players bucket (CMS)
DROP POLICY IF EXISTS "Editors upload players" ON storage.objects;
DROP POLICY IF EXISTS "Editors update players" ON storage.objects;
DROP POLICY IF EXISTS "Editors delete players" ON storage.objects;
CREATE POLICY "CMS editors upload players" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'players' AND public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));
CREATE POLICY "CMS editors update players" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'players' AND public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));
CREATE POLICY "CMS editors delete players" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'players' AND public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));

-- gallery bucket (CMS)
DROP POLICY IF EXISTS "Editors upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Editors update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Editors delete gallery" ON storage.objects;
CREATE POLICY "CMS editors upload gallery" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));
CREATE POLICY "CMS editors update gallery" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));
CREATE POLICY "CMS editors delete gallery" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND public.has_any_role(auth.uid(), ARRAY['admin','editor','cms_editor']::app_role[]));
