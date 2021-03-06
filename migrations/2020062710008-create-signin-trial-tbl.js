'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'signin_trial_tbl',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT,
        },
        requested_userid: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        requested_password: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        trial_time: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        trial_ip: {
          type: Sequelize.STRING(50),
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
        tableName: 'signin_trial_tbl',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('signin_trial_tbl');
  },
};
