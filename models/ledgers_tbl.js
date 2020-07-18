module.exports = (sequelize, DataTypes) => {
  const ledgers_tbl = sequelize.define(
    'ledgers_tbl',
    {
      ledger_id: {
        //! fk
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      ledger_title: {
        type: DataTypes.STRING,
      },
      ledger_type: {
        type: DataTypes.INTEGER,
      },
      ledger_body: {
        type: DataTypes.TEXT,
      },
      ledger_tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      ledger_details: {
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
      tableName: 'ledgers_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  ledgers_tbl.associate = function (models) {
    //associations can be defined here
    ledgers_tbl.hasMany(models.charges_tbl, {
      foreignKey: { name: 'ledger_id', allowNull: true },
    });
  };
  return ledgers_tbl;
};
