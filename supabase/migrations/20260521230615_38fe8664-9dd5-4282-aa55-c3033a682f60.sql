
-- Extensions for scheduled sync
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- =========================================================
-- CMS: players (joueurs + staff)
-- =========================================================
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT NOT NULL,
  team TEXT,
  jersey_number INT,
  name_en TEXT NOT NULL,
  name_fr TEXT,
  name_ar TEXT,
  position TEXT,
  nationality TEXT,
  date_of_birth DATE,
  photo_url TEXT,
  bio_en TEXT,
  bio_fr TEXT,
  bio_ar TEXT,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  staff_role TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_players_sport_active ON public.players(sport, active);
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players public read" ON public.players FOR SELECT USING (active OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));
CREATE POLICY "Editors manage players" ON public.players FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));
CREATE TRIGGER players_set_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- CMS: photos (galerie)
-- =========================================================
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album TEXT NOT NULL DEFAULT 'general',
  title_en TEXT,
  title_fr TEXT,
  title_ar TEXT,
  image_url TEXT NOT NULL,
  taken_at DATE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_photos_album ON public.photos(album, sort_order);
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Photos public read" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Editors manage photos" ON public.photos FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));
CREATE TRIGGER photos_set_updated_at BEFORE UPDATE ON public.photos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Sports: competitions
-- =========================================================
CREATE TABLE public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ext_id TEXT,
  sport TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_fr TEXT,
  name_ar TEXT,
  season TEXT,
  country TEXT,
  logo_url TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_competitions_ext ON public.competitions(sport, ext_id) WHERE ext_id IS NOT NULL;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Competitions public read" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Editors manage competitions" ON public.competitions FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));
CREATE TRIGGER competitions_set_updated_at BEFORE UPDATE ON public.competitions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Sports: sport_teams
-- =========================================================
CREATE TABLE public.sport_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ext_id TEXT,
  sport TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_fr TEXT,
  name_ar TEXT,
  short_name TEXT,
  logo_url TEXT,
  is_alahli BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_sport_teams_ext ON public.sport_teams(sport, ext_id) WHERE ext_id IS NOT NULL;
ALTER TABLE public.sport_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sport teams public read" ON public.sport_teams FOR SELECT USING (true);
CREATE POLICY "Editors manage sport teams" ON public.sport_teams FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));
CREATE TRIGGER sport_teams_set_updated_at BEFORE UPDATE ON public.sport_teams FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Sports: fixtures
-- =========================================================
CREATE TABLE public.fixtures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ext_id TEXT,
  sport TEXT NOT NULL,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE SET NULL,
  home_team_id UUID REFERENCES public.sport_teams(id) ON DELETE SET NULL,
  away_team_id UUID REFERENCES public.sport_teams(id) ON DELETE SET NULL,
  kickoff_at TIMESTAMPTZ NOT NULL,
  venue TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  home_score INT,
  away_score INT,
  source TEXT NOT NULL DEFAULT 'manual',
  raw JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_fixtures_ext ON public.fixtures(sport, ext_id) WHERE ext_id IS NOT NULL;
CREATE INDEX idx_fixtures_sport_date ON public.fixtures(sport, kickoff_at);
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fixtures public read" ON public.fixtures FOR SELECT USING (true);
CREATE POLICY "Editors manage fixtures" ON public.fixtures FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));
CREATE TRIGGER fixtures_set_updated_at BEFORE UPDATE ON public.fixtures FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Sports: standings
-- =========================================================
CREATE TABLE public.standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  season TEXT,
  team_id UUID NOT NULL REFERENCES public.sport_teams(id) ON DELETE CASCADE,
  rank INT NOT NULL DEFAULT 0,
  played INT NOT NULL DEFAULT 0,
  won INT NOT NULL DEFAULT 0,
  drawn INT NOT NULL DEFAULT 0,
  lost INT NOT NULL DEFAULT 0,
  goals_for INT NOT NULL DEFAULT 0,
  goals_against INT NOT NULL DEFAULT 0,
  points INT NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(competition_id, season, team_id)
);
CREATE INDEX idx_standings_comp_rank ON public.standings(competition_id, rank);
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Standings public read" ON public.standings FOR SELECT USING (true);
CREATE POLICY "Editors manage standings" ON public.standings FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));
CREATE TRIGGER standings_set_updated_at BEFORE UPDATE ON public.standings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Sync log
-- =========================================================
CREATE TABLE public.sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'sports',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  success BOOLEAN,
  items_upserted INT NOT NULL DEFAULT 0,
  error TEXT,
  details JSONB
);
CREATE INDEX idx_sync_runs_started ON public.sync_runs(started_at DESC);
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sync runs public read" ON public.sync_runs FOR SELECT USING (true);
CREATE POLICY "Editors manage sync runs" ON public.sync_runs FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));

-- =========================================================
-- Storage buckets
-- =========================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('players','players',true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery','gallery',true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Players images public read" ON storage.objects FOR SELECT USING (bucket_id = 'players');
CREATE POLICY "Editors upload players images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'players' AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)));
CREATE POLICY "Editors update players images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'players' AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)));
CREATE POLICY "Editors delete players images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'players' AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)));

CREATE POLICY "Gallery images public read" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Editors upload gallery images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)));
CREATE POLICY "Editors update gallery images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery' AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)));
CREATE POLICY "Editors delete gallery images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)));

-- =========================================================
-- Cron: hourly sports sync
-- =========================================================
SELECT cron.schedule(
  'sync-sports-data-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://vrgqdynmyybopdjfsizn.supabase.co/functions/v1/sync-sports-data',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZ3FkeW5teXlib3BkamZzaXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDY0NzMsImV4cCI6MjA5MjUyMjQ3M30.yfHmUWF7rebVsd6RCxWXJMPSgQaXbJyv_ikTCPyAYZw"}'::jsonb,
    body:='{"trigger":"cron"}'::jsonb
  );
  $$
);
