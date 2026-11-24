import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Mail, Phone, MapPin, Send, MessageSquare, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EXSi team for course enquiries or collaborations.",
};

export default function ContactPage() {
  const whatsappUrl = siteConfig.whatsappNumber ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hi EXSi team, I have an enquiry regarding courses / collaborations."
  )}` : null;

  return (
    <div className="bg-white text-[#14243a] min-h-screen">
      {/* Header Banner */}
      <section
        className="py-16 md:py-20 text-white"
        style={{
          background: "linear-gradient(125deg, #06152b 0%, #0a294c 58%, #073b68 100%)",
        }}
      >
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <div className="text-xs font-bold tracking-[0.16em] text-[#8fe4ff] uppercase mb-2">
            Get In Touch &bull; EXSi Technologies
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Let&apos;s start a conversation.
          </h1>
          <p className="text-[#c4d5e7] text-base sm:text-lg max-w-2xl mt-3 leading-relaxed">
            For course enquiries, institutional workshops, or general discussions, contact the EXSi team.
          </p>
        </div>
      </section>

      {/* Contact Grid matching reference design */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
            {/* Left Contact Info card */}
            <div className="bg-[#071a33] text-white p-8 rounded-3xl shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Contact EXSi</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We would be glad to hear from students, institutions, engineers, and potential collaborators.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-sm text-[#e3eef8]">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#55d3f1] shrink-0" />
                  <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                    {siteConfig.email}
                  </a>
                </div>

                {siteConfig.phone && <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#55d3f1] shrink-0" />
                  <span>{siteConfig.phone}</span>
                </div>}

                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#55d3f1] shrink-0" />
                  <span>{siteConfig.city}, India</span>
                </div>

                {siteConfig.linkedIn && <div className="flex items-center gap-3">
                  <Linkedin size={18} className="text-[#55d3f1] shrink-0" />
                  <a
                    href={siteConfig.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn: EXSi Technologies
                  </a>
                </div>}
              </div>

              {whatsappUrl && (
                <div className="pt-6 border-t border-white/10 text-xs text-slate-400">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm">
                    <MessageSquare size={14} /> Chat on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Right Contact Form card */}
            <div className="bg-white rounded-3xl border border-[#e2e8f0] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#071a33] mb-1">Send an Enquiry</h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in your details and we will get back to you shortly.
              </p>

              <form
                action={`mailto:${siteConfig.email}`}
                method="GET"
                className="flex flex-col gap-4 text-xs font-semibold text-[#41546b]"
              >
                <div>
                  <label className="block mb-1.5">Full name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">Email address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                  />
                </div>

                <div>
                  <label className="block mb-1.5">I am interested in</label>
                  <select
                    name="subject"
                    className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] bg-white focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                  >
                    <option value="Course enquiry">Course enquiry</option>
                    <option value="Workshop / institutional collaboration">Workshop / institutional collaboration</option>
                    <option value="Engineering services">Engineering services</option>
                    <option value="General enquiry">General enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5">Message</label>
                  <textarea
                    name="body"
                    required
                    rows={4}
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full text-xs font-bold text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer"
                  style={{
                    background: "linear-gradient(110deg, #0878d1 0%, #0755a3 100%)",
                  }}
                >
                  Send enquiry &rarr;
                </button>
              </form>
              <p className="mt-3 text-xs text-slate-500">
                Submitting opens your default email app. No enquiry is sent until you send the email there.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
