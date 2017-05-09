'use strict'
const db = require('../database');
exports.findOneByQuery = query => {
   return db.Users.findOne({
      where: query
   });
};
exports.findById = (id) => {
      return db.Users.findById(id);
};
exports.UserExists = (username, email) => {
  return db.Users.findAndCountAll({
  where: {
  $or: [{username: username}, {email: email}]
    }
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

exports.currentUser=(id)=>{
  return db.Users.findById(id);
}
