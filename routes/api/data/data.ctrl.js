var express = require('express');
var router = express.Router();
const models = require('../../../models');
const journals_tbl = require('../../../models').journals_tbl;
const payments_tbl = require('../../../models').payments_tbl;
const charges_tbl = require('../../../models').charges_tbl;
const data_tbl = require('../../../models').data_tbl;
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

exports.postCreate = async (req, res, next) => {
  var data = null;

  if (req.body.data) {
    data = req.body.data;
  }

  return data_tbl
    .create({
      data: data,
    })
    .then((result) => {
      return res.status(200).send({ token: req.accesstoken, data: result });
    })
    .catch((err) => {
      return res.status(400).send({ success: false, message: err });
    });
};

exports.getRead = (req, res, next) => {
  const path = req.originalUrl;
  const url = req.url;
  const id = req.params.id;
  try {
    return data_tbl
      .findByPk(id)
      .then((result) => {
        if (!result) {
          res.status(404).send({ success: false });
        } else {
          req.client.setex(path, 100, JSON.stringify(result));
          return res.status(200).send(result);
        }
      })
      .catch((err) => {
        return res.status(400).send({ success: false, error: err });
      });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};

exports.getList = async (req, res, next) => {
  try {
    var objectId = req.originalUrl;
    let wherePhrase = {};

    if (req.query.lowerid || req.query.upperid) {
      if (req.query.lowerid && !req.query.upperid) {
        wherePhrase['data_id'] = { [Op.gte]: req.query.lowerid };
      } else if (!req.query.lowerid && req.query.upperid) {
        wherePhrase['data_id'] = { [Op.lte]: req.query.upperid };
      } else {
        wherePhrase['data_id'] = {
          [Op.or]: {
            [Op.between]: [req.query.lowerid, req.query.upperid],
            [Op.or]: [req.query.lowerid, req.query.upperid],
          },
        };
      }
    }

    if (req.query.data) {
      wherePhrase['data'] = { [Op.like]: `%${req.query.data}%` };
    }

    return data_tbl
      .findAll({
        where: wherePhrase,
        order: [['data_id', 'ASC']],
      })
      .then((result) => {
        req.client.setex(
          objectId,
          10,
          JSON.stringify({ success: true, data: result })
        );
        return res.status(200).send({ success: true, data: result });
      });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};

exports.patchUpdate = async (req, res, next) => {
  const data_id = req.params.id;
  var updatePhrase = {};

  if (req.body.data) {
    updatePhrase['data'] = req.body.data;
  }

  return models.sequelize
    .transaction((t) => {
      return data_tbl
        .findOne({ where: { data_id: data_id } }, { transaction: t })
        .then((data) => {
          console.log('data_uuid:', data.dataValues.data_uuid);
          req.client.del(`/api/data/${data_id}`); //! delete cache
          //req.client.quit();
          return data.update(updatePhrase, {
            transaction: t,
            returning: true,
            plain: true,
          });
        });
    })
    .then((result) => {
      console.log('res:', result);
      //req.client.setex(objectId, 100, JSON.stringify(result));
      res.status(201).send({ success: true, data: result });
    })
    .catch((err) => {
      res.status(400).send({ success: false, msg: err });
    });
};

exports.patchUpdateUnmanaged = async (req, res, next) => {
  const data_id = req.params.id;
  var updatePhrase = {};

  if (req.body.data) {
    updatePhrase['data'] = req.body.data;
  }

  return models.sequelize.transaction().then((t) => {
    return data_tbl
      .findOne(
        { where: { data_id: data_id } },
        { transaction: t, returning: true }
      )
      .then((data) => {
        console.log('data_uuid:', data['dataValues']['data_uuid']);
        req.client.del(`/api/data/${data_id}`); //! delete cache
        //req.client.quit();
        return data.update(updatePhrase, {
          transaction: t,
          returning: true,
          plain: true,
        });
      })
      .then((result) => {
        console.log('res:', result);
        t.commit();
        //req.client.setex(objectId, 100, JSON.stringify(result));
        return res.status(201).send({ success: true, data: result });
      })
      .catch((err) => {
        t.rollback();
        return res.status(400).send({ success: false, msg: err });
      });
  });
};

exports.deleteDelete = async (req, res, next) => {
  const id = req.params.id;

  return data_tbl.findByPk(id).then((result) => {
    if (!result) {
      return res.status(404).send({ success: false });
    } else {
      result.destroy({ where: { data_id: id } });
      return res
        .status(200)
        .send({ success: true, message: `#${id} data is deleted` });
    }
  });
};

exports.postBulkUpload = async (req, res, next) => {
  const updateDataArray = req.body.dataArray;
  updateDataArray.map((el) => {
    return { ...el, updatedAt: Date.now() };
  });

  return data_tbl
    .bulkCreate(updateDataArray, { updateOnDuplicate: ['data', 'updatedAt'] }) //since bulkCreate doesn't update updatedAt automatically
    .then(() => {
      return data_tbl.findAll({ order: [['data_id', 'ASC']] });
    })
    .then((data) => {
      return res.status(200).send({ success: true, data: data });
    })
    .catch((err) => res.status(400).send({ success: false, error: err }));
};
