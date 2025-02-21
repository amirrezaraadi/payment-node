const { User } = require("../../../models");
const jwt = require("jsonwebtoken");
const codeGenerate = require("../Services/codeGenerate");
const redisClient = require("../../../src/redis"); // استفاده از کلاینت موجود
const userRepo = require("../Repository/userRepo");
const crypto = require("crypto");
const { log } = require("console");
const expertRepo = require("../../experts/Repository/expertRepo");

class UserController {
  static async registerUser(req, res) {
    try {
      const { mobile } = req.body;
      const userCheck = await userRepo.getFindMobile(mobile);
      if (userCheck) {
        return res.status(400).json({
          status: "error",
          message: "این شماره قبلاً ثبت شده است.",
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000);
      const cachedCode = await redisClient.get(mobile);
      if (cachedCode) {
        return res.status(200).json({
          status: "success",
          message: "کد برای این شماره قبلاً ایجاد شده است",
        });
      }
      const sendSms = await codeGenerate.sendSmsMobile(mobile, code);
      await redisClient.set(mobile, code, {
        EX: 300, // زمان انقضا: ۵ دقیقه
      });
      res.status(200).json({
        status: "success",
        message: "کد ایجاد و ذخیره شد",
        mobile,
        remaining_time: 240,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error processing request", error: error.message });
    }
  }
  static async verifyMobile(req, res) {
    try {
      const { mobile, otp } = req.body;
      const cachedCode = await redisClient.get(mobile);
      if (!cachedCode) {
        return res.status(200).json({
          status: "error",
          message: "زمان استفاده از کد به پایان رسیده است",
        });
      }

      if (cachedCode === otp) {
        const data_token = await codeGenerate.data_token();
        const redisValue = {
          mobile: mobile,
        };
        await userRepo.setCacheRedis(data_token, JSON.stringify(redisValue));
        res.status(200).json({
          message: "به درستی تایید شد",
          status: "success",
          data_token: data_token,
        });
      } else {
        res.status(500).json({
          message: "کد نا معتبر",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        message: "خطا در پردازش درخواست",
        error: error.message,
      });
    }
  }
  static async completeIdentityInformation(req, res) {
    try {
      const { data_token, name, national_code, password, confirmed_password } =
        req.body;
      const cachedCode = await redisClient.get(data_token);
      if (!cachedCode) {
        return res.status(400).json({
          status: "error",
          message: "زمان استفاده از کد به پایان رسیده است",
        });
      }

      if (password !== confirmed_password) {
        return res.status(500).json({
          status: "error",
          message: "رمز و تایید رمز باهم تطابق ندارند",
        });
      }

      const user = await userRepo.create(req.body);
      if (!user || user instanceof Error) {
        return res.status(400).json({
          status: "error",
          message: "خطا در ایجاد کاربر جدید",
          error: user.message || "Unknown error",
          details: user.errors || null, // اضافه کردن جزئیات خطا
        });
      }

      const payload = {
        id: user.id,
        username: user.username,
        mobile: user.mobile,
        role: "user",
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "24hours",
      });
      
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000,
        path: "/",
        sameSite: "Strict",
      });
      return res.status(200).json({
        message: "Login successful.",
        status: "success",
        token,
        data: {
          id: user.id,
          mobile: user.mobile,
          name: user.fname,
          status: user.status,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "خطا در بروزرسانی اطلاعات کاربر",
        error: error.message,
        details: error.errors
          ? error.errors.map((err) => err.message) // فقط message
          : null,
      });
    }
  }
  static async resetPasswordUser(req, res) {
    try {
      const { mobile } = req.body;
      const userMobile = await userRepo.getFindMobile(mobile);
      if (!userMobile) {
        return res.status(404).json({
          status: "error",
          message: "همچین کاربری وجود ندارد",
        });
      }
      const code = Math.floor(100000 + Math.random() * 900000);
      const sendSms = await codeGenerate.sendSmsMobile(mobile, code);
      await redisClient.set(mobile, code, {
        EX: 300,
      });
      res.status(200).json({
        status: "success",
        message: "کد برای این شماره ارسال شد",
        remaining_time: 240,
        mobile,
        code,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: "خطا در پردازش درخواست",
        error: error.message,
      });
    }
  }
  static async resetPasswordUserVerifyMobile(req, res) {
    try {
      const { mobile, otp } = req.body;
      const cachedCode = await redisClient.get(mobile);
      if (!cachedCode) {
        return res.status(200).json({
          status: "error",
          message: "زمان استفاده از کد به پایان رسیده است",
        });
      }
      if (cachedCode === otp) {
        const user = await userRepo.getFindByMobile(mobile);
        if (user) {
          const data_token = await codeGenerate.data_token();
          await redisClient.set(data_token, user.id, {
            EX: 300,
          });
          res.status(200).json({
            status: "success",
            message: "کاربر با موفقیت ثبت شد",
            user: {
              id: user.id,
              mobile: user.mobile,
              code: data_token, // کد یکتا
            },
          });
        }
      } else {
        return res.status(400).json({
          status: "error",
          message: "کد وارد شده صحیح نمی‌باشد",
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        message: "خطا در پردازش درخواست",
        error: error.message,
      });
    }
  }
  static async passwordUpdateUser(req, res) {
    try {
      const { data_token, password } = req.body;
      const cachedCode = await redisClient.get(data_token);
      if (!cachedCode) {
        return res.status(400).json({
          status: "error",
          message: "زمان استفاده از کد به پایان رسیده است",
        });
      }
      const user = await userRepo.updateUserPassword(cachedCode, password);
      const payload = {
        id: user.id,
        username: user.username,
        mobile: user.mobile,
        role: "user",
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "24hours",
      });
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000,
        path: "/",
        sameSite: "Strict",
      });
      return res.status(200).json({
        message: "Login successful.",
        status: "success",
        token,
        data: {
          id: user.id,
          mobile: user.mobile,
          username: user.username,
          status: user.status,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "خطا در بروزرسانی اطلاعات کاربر",
        error: error.message,
      });
    }
  }
  static async login(req, res) {
    try {
      const { mobile, password } = req.body;
      const user = await userRepo.getFindMobile(mobile);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "کاربر یافت نشد",
        });
      }
      const checkPassword = await userRepo.checkPassword(
        password,
        user.password
      );
      if (!checkPassword) {
        return res.status(401).json({
          status: "error",
          message: "رمز عبور اشتباه است",
        });
      }
      const payload = {
        id: user.id,
        username: user.username,
        mobile: user.mobile,
        role: "user",
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      });

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000,
        path: "/",
        sameSite: "Strict",
      });

      res.status(200).json({
        status: "success",
        message: "خوش آمدید",
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "مشکلی در سرور رخ داده است",
      });
    }
  }
}
module.exports = UserController;
