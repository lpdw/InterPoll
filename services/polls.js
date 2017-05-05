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
      id: id
    }
  });

};
