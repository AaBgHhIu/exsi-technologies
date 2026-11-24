import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Eye, Lightbulb, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about EXSi Technologies, our engineering education, services, research, philosophy, vision, and mission.",
};

export default function AboutPage() {
  return (
    <div className="bg-white text-[#14243a] min-h-screen">
      <section
        className="py-16 md:py-20 text-white"
        style={{
          background: "linear-gradient(125deg, #06152b 0%, #0a294c 58%, #073b68 100%)",
        }}
      >
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <div className="text-xs font-bold tracking-[0.16em] text-[#8fe4ff] uppercase mb-2">
            About EXSi
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-4xl leading-tight">
            Building engineering capabilities. Creating meaningful solutions. Shaping the future of technology.
          </h1>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-white">
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <div className="max-w-3xl">
            <div className="text-xs font-bold tracking-[0.16em] text-[#0878d1] uppercase mb-2">
              Who We Are
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071a33] mb-5">
              Engineering capability built through learning, practice, and collaboration.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              EXSI Technologies is an emerging technology organisation driven by a passion for engineering, knowledge sharing and innovation.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              We believe that technological advancement begins with strong fundamentals, practical knowledge and the ability to turn ideas into meaningful solutions.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Our journey begins with empowering aspiring engineers through quality technical education, hands-on learning and dedicated mentorship, while building towards a broader vision of engineering services, research and technology development.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-[#f8fafc] border-y border-[#e2e8f0]">
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <div className="max-w-3xl mb-9">
            <div className="text-xs font-bold tracking-[0.16em] text-[#0878d1] uppercase mb-2">
              What We Do
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071a33] mb-3">
              Our focus spans three interconnected areas.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="border-t-2 border-[#0878d1] pt-5">
              <h3 className="text-lg font-bold text-[#071a33] mb-3">Engineering Education</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We aim to bridge the gap between academic knowledge and practical engineering through structured learning, hands-on projects and industry-oriented technical training, with an initial focus on RTL design, Verilog and VLSI.
              </p>
            </article>
            <article className="border-t-2 border-[#00a783] pt-5">
              <h3 className="text-lg font-bold text-[#071a33] mb-3">Engineering Services</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are working towards developing engineering capabilities in RTL design, digital verification, FPGA and embedded systems to deliver reliable solutions that address real-world industry requirements.
              </p>
            </article>
            <article className="border-t-2 border-[#e49b25] pt-5">
              <h3 className="text-lg font-bold text-[#071a33] mb-3">Research &amp; Innovation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We aspire to explore emerging technologies, develop innovative engineering concepts and contribute to the advancement of semiconductor and electronic systems.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-white">
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-x-9 gap-y-10">
          <article className="border-t border-[#cbdbea] pt-5">
            <div className="flex items-center gap-2 text-[#0b1f45] text-lg font-semibold mb-4">
              <Lightbulb size={18} className="text-[#0e6fd0]" aria-hidden="true" />
              Our Philosophy
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0b1f45] mb-4">
              Learning, experimentation and practical outcomes.
            </h2>
            <p className="text-[#5b6e86] text-sm leading-relaxed mb-4">
              At EXSI, we believe knowledge becomes more valuable when it is shared and applied.
            </p>
            <p className="text-[#5b6e86] text-sm leading-relaxed mb-4">
              We strive to create an environment where individuals can learn, experiment, develop their capabilities and transform their ideas into practical outcomes.
            </p>
            <p className="text-[#5b6e86] text-sm leading-relaxed">
              Our focus goes beyond delivering information. It is about building confidence, nurturing engineering talent and encouraging a mindset of continuous learning and innovation.
            </p>
          </article>

          <article className="border-t border-[#cbdbea] pt-5">
              <div className="flex items-center gap-2 text-[#0b1f45] text-lg font-semibold mb-4">
                <Eye size={18} className="text-[#0e6fd0]" aria-hidden="true" />
                Our Vision
              </div>
              <p className="text-[#5b6e86] text-sm leading-relaxed">
                To become a globally recognised technology organisation, distinguished by engineering excellence, meaningful innovation and its contribution to technological advancement.
              </p>
          </article>
          <article className="border-t border-[#cbdbea] pt-5">
              <div className="flex items-center gap-2 text-[#0b1f45] text-lg font-semibold mb-4">
                <span className="relative inline-flex" aria-hidden="true">
                  <Target size={18} className="text-[#0e6fd0]" />
                  <ArrowUpRight size={10} className="absolute -right-1 -top-1 text-[#0e6fd0]" />
                </span>
                Our Mission
              </div>
              <p className="text-[#5b6e86] text-sm leading-relaxed">
                To cultivate engineering talent through quality education, practical learning and dedicated mentorship; deliver reliable and high-quality engineering solutions that create value for the industry; and foster innovation through continuous research and development.
              </p>
          </article>
        </div>
      </section>

      <section className="py-14 bg-[#f8fafc] border-t border-[#e2e8f0] text-center">
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <h2 className="text-2xl font-bold text-[#071a33] mb-3">
            Start building your engineering capabilities.
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Explore practical technical education and our current learning programmes.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(110deg, #0878d1 0%, #065ea3 100%)",
            }}
          >
            View Available Courses <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
