import { FadeIn } from "@/components/animations/FadeIn";
import {
  ArrowRight,
  Box,
  CreditCard,
  Globe,
  Hotel,
  PieChart,
  Plug,
  type LucideIcon,
} from "lucide-react";
import { getPartners } from "@/lib/cms";

export const revalidate = 60;

// Maps the `icon` string stored in the Partners collection to a component.
// Keep in sync with the select options in src/payload/collections/Partners.ts.
const ICON_MAP: Record<string, LucideIcon> = {
  CreditCard,
  Hotel,
  PieChart,
  Box,
  Plug,
  Globe,
};

export default async function PartnersPage() {
  const integrations = await getPartners();

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <FadeIn>
           <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
             Integration <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Ecosystem.</span>
           </h1>
           <p className="text-2xl text-muted-foreground font-medium mb-16 max-w-2xl leading-relaxed">
             Our open API and partner directory allows you to connect ONFIX natively with the tools you already rely on.
           </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, i) => {
            const Icon = ICON_MAP[integration.icon] ?? Box;
            return (
            <FadeIn key={integration.id} delay={i * 0.1} direction="up">
              <div className="group relative p-10 rounded-[2rem] bg-card/80 backdrop-blur-md border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all duration-500 h-full flex flex-col justify-between overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_20px_50px_rgba(255,92,0,0.1)]">

                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent transition-opacity duration-700" />

                <div className="relative z-10">
                  <div className="h-16 w-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 overflow-hidden">
                    {integration.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={integration.logo} alt={integration.name} className="h-full w-full object-contain p-2" />
                    ) : (
                      <Icon size={32} />
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary uppercase tracking-widest mb-3 block">{integration.category}</span>
                  <h3 className="text-3xl font-heading font-bold mb-4">{integration.name}</h3>
                  <p className="text-muted-foreground text-lg">{integration.desc}</p>
                </div>

                <div className="relative z-10 mt-10 flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 text-primary">
                  View Integration <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </div>
            </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
