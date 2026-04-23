export type Locale = "en" | "fr" | "ar";

export interface NewsArticleRow {
  id: string;
  slug: string;
  category_id: string | null;
  cover_image_url: string | null;
  cover_image_path: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsTranslationRow {
  id: string;
  article_id: string;
  locale: Locale;
  title: string;
  excerpt: string | null;
  content: string | null;
}

export interface NewsCategoryRow {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
  color: string | null;
  sort_order: number;
}

export const pickTranslation = (
  translations: NewsTranslationRow[] | undefined | null,
  lang: string
): NewsTranslationRow | null => {
  if (!translations || translations.length === 0) return null;
  const target = (["en", "fr", "ar"].includes(lang) ? lang : "en") as Locale;
  return (
    translations.find(t => t.locale === target) ??
    translations.find(t => t.locale === "en") ??
    translations[0]
  );
};

export const categoryName = (cat: NewsCategoryRow | null | undefined, lang: string): string => {
  if (!cat) return "";
  if (lang === "fr") return cat.name_fr;
  if (lang === "ar") return cat.name_ar;
  return cat.name_en;
};

export const formatDate = (iso: string | null, lang: string): string => {
  if (!iso) return "";
  const locale = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-LY" : "en-US";
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const slugify = (text: string): string =>
  text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || `article-${Date.now()}`;