module.exports = (sequelize, DataTypes) => {
  const tenants_tbl = sequelize.define(
    'tenants_tbl',
    {
      tenant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      tenant_uuid: {
        allowNull: false,
        //primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      tenant_name: {
        type: DataTypes.STRING,
      },
      tenant_type: {
        type: DataTypes.INTEGER,
      },
      tenant_contact_info: {
        type: DataTypes.STRING(15),
      },
      tenant_address: {
        type: DataTypes.TEXT,
      },
      tenant_tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      tenant_details: {
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
      tableName: 'tenants_tbl',
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  tenants_tbl.associate = function (models) {
    //associations can be defined here
    tenants_tbl.belongsTo(models.rooms_tbl, {
      foreignKey: { name: 'tenant_id', allowNull: true },
    });
  };
  return tenants_tbl;
};
