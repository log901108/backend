module.exports = (sequelize, DataTypes) => {
  const journals_tbl = sequelize.define(
    'journals_tbl',

    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
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
      tableName: 'journals_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  journals_tbl.associate = function (models) {
    //associations can be defined here
  };
  return journals_tbl;
};
