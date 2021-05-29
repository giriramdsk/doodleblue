const db = require('../models')
const bcrypt = require("bcrypt");
const master = require('../config/default.json');
var jwt = require('jsonwebtoken');
const config = require('../config/jwtConfig');
const Op = require('sequelize').Op

exports.Register = async(req, res) => {
    try {
        console.log(req.body)
        db.users.create({
                email: req.body.email,
                name: req.body.name,
                address: req.body.address,
                mobile_number: req.body.mobile_number,
                status: master.status.active,
                // password: bcrypt.hashSync(req.body.password, 8),
                password: req.body.password,
                temporary_password: req.body.password,
            }).then((data) => { res.send(data) })
            .catch((error) => {
                res.send(error)
            })
    } catch (error) {
        res.send(error)
    }
}
exports.login = (req, res) => {
    console.log(req.body);

    db.users.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send('User Not Found.');
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, accessToken: token });

    }).catch(err => {
        res.status(500).send('Error -> ' + err);
    });
}

exports.get = async(req, res) => {
    db.users.findAll({
        where: {
            status: {
                [Op.notIn]: [master.status.delete]
            }
        },
        include: [{
            model: db.orders,
            as: 'orders',
            include: [{
                model: db.products,
                as: 'products'
            }]

        }],
        order: [
            ['id', 'DESC']
        ],
    }).then(data => res.send(data))
}