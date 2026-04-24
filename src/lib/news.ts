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
  const short = (lang || "en").slice(0, 2).toLowerCase();
  const target = (["en", "fr", "ar"].includes(short) ? short : "en") as Locale;
  return (
    translations.find(t => t.locale === target) ??
    translations.find(t => t.locale === "en") ??
    translations[0]
  );
};

export const categoryName = (cat: NewsCategoryRow | null | undefined, lang: string): string => {
  if (!cat) return "";
  const short = (lang || "en").slice(0, 2).toLowerCase();
  if (short === "fr") return cat.name_fr;
  if (short === "ar") return cat.name_ar;
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

export const timeAgo = (iso: string | null, lang: string): string => {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.max(1, Math.floor(diffMs / 1000));
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const mo = Math.floor(day / 30);
  const yr = Math.floor(day / 365);

  const short = (lang || "en").slice(0, 2).toLowerCase();
  const L = (short === "fr" ? "fr" : short === "ar" ? "ar" : "en") as "fr" | "ar" | "en";
  const dict = {
    fr: { now: "à l'instant", m: (n: number) => `il y a ${n} min`, h: (n: number) => `il y a ${n} h`, d: (n: number) => `il y a ${n} j`, mo: (n: number) => `il y a ${n} mois`, y: (n: number) => `il y a ${n} an${n > 1 ? "s" : ""}` },
    en: { now: "just now", m: (n: number) => `${n}m ago`, h: (n: number) => `${n}h ago`, d: (n: number) => `${n}d ago`, mo: (n: number) => `${n}mo ago`, y: (n: number) => `${n}y ago` },
    ar: { now: "الآن", m: (n: number) => `منذ ${n} د`, h: (n: number) => `منذ ${n} س`, d: (n: number) => `منذ ${n} يوم`, mo: (n: number) => `منذ ${n} شهر`, y: (n: number) => `منذ ${n} سنة` },
  }[L];

  if (yr >= 1) return dict.y(yr);
  if (mo >= 1) return dict.mo(mo);
  if (day >= 1) return dict.d(day);
  if (hr >= 1) return dict.h(hr);
  if (min >= 1) return dict.m(min);
  return dict.now;
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