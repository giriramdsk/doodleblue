const master = require('../config/default.json');
const db = require('../models');
const Op = require('sequelize').Op

exports.create = async(req, res) => {
    try {
        db.orders.create({
            product_id: req.body.product_id,
            user_id: req.body.user_id,
            order_address: req.body.order_address,
            quantity: req.body.quantity,
            total: req.body.total,
            status: master.status.active
        }).then(data => res.send(data)).catch((error) => {
            res.send(error)
        })
    } catch (error) {
        res.send(error)
    }

}
exports.update = async(req, res) => {
    try {
        db.orders.update({
            product_id: req.body.product_id,
            user_id: req.body.user_id,
            order_address: req.body.order_address,
            quantity: req.body.quantity,
            total: req.body.total,
            status: master.status.active
        }, {
            where: { id: req.body.id }
        }).then(() => res.send("Updated")).catch(error => {

            if (error.name == 'SequelizeForeignKeyConstraintError') {
                res.send({ Error: 'Unknown User ' })
            } else {
                res.send(error)

            }
        })

    } catch (error) {
        res.send(error)
    }

}
exports.get = async(req, res) => {
    var where = {
        status: {
            [Op.notIn]: [master.status.delete]
        }
    }
    if (req.query.search) {
        where.name = {
            [Op.like]: '%' + req.query.search + '%'
        };
        // where.name = { $like: '%' + req.query.search + '%' };
    }
    console.log(where);

    db.orders.findAll({
        where: {
            status: {
                [Op.notIn]: [master.status.delete]
            }
        },
        include: [{
            model: db.products,
            as: 'products',
            where: {
                name: {
                    [Op.like]: '%' + req.query.search + '%'
                }
            }
        }, {
            model: db.users,
            as: 'users',
            attributes: {
                exclude: ['password', 'temporary_password']
            },
        }],
        order: [
            ['id', 'DESC']
        ],
    }).then(data => res.send(data))
}

exports.getById = async(req, res) => {
    db.orders.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: db.products,
            as: 'products',
        }, {
            model: db.users,
            as: 'users',
            attributes: {
                exclude: ['password', 'temporary_password']
            },
        }],
    }).then(data => res.send(data))
}
exports.delete = async(req, res) => {

    db.orders.destroy({
        where: { id: req.params.id }
    }).then(data => res.send("Deleted"));
}
exports.statusChange = async(req, res) => {
    db.orders.update({
        status: req.params.status
    }, {
        where: { id: req.params.id }
    }).then(data => res.send("status changed"));
}