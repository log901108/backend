'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface
          .createTable(
            'data_tbl',
            {
              data_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
              },
              data_uuid: {
                allowNull: false,
                //primaryKey: true,
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
              },
              data: {
                type: Sequelize.TEXT,
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
              tableName: 'data_tbl',
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
    return queryInterface.dropTable('data_tbl');
  },
};
