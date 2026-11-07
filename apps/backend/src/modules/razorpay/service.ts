import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import Razorpay from "razorpay"

type RazorpayOptions = {
    key_id: string
    key_secret: string
}

class RazorpayProviderService extends AbstractPaymentProvider<RazorpayOptions> {
    static identifier = "razorpay"
    protected razorpay_: Razorpay

    constructor(container: any, options: RazorpayOptions) {
        super(container, options)

        // Initialize the official Razorpay SDK using the keys from your .env
        this.razorpay_ = new Razorpay({
            key_id: options.key_id,
            key_secret: options.key_secret,
        })
    }

    // 1. When the user loads checkout, Medusa calls this to generate a Razorpay Order
    async initiatePayment(input: any): Promise<any> {
        try {
            const order = await this.razorpay_.orders.create({
                amount: Math.round(input.amount * 100), // Razorpay expects paise (₹1 = 100 paise)
                currency: input.currency_code.toUpperCase(),
                receipt: input.resource_id,
            })

            return {
                // We pass this data back to Next.js to open the popup modal
                data: {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                },
            }
        } catch (error: any) {
            return {
                error: error.message,
                code: "unknown",
            }
        }
    }

    // 2. If the cart updates, we generate a new Razorpay Order
    async updatePayment(input: any): Promise<any> {
        return this.initiatePayment(input)
    }

    // 3. Newly required methods for Webhooks and fetching sessions
    async retrievePayment(input: any): Promise<any> {
        return { data: input.data }
    }

    async getWebhookActionAndData(input: any): Promise<any> {
        // Phase 2: We will build the Razorpay cryptographic signature verification here!
        return { action: "not_supported" }
    }

    // 4. Standard Boilerplate methods required by Medusa v2
    async authorizePayment(input: any): Promise<any> {
        return { data: input.data, status: "authorized" }
    }

    async capturePayment(input: any): Promise<any> {
        return { data: input.data }
    }

    async cancelPayment(input: any): Promise<any> {
        return { data: input.data }
    }

    async deletePayment(input: any): Promise<any> {
        return { data: input.data }
    }

    async getPaymentStatus(input: any): Promise<any> {
        return { data: input.data, status: "authorized" }
    }

    async refundPayment(input: any): Promise<any> {
        return { data: input.data }
    }
}

export default RazorpayProviderService