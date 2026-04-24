import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

type SeoProps = {
  /** i18n key under `seo.*` (e.g. "home", "club", "news"). */
  pageKey: string;
  /** Optional override of the rendered title. */
  title?: string;
  /** Optional override of the rendered description. */
  description?: string;
  /** Optional canonical/og image URL. */
  image?: string;
  /** Optional override of og:type (defaults to "website"). */
  type?: string;
};

const upsertMeta = (
  selector: string,
  attr: "name" | "property",
  key: string,
  content: string,
) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Localized SEO/OG/Twitter/JSON-LD updater. Mounts once per page,
 * reflects the current i18n language and route into <head>.
 */
export const Seo = ({ pageKey, title, description, image, type = "website" }: SeoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const lang = i18n.language || "en";
    const dir = i18n.dir();
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", dir);

    const resolvedTitle =
      title ?? (t(`seo.${pageKey}.title`) as string) ?? (t("seo.titleSuffix") as string);
    const resolvedDesc =
      description ?? (t(`seo.${pageKey}.description`) as string) ?? "";
    const siteName = t("seo.siteName") as string;
    const url = typeof window !== "undefined" ? window.location.origin + pathname : pathname;

    document.title = resolvedTitle;

    upsertMeta('meta[name="description"]', "name", "description", resolvedDesc);
    upsertMeta('meta[property="og:title"]', "property", "og:title", resolvedTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", resolvedDesc);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", siteName);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta(
      'meta[property="og:locale"]',
      "property",
      "og:locale",
      lang === "ar" ? "ar_LY" : lang === "fr" ? "fr_FR" : "en_US",
    );
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", resolvedTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", resolvedDesc);
    if (image) {
      upsertMeta('meta[property="og:image"]', "property", "og:image", image);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }

    upsertLink("canonical", url);
    upsertLink("alternate", url, "en");
    upsertLink("alternate", url, "fr");
    upsertLink("alternate", url, "ar");
    upsertLink("alternate", url, "x-default");
  }, [pageKey, title, description, image, type, t, i18n.language, pathname]);

  return null;
};

export default Seo;