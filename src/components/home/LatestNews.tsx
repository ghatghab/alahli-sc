import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import stadium from "@/assets/stadium-aerial.jpg";
import training from "@/assets/training.jpg";
import basket from "@/assets/basketball.jpg";

const items = [
  { img: stadium, cat: "Club", titleKey: "news.item1", date: "Apr 22, 2026" },
  { img: training, cat: "Football", titleKey: "news.item2", date: "Apr 20, 2026" },
  { img: basket, cat: "Basketball", titleKey: "news.item3", date: "Apr 18, 2026" },
];

const titles: Record<string, Record<string, string>> = {
  en: {
    "news.item1": "A new era begins at Tripoli International Stadium",
    "news.item2": "First team intensifies preparation ahead of decisive week",
    "news.item3": "Basketball squad climbs to second place in the league",
  },
  fr: {
    "news.item1": "Une nouvelle ère commence au Stade International de Tripoli",
    "news.item2": "L'équipe première intensifie sa préparation avant une semaine décisive",
    "news.item3": "Les basketteurs prennent la 2ᵉ place du championnat",
  },
  ar: {
    "news.item1": "حقبة جديدة تبدأ في ملعب طرابلس الدولي",
    "news.item2": "الفريق الأول يكثّف تحضيراته قبل أسبوع حاسم",
    "news.item3": "فريق السلة يصعد إلى المركز الثاني في الدوري",
  },
};

export const LatestNews = () => {
  const { t, i18n } = useTranslation();
  const lang = (titles[i18n.language] ? i18n.language : "en") as keyof typeof titles;
  return (
    <section className="container-club py-20 lg:py-28">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("nav.news")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-2">{t("sections.latestNews")}</h2>
          <p className="text-muted-foreground mt-2">{t("sections.latestNewsSub")}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/news">{t("sections.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it, idx) => (
          <article
            key={idx}
            className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={it.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-smooth group-hover:scale-110"
              />
            </div>
            <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
              <span className="px-3 py-1 rounded-full bg-gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-wider">
                {it.cat}
              </span>
            </div>
            <div className="p-5">
              <div className="text-xs text-muted-foreground">{it.date}</div>
              <h3 className="font-display text-lg font-bold mt-2 leading-tight group-hover:text-accent transition-smooth">
                {titles[lang][it.titleKey]}
              </h3>
              <Link to="/news" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                {t("sections.cta")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};