'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable(
          'settings_tbl',
          {
            setting_id: {
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              type: Sequelize.BIGINT,
            },
            corporation_name: {
              allowNull: false,
              type: Sequelize.STRING(50),
            },
            corporation_register_number: {
              allowNull: false,
              type: Sequelize.STRING(50),
            },
            corporation_address: {
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
            tableName: 'settings_tbl',
            freezeTableName: true,
            underscored: true,
            timestamps: true,
          }
        );
      })
      .then(function () {
        var sql =
          'ALTER TABLE "settings_tbl" ADD CONSTRAINT "settings_tbl_unique_index" UNIQUE ("corporation_name");';
        return queryInterface.sequelize.query(sql, {
          type: Sequelize.QueryTypes.RAW,
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('settings_tbl');
  },
};
