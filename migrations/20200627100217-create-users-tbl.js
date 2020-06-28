'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(
        'users_tbl',
        {
          _id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
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
            type: Sequelize.STRING(15),
          },
          refresh_token: {
            type: Sequelize.STRING(255),
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,

            type: Sequelize.DATE,
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        },
        {
          tableName: 'users_tbl',
          freezeTableName: true,
          underscored: true,
          timestamps: true,
        }
      )

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
