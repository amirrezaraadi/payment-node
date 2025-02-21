const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const upload = require("../middlewares/multer");
const validateMobile = require("../middlewares/ValidationMobile");
const validateOtp = require("../middlewares/ValidationOtp");
const ValidationNationalCode = require("../middlewares/ValidationNationalCode");
const { validationResult } = require("express-validator");

router.post(
  "/give-mobile",
  upload.none(),
  validateMobile,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    next();
  },
  UserController.registerUser
);
router.post(
  "/verify-mobile",
  upload.none(),
  validateMobile,
  validateOtp,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    next();
  },
  UserController.verifyMobile
);
router.post(
  "/complete-identity-information",
  upload.none(),
  ValidationNationalCode,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    next();
  },
  UserController.completeIdentityInformation
);
router.post(
  "/reset-password/send-otp",
  upload.none(),
  validateMobile,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    next();
  },
  UserController.resetPasswordUser
);
router.post(
  "/reset-password/verify-mobile",
  upload.none(),
  validateMobile,
  validateOtp,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    next();
  },
  UserController.resetPasswordUserVerifyMobile
);
router.post(
  "/reset-password/password-update",
  upload.none(),
  UserController.passwordUpdateUser
);
router.post(
  "/login",
  upload.none(),
  validateMobile,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    next();
  },
  UserController.login
);
module.exports = router;
