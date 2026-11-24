import { siteConfig } from "@/config/site";

export default function Topbar() {
  return (
    <div className="bg-[#041226] text-[#c8d7e8] text-xs py-2 px-4 border-b border-white/10">
      <div className="w-[min(1140px,calc(100%-32px))] mx-auto flex items-center justify-between gap-4">
          <span className="font-medium tracking-wide">
            Practical learning. Engineering excellence. Innovation.
          </span>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="hidden md:inline hover:text-[#16b9df] transition-colors"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    </div>
  );
}
