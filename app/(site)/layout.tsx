import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { CalendlyInterceptor } from "@/components/site/calendly-interceptor";
import { LimovaChatbot } from "@/components/site/limova-chatbot";
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
      <CalendlyInterceptor />
      <LimovaChatbot />
    </div>
  );
}
