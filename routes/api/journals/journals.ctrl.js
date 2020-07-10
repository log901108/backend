var express = require('express');
var router = express.Router();
const journals_tbl = require('../../../models').journals_tbl;
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
  var code,
    title,
    type,
    amount,
    tags,
    details = null;
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
  //var userJson = { created_id: req.user.uuid, created_userid: req.user.userid };
  if (title && body) {
    journals_tbl
      .create({
        account_title: title,
        account_body: sanitizeHtml(body, sanitizeOption),
        //account_details: userJson,
      })
      .then((result) => {
        console.log(req.user);
        console.log(req.accesstoken);
        res.status(200).send({ token: req.accesstoken, data: result });
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
  try {
    const path = req.originalUrl;
    console.log(path);
    const url = req.url;
    console.log(url);
    const id = req.params.id;
    console.log(id);

    journals_tbl
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

module.exports.patchUpdate = async (req, res, next) => {};

module.exports.deleteDelete = async (req, res, next) => {
  const id = req.params.id;

  journals_tbl.findByPk(id).then((result) => {
    if (!result) {
      res.status(404).send({ success: false });
    } else {
      result.destroy({ where: { id: id } });
      res.status(200).send({ success: true, msg: `#${id} journal is deleted` });
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
