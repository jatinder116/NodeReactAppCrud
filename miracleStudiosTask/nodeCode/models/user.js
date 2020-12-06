//var Sequelize = require("sequelize");
'use strict';

module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER(11),
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            field: 'firstName',
            allowNull: false,
            defaultValue: ''
        },
        lastName: {
            type: DataTypes.STRING(50),
            field: 'lastName',
            allowNull: false,
            defaultValue: ''
        },
        email: {
            type: DataTypes.STRING(128),
            field: 'email',
            allowNull: false,
            defaultValue: ''
        },
        password: {
            type: DataTypes.STRING(128),
            field: 'password',
            allowNull: false,
            defaultValue: ''
        },
        is_deleted: {
            type: DataTypes.INTEGER(11),
            field: 'is_deleted',
            allowNull: false,
            defaultValue: 0
        },
        type: {
            type: DataTypes.INTEGER(11),
            field: 'type',
            allowNull: false,
            defaultValue: 1  //1 for user and 2 for admin
        },
        last_login: {
            type: DataTypes.DATE,
            field: 'last_login',
            allowNull: true
        }
    }, {
            timestamps: true,
            freezeTableName: true,
            tableName: 'user'
        });

    return user;
}
