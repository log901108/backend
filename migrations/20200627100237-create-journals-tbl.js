'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(
        'journals_tbl',
        {
          _id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
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
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        },
        {
          tableName: 'journals_tbl',
          freezeTableName: true,
          underscored: true,
          timestamps: true,
        }
      )
      .then(function () {
        return queryInterface.sequelize.query(
          'CREATE INDEX tags_index ON journals_tbl(account_tags);'
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('journals_tbl');
  },
};
