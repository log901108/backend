'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface
          .createTable(
            'charges_tbl',
            {
              charge_journal_id: {
                allowNull: false,
                autoIncrement: true,
                //primaryKey: true,
                type: Sequelize.BIGINT,
              },
              charge_journal_uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
              },
              charge_item_id: {
                //! fk from charge_items_tbl
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                  model: 'charge_items_tbl',
                  key: 'charge_item_id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
              room_id: {
                //! fk from ledgers_tbl
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                  model: 'rooms_tbl',
                  key: 'room_id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
              ledger_id: {
                //! fk from ledgers_tbl
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                  model: 'ledgers_tbl',
                  key: 'ledger_id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
              account_code: {
                type: Sequelize.INTEGER,
              },
              account_title: {
                type: Sequelize.STRING,
              },
              account_type: {
                type: Sequelize.INTEGER,
              },
              account_amount: {
                type: Sequelize.BIGINT,
              },
              account_body: {
                type: Sequelize.TEXT,
              },
              account_tags: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
              },
              account_details: {
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
              tableName: 'charges_tbl',
              freezeTableName: true,
              underscored: true,
              timestamps: true,
            }
          )
          .then(function () {
            const sql =
              'CREATE INDEX tags_index_charges_tbl ON "charges_tbl"(account_tags);';
            return queryInterface.sequelize.query(sql, {
              type: Sequelize.QueryTypes.RAW,
            });
          });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('charges_tbl');
  },
};