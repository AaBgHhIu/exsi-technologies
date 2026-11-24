import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Sign in before starting checkout." }, { status: 401 });
    }

    const body = await req.json();
    const enrollmentId = typeof body.enrollmentId === "string" ? body.enrollmentId : "";
    if (!enrollmentId) {
      return NextResponse.json({ error: "An enrollment ID is required." }, { status: 400 });
    }

    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id,status,order_id,courses!inner(slug,title,fee,is_active)")
      .eq("id", enrollmentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (enrollmentError) {
      console.error("Could not load enrollment for payment:", enrollmentError.message);
      return NextResponse.json(
        { error: "Could not load your registration for checkout." },
        { status: 500 }
      );
    }

    const course = Array.isArray(enrollment?.courses)
      ? enrollment.courses[0]
      : enrollment?.courses;
    if (!enrollment || !course || !course.is_active || enrollment.status !== "pending") {
      return NextResponse.json(
        { error: "This registration is unavailable for payment." },
        { status: 404 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const missingVariables = [
      !keyId && "NEXT_PUBLIC_RAZORPAY_KEY_ID",
      !keySecret && "RAZORPAY_KEY_SECRET",
      !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter((variable): variable is string => Boolean(variable));

    if (!keyId || !keySecret || !serviceRoleKey) {
      return NextResponse.json(
        {
          error: `Missing Vercel environment variable(s): ${missingVariables.join(", ")}.`,
          missingConfig: true,
        },
        { status: 503 }
      );
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        {
          error: "Could not initialize Supabase server credentials. Check SUPABASE_SERVICE_ROLE_KEY.",
          missingConfig: true,
        },
        { status: 503 }
      );
    }

    const amountInPaise = course.fee * 100;
    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json({ error: "Course fee is not valid for payment." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    if (enrollment.order_id) {
      const existingOrder = await razorpay.orders.fetch(enrollment.order_id);
      if (
        existingOrder.notes?.enrollmentId !== enrollment.id ||
        existingOrder.notes?.userId !== user.id ||
        existingOrder.notes?.courseSlug !== course.slug ||
        existingOrder.amount !== amountInPaise ||
        existingOrder.currency !== "INR"
      ) {
        return NextResponse.json(
          { error: "The existing payment order does not match this registration." },
          { status: 409 }
        );
      }
      if (existingOrder.status === "paid") {
        return NextResponse.json(
          { error: "Payment was already received. Refresh your student dashboard." },
          { status: 409 }
        );
      }

      return NextResponse.json({
        orderId: existingOrder.id,
        amount: existingOrder.amount,
        currency: existingOrder.currency,
        keyId,
      });
    }

    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        enrollmentId: enrollment.id,
        userId: user.id,
        courseSlug: course.slug,
      },
    });

    const { error: orderSaveError } = await adminClient
      .from("enrollments")
      .update({ order_id: order.id })
      .eq("id", enrollment.id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .is("order_id", null)
      .select("id")
      .single();

    if (orderSaveError) {
      console.error("Could not save Razorpay order on enrollment:", orderSaveError.message);
      return NextResponse.json(
        { error: "Could not associate the payment order with your registration." },
        { status: 500 }
      );
    }

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
