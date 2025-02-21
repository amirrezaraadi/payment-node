class PaymentGatewayInterface {
    async createPayment(amount, callbackUrl, description, email, mobile) {
        throw new Error("createPayment method must be implemented");
    }

    async verifyPayment(authority, amount) {
        throw new Error("verifyPayment method must be implemented");
    }
}

module.exports = PaymentGatewayInterface;