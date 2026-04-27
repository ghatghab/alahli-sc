import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import stadium from "@/assets/hero-stadium.jpg";

const departments = [
  { name: "General enquiries", email: "info@alahli-sc.ly" },
  { name: "Tickets & hospitality", email: "tickets@alahli-sc.ly" },
  { name: "Media & press", email: "media@alahli-sc.ly" },
  { name: "Partnerships", email: "partnerships@alahli-sc.ly" },
  { name: "Academy", email: "academy@alahli-sc.ly" },
  { name: "Fan services", email: "fans@alahli-sc.ly" },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent", description: "Thanks — we'll get back to you within 2 business days." });
    setForm({ name: "", email: "", subject: "General", message: "" });
  };
  return (
    <>
      <Seo pageKey="contact" />
      <Breadcrumbs />
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Whether you're a fan, a journalist, a partner or a future academy player — we'd love to hear from you."
        image={stadium}
      />
      <section className="container-club py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="eyebrow mb-3">Send us a message</div>
          <h2 className="font-display text-3xl font-bold text-foreground">We read every message</h2>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                required
                type="email"
                placeholder="Email"
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
              {departments.map(d => <option key={d.name}>{d.name}</option>)}
            </select>
            <textarea
              required
              rows={6}
              placeholder="Your message"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <button
              type="submit"
              className="self-start inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground">Club office</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>Tripoli International Stadium, Gate B<br />Tripoli, Libya</span></li>
              <li className="flex gap-3"><Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>+218 21 000 0000</span></li>
              <li className="flex gap-3"><Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>info@alahli-sc.ly</span></li>
              <li className="flex gap-3"><Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span>Sun — Thu, 9:00 — 17:00</span></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground">Departments</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {departments.map(d => (
                <li key={d.email} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{d.name}</span>
                  <a href={`mailto:${d.email}`} className="text-accent hover:underline">{d.email}</a>
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