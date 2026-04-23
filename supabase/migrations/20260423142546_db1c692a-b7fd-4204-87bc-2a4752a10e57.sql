CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users view their roles" ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.news_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  color TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.news_categories FOR SELECT USING (true);
CREATE POLICY "Editors manage categories" ON public.news_categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.news_categories(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  cover_image_path TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_news_articles_pub ON public.news_articles (published, published_at DESC);
CREATE INDEX idx_news_articles_published_at ON public.news_articles (published_at DESC);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles public read" ON public.news_articles FOR SELECT
USING (published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Editors manage articles" ON public.news_articles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TABLE public.news_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'fr', 'ar')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (article_id, locale)
);
ALTER TABLE public.news_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Translations public read" ON public.news_translations FOR SELECT USING (true);
CREATE POLICY "Editors manage translations" ON public.news_translations FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_news_articles_updated BEFORE UPDATE ON public.news_articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_news_translations_updated BEFORE UPDATE ON public.news_translations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "News images public read" ON storage.objects FOR SELECT USING (bucket_id = 'news-images');
CREATE POLICY "Editors upload news images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'news-images' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));
CREATE POLICY "Editors update news images" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'news-images' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));
CREATE POLICY "Editors delete news images" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'news-images' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

INSERT INTO public.news_categories (slug, name_en, name_fr, name_ar, sort_order) VALUES
('club', 'Club', 'Club', 'النادي', 1),
('football', 'Football', 'Football', 'كرة القدم', 2),
('basketball', 'Basketball', 'Basketball', 'كرة السلة', 3),
('handball', 'Handball', 'Handball', 'كرة اليد', 4),
('volleyball', 'Volleyball', 'Volleyball', 'الكرة الطائرة', 5),
('academy', 'Academy', 'Académie', 'الأكاديمية', 6),
('fans', 'Fans', 'Supporters', 'المشجعون', 7);