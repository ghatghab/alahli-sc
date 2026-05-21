import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/news";

type SyncRun = {
  id: string;
  source: string;
  started_at: string;
  finished_at: string | null;
  success: boolean | null;
  items_upserted: number;
  error: string | null;
  details: Record<string, unknown> | null;
};

const AdminSync = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [runs, setRuns] = useState<SyncRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("sync_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(20);
    setRuns((data as SyncRun[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onSyncNow = async () => {
    setRunning(true);
    try {
      const { error } = await supabase.functions.invoke("sync-sports-data", {
        body: { trigger: "manual" },
      });
      if (error) throw error;
      toast({ title: t("admin.sync.successTitle"), description: t("admin.sync.successDesc") });
      await load();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">{t("admin.sync.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("admin.sync.subtitle")}</p>
        </div>
        <Button variant="gold" onClick={onSyncNow} disabled={running}>
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {t("admin.sync.runNow")}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : runs.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">
          {t("admin.sync.noRuns")}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-soft">
          <div className="divide-y divide-border">
            {runs.map(r => {
              const duration = r.finished_at
                ? Math.max(0, new Date(r.finished_at).getTime() - new Date(r.started_at).getTime())
                : null;
              return (
                <div key={r.id} className="p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    {r.success === null ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : r.success ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">
                      {formatDate(r.started_at, i18n.language)} · {new Date(r.started_at).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {r.success
                        ? t("admin.sync.itemsUpserted", { n: r.items_upserted })
                        : (r.error ?? t("admin.sync.running"))}
                      {duration !== null && ` · ${(duration / 1000).toFixed(1)}s`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSync;