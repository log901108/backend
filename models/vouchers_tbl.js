module.exports = (sequelize, DataTypes) => {
  const vouchers_tbl = sequelize.define(
    'vouchers_tbl',
    {
      voucher_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      uuid: {
        //! used as surrogate key
        allowNull: false,
        //primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      voucher_type: {
        type: DataTypes.INTEGER,
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
      tableName: 'vouchers_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  vouchers_tbl.associate = function (models) {
    //associations can be defined here
    vouchers_tbl.belongsToMany(models.vouchers_tbl, {
      through: 'voucher_associations_tbl',
      as: 'debit', // 같은 테이블 끼리 다대다관계이면 구별을 위해 as로 구별. JavaScript 객체에서 사용할 이름
      foreignKey: 'credit_voucher_id', // DB 컬럼명: 반대로 쓰는 이유는 foreignKey가 남의 테이블 id를 가리키기 때문
      otherKey: 'debit_voucher_id',
    });
    vouchers_tbl.belongsToMany(models.vouchers_tbl, {
      through: 'voucher_associations_tbl',
      as: 'credit', // 같은 테이블 끼리 다대다관계이면 구별을 위해 as로 구별. JavaScript 객체에서 사용할 이름
      foreignKey: 'debit_voucher_id', // DB 컬럼명: 반대로 쓰는 이유는 foreignKey가 남의 테이블 id를 가리키기 때문
      otherKey: 'credit_voucher_id',
    });
  };
  return vouchers_tbl;
};
