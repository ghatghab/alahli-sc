import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { toast } from "@/hooks/use-toast";
import stadium from "@/assets/hero-stadium.jpg";

const DEPT_KEYS = ["general", "ticketsHosp", "media", "partnerships", "academy", "fans"] as const;
const DEPT_EMAILS: Record<typeof DEPT_KEYS[number], string> = {
  general: "info@alahli-sc.ly",
  ticketsHosp: "tickets@alahli-sc.ly",
  media: "media@alahli-sc.ly",
  partnerships: "partnerships@alahli-sc.ly",
  academy: "academy@alahli-sc.ly",
  fans: "fans@alahli-sc.ly",
};

const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: DEPT_KEYS[0] as string, message: "" });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("pagesContent.contact.sentTitle"),
      description: t("pagesContent.contact.sentDesc"),
    });
    setForm({ name: "", email: "", subject: DEPT_KEYS[0], message: "" });
  };
  return (
    <>
      <Seo pageKey="contact" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.contact.eyebrow")}
        title={t("pagesContent.contact.title")}
        subtitle={t("pagesContent.contact.subtitle")}
        image={stadium}
      />
      <section className="container-club py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="eyebrow mb-3">{t("pagesContent.contact.sendEyebrow")}</div>
          <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.contact.sendTitle")}</h2>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder={t("pagesContent.contact.yourName")}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                required
                type="email"
                placeholder={t("pagesContent.contact.email")}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {DEPT_KEYS.map(k => (
                <option key={k} value={k}>{t(`pagesContent.contact.departments.${k}`)}</option>
              ))}
            </select>
            <textarea
              required
              rows={6}
              placeholder={t("pagesContent.contact.yourMessage")}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <button
              type="submit"
              className="self-start inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition"
            >
              <Send className="h-4 w-4" /> {t("pagesContent.contact.send")}
            </button>
          </form>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground">{t("pagesContent.contact.officeTitle")}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>{t("pagesContent.contact.address")}<br />{t("pagesContent.contact.city")}</span></li>
              <li className="flex gap-3"><Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>+218 21 000 0000</span></li>
              <li className="flex gap-3"><Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>info@alahli-sc.ly</span></li>
              <li className="flex gap-3"><Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>{t("pagesContent.contact.hoursLabel")}</span></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground">{t("pagesContent.contact.departmentsTitle")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {DEPT_KEYS.map(k => (
                <li key={k} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{t(`pagesContent.contact.departments.${k}`)}</span>
                  <a href={`mailto:${DEPT_EMAILS[k]}`} className="text-accent hover:underline">{DEPT_EMAILS[k]}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
};

export default ContactPage;
