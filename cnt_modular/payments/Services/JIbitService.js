const PaymentGatewayInterface = require("../Gateway/PaymentGatewayInterface");

class JIbitService extends PaymentGatewayInterface {
    async createPayment(amount, callbackUrl, description, email, mobile) {
    }

    async verifyPayment(authority, amount) {
    }
}

module.exports = JIbitService;
