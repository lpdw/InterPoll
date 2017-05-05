'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Poll_Settings', {
        type: {
            type: DataTypes.STRING,
        },
        value: {
          type: DataTypes.STRING,
        }

    });
};
