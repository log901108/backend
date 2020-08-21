var express = require('express');
var router = express.Router();
const vouchers_tbl = require('../../../models').vouchers_tbl;
const voucher_associations_tbl = require('../../../models')
  .voucher_associations_tbl;
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
  const voucher_type_id = req.body.voucher_type;

  return vouchers_tbl
    .create(
      {
        voucher_type: voucher_type_id,
      },
      { returning: true, plain: true }
    )
    .then((result) => {
      return res.status(201).send({ success: true, data: result });
    })
    .catch((err) => {
      return res.status(400).send({ success: false, message: err });
    });
};

//! https://velog.io/@bigbrothershin/Backend-sequelize-MN-%EA%B4%80%EA%B3%84
exports.getList = (req, res, next) => {
  const path = req.originalUrl;

  return vouchers_tbl
    .findAll({
      include: [
        {
          model: vouchers_tbl,
          as: 'credit',
          attributes: ['voucher_id'],
        },
        {
          model: vouchers_tbl,
          as: 'debit',
          //attributes: ['uuid'],
        },
      ],
      order: [['voucher_id', 'DESC']],
    })
    .then((result) => {
      if (!result) {
        res.status(404).send({ success: false });
      } else {
        req.client.setex(path, 100, JSON.stringify(result));
        res.status(200).send(result);
      }
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err });
    });
};

exports.getRead = (req, res, next) => {
  try {
    const path = req.originalUrl;
    console.log(path);
    const url = req.url;
    console.log(url);
    const id = req.params.id;
    console.log(id);

    vouchers_tbl
      .findOne({
        where: {
          voucher_id: id,
        },
        include: [
          {
            model: vouchers_tbl,
            as: 'credit',
            attributes: ['voucher_id'],
          },
          {
            model: vouchers_tbl,
            as: 'debit',
            //attributes: ['uuid'],
          },
        ],
        order: [['voucher_id', 'DESC']],
      })
      .then((result) => {
        if (!result) {
          res.status(404).send({ success: false });
        } else {
          req.client.setex(path, 100, JSON.stringify(result));
          res.status(200).send(result);
        }
      })
      .catch((err) => {
        res.status(400).send({ success: false, error: err });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, err: err });
  }
};

exports.patchUpdate = async (req, res, next) => {};

exports.deleteDelete = async (req, res, next) => {
  const id = req.params.id;

  vouchers_tbl.findByPk(id).then((result) => {
    if (!result) {
      res.status(404).send({ success: false });
    } else {
      result.destroy({ where: { id: id } });
      res.status(200).send({ success: true, msg: `#${id} voucher is deleted` });
    }
  });
};
