'use strict'
const db = require('../database');
exports.findAll = () => {
   return db.Themes.findAll();
};
