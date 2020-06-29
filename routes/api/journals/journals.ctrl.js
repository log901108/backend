var express = require('express');
var router = express.Router();
const journals_tbl = require('../../../models').journals_tbl;
const { Op } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

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
  console.log(req.body);
  console.log(req.user);
  var code, title, type, amount, tags, details;
  if (req.body.code) {
    code = req.body.code;
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
  var userJson = { created_id: req.user.id, created_userid: req.user.userid };

  if (title && body) {
    journals_tbl
      .create({
        account_title: title,
        account_body: sanitizeHtml(body, sanitizeOption),
        account_details: userJson,
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send({ err });
      });
  } else {
    res.status(400).send({
      success: false,
      msg: 'one or more required contents are missing',
    });
  }
};

module.exports.getRead = (req, res, next) => {
  const id = req.params.id;
  console.log(id);

  journals_tbl
    .findByPk(id)
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
