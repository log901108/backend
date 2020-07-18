'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface
          .createTable(
            'tenants_tbl',
            {
              tenant_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
              },
              tenant_uuid: {
                allowNull: false,
                //primaryKey: true,
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
              },
              tenant_name: {
                type: Sequelize.STRING,
              },
              tenant_type: {
                type: Sequelize.INTEGER,
              },
              tenant_contact_info: {
                type: Sequelize.STRING(15),
              },
              tenant_address: {
                type: Sequelize.TEXT,
              },
              tenant_tags: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
              },
              tenant_details: {
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
              tableName: 'tenants_tbl',
              freezeTableName: true,
              underscored: true,
              timestamps: true,
            }
          )
          .then(function () {
            const sql =
              'CREATE INDEX tags_index_tenants_tbl ON "tenants_tbl"(tenant_tags);';
            return queryInterface.sequelize.query(sql, {
              type: Sequelize.QueryTypes.RAW,
            });
          });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tenants_tbl');
  },
};
