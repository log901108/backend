'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(
        'charge_items_tbl',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },
          charge_item_code: {
            type: Sequelize.STRING,
            primaryKey: true,
          },
          charge_item_title: {
            type: Sequelize.STRING,
          },
          charge_item_type: {
            type: Sequelize.INTEGER,
          },
          charge_item_body: {
            type: Sequelize.TEXT,
          },
          charge_item_tags: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
          },
          charge_item_details: {
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
          tableName: 'charge_items_tbl',
          freezeTableName: true,
          underscored: true,
          timestamps: true,
        }
      )
      .then(function () {
        var sql =
          'ALTER TABLE "charge_items_tbl" ADD CONSTRAINT "charge_items_tbl_unique_index" UNIQUE ("charge_item_code");';
        return queryInterface.sequelize.query(sql, {
          type: Sequelize.QueryTypes.RAW,
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('charge_items_tbl');
  },
};
