import { ArrowUpRight, Eye, Lightbulb, Target } from "lucide-react";

export function WhyExsi() {
  return (
    <section id="about" className="py-14 sm:py-16 md:py-20 bg-white scroll-mt-20">
      <div className="wrap">
        <div className="max-w-4xl mb-12">
          <span className="kicker">About EXSI</span>
          <h2 className="text-[#0b1f45] mb-5 font-semibold leading-tight max-w-3xl">
            Building engineering capabilities. Creating meaningful solutions. Shaping the future of technology.
          </h2>
          <p className="text-[#5b6e86] text-[0.98rem] leading-relaxed mb-4 max-w-3xl">
            EXSI Technologies is an emerging technology organisation driven by a passion for engineering, knowledge sharing and innovation.
          </p>
          <p className="text-[#5b6e86] text-[0.98rem] leading-relaxed max-w-3xl">
            We believe that technological advancement begins with strong fundamentals, practical knowledge and the ability to turn ideas into meaningful solutions. Our journey begins with empowering aspiring engineers through quality technical education, hands-on learning and dedicated mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-9 gap-y-10">
          <article className="border-t border-[#cbdbea] pt-5">
            <h3 className="flex items-center gap-2 text-[#0b1f45] text-lg font-semibold mb-4">
              <Lightbulb size={18} className="text-[#0e6fd0]" aria-hidden="true" /> Our Philosophy
            </h3>
            <p className="text-[#5b6e86] text-sm leading-relaxed mb-3">
              At EXSI, we believe knowledge becomes more valuable when it is shared and applied.
            </p>
            <p className="text-[#5b6e86] text-sm leading-relaxed mb-3">
              We strive to create an environment where individuals can learn, experiment, develop their capabilities and transform their ideas into practical outcomes.
            </p>
            <p className="text-[#5b6e86] text-sm leading-relaxed">
              Our focus goes beyond delivering information. It is about building confidence, nurturing engineering talent and encouraging a mindset of continuous learning and innovation.
            </p>
          </article>

          <article className="border-t border-[#cbdbea] pt-5">
            <h3 className="flex items-center gap-2 text-[#0b1f45] text-lg font-semibold mb-4">
              <Eye size={18} className="text-[#0e6fd0]" aria-hidden="true" /> Our Vision
            </h3>
            <p className="text-[#5b6e86] text-sm leading-relaxed">
              To become a globally recognised technology organisation, distinguished by engineering excellence, meaningful innovation and its contribution to technological advancement.
            </p>
          </article>
          <article className="border-t border-[#cbdbea] pt-5">
            <h3 className="flex items-center gap-2 text-[#0b1f45] text-lg font-semibold mb-4">
              <span className="relative inline-flex" aria-hidden="true">
                <Target size={18} className="text-[#0e6fd0]" />
                <ArrowUpRight size={10} className="absolute -right-1 -top-1 text-[#0e6fd0]" />
              </span>
              Our Mission
            </h3>
            <p className="text-[#5b6e86] text-sm leading-relaxed">
              To cultivate engineering talent through quality education, practical learning and dedicated mentorship; deliver reliable and high-quality engineering solutions that create value for the industry; and foster innovation through continuous research and development.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
