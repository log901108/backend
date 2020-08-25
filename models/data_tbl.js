module.exports = (sequelize, DataTypes) => {
  const data_tbl = sequelize.define(
    'data_tbl',
    {
      data_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      data_uuid: {
        allowNull: false,
        //primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      data: {
        type: DataTypes.TEXT,
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
      tableName: 'data_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  data_tbl.associate = function (models) {
    //associations can be defined here
  };
  return data_tbl;
};
