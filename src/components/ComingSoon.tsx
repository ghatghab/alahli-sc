import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

export const ComingSoon = () => {
  const { t } = useTranslation();
  return (
    <div className="container-club py-16">
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-gold" />
        <p className="mt-4 text-muted-foreground">{t("comingSoon")}</p>
      </div>
    </div>
  );
};