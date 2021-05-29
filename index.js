const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// cors = require('./routes/cors');
// app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ limit: '500mb', extended: true }))

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    // app.use(bodyParser.json());


const dbSequelizeConnect = require('./models');
const PORT = 8080;


require('./routes/apiRoutes')(app);
app.use('/public', express.static('public'));


app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: { message: error.message }
    })
})


dbSequelizeConnect.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`notes-app listening on PORT ${PORT}!`)
    })

}).catch((error) => {
    console.log(error)
})


// dbSequelizeConnect.sequelize.authenticate().then(() => {
//         console.log('Connection has been established successfully.Port http://localhost:' + PORT);
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });