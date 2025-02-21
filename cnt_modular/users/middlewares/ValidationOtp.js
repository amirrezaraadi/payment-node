const { check } = require("express-validator");

const validateOtp = [
  check("otp")
    .notEmpty()
    .withMessage("کد شما خالی هست")
    .isLength({ min: 6, max: 6 })
    .withMessage("کد موبایل باید دقیقا 6 رقم باشد"),
];

module.exports = validateOtp;
