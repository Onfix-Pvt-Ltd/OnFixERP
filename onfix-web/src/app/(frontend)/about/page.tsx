import { FadeIn } from "@/components/animations/FadeIn";
import { HorizontalScroll } from "@/components/about/HorizontalScroll";
import { getAboutContent } from "@/lib/cms";

export const revalidate = 60;

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <div className="pt-40 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 max-w-7xl">
        <FadeIn>
          <div className="max-w-4xl mb-32 relative">
            {/* Ambient Title Glow */}
            <div className="absolute -left-20 top-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50" />

            <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1] relative z-10">
              {about.hero.headingLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">{about.hero.headingHighlight}</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-medium max-w-2xl relative z-10">
              {about.hero.subheading}
            </p>
          </div>
        </FadeIn>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <FadeIn direction="right" className="relative group">
            <div className="aspect-square rounded-[3rem] bg-foreground/5 border border-border/50 overflow-hidden relative shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              {/* Spinning Neon Border Effect */}
              <div className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#FF5C00_50%)] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute inset-[2px] bg-card rounded-[3rem] z-0" />

              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" />
              <div className="absolute inset-0 flex items-center justify-center p-12 md:p-16 z-20">
                <p className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter leading-tight text-foreground/80 drop-shadow-lg">
                  &ldquo;{about.bigQuote}&rdquo;
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" className="space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold uppercase tracking-widest">
              {about.origin.badge}
            </div>
            <h2 className="text-5xl font-heading font-extrabold tracking-tighter">{about.origin.heading}</h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">
              {about.origin.paragraph}
            </p>
            <div className="pl-6 border-l-4 border-primary/50 py-2">
              <p className="text-2xl text-foreground leading-relaxed italic">
                &ldquo;{about.origin.quote}&rdquo;
              </p>
            </div>
            <p className="text-2xl text-foreground font-bold leading-relaxed">
              {about.origin.closing}
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Horizontal Progressive Scroll Section */}
      <HorizontalScroll values={about.values} />

    </div>
  );
}
