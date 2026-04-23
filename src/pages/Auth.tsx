import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { t } = useTranslation();
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    const from = (location.state as { from?: string } | null)?.from ?? "/admin";
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) {
      toast({ title: t("auth.error"), description: error, variant: "destructive" });
    } else if (mode === "signup") {
      toast({ title: t("auth.checkEmail"), description: t("auth.checkEmailDesc") });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-elegant p-8">
        <h1 className="font-display text-3xl font-bold uppercase">{t("auth.title")}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t("auth.subtitle")}</p>

        <div className="mt-6 grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`py-2 text-sm font-semibold rounded-md transition-smooth ${
              mode === "signin" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            {t("auth.signIn")}
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`py-2 text-sm font-semibold rounded-md transition-smooth ${
              mode === "signup" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            {t("auth.signUp")}
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? t("auth.signIn") : t("auth.signUp")}
          </Button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-accent">
          ← {t("pages.notFound.back")}
        </Link>
      </div>
    </div>
  );
};

export default Auth;