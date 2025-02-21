require("dotenv").config();
const crypto = require("crypto");

class CodeGenerate {
  static generateVerificationCode() {
    if (process.env.NODE_ENV_PRODUCT === "production") {
      return Math.floor(100000 + Math.random() * 900000);
    }
    return 123456;
  }

  
  static async data_token() {
    return crypto.randomBytes(16).toString("hex");
  }
  static async generateUnique8DigitNumber() {
    const generatedNumbers = new Set();
    while (true) {
      const number = Math.floor(10000000 + Math.random() * 90000000);
      if (!generatedNumbers.has(number)) {
        generatedNumbers.add(number);
        return number;
      }
    }
  }


  static async generateUnique5DigitNumber() {
    const generatedNumbers = new Set();
    while (true) {
      const number = Math.floor(10000 + Math.random() * 90000); // بازه‌ی 10000 تا 99999
      if (!generatedNumbers.has(number)) {
        generatedNumbers.add(number);
        return number;
      }
    }
  }
}

module.exports = CodeGenerate;
