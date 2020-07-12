module.exports = (sequelize, DataTypes) => {
  const charges_tbl = sequelize.define(
    'charges_tbl',
    {
      id: {
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
      charge_items_tbl_id: {
        //! fk of charges_tbl
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
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
    charges_tbl.belongsTo(models.charge_items_tbl, {
      foreignKey: 'charge_items_tbl_id',
    });
  };
  return charges_tbl;
};
