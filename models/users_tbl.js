'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const requestIp = require('request-ip');

module.exports = (sequelize, DataTypes) => {
  const users_tbl = sequelize.define(
    'users_tbl',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT,
      },
      //https://krmannix.com/2017/05/23/postgres-autogenerated-uuids-with-sequelize/
      uuid: {
        //! used as surrogate key
        allowNull: false,
        //primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userid: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      password_hash: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      user_email: {
        type: DataTypes.STRING(100),
      },
      user_phone: {
        type: DataTypes.STRING(15),
      },
      user_details: {
        type: DataTypes.JSONB,
      },
      login_fail_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_account_lock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      latest_login_date: {
        type: DataTypes.DATE,
      },
      try_login_date: {
        type: DataTypes.DATE,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      login_ip: {
        type: DataTypes.STRING(50),
      },
      refresh_token: {
        type: DataTypes.STRING(255),
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'users_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );

  //sequelize::CLASS METHOD:: - the methods executed during lifecycle of each instance

  //the class method which change password by generated bcrypt hash when column created or updated
  users_tbl.beforeSave((user, options) => {
    if (user.changed('password_hash')) {
      user.password_hash = bcrypt.hashSync(
        user.password_hash,
        bcrypt.genSaltSync(10),
        null
      );
    }
  });

  //sequelize::INSTANCE METHOD:: - the methods give addition func

  //the instance method which increase login trial error count when login failed
  users_tbl.prototype.PlusLoginFailCount = function (user) {
    this.increment(
      { login_fail_count: 1 },
      {
        where: { userid: user.body.userid },
      }
    ).then((user) => {
      if (user.dataValues.login_fail_count >= 5) {
        return users_tbl.update(
          { is_account_lock: true },
          { where: { userid: user.dataValues.userid } }
        );
      }
    });
  };

  //the instnace method which check trial and passwd in db
  users_tbl.prototype.comparePassword = function (passwd, cb) {
    bcrypt.compare(passwd, this.password_hash, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  //the instance method which update try_login_date
  users_tbl.prototype.UpdateloginTrialDate = function (user) {
    this.update(
      {
        try_login_date: new Date(),
      },
      {
        where: { userid: user },
      }
    );
  };

  //the instance method which update is_admin by true
  users_tbl.prototype.UpdateAdminTrue = function (user) {
    this.update(
      {
        is_admin: true,
      },
      { where: { userid: user } }
    );
  };

  //the instance method which update is_admin by false
  users_tbl.prototype.UpdateAdminFalse = function (user) {
    this.update(
      {
        is_admin: false,
      },
      { where: { userid: user } }
    );
  };

  //the instance method update latest_login_date
  users_tbl.prototype.UpdateLoginDate = function (user) {
    this.update(
      {
        latest_login_date: new Date(),
      },
      { where: { userid: user } }
    );
  };

  //the instance method update login_ip
  users_tbl.prototype.UpdateLoginIp = function (client, user) {
    this.update(
      {
        login_ip: requestIp.getClientIp(client),
      },
      { where: { userid: user } }
    );
  };

  //the instance method select lock status of the user
  users_tbl.prototype.SelectlockStatus = function (user) {
    return this.is_account_lock;
  };

  //the instance method clear login_fail_count by 0 and is_account_lock as false
  users_tbl.prototype.UpdateClearLoginFailCount = function (user) {
    this.update(
      {
        login_fail_count: 0,
        is_account_lock: false,
      },
      { where: { userid: user } }
    );
  };

  //the instance method clear lock_count by 0
  users_tbl.prototype.UpdateClearLockCount = function (user) {
    this.update(
      {
        lock_count: 0,
      },
      { where: { userid: user } }
    );
  };

  //the instance method update refreshtoken
  users_tbl.prototype.UpdateRefreshtoken = async function (user, expiretime) {
    const payload = JSON.parse(
      JSON.stringify({ userid: user, signinDate: Date.now() })
    );
    var RefreshToken = await jwt.sign(payload, process.env.JWTSECRET, {
      expiresIn: expiretime,
    });

    this.update(
      {
        refresh_token: RefreshToken,
      },
      { where: { userid: user } }
    );

    return RefreshToken;
  };

  users_tbl.associate = function (models) {
    //associations can be defined here
  };
  return users_tbl;
};
