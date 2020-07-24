var express = require('express');
var router = express.Router();
const journals_tbl = require('../../../models').journals_tbl;
const payments_tbl = require('../../../models').payments_tbl;
const charges_tbl = require('../../../models').charges_tbl;
const chargepayment_tbl = require('../../../models').chargepayment_tbl;
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
  var charge,
    ledger,
    title,
    type,
    amount,
    tags,
    details = null;
  if (req.body.charge) {
    charge = req.body.charge;
  }
  if (req.body.ledger) {
    ledger = req.body.ledger;
  }
  if (req.body.title) {
    title = req.body.title;
  }
  if (req.body.type) {
    type = req.body.type;
  }
  if (req.body.amount) {
    amount = req.body.amount;
  }
  if (req.body.body) {
    body = req.body.body;
  }
  if (req.body.tags) {
    tags = req.body.tags;
  }
  if (req.body.details) {
    details = req.body.details;
  }
  //var userJson = { created_id: req.user.uuid, created_userid: req.user.userid };
  if (title && body) {
    return payments_tbl
      .create({
        charge_journal_id: charge,
        ledger_id: ledger,
        account_title: title,
        account_body: sanitizeHtml(body, sanitizeOption),
        //account_details: userJson,
      })
      .then((result) => {
        console.log(req.user);
        console.log(req.accesstoken);
        chargepayment_tbl.create({
          charge_journal_id: charge,
          payment_journal_id: result.payment_journal_id,
        });
        return res.status(200).send({ token: req.accesstoken, data: result });
      })
      .catch((err) => {
        return res.status(400).send({ success: false, message: err });
      });

    //await payments_tbl.addcharges_tbl()
  } else {
    res.status(400).send({
      success: false,
      msg: 'one or more required contents are missing',
    });
  }
};

module.exports.getRead = (req, res, next) => {
  const path = req.originalUrl;
  const url = req.url;
  const id = req.params.id;
  try {
    return payments_tbl
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

module.exports.getList = async (req, res, next) => {
  try {
    var objectId = req.originalUrl;
    return payments_tbl
      .findAll({
        //include: [
        //  {
        //    model: payments_tbl,
        //    through: {
        //      //attributes: ['followerId'],
        //    },
        //  },
        //],
        include: [
          {
            model: charges_tbl,
            //through: { attributes: [] },
          },
        ],
        //order: [['charge_journal_id', 'ASC']],
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

module.exports.patchUpdate = async (req, res, next) => {};

module.exports.deleteDelete = async (req, res, next) => {
  const id = req.params.id;

  return payments_tbl.findByPk(id).then((result) => {
    if (!result) {
      return res.status(404).send({ success: false });
    } else {
      result.destroy({ where: { id: id } });
      return res
        .status(200)
        .send({ success: true, message: `#${id} payment is deleted` });
    }
  });
};

module.exports.postProfile = async (req, res, next) => {
  req.accepts('application/json');
  var key = req.body.name;
  var value = JSON.stringify(req.body);

  req.cache.set(key, value, function (err, data) {
    if (err) {
      console.log(err);
      res.send('err' + err);
      return;
    }
    req.cache.expire(key, 100);
    res.json(value);
  });
};

module.exports.getProfile = async (req, res, next) => {
  var key = req.params.name;

  req.cache.get(key, function (err, data) {
    if (err) {
      console.log(err);
      res.send('err' + err);
      return;
    }

    var value = JSON.parse(data);
    res.json(value);
  });
};
