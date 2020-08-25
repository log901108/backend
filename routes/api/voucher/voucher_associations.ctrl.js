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
  const voucher_credit_id = req.body.voucher_credit_id;
  const voucher_debit_id = req.body.voucher_debit_id;

  return voucher_associations_tbl
    .create({
      //credit_voucher_id: result.dataValues.voucher_id,
      //! 현재 1개의 debit 전표가 두개의 credit 전표를 참조하려면 credit전표두개를 array로 받아서 voucher_associations_tbl에 두번 create해야됨
      //! credit 전표쪽에서 1번 debit전표를 저장하면 되는데, 이렇게 되면 이중으로 저장하는 거임. 이걸 해야 되는지 말아야 하는지 생각해볼 문제임
      //!                   debit                  |            credit
      //!    -------------------------------------------------------------------------
      //!     1.   당좌예금     1,000,000,000       |  3. 현금             950,000,000
      //!     2.       적금       500,000,000       |  4. 유동성 금융자산    50,000,000
      //!                                           | 5. 매출채권           500,000,000
      //! 이 때 1번은 debit 대체전표로서 3,4,5번과 credit 대체전표 연결. 2번도 3,4,5와 연결
      //! 그러므로 voucher는 생성하는 api 따로 association을 지정하는 api 따로 존재해야 한다는 뜻이다.
      //! 이렇게 되면 이중 저장하는 게 아니라 debit 1에 대해 credit 3,4,5로 voucher_associations_tbl에 3개의 row들을 개별적으로 저장하고
      //! 2번 도 voucher_associations_tbl에 3,4,5에 대한 관계를 저장하면 끝.
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