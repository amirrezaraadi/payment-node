const { check } = require("express-validator");

const validateMobile = [
  check("mobile")
    .notEmpty()
    .withMessage("شماره موبایل نمی‌تواند خالی باشد")
    .matches(/^09[0-9]{9}$/)
    .withMessage("شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد")
    .isLength({ min: 11, max: 11 })
    .withMessage("شماره موبایل باید دقیقا ۱۱ رقم باشد"),
];

module.exports = validateMobile;
