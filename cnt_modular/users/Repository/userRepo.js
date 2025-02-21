const { Op } = require("sequelize");
const { User, Expert } = require("../../../models");
const bcrypt = require("bcrypt");
const redisClient = require("../../../src/redis");
const codeGenerate = require("../Services/codeGenerate");
const axios = require("axios");

class userRepo {
  static async getFindByMobile(mobile) {
    return await User.findOne({
      where: {
        mobile: {
          [Op.eq]: mobile,
        },
      },
    });
  }
  static async createUser(mobile, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      mobile: mobile,
      password: hashedPassword,
    });
    return user;
  }
  static async updateUser(id, name, national_code) {
    try {
      const user = await User.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new Error("کاربر یافت نشد");
      }
      const updatedUser = await user.update({
        name: name,
        national_code: national_code,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getFindMobile(mobile) {
    try {
      return await User.findOne({
        where: {
          mobile: mobile,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getFindId(id) {
    try {
      const user = await User.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new Error("کاربر یافت نشد");
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateUserPassword(id, password) {
    try {
      const user = await this.getFindId(id);
      const hashedPassword = await bcrypt.hash(password, 10);
      user.update({
        password: hashedPassword,
      });
      return user; // بازگشت کاربر بروزرسانی شده
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async checkPassword(plainPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch; // true اگر مطابقت داشت، وگرنه false
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
    }
  }

  static async getCheckCacheRedis(code) {
    try {
      if (!code) {
        console.error("Invalid key provided to Redis GET:", code);
        throw new Error("Invalid key argument");
      }
      const cachedValue = await redisClient.get(String(code));
      if (cachedValue) {
        return { exists: true, cachedValue };
      }
      return { exists: false, cachedValue: null };
    } catch (error) {
      console.error("Error in Redis GET:", error);
      throw new Error("Redis caching error");
    }
  }

  static async setCacheRedis(key, value, expiration = 9000) {
    try {
      if (!key || !value) {
        throw new Error("Invalid key or value for Redis cache");
      }

      await redisClient.set(key, value, "EX", expiration);
    } catch (error) {
      console.error("Error saving data to Redis:", error);
      throw new Error("Redis caching error");
    }
  }

  static async create(data) {
    try {
      const { data_token, name, national_code, password, confirmed_password } =
        data;
      const giveUpCache = await this.getCheckCacheRedis(data_token);
      if (!giveUpCache || !giveUpCache.cachedValue) {
        throw new Error("No cached data found.");
      }
      let parsedCache;
      try {
        parsedCache = JSON.parse(giveUpCache.cachedValue);
      } catch (error) {
        throw new Error("Invalid cached data.");
      }
      const { mobile } = parsedCache;
      const codeFind = await codeGenerate.generateUnique5DigitNumber();
      const user = await User.create({
        password: await bcrypt.hash(password, 10),
        mobile: mobile,
        name: name,
        national_code: national_code,
      });
      user.update({
        username: "2" + codeFind + user.id,
      });
      const axiosInstance = axios.create({
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
      });

      try {
        const sipResponse = await axiosInstance.post(
          "https://voip.alo-komak.com:61281/api/v1/endpoint",
          { username: user.username }
        );
        if (sipResponse.data.status !== "success") {
        } else {
          const sipPassword = sipResponse.data.data.password;
          await user.update({ sip_password: sipPassword });
        }
      } catch (error) {
        console.error("Error in SIP request:", error.message);
      }
      return user;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw {
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        };
      }
      throw error;
    }
  }
}

module.exports = userRepo;
