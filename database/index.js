/* jshint esversion: 6 */
/* jshint node: true */

'use strict';
const path = require('path');
const Sequelize = require('sequelize');
const url = (process.env.DATABASE_URL || '').match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
const DB_name= url ? url[6] : null;
const user= url ? url[2] : null;
const pwd= url ? url[3] : null;
const protocol= url ? url[1] : null;

const dialect= url ? url[1] : 'sqlite';

const port= url ? url[5] : null;

const host= url ? url[4] : null;

const storage= process.env.DATABASE_STORAGE || 'database.sqlite';




const sequelize = new Sequelize(DB_name, user, pwd, { dialect, protocol, port, host, storage, omitNull: true });
sequelize.sync()
   .then(() => {
       console.log('DB loaded');
   })
;
const Users = sequelize.import(path.join(__dirname, 'users'));
const Polls = sequelize.import(path.join(__dirname, 'polls'));
const Poll_Results = sequelize.import(path.join(__dirname, 'pollResults'));
const Themes = sequelize.import(path.join(__dirname, 'themes'));
const Poll_Settings = sequelize.import(path.join(__dirname, 'pollSettings'));

Polls.belongsTo(Users, {as: 'User',foreignKey: 'fk_user' });
Users.hasMany(Polls, {as: 'Polls',foreignKey: 'fk_user' });
Poll_Results.belongsTo(Polls, {as:'Poll', foreignKey: 'fk_poll' });
Themes.hasMany(Polls,{as: 'Theme', foreignKey:'fk_theme'});
Polls.belongsTo(Themes,{as: 'Theme', foreignKey:'fk_theme'});
exports.Users = Users;
exports.Polls = Polls;
exports.Poll_Results = Poll_Results;
exports.Themes = Themes ;
exports.Poll_Settings = Poll_Settings ;
