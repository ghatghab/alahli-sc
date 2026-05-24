import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Role = "admin" | "editor" | "cms_editor" | "sports_editor" | "user";
type RoleRow = { id: string; user_id: string; role: Role };

const ROLES: Role[] = ["admin", "editor", "cms_editor", "sports_editor"];

const AdminUsers = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("cms_editor");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("user_roles")
      .select("id, user_id, role")
      .order("role");
    setRows((data as RoleRow[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      const { data: uid, error: rpcErr } = await supabase.rpc("get_user_id_by_email", {
        _email: email.trim(),
      });
      if (rpcErr) throw rpcErr;
      if (!uid) {
        toast({
          title: t("admin.users.userNotFound"),
          variant: "destructive",
        });
        return;
      }
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: uid as string, role });
      if (error && !error.message.includes("duplicate")) throw error;
      toast({ title: t("admin.users.added") });
      setEmail("");
      await load();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("admin.users.removed") });
      load();
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.users.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("admin.users.subtitle")}</p>
      </div>

      <form
        onSubmit={onAdd}
        className="bg-card border border-border rounded-xl p-6 shadow-soft mb-6 grid gap-4 sm:grid-cols-[1fr_220px_auto] items-end"
      >
        <div>
          <Label>{t("admin.users.emailLabel")}</Label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={role} onValueChange={v => setRole(v as Role)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ROLES.map(r => (
                <SelectItem key={r} value={r}>
                  {t(`admin.users.roleLabels.${r}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" variant="gold" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {t("admin.users.addRole")}
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border text-muted-foreground">
          {t("admin.users.empty")}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-soft divide-y divide-border">
          {rows.map(r => (
            <div key={r.id} className="p-4 flex items-center gap-4">
              <Shield className="h-4 w-4 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {t(`admin.users.roleLabels.${r.role}`)}
                </div>
                <div className="text-xs text-muted-foreground font-mono truncate">
                  {r.user_id}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;