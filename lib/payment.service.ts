import { functions } from "./appwrite";

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

const PAYMENT_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_FUNCTION_PAYMENT_ID;

/**
 * Calls the Appwrite Function that talks to Stripe with the secret key and
 * returns a PaymentIntent client secret. The secret key never touches the app.
 */
export const createPaymentIntent = async ({
  amount,
  currency = "usd",
  customerEmail,
  customerName,
}: CreatePaymentIntentParams): Promise<PaymentIntentResponse> => {
  if (!PAYMENT_FUNCTION_ID) {
    return {
      success: false,
      error: "Payment function is not configured (missing env var).",
    };
  }

  try {
    const execution = await functions.createExecution(
      PAYMENT_FUNCTION_ID,
      JSON.stringify({ amount, currency, customerEmail, customerName }),
      false,
    );

    if (execution.status !== "completed") {
      throw new Error(
        execution.errors || `Payment function ${execution.status}`,
      );
    }

    if (!execution.responseBody) {
      throw new Error("Empty response from payment function");
    }

    return JSON.parse(execution.responseBody) as PaymentIntentResponse;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create payment intent",
    };
  }
};
