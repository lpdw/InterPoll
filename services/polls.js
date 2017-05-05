'use strict'
const db = require('../database');
exports.find = (query = {}) => {
    return db.Polls.findAll({
        where: query
    });
};
exports.create = (song) => {
    const model = db.Polls.build(song);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
            return model.save();
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


exports.destroy=(id)=>{
  return db.Polls.destroy({
  where : {
      id: id
    }
  });

};
