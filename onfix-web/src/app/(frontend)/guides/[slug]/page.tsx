import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { getGuideBySlug, GUIDE_CATEGORIES } from "@/lib/cms";

export const revalidate = 60;

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const categoryLabel =
    GUIDE_CATEGORIES.find((c) => c.key === guide.category)?.title ?? "Guide";
  const body = guide.body as SerializedEditorState | undefined;

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <article className="container mx-auto px-6 max-w-3xl relative z-10">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={16} /> All guides
        </Link>

        <span className="text-sm font-bold text-primary uppercase tracking-widest mb-4 block">
          {categoryLabel}
        </span>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tighter mb-6 leading-[1.1]">
          {guide.title}
        </h1>
        {guide.excerpt && (
          <p className="text-2xl text-muted-foreground font-medium mb-12 leading-relaxed">
            {guide.excerpt}
          </p>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary">
          {body ? (
            <RichText data={body} />
          ) : (
            <p className="text-muted-foreground">
              This guide is being written. Check back soon — or{" "}
              <Link href="/contact" className="text-primary font-medium hover:underline">
                contact us
              </Link>{" "}
              if you need help with this topic now.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
