
/* jshint esversion: 6 */
/* jshint node: true */

'use strict';
const db = require('../database');

exports.find = (query = {}) => {
  return db.Polls.findAll({
    where: query
  });
};

exports.createPoll = (title,form_json,logo,font_family, font_category,font_color,background_color) => {
  return db.Polls.create({
    title: title,
    form_json: form_json,
    logo: logo,
    font_family: font_family,
    font_category: font_category,
    font_color: font_color,
    background_color: background_color
  });
};

exports.findById = (id) => {
  return db.Polls.findById(id);
};

exports.findLivePollById = (id) => {
  return db.Polls.findOne({
    where: {
      id:id,
      online:true
    }
  });
};

exports.findByUser = (user) => {
  return db.Polls.findAll({
    where: {
      user: user,
    }
  });
};

exports.updatePoll = (id,title,form_json,logo,font_family, font_category,font_color,background_color) => {
  return db.Polls.update({
    title: title,
    form_json: form_json,
    logo: logo,
    font_family: font_family,
    font_category: font_category,
    font_color: font_color,
    background_color: background_color
  }, {
    where: {
      id: id
    }
  });
};

exports.onlinePoll = (id,qrcode,tinyurl) => {
  return db.Polls.update({
    online: true,
    qrcode:qrcode,
    tinyurl:tinyurl
  }, {
    where: {
      id: id
    }
  });
};

exports.offlinePoll = (id) => {
  return db.Polls.update({
    online: false,
  }, {
    where: {
      id: id
    }
  });
};

exports.destroy = (id) => {
  return db.Polls.destroy({
    where : {
      id: id
    }
  });
};
