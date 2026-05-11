import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getSiteSettings } from "@/lib/sanity/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
