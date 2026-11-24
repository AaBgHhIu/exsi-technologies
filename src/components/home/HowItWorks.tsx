import { BookOpen, UserCheck, Video } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: BookOpen,
      title: "Explore Programmes",
      desc: "Review detailed syllabus outlines, prerequisites, duration, and weekend batch timings for our semiconductor courses.",
    },
    {
      num: "02",
      icon: UserCheck,
      title: "Ask About a Programme",
      desc: "Contact the EXSI team to confirm current availability, schedule, and enrolment details.",
    },
    {
      num: "03",
      icon: Video,
      title: "Get Programme Details",
      desc: "The team will share current programme information and next steps for enrolment.",
    },
  ];

  return (
    <section className="py-20 bg-white text-[#14243a]">
      <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold tracking-[0.16em] text-[#0878d1] uppercase mb-2">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#071a33] tracking-tight">
            From Registration to Classroom in 3 Steps
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Transparent, straightforward enrolment designed for college engineering students.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#e2e8f0] text-[#0878d1] grid place-items-center shadow-sm">
                      <Icon size={22} />
                    </div>
                    <span className="text-2xl font-black text-slate-300">
                      {s.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#071a33] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200/60 text-[11px] font-semibold text-[#0878d1]">
                  Step {s.num}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
