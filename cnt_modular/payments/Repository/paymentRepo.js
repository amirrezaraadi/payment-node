const { Op } = require("sequelize");
const { Payment } = require("../../../models");

class paymentRepo {
    static async created(paymentData) {
        try {
          return await Payment.create(paymentData);
        } catch (error) {
          console.error("Error creating payment:", error.message);
          return null;
        }
      }
    
      static async findByInvoiceId(invoice_id) {
        try {
          return await Payment.findOne({ where: { invoice_id } });
        } catch (error) {
          console.error("Error finding payment:", error.message);
          return null;
        }
      }
    
      static async updateStatus(invoice_id, status) {
        try {
          return await Payment.update({ status }, { where: { invoice_id } });
        } catch (error) {
          console.error("Error updating payment status:", error.message);
          return null;
        }
      }
}

module.exports = paymentRepo;
