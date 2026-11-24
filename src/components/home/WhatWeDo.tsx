import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Cpu, GraduationCap, Microscope } from "lucide-react";

export function WhatWeDo() {
  const cards = [
    {
      icon: GraduationCap,
      image: "/images/grid-eda.jpg",
      imageAlt: "Illustrative digital design workstation",
      focus: "Initial operational focus",
      title: "Engineering Education",
      desc: "We aim to bridge the gap between academic knowledge and practical engineering through structured learning, hands-on projects and industry-oriented technical training, with an initial focus on RTL design, Verilog and VLSI.",
      linkText: "Explore courses →",
      href: "/#courses",
    },
    {
      icon: Cpu,
      image: "/images/hero-electronics.jpg",
      imageAlt: "Illustrative digital electronics and test equipment",
      focus: "Capabilities in development",
      title: "Engineering Services",
      desc: "We are working towards developing engineering capabilities in RTL design, digital verification, FPGA and embedded systems to deliver reliable solutions that address real-world industry requirements.",
      linkText: "Discuss engineering services →",
      href: "/#contact",
    },
    {
      icon: Microscope,
      image: "/images/hero-chip-v3.jpg",
      imageAlt: "Illustrative semiconductor chip design",
      focus: "Future development direction",
      title: "Research & Innovation",
      desc: "We aspire to explore emerging technologies, develop innovative engineering concepts and contribute to the advancement of semiconductor and electronic systems.",
      linkText: "Discuss collaboration →",
      href: "/#contact",
    },
  ];

  return (
    <section id="services" className="py-14 sm:py-16 md:py-20 bg-[#f5f9ff] scroll-mt-20">
      <div className="wrap">
        <div className="max-w-[700px] mb-12">
          <span className="kicker">What we do</span>
          <h2 className="text-[#0b1f45] font-semibold leading-tight">
            Our focus spans three interconnected areas.
          </h2>
          <p className="text-[#5b6e86] text-[1.05rem] mt-4">
            We bring together engineering education, practical services and research to contribute to the advancement of technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <article key={c.title} className="min-w-0">
                <div className="group relative aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-[#e8f4fd]">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 left-3 bg-[#041226]/75 px-2.5 py-1 text-[10px] font-medium text-white">
                    Illustrative image
                  </span>
                </div>
                <div className="border-t border-[#d7e3ef] pt-5 mt-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="flex items-center gap-2 text-[11px] font-semibold uppercase text-[#0a58a8]">
                      <Icon size={16} aria-hidden="true" />
                      {c.focus}
                    </span>
                  </div>
                  <h3 className="text-[#0b1f45] font-semibold text-xl mb-3">{c.title}</h3>
                  <p className="text-[#5b6e86] text-[0.96rem] leading-relaxed mb-5">{c.desc}</p>
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-1.5 font-medium text-[0.92rem] text-[#0a58a8] hover:text-[#0e6fd0] transition-colors"
                  >
                    {c.linkText} <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
