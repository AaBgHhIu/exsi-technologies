"use client";

/**
 * Loads the official Razorpay Checkout SDK script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentParams {
  enrollmentId: string;
  courseTitle: string;
  courseSlug: string;
  fee: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
}

export interface RazorpayPaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
  missingConfig?: boolean;
}

/**
 * Initiates the complete Razorpay payment flow:
 * 1. Creates order via Next.js backend API
 * 2. Opens official Razorpay modal
 * 3. Verifies payment signature on the backend
 */
export async function initiateRazorpayPayment(
  params: RazorpayPaymentParams
): Promise<RazorpayPaymentResult> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    return {
      success: false,
      error: "Unable to load Razorpay payment gateway. Please check your internet connection.",
    };
  }

  // 1. Create Order on our backend
  let orderData;
  try {
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId: params.enrollmentId }),
    });

    orderData = await res.json();

    if (!res.ok || orderData.error) {
      return {
        success: false,
        error: orderData.error || "Failed to create payment order.",
        missingConfig: Boolean(orderData.missingConfig),
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error creating payment order.",
    };
  }

  // 2. Open Razorpay Checkout Modal
  return new Promise((resolve) => {
    const options: RazorpayOptions = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "EXSi Technologies",
      description: `Course Registration: ${params.courseTitle}`,
      image: "/images/logo.svg",
      order_id: orderData.orderId,
      prefill: {
        name: params.studentName,
        email: params.studentEmail,
        contact: params.studentPhone || "",
      },
      notes: {
        courseTitle: params.courseTitle,
        courseSlug: params.courseSlug,
      },
      theme: {
        color: "#0e6fd0",
      },
      modal: {
        ondismiss: () => {
          resolve({
            success: false,
            error: "Payment cancelled by user.",
          });
        },
      },
      handler: async (response: RazorpayResponse) => {
        // 3. Verify Payment Signature on backend
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, enrollmentId: params.enrollmentId }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
          } else {
            resolve({
              success: false,
              error: verifyData.error || "Payment verification failed.",
            });
          }
        } catch (verifyErr: unknown) {
          resolve({
            success: false,
            error:
              verifyErr instanceof Error
                ? verifyErr.message
                : "Payment signature verification failed.",
          });
        }
      },
    };

    const rzp = new window.Razorpay!(options);
    rzp.open();
  });
}
