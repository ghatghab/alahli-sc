import hero from "@/assets/hero-stadium.jpg";

export const PageHeader = ({ title, intro }: { title: string; intro?: string }) => (
  <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
    <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-background" />
    <div className="container-club relative text-primary-foreground">
      <h1 className="font-display text-4xl sm:text-6xl font-bold uppercase">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-primary-foreground/85">{intro}</p>}
    </div>
  </section>
);