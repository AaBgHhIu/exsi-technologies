import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CourseEnrollCard from "@/components/courses/CourseEnrollCard";
import CourseRegisterSection from "@/components/courses/CourseRegisterSection";
import { BookOpen, HelpCircle, ArrowLeft } from "lucide-react";
import { courses, getCourseBySlug } from "@/config/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const course = getCourseBySlug(params.slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.title,
    description: course.shortDesc,
  };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) {
    notFound();
  }

  return (
    <div className="bg-white text-[#0b1f45] min-h-screen">
      {/* Header Banner */}
      <section
        className="py-14 sm:py-18 text-white"
        style={{
          background: "linear-gradient(150deg, #051b4b, #0a58a8)",
        }}
      >
        <div className="wrap">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-[#9fdcf5] hover:underline mb-4 font-medium"
          >
            <ArrowLeft size={14} /> Back to all courses
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {course.level && <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white">{course.level}</span>}
            {course.mode && <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-[#9fdcf5]">{course.mode}</span>}
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4 max-w-3xl">
            {course.title}
          </h1>

          <p className="text-[#e0edff] text-base sm:text-lg max-w-2xl leading-relaxed">
            {course.shortDesc}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-14 bg-white">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* Left: Syllabus & Details */}
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-[#0b1f45] mb-3">
                About this course
              </h2>
              <p className="text-[#5b6e86] leading-relaxed text-sm sm:text-base">
                {course.fullDesc}
              </p>
            </div>

            <div className="mb-10 p-5 rounded-[16px] bg-[#f5f9ff] border border-[#dde8f5]">
              <h3 className="text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle size={15} className="text-[#0e6fd0]" /> Prerequisites
              </h3>
              <p className="text-sm text-[#5b6e86] leading-relaxed">
                {course.prerequisites}
              </p>
            </div>

            {/* Syllabus */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={20} className="text-[#0e6fd0]" />
                <h2 className="text-2xl font-semibold text-[#0b1f45]">Course Syllabus</h2>
              </div>

              <div className="flex flex-col gap-4">
                {course.syllabus.map((mod, index) => (
                  <div
                    key={index}
                    className="rounded-[16px] border border-[#dde8f5] bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-[#0b1f45] mb-3 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-md bg-[#e8f4fd] text-[#0a58a8] text-xs font-bold grid place-items-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{mod.module}</span>
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-[#5b6e86] ml-9">
                      {mod.topics.map((topic, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0e6fd0] shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky Card */}
          {course.enquiryOnly ? (
            <aside className="lg:sticky lg:top-24 overflow-hidden border border-[#dde8f5] bg-white shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-[#f4f9ff]">
                <Image
                  src={course.image}
                  alt="Illustrative digital design visual"
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-[#041226]/75 px-2.5 py-1 text-[10px] font-medium text-white">
                  Illustrative image
                </span>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold uppercase text-[#0e6fd0]">Programme enquiry</span>
                <h2 className="mt-2 text-xl font-semibold text-[#0b1f45]">Get current details</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6e86]">
                  Contact EXSI to confirm the current duration, schedule, and fee for this programme.
                </p>
                <Link href="/#contact" className="btn btn-primary mt-5 w-full">
                  Ask about this programme
                </Link>
              </div>
            </aside>
          ) : (
            <CourseEnrollCard
              courseTitle={course.title}
              courseSlug={course.slug}
              image={course.image}
              fee={course.fee}
              duration={course.duration}
              mode={course.mode}
              batchStart={course.batchStart}
            />
          )}
        </div>
      </section>

      {/* Registration Section at Bottom */}
      {!course.enquiryOnly && (
        <CourseRegisterSection
          courseTitle={course.title}
          courseSlug={course.slug}
          fee={course.fee}
          duration={course.duration}
          batchStart={course.batchStart}
        />
      )}
    </div>
  );
}
