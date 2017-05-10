'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Themes', {
        page: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        preview: {
            type: DataTypes.STRING,
        }
    });
};
