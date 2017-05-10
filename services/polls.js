
/* jshint esversion: 6 */
/* jshint node: true */

'use strict';
const db = require('../database');
exports.find = (query = {}) => {
    return db.Polls.findAll({
        where: query
    });
};

exports.createPoll = (title,form_json,logo,font,font_color,background_color) => {
  return db.Polls.create(
  {
      title: title,
      form_json: form_json,
      logo: logo,
      font: font,
      font_color: font_color,
      background_color: background_color
  });
};

exports.findById = (id) => {
    return db.Polls.findById(id);
};
exports.findByUser= (user) => {
    return db.Polls.findAll({
  where: {
    user: user,
  }
});};

exports.update = (song,id) => {
    return db.Polls.update(
    {
        title: song.title,
        album: song.album,
        artist: song.artist,
        year: song.year,
        bpm: song.bpm
    },
    { where:{
      id: id

    }
  });
};

exports.onlinePoll = (id) => {
    return db.Polls.update(
    {
        online: true,
    },
    { where:{
      id: id

    }
    // TODO: Generate URL + QR CODE
  });
};
exports.offlinePoll = (id) => {
    return db.Polls.update(
    {
        online: false,
    },
    { where:{
      id: id

    }
  });
};

exports.destroy=(id)=>{
  return db.Polls.destroy({
  where : {
      _id: id
    }
  });

};
