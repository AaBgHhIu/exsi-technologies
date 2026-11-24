declare module "razorpay" {
  interface RazorpayConfig {
    key_id: string;
    key_secret: string;
  }

  interface OrderCreateOptions {
    amount: number;
    currency: string;
    receipt?: string;
    notes?: Record<string, string>;
    partial_payment?: boolean;
  }

  interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
  }

  interface RazorpayOrders {
    create: (options: OrderCreateOptions) => Promise<RazorpayOrder>;
    fetch: (orderId: string) => Promise<RazorpayOrder>;
  }

  interface RazorpayPayment {
    id: string;
    order_id: string | null;
    amount: number;
    currency: string;
    status: "created" | "authorized" | "captured" | "refunded" | "failed";
  }

  interface RazorpayPayments {
    fetch: (paymentId: string) => Promise<RazorpayPayment>;
  }

  class Razorpay {
    constructor(config: RazorpayConfig);
    orders: RazorpayOrders;
    payments: RazorpayPayments;
  }

  export = Razorpay;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

interface Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
}
