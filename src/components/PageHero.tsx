import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  children?: ReactNode;
};

export const PageHero = ({ eyebrow, title, subtitle, image, children }: Props) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={image} alt="" className="h-full w-full object-cover" loading="eager" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
    </div>
    <div className="container-club relative py-20 lg:py-28">
      {eyebrow && (
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground max-w-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);