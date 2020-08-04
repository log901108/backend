'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface
          .createTable(
            'voucher_associations_tbl',
            {
              voucher_association_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
              },
              credit_voucher_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                  model: 'vouchers_tbl',
                  key: 'voucher_id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
              debit_voucher_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                  model: 'vouchers_tbl',
                  key: 'voucher_id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
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
              tableName: 'voucher_associations_tbl',
              freezeTableName: true,
              underscored: true,
              timestamps: true,
            }
          )
          .then(function () {
            /*const sql =
              'CREATE INDEX tags_index_journals_tbl ON "journals_tbl"(account_tags);';
            return queryInterface.sequelize.query(sql, {
              type: Sequelize.QueryTypes.RAW,
            });*/
          });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('voucher_associations_tbl');
  },
};
