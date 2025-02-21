const { check } = require("express-validator");

const ValidationNationalCode = [
  check("national_code")
    .notEmpty()
    .withMessage("کد  ملی شما خالی هست")
    .isLength({ min: 10, max: 10 })
    .withMessage(" کد ملی باید دقیقا 10 رقم باشد"),
]

module.exports = ValidationNationalCode;
