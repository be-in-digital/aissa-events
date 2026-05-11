import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/lib/sanity/fetch";
import { legalPageQuery } from "@/lib/sanity/queries";
import type { LegalPageQueryResult } from "@/sanity.types";
import { RichText } from "@/components/site/portable-text";

const PATH = "/politique-confidentialite";
const TYPE = "politiqueConfidentialite";
const FALLBACK_TITLE = "Politique de confidentialité";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<LegalPageQueryResult>({
    query: legalPageQuery,
    params: { type: TYPE },
    tags: [TYPE],
  });

  return buildMetadata({
    seo: data?.seo ?? null,
    fallbackTitle: `${data?.title ?? FALLBACK_TITLE} — Aïssa Events`,
    pathname: PATH,
  });
}

export default async function PolitiqueConfidentialitePage() {
  const data = await sanityFetch<LegalPageQueryResult>({
    query: legalPageQuery,
    params: { type: TYPE },
    tags: [TYPE],
  });

  const title = data?.title ?? FALLBACK_TITLE;
  const lastUpdated = data?.lastUpdated ?? null;
  const body = data?.body ?? null;

  return (
    <>
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="mx-auto max-w-[860px] px-6 sm:px-14">
          <nav
            className="mb-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink"
            aria-label="Fil d'Ariane"
          >
            <Link href="/" className="transition-colors hover:text-bordeaux">
              Accueil
            </Link>
            <span className="mx-3">/</span>
            <span className="text-ink-soft">Politique de confidentialité</span>
          </nav>
          <h1
            className="font-serif text-[40px] leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[64px]"
            style={{ fontWeight: 300 }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
              Mise à jour : {formatDate(lastUpdated)}
            </p>
          )}
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-[760px] px-6 sm:px-14">
          {body ? (
            <article className="prose-blog font-serif text-[17px] leading-[1.8] text-ink-soft sm:text-[18px]">
              <RichText value={body} />
            </article>
          ) : (
            <p className="font-serif text-[17px] italic leading-[1.7] text-ink-soft sm:text-[18px]">
              Document en cours de rédaction. Pour toute demande d&apos;information,
              contactez-nous.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
