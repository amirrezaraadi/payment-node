module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING(11),
        allowNull: true,
        unique: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
      },
      
      username: {
        type: DataTypes.BIGINT,
        allowNull: true,
        unique: true
      },
      sip_password: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      national_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users", // نام جدول را مشخص می‌کنیم
      underscored: true, // تبدیل createdAt => created_at
    }
  );

  User.associate = function (models) {
    // روابط مدل‌ها در اینجا تعریف می‌شود
  };

  return User;
};
