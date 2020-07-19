module.exports = (sequelize, DataTypes) => {
  const chargepayment_tbl = sequelize.define(
    'chargepayment_tbl',
    {
      chargepayment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      payment_journal_id: {
        //! fk from charge_journal_tbl
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'payments_tbl',
          key: 'payment_journal_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      charge_journal_id: {
        //! fk from charge_journal_tbl
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'charges_tbl',
          key: 'charge_journal_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      tableName: 'chargepayment_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  chargepayment_tbl.associate = function (models) {
    //associations can be defined here
  };
  return chargepayment_tbl;
};
