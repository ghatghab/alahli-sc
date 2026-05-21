import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileText, FolderTree, LogOut, Home, Users, Image, RefreshCw, Shield, Trophy, CalendarDays, ListOrdered } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const { t } = useTranslation();
  const { user, signOut, roles } = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const links = [
    { to: "/admin", end: true, icon: Home, label: t("admin.dashboard") },
    { to: "/admin/articles", icon: FileText, label: t("admin.articles") },
    { to: "/admin/categories", icon: FolderTree, label: t("admin.categories") },
    { to: "/admin/players", icon: Users, label: t("admin.players.title") },
    { to: "/admin/photos", icon: Image, label: t("admin.photos.title") },
    { to: "/admin/teams", icon: Shield, label: t("admin.teams.title") },
    { to: "/admin/competitions", icon: Trophy, label: t("admin.competitions.title") },
    { to: "/admin/fixtures", icon: CalendarDays, label: t("admin.fixtures.title") },
    { to: "/admin/standings", icon: ListOrdered, label: t("admin.standings.title") },
    { to: "/admin/sync", icon: RefreshCw, label: t("admin.sync.title") },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col lg:flex-row pt-20 lg:pt-0">
      <aside className="lg:w-64 lg:min-h-screen lg:fixed lg:inset-y-0 lg:left-0 bg-card border-b lg:border-b-0 lg:border-r border-border flex lg:flex-col">
        <div className="hidden lg:block p-6 border-b border-border">
          <div className="font-display text-xl font-bold uppercase">Alahli CMS</div>
          <div className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</div>
          <div className="mt-2 flex gap-1 flex-wrap">
            {roles.map(r => (
              <span key={r} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                {r}
              </span>
            ))}
          </div>
        </div>
        <nav className="flex lg:flex-col gap-1 p-3 lg:p-4 flex-1 overflow-x-auto">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth whitespace-nowrap",
                  isActive ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 lg:p-4 lg:border-t border-border">
          <Button variant="outline" size="sm" className="w-full" onClick={onSignOut}>
            <LogOut className="h-4 w-4" /> {t("admin.signOut")}
          </Button>
        </div>
      </aside>
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;