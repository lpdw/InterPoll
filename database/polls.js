 'use strict';
 module.exports = (sequelize, DataTypes) => {
     return sequelize.define('Polls', {
         title: {
             type: DataTypes.STRING,
             validate: {
                 notEmpty: {
                     msg: "-> Titre manquant"
                 }
             }
         },
         form_json: {
             type: DataTypes.TEXT('long'),
             validate: {
                 notEmpty: {
                     msg: "->Sondages manquants"
                 }
             }
         },
         logo: {
             type: DataTypes.STRING,
         },
         font: {
             type: DataTypes.STRING,
         },
         font_color: {
             type: DataTypes.STRING,
         },
         background_color: {
             type: DataTypes.STRING,
         },
         online: {
             type: DataTypes.BOOLEAN,
             defaultValue:false
         }
     });
 };
