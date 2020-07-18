'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(
        'ledgers_tbl',
        {
          ledger_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          ledger_title: {
            type: Sequelize.STRING,
          },
          ledger_type: {
            type: Sequelize.INTEGER,
          },
          ledger_body: {
            type: Sequelize.TEXT,
          },
          ledger_tags: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
          },
          ledger_details: {
            type: Sequelize.JSONB,
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
          tableName: 'ledgers_tbl',
          freezeTableName: true,
          underscored: true,
          timestamps: true,
        }
      )
      .then(function () {
        var sql =
          'ALTER TABLE "ledgers_tbl" ADD CONSTRAINT "ledgers_tbl_unique_index" UNIQUE ("ledger_title");';
        return queryInterface.sequelize.query(sql, {
          type: Sequelize.QueryTypes.RAW,
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ledgers_tbl');
  },
};
