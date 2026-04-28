import { useTranslation } from "react-i18next";
import { type StaffMember } from "@/lib/roster";

export const StaffGrid = ({ staff }: { staff: StaffMember[] }) => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {staff.map(s => (
        <div key={s.name} className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 grid place-items-center font-display text-lg font-black text-accent shrink-0">
            {s.name.replace(/^Dr\.\s*/, "").split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground">{s.name}</h3>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mt-1">
              {t(`pagesContent.staffRoles.${s.role}`, { defaultValue: s.role })}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{s.nationality}</div>
          </div>
        </div>
      ))}
    </div>
  );
};