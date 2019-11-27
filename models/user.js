const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };

  User.validPassword = function(inputPwd, dbPwd) {
    return bcrypt.compareSync(inputPwd, dbPwd);
  };

  User.associate = function(models){
    User.hasMany(models.history, {
      onDelete: "cascade"
    });
  };

  return User;
};
