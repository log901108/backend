'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface
          .createTable(
            'chargepayment_tbl',
            {
              chargepayment_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
              },
              payment_journal_id: {
                //! fk from charge_journal_tbl
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                  model: 'payments_tbl',
                  key: 'payment_journal_id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
              charge_journal_id: {
                //! fk from charge_journal_tbl
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                  model: 'charges_tbl',
                  key: 'charge_journal_id',
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
              tableName: 'chargepayment_tbl',
              freezeTableName: true,
              underscored: true,
              timestamps: true,
            }
          )
          .then(function () {
            //const sql =
            //  'CREATE INDEX "tags_index_payments_tbl" ON "payments_tbl"(account_tags);';
            //return queryInterface.sequelize.query(sql, {
            //  type: Sequelize.QueryTypes.RAW,
            //});
          });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('chargepayment_tbl');
  },
};
