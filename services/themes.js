'use strict'
const db = require('../database');
exports.findAll = () => {
   return db.Themes.findAll();
};
exports.findById = (id) => {
    return db.Themes.findById(id);
};
