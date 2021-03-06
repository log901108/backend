'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable(
          'users_tbl',
          {
            id: {
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              type: Sequelize.BIGINT,
            },
            uuid: {
              allowNull: false,
              //primaryKey: true,
              type: Sequelize.DataTypes.UUID,
              defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            userid: {
              allowNull: false,
              type: Sequelize.STRING(50),
            },
            password_hash: {
              allowNull: false,
              type: Sequelize.STRING(255),
            },
            username: {
              allowNull: false,
              type: Sequelize.STRING(50),
            },
            user_email: {
              type: Sequelize.STRING(100),
            },
            user_phone: {
              type: Sequelize.STRING(15),
            },
            user_details: {
              type: Sequelize.JSONB,
            },
            login_fail_count: {
              type: Sequelize.INTEGER,
              defaultValue: 0,
            },
            is_account_lock: {
              type: Sequelize.BOOLEAN,
              defaultValue: false,
            },
            latest_login_date: {
              type: Sequelize.DATE,
            },
            try_login_date: {
              type: Sequelize.DATE,
            },
            is_admin: {
              type: Sequelize.BOOLEAN,
              defaultValue: false,
            },
            login_ip: {
              type: Sequelize.STRING(50),
            },
            refresh_token: {
              type: Sequelize.STRING(255),
            },
            createdAt: {
              field: 'created_at',
              type: Sequelize.DATE,
              allowNull: false,
            },
            updatedAt: {
              field: 'updated_at',
              type: Sequelize.DATE,
              allowNull: false,
            },
            deletedAt: {
              field: 'deleted_at',
              type: Sequelize.DATE,
            },
          },
          {
            tableName: 'users_tbl',
            freezeTableName: true,
            underscored: true,
            timestamps: true,
          }
        );
      })
      .then(function () {
        var sql =
          'ALTER TABLE "users_tbl" ADD CONSTRAINT "users_tbl_unique_index" UNIQUE ("userid");';
        return queryInterface.sequelize.query(sql, {
          type: Sequelize.QueryTypes.RAW,
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_tbl');
  },
};
