import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

  useEffect(() => {
    (async () => {
      const { count: total } = await supabase.from("news_articles").select("*", { count: "exact", head: true });
      const { count: published } = await supabase.from("news_articles").select("*", { count: "exact", head: true }).eq("published", true);
      setStats({ total: total ?? 0, published: published ?? 0, drafts: (total ?? 0) - (published ?? 0) });
    })();
  }, []);

  const cards = [
    { label: t("admin.totalArticles"), value: stats.total, icon: FileText, color: "text-accent" },
    { label: t("admin.published"), value: stats.published, icon: CheckCircle2, color: "text-emerald-500" },
    { label: t("admin.drafts"), value: stats.drafts, icon: Clock, color: "text-amber-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">{t("admin.dashboard")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("admin.dashboardSub")}</p>
        </div>
        <Button asChild variant="gold">
          <Link to="/admin/articles/new">+ {t("admin.newArticle")}</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(c => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <c.icon className={`h-6 w-6 ${c.color}`} />
            <div className="text-3xl font-bold mt-3">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;