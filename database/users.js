 'use strict';
 module.exports = (sequelize, DataTypes) => {
     return sequelize.define('Users', {
         username: {
             type: DataTypes.STRING,
             validate: {
                 notEmpty: {
                     msg: "-> Identifiant manquant"
                 }
             }
         },
         email: {
             type: DataTypes.STRING,
             validate: {
                 notEmpty: {
                     msg: "-> E-mail manquant"
                 }
             }
         },
         password: {
             type: DataTypes.STRING,
             validate: {
                 notEmpty: {
                   msg: "-> Mot de passe manquant"
                 }
             }
         },
         checked:{
           type: DataTypes.BOOLEAN,
           defaultValue:false

         }
     });
 };
