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
  const voucher_credit_id = req.body.voucher_credit_id;
  const voucher_debit_id = req.body.voucher_debit_id;

  return vouchers_tbl
    .create(
      {
        voucher_type: voucher_type_id,
      },
      { returning: true, plain: true }
    )
    .then((result) => {
      voucher_associations_tbl
        .create({
          //credit_voucher_id: result.dataValues.voucher_id,
          //! 현재 1개의 debit 전표가 두개의 credit 전표를 참조하려면 credit전표두개를 array로 받아서 voucher_associations_tbl에 두번 create해야됨
          //! credit 전표쪽에서 1번 debit전표를 저장하면 되는데, 이렇게 되면 이중으로 저장하는 거임. 이걸 해야 되는지 말아야 하는지 생각해볼 문제임
          credit_voucher_id: voucher_credit_id,
          debit_voucher_id: voucher_debit_id,
        })
        .then((result) => {
          console.log(req.user);
          console.log(req.accesstoken);
          return res.status(200).send({ token: req.accesstoken, data: result });
        })
        .catch((err) => {
          return res.status(400).send({ err });
        });
    });
};

//! https://velog.io/@bigbrothershin/Backend-sequelize-MN-%EA%B4%80%EA%B3%84
exports.getList = (req, res, next) => {
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
      .findByPk(id)
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
