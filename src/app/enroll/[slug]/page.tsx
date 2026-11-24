import { redirect } from "next/navigation";

export default function EnrollPage({ params }: { params: { slug: string } }) {
  // Seamless redirect back to the course detail page so everything stays in-page!
  redirect(`/courses/${params.slug}`);
}
