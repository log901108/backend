module.exports = (sequelize, DataTypes) => {
  const payments_tbl = sequelize.define(
    'payments_tbl',
    {
      payment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      payment_uuid: {
        //! used as surrogate key
        allowNull: false,
        //primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      charge_id: {
        //! fk from charges_tbl
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'charges_tbl',
          key: 'charge_id',
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
      tableName: 'payments_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  payments_tbl.associate = function (models) {
    //associations can be defined here
    //payments_tbl.belongsTo(models.charges_tbl, {
    //  foreignKey: { name: 'charge_uuid', allowNull: true },
    //});
    //payments_tbl.belongsTo(models.ledgers_tbl, {
    //  foreignKey: { name: 'ledger_id', allowNull: true },
    //});
    payments_tbl.belongsToMany(models.charges_tbl, {
      through: 'chargepayment_tbl',
      //as: 'Followers', // 같은 테이블 끼리 다대다관계이면 구별을 위해 as로 구별. JavaScript 객체에서 사용할 이름
      foreignKey: 'charge_id', // DB 컬럼명: 반대로 쓰는 이유는 foreignKey가 남의 테이블 id를 가리키기 때문
      otherKey: 'payment_id',
    });
  };
  return payments_tbl;
};
