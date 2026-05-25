import { FadeIn } from "@/components/animations/FadeIn";

interface LegalPageProps {
  title: string;
  effectiveDate?: string;
  intro?: string;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  effectiveDate,
  intro,
  children,
}: LegalPageProps) {
  return (
    <div className="pt-40 pb-32 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <FadeIn>
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tighter mb-6 leading-[1.1]">
              {title}
            </h1>
            {effectiveDate && (
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Effective {effectiveDate}
              </p>
            )}
            {intro && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {intro}
              </p>
            )}
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <article className="prose prose-lg dark:prose-invert max-w-none [&_h2]:text-3xl [&_h2]:font-heading [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:mt-16 [&_h2]:mb-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_p]:text-lg [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6 [&_ul]:text-lg [&_ul]:text-muted-foreground [&_ul]:leading-relaxed [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_a]:text-primary [&_a]:font-semibold [&_a]:underline">
            {children}
          </article>
        </FadeIn>
      </div>
    </div>
  );
}
