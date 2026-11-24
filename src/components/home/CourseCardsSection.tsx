import Link from "next/link";
import Image from "next/image";
import { courses } from "@/config/courses";

export function CourseCardsSection() {
  return (
    <section id="courses" className="py-14 sm:py-16 md:py-20 bg-white scroll-mt-20">
      <div className="wrap">
        <div className="max-w-[640px] mb-12">
          <span className="kicker">Learning programmes</span>
          <h2 className="text-[#0b1f45] font-semibold leading-tight">
            Explore our courses
          </h2>
          <p className="text-[#5b6e86] text-[1.05rem] mt-4">
            A complete engineering programme in digital design, Verilog HDL, RTL verification, and practical hardware projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <article
              key={course.slug}
              className="grid overflow-hidden border border-[#dde8f5] bg-white shadow-[0_4px_16px_rgba(18,38,63,0.04)] transition-shadow hover:shadow-[0_12px_34px_rgba(14,111,208,0.12)] lg:grid-cols-[1.12fr_0.88fr]"
            >
              <div className="group relative aspect-[16/9] w-full overflow-hidden bg-[#e8f4fd] lg:aspect-auto lg:min-h-[360px]">
                <Image
                  src={course.image}
                  alt="Illustrative digital design visual"
                  fill
                  sizes="(max-width: 720px) 100vw, 672px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-3 left-3 bg-[#041226]/75 px-2.5 py-1 text-[10px] font-medium text-white">
                  Illustrative image
                </span>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <span className="flex-none w-11 h-11 grid place-items-center rounded-xl bg-[#e8f4fd] text-[#0a58a8] text-xl mb-4">
                  {course.icon}
                </span>
                <h3 className="text-[#0b1f45] font-semibold text-xl mb-2.5">
                  <Link href={`/courses/${course.slug}`} className="hover:text-[#0e6fd0] transition-colors">
                    {course.title}
                  </Link>
                </h3>

                <p className="text-[#5b6e86] text-[0.96rem] leading-relaxed mb-5">
                  {course.shortDesc}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {course.level && (
                    <span className="py-1 px-3 rounded-full bg-[#e8f4fd] text-[#0a58a8] text-[0.78rem] font-medium">
                      {course.level}
                    </span>
                  )}
                  <span className="py-1 px-3 rounded-full bg-[#e8f4fd] text-[#0a58a8] text-[0.78rem] font-medium">
                    Project-based learning
                  </span>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="font-medium text-[0.92rem] text-[#0a58a8] hover:text-[#0e6fd0] transition-colors mt-auto"
                >
                  {course.enquiryOnly ? "Ask about this programme" : "Register for this course"} &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 p-4 sm:p-[16px_20px] rounded-[14px] bg-[#e8f4fd] text-[#1f4a7a] text-[0.92rem]">
          <strong>Programme enquiries:</strong> Contact the EXSI team to confirm current availability, schedule, and fee.
        </div>
      </div>
    </section>
  );
}
