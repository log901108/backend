'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface
          .createTable(
            'rooms_tbl',
            {
              id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
              },
              room_uuid: {
                allowNull: false,
                //primaryKey: true,
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
              },
              room_code: {
                type: Sequelize.INTEGER,
              },
              room_name: {
                type: Sequelize.STRING,
              },
              room_type: {
                type: Sequelize.INTEGER,
              },
              room_host_name: {
                type: Sequelize.STRING,
              },
              room_host_contact: {
                type: Sequelize.STRING,
              },
              room_host_address: {
                type: Sequelize.STRING,
              },
              room_address: {
                type: Sequelize.TEXT,
              },
              room_tags: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
              },
              room_details: {
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
              tableName: 'rooms_tbl',
              freezeTableName: true,
              underscored: true,
              timestamps: true,
            }
          )
          .then(function () {
            var sql =
              'ALTER TABLE "rooms_tbl" ADD CONSTRAINT "rooms_tbl_unique_index" UNIQUE ("room_uuid");';
            return queryInterface.sequelize.query(sql, {
              type: Sequelize.QueryTypes.RAW,
            });
          });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rooms_tbl');
  },
};
