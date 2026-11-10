import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-ivory-50 transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
