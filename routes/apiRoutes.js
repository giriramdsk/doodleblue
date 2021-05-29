const authJwt = require('./jwtVerification');

module.exports = (app) => {
    console.log('routerWork')
    const userController = require('../controller/user.controller');
    const orderController = require('../controller/orders.controller');
    const productController = require('../controller/products.controller');
    const upload = require("../middleware/upload");
    const config = require('../config/jwtConfig');

    app.post('/api/user/create', userController.Register)
    app.post('/api/auth/login', userController.login);

    app.post('/api/order/create', [authJwt.verifyToken], orderController.create)
    app.put('/api/order/update', [authJwt.verifyToken], orderController.update)
    app.get('/api/order/get', [authJwt.verifyToken], orderController.get)
    app.get('/api/order/getById/:id', [authJwt.verifyToken], orderController.getById)
    app.delete('/api/order/delete/:id', [authJwt.verifyToken], orderController.delete)
    app.get('/api/order/statusChange/:id/:status', [authJwt.verifyToken], orderController.statusChange)

    app.post('/api/product/create', [authJwt.verifyToken], upload.single("file"), productController.create)
    app.get('/api/product/get', [authJwt.verifyToken], productController.get)
    app.get('/api/customer/get', [authJwt.verifyToken], userController.get)

}