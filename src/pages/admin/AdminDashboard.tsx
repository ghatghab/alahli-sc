import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FileText, CheckCircle2, Clock, Users, Image as ImageIcon,
  Shield, Trophy, CalendarDays, ListOrdered, RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total: 0, published: 0, drafts: 0,
    players: 0, photos: 0, teams: 0, competitions: 0, fixtures: 0, standings: 0,
    lastSync: null as string | null,
  });

  useEffect(() => {
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [a, p, pl, ph, tm, cp, fx, st, sy] = await Promise.all([
        supabase.from("news_articles").select("*", head),
        supabase.from("news_articles").select("*", head).eq("published", true),
        supabase.from("players").select("*", head),
        supabase.from("photos").select("*", head),
        supabase.from("sport_teams").select("*", head),
        supabase.from("competitions").select("*", head),
        supabase.from("fixtures").select("*", head),
        supabase.from("standings").select("*", head),
        supabase.from("sync_runs").select("started_at").order("started_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      setStats({
        total: a.count ?? 0,
        published: p.count ?? 0,
        drafts: (a.count ?? 0) - (p.count ?? 0),
        players: pl.count ?? 0,
        photos: ph.count ?? 0,
        teams: tm.count ?? 0,
        competitions: cp.count ?? 0,
        fixtures: fx.count ?? 0,
        standings: st.count ?? 0,
        lastSync: (sy.data as { started_at: string } | null)?.started_at ?? null,
      });
    })();
  }, []);

  const sections: { heading: string; cards: { label: string; value: number | string; icon: any; color: string; to: string }[] }[] = [
    {
      heading: t("admin.cmsHeading"),
      cards: [
        { label: t("admin.totalArticles"), value: stats.total, icon: FileText, color: "text-accent", to: "/admin/articles" },
        { label: t("admin.published"), value: stats.published, icon: CheckCircle2, color: "text-emerald-500", to: "/admin/articles" },
        { label: t("admin.drafts"), value: stats.drafts, icon: Clock, color: "text-amber-500", to: "/admin/articles" },
        { label: t("admin.players.title"), value: stats.players, icon: Users, color: "text-accent", to: "/admin/players" },
        { label: t("admin.photos.title"), value: stats.photos, icon: ImageIcon, color: "text-accent", to: "/admin/photos" },
      ],
    },
    {
      heading: t("admin.sportsHeading"),
      cards: [
        { label: t("admin.teams.title"), value: stats.teams, icon: Shield, color: "text-accent", to: "/admin/teams" },
        { label: t("admin.competitions.title"), value: stats.competitions, icon: Trophy, color: "text-accent", to: "/admin/competitions" },
        { label: t("admin.fixtures.title"), value: stats.fixtures, icon: CalendarDays, color: "text-accent", to: "/admin/fixtures" },
        { label: t("admin.standings.title"), value: stats.standings, icon: ListOrdered, color: "text-accent", to: "/admin/standings" },
        { label: t("admin.sync.lastRun"), value: stats.lastSync ? new Date(stats.lastSync).toLocaleString() : "—", icon: RefreshCw, color: "text-accent", to: "/admin/sync" },
      ],
    },
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
      <div className="space-y-8">
        {sections.map(sec => (
          <div key={sec.heading}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{sec.heading}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {sec.cards.map(c => (
                <Link key={c.label} to={c.to} className="bg-card border border-border rounded-xl p-5 shadow-soft hover:border-accent transition-smooth">
                  <c.icon className={`h-5 w-5 ${c.color}`} />
                  <div className="text-2xl font-bold mt-3 truncate">{c.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">{c.label}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;