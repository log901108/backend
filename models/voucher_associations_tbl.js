module.exports = (sequelize, DataTypes) => {
  const voucher_associations_tbl = sequelize.define(
    'voucher_associations_tbl',
    {
      voucher_association_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      credit_voucher_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'vouchers_tbl',
          key: 'voucher_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      debit_voucher_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'vouchers_tbl',
          key: 'voucher_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'voucher_associations_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  voucher_associations_tbl.associate = function (models) {
    //associations can be defined here
  };
  return voucher_associations_tbl;
};
