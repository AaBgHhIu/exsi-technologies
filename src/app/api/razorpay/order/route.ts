import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCourseBySlug } from "@/config/courses";

function parseFee(feeString: string): number | null {
  const cleaned = feeString.replace(/[^\d.]/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseSlug, studentEmail, studentName } = body;
    const course = typeof courseSlug === "string" ? getCourseBySlug(courseSlug) : undefined;
    const numericAmount = course && !course.enquiryOnly ? parseFee(course.fee) : null;

    if (!course || !numericAmount) {
      return NextResponse.json(
        { error: "This programme is available by enquiry; payment details are not currently configured." },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.trim() === "" || keySecret.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Razorpay API Keys are not configured in .env.local (NEXT_PUBLIC_RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET).",
          missingConfig: true,
        },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(numericAmount * 100);

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        courseTitle: course.title,
        courseSlug: course.slug,
        studentEmail: studentEmail || "",
        studentName: studentName || "",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create Razorpay order";
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
