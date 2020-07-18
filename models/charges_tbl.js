module.exports = (sequelize, DataTypes) => {
  const charges_tbl = sequelize.define(
    'charges_tbl',
    {
      charge_journal_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      uuid: {
        allowNull: false,
        //primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      charge_item_id: {
        //! fk from charge_items_tbl
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'charge_items_tbl',
          key: 'charge_item_id',
        },
      },
      room_id: {
        //! fk from rooms_tbl
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'rooms_tbl',
          key: 'room_id',
        },
      },
      ledger_id: {
        //! fk from ledgers_tbl
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'ledgers_tbl',
          key: 'ledger_id',
        },
      },
      account_code: {
        type: DataTypes.INTEGER,
      },
      account_title: {
        type: DataTypes.STRING,
      },
      account_type: {
        type: DataTypes.INTEGER,
      },
      account_amount: {
        type: DataTypes.BIGINT,
      },
      account_body: {
        type: DataTypes.TEXT,
      },
      account_tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      account_details: {
        type: DataTypes.JSONB,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'charges_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  charges_tbl.associate = function (models) {
    //associations can be defined here
    charges_tbl.belongsTo(
      models.charge_items_tbl,
      { foreignKey: { name: 'charge_item_id', allowNull: true } }
      //! cascade: https://velog.io/@josworks27/Back-end-Sequelize%EC%9D%98-cascade-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
    );
    charges_tbl.belongsTo(
      models.rooms_tbl,
      { foreignKey: { name: 'room_id', allowNull: true } }
      //! cascade: https://velog.io/@josworks27/Back-end-Sequelize%EC%9D%98-cascade-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
    );
    charges_tbl.hasMany(models.payments_tbl, {
      foreignKey: { name: 'charge_journal_id', allowNull: true },
    });
  };
  return charges_tbl;
};
