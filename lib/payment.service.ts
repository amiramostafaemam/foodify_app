// lib/payment.service.ts
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

export const createPaymentIntent = async ({
  amount,
  currency = "usd",
  customerEmail,
  customerName,
}: CreatePaymentIntentParams): Promise<PaymentIntentResponse> => {
  try {
    // Execute the function
    const execution = await functions.createExecution(
      process.env.EXPO_PUBLIC_APPWRITE_FUNCTION_PAYMENT_ID!,
      JSON.stringify({
        amount,
        currency,
        customerEmail,
        customerName,
      }),
      false, // async execution = false (wait for response)
    );

    console.log("Execution Status:", execution.status);
    console.log("Response Body:", execution.responseBody);

    // Check execution status
    if (execution.status === "completed") {
      // Check if responseBody exists and is not empty
      if (!execution.responseBody) {
        throw new Error("Empty response from payment function");
      }

      try {
        const response = JSON.parse(execution.responseBody);
        return response;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw Response:", execution.responseBody);
        throw new Error(`Invalid response format: ${execution.responseBody}`);
      }
    } else if (execution.status === "failed") {
      throw new Error(execution.errors || "Payment intent creation failed");
    } else {
      throw new Error("Unexpected execution status: " + execution.status);
    }
  } catch (error: any) {
    console.error("Create Payment Intent Error:", error);
    return {
      success: false,
      error: error.message || "Failed to create payment intent",
    };
  }
};
