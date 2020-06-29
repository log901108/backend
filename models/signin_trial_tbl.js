'use strict';

module.exports = (sequelize, DataTypes) => {
  const signin_trial_tbl = sequelize.define(
    'signin_trial_tbl',

    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      requested_userid: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      requested_password: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      trial_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      trial_ip: {
        type: DataTypes.STRING(50),
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
      tableName: 'signin_trial_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  signin_trial_tbl.associate = function (models) {
    //associations can be defined here
  };
  return signin_trial_tbl;
};
