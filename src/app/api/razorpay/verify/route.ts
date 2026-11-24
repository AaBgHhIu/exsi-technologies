import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Supabase is not configured." }, { status: 503 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Sign in before verifying a payment." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const enrollmentId = typeof body.enrollmentId === "string" ? body.enrollmentId : "";
    const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
    const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!enrollmentId || !orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: "Incomplete payment data received." },
        { status: 400 }
      );
    }
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay is not configured on the server." },
        { status: 503 }
      );
    }

    const payload = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");
    const generatedBuffer = Buffer.from(generatedSignature, "hex");
    const suppliedBuffer = Buffer.from(signature, "hex");
    if (
      generatedBuffer.length !== suppliedBuffer.length ||
      !crypto.timingSafeEqual(generatedBuffer, suppliedBuffer)
    ) {
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id,status,payment_id,order_id,courses!inner(slug,fee)")
      .eq("id", enrollmentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { success: false, error: "The registration for this payment was not found." },
        { status: 404 }
      );
    }

    if (enrollment.status === "approved" && enrollment.payment_id === paymentId) {
      return NextResponse.json({
        success: true,
        message: "Payment was already verified.",
        paymentId,
        orderId,
      });
    }
    if (enrollment.order_id !== orderId) {
      return NextResponse.json(
        { success: false, error: "This payment order is not associated with the registration." },
        { status: 400 }
      );
    }
    if (enrollment.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "This registration is no longer awaiting payment." },
        { status: 409 }
      );
    }

    const course = Array.isArray(enrollment.courses)
      ? enrollment.courses[0]
      : enrollment.courses;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const [order, payment] = await Promise.all([
      razorpay.orders.fetch(orderId),
      razorpay.payments.fetch(paymentId),
    ]);

    if (
      order.notes?.enrollmentId !== enrollment.id ||
      order.notes?.userId !== user.id ||
      order.notes?.courseSlug !== course?.slug ||
      order.amount !== (course?.fee || 0) * 100 ||
      order.currency !== "INR" ||
      payment.order_id !== orderId ||
      payment.amount !== (course?.fee || 0) * 100 ||
      payment.currency !== "INR" ||
      payment.status !== "captured"
    ) {
      return NextResponse.json(
        { success: false, error: "The payment does not match this registration." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, error: "Payment persistence is not configured on the server." },
        { status: 503 }
      );
    }

    const { error: updateError } = await adminClient
      .from("enrollments")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        payment_id: paymentId,
        order_id: orderId,
        payment_method: "online_razorpay",
      })
      .eq("id", enrollment.id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .select("id")
      .single();

    if (updateError) {
      console.error("Could not save verified payment:", updateError.message);
      return NextResponse.json(
        { success: false, error: "Payment was verified, but registration could not be updated." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and registration approved.",
      paymentId,
      orderId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal verification error";
    console.error("Razorpay verification error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
