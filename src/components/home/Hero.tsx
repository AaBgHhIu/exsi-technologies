import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[620px] overflow-hidden bg-[#041226] text-white sm:min-h-[650px]"
    >
      <Image
        src="/images/hero-chip-v3.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-[58%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[#041226]/80 md:bg-transparent md:bg-gradient-to-r md:from-[#041226] md:via-[#041226]/85 md:to-[#041226]/25"
      />

      <div className="wrap relative z-20 flex items-center py-16 sm:py-20">
        <div className="max-w-3xl">
          <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Image
              src="/images/logo.svg"
              alt="EXSi Technologies"
              width={166}
              height={52}
              priority
              className="h-10 w-[140px] brightness-0 invert sm:h-12 sm:w-[166px]"
            />
            <span className="border-l border-white/30 pl-5 text-sm font-medium text-[#a9eaff]">
              Engineering knowledge into innovation.
            </span>
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl">
            Build skills.
            <br />
            <span className="text-[#70d8f1]">Design what&apos;s next.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Empowering engineers through practical learning, advanced digital design and innovative semiconductor technologies.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/#courses" className="btn btn-primary">
              Explore Learning <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/#about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-[22px] py-3 text-[0.95rem] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Discover EXSI
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-4 text-xs font-medium text-white/75 sm:text-sm">
            <span>Engineering Education</span>
            <span>Engineering Services</span>
            <span>Research &amp; Innovation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
