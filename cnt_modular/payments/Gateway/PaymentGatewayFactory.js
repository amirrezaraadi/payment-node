const ZarinPalService = require("../Services/ZarinPalService");
const JIbitService = require("../Services/JIbitService");

class PaymentGatewayFactory {
    static getGateway(gatewayName) {
        switch (gatewayName) {
            case "zarinpal":
                return new ZarinPalService();
            case "jibit":
                return new JIbitService();
            default:
                throw new Error("درگاه پرداخت نامعتبر است");
        }
    }
}

module.exports = PaymentGatewayFactory;
