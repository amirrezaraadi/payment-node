const paymentRepo = require("../Repository/paymentRepo");
const PaymentGatewayFactory = require("../Gateway/PaymentGatewayFactory");

class PaymentController {
  static async store(req, res) {
    try {
      const { amount, callbackUrl, description, email, mobile, payment_method } = req.body;
      const gatewayName = req.body.gateway || "zarinpal"; 
      const paymentGateway = PaymentGatewayFactory.getGateway(gatewayName);
      const paymentResponse = await paymentGateway.createPayment(amount, callbackUrl, description, email, mobile);
      if (!paymentResponse.success) {
        return res.status(400).json({ message: "خطا در ایجاد درخواست پرداخت", status: "error" });
      }
      const paymentData = {
        buyer_id: req.user.id,
        paymentable_type: req.user.role,
        paymentable_id: req.user.id,
        amount,
        currency: "IRT",
        invoice_id: paymentResponse.authority,
        gateway: gatewayName,
        payment_method: payment_method || "cash",
        status: "pending",
        site_share: 0,
      };

      await paymentRepo.created(paymentData);

      res.status(200).json({
        message: "پرداخت با موفقیت ایجاد شد",
        status: "success",
        url: paymentResponse.url,
        authority: paymentResponse.authority,
      });
    } catch (error) {
      res.status(500).json({ message: error.message || "خطا در ایجاد درخواست پرداخت", status: "error" });
    }
  }

  static async verify(req, res) {
    try {
      const { Authority, Status } = req.query;
      if (Status !== "OK") {
        return res.status(400).json({ message: "پرداخت ناموفق یا لغو شد.", status: "error" });
      }

      const payment = await paymentRepo.findByInvoiceId(Authority);
      if (!payment) {
        return res.status(404).json({ message: "تراکنش یافت نشد.", status: "error" });
      }

      const paymentGateway = PaymentGatewayFactory.getGateway(payment.gateway);
      const verification = await paymentGateway.verifyPayment(payment.invoice_id, payment.amount);

      if (!verification.success) {
        return res.status(400).json({ message: "پرداخت تأیید نشد.", status: "error" });
      }

      await paymentRepo.updateStatus(Authority, "success");

      res.status(200).json({
        message: "پرداخت موفق!",
        status: "success",
        refID: verification.refID,
      });
    } catch (error) {
      res.status(500).json({ message: error.message || "error", status: "error" });
    }
  }
}

module.exports = PaymentController;
