const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      buyer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      paymentable_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      paymentable_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "IRT",
      },
      invoice_id: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
      },
      gateway: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.ENUM("cash", "coin", "membership", "project", "wallet"),
        allowNull: false,
        defaultValue: "cash",
      },
      status: {
        type: DataTypes.ENUM("pending", "canceled", "success", "fail"),
        allowNull: false,
        defaultValue: "pending",
      },
      site_share: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "payments",
      underscored: true,
      timestamps: true,
    }
  );

  Payment.associate = function (models) {
    Payment.belongsTo(models.User, { foreignKey: "buyer_id",  constraints: false,  as: "users" });
  };

  return Payment;
};
