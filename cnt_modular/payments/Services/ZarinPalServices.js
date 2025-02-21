const ZarinpalCheckout = require('zarinpal-checkout');
const merchantId = process.env.YOUR_MERCHANT_ID;
const zarinpal = ZarinpalCheckout.create(merchantId, false); 
console.log(merchantId , 'merchantId');

class ZarinPalService {
    static async createPayment(amount, callbackUrl, description, email, mobile) {
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

    static async verifyPayment(authority, amount) {
        try {
            console.log(authority, amount , parseInt(amount));
            
            const response = await zarinpal.PaymentVerification({
                Amount: parseInt(amount),
                Authority: authority,
            });
                console.log(response , 'response');
                
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
