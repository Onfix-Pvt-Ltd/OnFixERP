import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";
import { BookOpen, Code, Terminal, Zap, type LucideIcon } from "lucide-react";
import { getGuides, GUIDE_CATEGORIES } from "@/lib/cms";

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Terminal,
  Zap,
  Code,
};

export default async function GuidesPage() {
  const guides = await getGuides();

  // Live article counts per category; fall back to the canned label when empty.
  const categories = GUIDE_CATEGORIES.map((cat) => {
    const count = guides.filter((g) => g.category === cat.key).length;
    return {
      ...cat,
      Icon: CATEGORY_ICONS[cat.icon] ?? BookOpen,
      count: count > 0 ? `${count} article${count === 1 ? "" : "s"}` : cat.fallbackCount,
    };
  });

  const popular = guides.filter((g) => g.popular);
  const popularList = popular.length ? popular : guides.slice(0, 4);

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <FadeIn>
           <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
             Knowledge <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Architecture.</span>
           </h1>
           <p className="text-2xl text-muted-foreground font-medium mb-20 max-w-2xl leading-relaxed">
             Master the ONFIX ecosystem. Comprehensive guides, API documentation, and implementation blueprints.
           </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-32 h-fit">
            {categories.map((cat, i) => (
              <FadeIn key={cat.key} delay={i * 0.1} direction="right">
                <div className="w-full text-left p-4 rounded-2xl hover:bg-muted/50 transition-colors flex items-center gap-4 group border border-transparent hover:border-border/50">
                  <div className="p-3 rounded-xl bg-foreground/5 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all duration-300">
                    <cat.Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{cat.title}</h4>
                    <span className="text-sm text-muted-foreground">{cat.count}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
             <FadeIn delay={0.3} direction="up">
                <div className="p-10 md:p-16 rounded-[3rem] bg-card/80 backdrop-blur-md border border-border/50 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

                  <h3 className="text-4xl font-heading font-bold mb-10 relative z-10">Popular Guides</h3>
                  <div className="space-y-4 relative z-10">
                    {popularList.map((guide) => (
                      <Link
                        key={guide.id}
                        href={`/guides/${guide.slug}`}
                        className="p-6 md:p-8 rounded-[1.5rem] border border-border/30 bg-background/50 hover:bg-background hover:border-primary/50 transition-all duration-300 cursor-pointer group flex items-center justify-between shadow-sm hover:shadow-[0_10px_30px_rgba(255,92,0,0.05)]"
                      >
                        <span className="text-xl font-medium group-hover:text-primary transition-colors">{guide.title}</span>
                        <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 shrink-0">
                          →
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
             </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
