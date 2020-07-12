module.exports = (sequelize, DataTypes) => {
  const charge_items_tbl = sequelize.define(
    'charge_items_tbl',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      charge_item_code: {
        //! fk of charges_tbl
        type: DataTypes.STRING,
        allowNull: false,
      },
      charge_item_title: {
        type: DataTypes.STRING,
      },
      charge_item_type: {
        type: DataTypes.INTEGER,
      },
      charge_item_body: {
        type: DataTypes.TEXT,
      },
      charge_item_tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      charge_item_details: {
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
      tableName: 'charge_items_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  charge_items_tbl.associate = function (models) {
    //associations can be defined here
    charge_items_tbl.hasMany(models.charges_tbl);
  };
  return charge_items_tbl;
};
