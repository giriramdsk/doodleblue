// const { DataTypes } = require("sequelize/types");
// const { sequelize } = require(".");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please enter your name'
                },
                notNull: {
                    msg: 'Name field Empty'
                }

            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Must be a valid email address",
                }
            }
        },
        mobile_number: {
            type: DataTypes.BIGINT(11),
            allowNull: true,
            validate: {
                notEmpty: {
                    msg: "mobile number Not empty",
                }
            }
        },
        status: DataTypes.BIGINT(11),
        temporary_password: DataTypes.STRING(64),
        password: {
            type: DataTypes.STRING(64),
            validate: {
                is: {
                    args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/,
                    msg: 'The password must contain atleast 8 characters including at least 1 uppercase, 1 lowercase and one digit.'
                }
            }
        },


    }, {
        hooks: {
            beforeUpdate: (user) => {
                console.log("test")
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            },
            beforeCreate: (user) => {
                console.log(user)

                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },

    });

    User.associate = models => {
        User.hasMany(models.orders, { as: 'orders', foreignKey: 'user_id' });
    }
    return User;
}