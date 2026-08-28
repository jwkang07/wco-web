import { SiteLogo } from "@/components/SiteLogo";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e5e5e5] bg-[#f5f5f5] text-[#777]">
      <div className="container flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-9">
        <SiteLogo variant="footer" />

        <div className="space-y-1 text-[13px] leading-[1.7] lg:text-right">
          <p>
            우) {site.footer.zip} {site.footer.address}
          </p>
          <p>
            전화 : {site.footer.tel}, 팩스 : {site.footer.fax}, 메일 :{" "}
            <a
              href={`mailto:${site.footer.email}`}
              className="text-[#777] hover:text-wco-orange"
            >
              {site.footer.email}
            </a>
          </p>
          <p className="text-[12px] text-[#999]">{site.footer.copyrightLine}</p>
        </div>
      </div>
    </footer>
  );
}
