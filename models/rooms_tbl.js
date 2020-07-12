module.exports = (sequelize, DataTypes) => {
  const rooms_tbl = sequelize.define(
    'rooms_tbl',

    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      room_uuid: {
        allowNull: false,
        //primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      room_code: {
        type: DataTypes.INTEGER,
      },
      room_name: {
        type: DataTypes.STRING,
      },
      room_type: {
        type: DataTypes.INTEGER,
      },
      room_host_name: {
        type: DataTypes.STRING,
      },
      room_host_contact: {
        type: DataTypes.STRING,
      },
      room_host_address: {
        type: DataTypes.STRING,
      },
      room_address: {
        type: DataTypes.TEXT,
      },
      room_tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      room_details: {
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
      tableName: 'rooms_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  rooms_tbl.associate = function (models) {
    //associations can be defined here
    rooms_tbl.hasMany(models.tenants_tbl);
  };
  return rooms_tbl;
};
