const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const upload = require("../middlewares/multer");
const verifyToken = require("../middlewares/verifyToken");
const { validationResult } = require("express-validator");

router.post('/payments/pay' , verifyToken , PaymentController.store);
router.get('/payments/verify'  , PaymentController.verify);

module.exports = router;
