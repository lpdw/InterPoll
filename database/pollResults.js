 'use strict';
 module.exports = (sequelize, DataTypes) => {
     return sequelize.define('Poll_Results', {
         result_csv: {
             type: DataTypes.STRING,
             validate: {
                 notEmpty: {
                     msg: "-> Titre manquant"
                 }
             }
         },
         result_json: {
           type: DataTypes.STRING,
         }

     });
 };
