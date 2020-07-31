var express = require('express');
var router = express.Router();
const path = require('path');
const Sequelize = require('sequelize');
const { DataTypes, QueryTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../config/config.js')[env];
const { Op } = require('sequelize');
const sanitizeHtml = require('sanitize-html');
const JSON = require('JSON');

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'strong',
    'em',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
    'pre',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
    pre: ['class', 'spellcheck'],
  },
  allowedSchemes: ['data', 'http'],
};

module.exports.postCreate = async (req, res, next) => {
  let sequelize;
  const tbl = req.body.tbl;
  const tenant = req.body.tenant;
  var db = {};

  try {
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
      sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });
      return res
        .status(201)
        .send({ success: true, message: `${tbl}s table is created` });
    } else {
      sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );

      await sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });

      const file = 'tenants_tbl.js';
      var tblmodel = require(path.join(__dirname + '/../../../models/', file))(
        sequelize,
        DataTypes
      );

      //var tblmodel = require(__dirname + '/../../../models').tenants_tbl;
      console.log(tblmodel);
      db[tblmodel.name] = tblmodel;
      console.log('db:', db);

      tblmodel = sequelize.define(
        `${tbl}s_tbl`,
        {
          ledger_id: {
            //! fk
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          tenant_id: {
            //! fk from tenants_tbl
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
              model: 'tenants_tbl',
              key: 'tenant_id',
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
          tableName: `${tbl}s_tbl`,
          freezeTableName: true,
          underscored: true,
          timestamps: true,
          paranoid: true,
        }
      );

      tblmodel.associate = function (models) {
        //associations can be defined here
        tblmodel.belongsTo(models.tenants_tbl, {
          foreignKey: { name: 'tenant_id', allowNull: true },
        });
      };

      db[tblmodel.name] = tblmodel;
      console.log(db);
      if (db[tblmodel.name].associate) {
        db[tblmodel.name].associate(db);
      }

      db.sequelize = sequelize;
      db.Sequelize = Sequelize;

      return tblmodel
        .create({
          tenant_id: tenant,
        })
        .then((result) => {
          return res.status(201).send({ success: true, data: result });
        })
        .catch((err) => {
          return res.status(400).send({ success: false, message: err });
        });
    }
  } catch (err) {
    return res.status(400).send({ success: false, message: err });
  }
};

module.exports.postInsert = async (req, res, next) => {
  let sequelize;
  const tbl = req.body.tbl;
  const tenant = req.body.tenant;
  var db = {};

  try {
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
      sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });
      return res
        .status(201)
        .send({ success: true, message: `${tbl}s table is created` });
    } else {
      sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );

      await sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });

      var tblmodel = sequelize.define(
        `${tbl}s_tbl`,
        {
          ledger_id: {
            //! fk
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          tenant_id: {
            //! fk from tenants_tbl
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
              model: 'tenants_tbl',
              key: 'tenant_id',
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
          tableName: `${tbl}s_tbl`,
          freezeTableName: true,
          underscored: true,
          timestamps: true,
          paranoid: true,
        }
      );
      //TODO: need to FIX 당연히 modelsdp tenants_tbl이 없으니 안됨
      tblmodel.associate = function (models) {
        //associations can be defined here
        tblmodel.belongTo(models.tenants_tbl, {
          foreignKey: { name: 'tenant_id', allowNull: true },
        });
      };

      db[tblmodel.name] = tblmodel;
      if (db[tblmodel.name].associate) {
        db[tblmodel.name].associate(db);
      }

      db.sequelize = sequelize;
      console.log('a');
      await tblmodel.create({
        tenant_id: tenant,
      });

      return res
        .status(201)
        .send({ success: true, message: `${tbl}s table is created` });
    }
  } catch (err) {
    return res.status(400).send({ success: false, message: err });
  }
};

module.exports.postCreateSync = async (req, res, next) => {
  let sequelize;
  const tbl = req.body.tbl;
  var db = {};

  try {
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
      sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });
      return res
        .status(201)
        .send({ success: true, message: `${tbl}s table is created` });
    } else {
      sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );

      await sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });

      const file = 'tenants_tbl.js';
      console.log(file);
      //var tblmodel = require(path.join(__dirname + '/../../../models', file))(
      //  sequelize,
      //  DataTypes
      //);

      var tblmodel = require('../../../models').tenants_tbl;
      console.log(tblmodel);
      db[tblmodel.name] = tblmodel;
      console.log('db:', db);

      tblmodel = sequelize.define(
        `${tbl}s_tbl`,
        {
          ledger_id: {
            //! fk
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          tenant_id: {
            //! fk from tenants_tbl
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
              model: 'tenants_tbl',
              key: 'tenant_id',
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
          tableName: `${tbl}s_tbl`,
          freezeTableName: true,
          underscored: true,
          timestamps: true,
          paranoid: true,
        }
      );

      tblmodel.associate = function (models) {
        //associations can be defined here
        tblmodel.belongsTo(models.tenants_tbl, {
          foreignKey: { name: 'tenant_id', allowNull: true },
        });
      };

      db[tblmodel.name] = tblmodel;
      console.log(db);
      if (db[tblmodel.name].associate) {
        db[tblmodel.name].associate(db);
      }

      db.sequelize = sequelize;
      db.Sequelize = Sequelize;

      await db.sequelize.sync();

      return res
        .status(201)
        .send({ success: true, message: `${tbl}s table is created` });
    }
  } catch (err) {
    return res.status(400).send({ success: false, message: err });
  }
};

module.exports.postInsert = async (req, res, next) => {
  let sequelize;
  const tbl = req.body.tbl;
  const tenant = req.body.tenant;
  var db = {};

  try {
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
      sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });
      return res
        .status(201)
        .send({ success: true, message: `${tbl}s table is created` });
    } else {
      sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );

      await sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });

      var tblmodel = sequelize.define(
        `${tbl}s_tbl`,
        {
          ledger_id: {
            //! fk
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          tenant_id: {
            //! fk from tenants_tbl
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
              model: 'tenants_tbl',
              key: 'tenant_id',
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
          tableName: `${tbl}s_tbl`,
          freezeTableName: true,
          underscored: true,
          timestamps: true,
          paranoid: true,
        }
      );
      //TODO: need to FIX 당연히 modelsdp tenants_tbl이 없으니 안됨
      tblmodel.associate = function (models) {
        //associations can be defined here
        tblmodel.belongTo(models.tenants_tbl, {
          foreignKey: { name: 'tenant_id', allowNull: true },
        });
      };

      db[tblmodel.name] = tblmodel;
      if (db[tblmodel.name].associate) {
        db[tblmodel.name].associate(db);
      }

      db.sequelize = sequelize;
      console.log('a');
      await tblmodel.create({
        tenant_id: tenant,
      });

      return res
        .status(201)
        .send({ success: true, message: `${tbl}s table is created` });
    }
  } catch (err) {
    return res.status(400).send({ success: false, message: err });
  }
};

module.exports.getRead = (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, err: err });
  }
};

module.exports.patchUpdate = async (req, res, next) => {};

module.exports.deleteDelete = async (req, res, next) => {};
