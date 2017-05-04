'use strict'
const db = require('../database');
exports.findOneByQuery = query => {
   return db.Users.findOne({
      where: query
   });
};
exports.createUser = (username,email,password) => {
   const model = db.Users.build({username:username,email:email,password:password});

   return model.validate()
       .then(err => {
           if (err) {
               return Promise.reject(err);
           }
           return model.save();
       });
};
