const ZarinpalCheckout = require('zarinpal-checkout');
const PaymentGatewayInterface = require("../Gateway/PaymentGatewayInterface");

const merchantId = process.env.ZARINPAL_MERCHANT_ID;
const zarinpal = ZarinpalCheckout.create(merchantId, false);

class ZarinPalService extends PaymentGatewayInterface {
    async createPayment(amount, callbackUrl, description, email, mobile) {
        try {
            const response = await zarinpal.PaymentRequest({
                Amount: amount, 
                CallbackURL: callbackUrl,
                Description: description,
                Email: email, 
                Mobile: mobile, 
            });

            if (response.status === 100) {
                return { success: true, url: response.url, authority: response.authority };
            } else {
                return { success: false, message: "خطا در ایجاد درخواست پرداخت" };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async verifyPayment(authority, amount) {
        try {
            const response = await zarinpal.PaymentVerification({
                Amount: parseInt(amount),
                Authority: authority,
            });

            if (response.status === 100) {
                return { success: true, refID: response.RefID };
            } else {
                return { success: false, message: "پرداخت ناموفق" };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

module.exports = ZarinPalService;
