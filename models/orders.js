'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class orders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    orders.init({
        product_id: { type: DataTypes.INTEGER, allowNull: false, },
        user_id: DataTypes.INTEGER,
        order_address: DataTypes.TEXT,
        quantity: DataTypes.INTEGER,
        total: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'orders',
    });
    orders.associate = models => {
        orders.belongsTo(models.users, { foreignKey: 'user_id', as: 'users' });
        orders.belongsTo(models.products, { foreignKey: 'product_id', as: 'products' });
    }
    return orders;
};