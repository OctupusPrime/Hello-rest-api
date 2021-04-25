const express = require('express');
const mongoose = require('mongoose');
require('./app/models');
const config = require('./config');

const app = express();
app.use(express.urlencoded({extended: true}))
config.express(app, express);
config.userRoutes(app);

const {appPort, moungoUri} = config.app;

const start = async () => {
    try {
        await mongoose.connect(moungoUri, {//Connect mongoose
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        app.listen(appPort, () => {
            console.log("Server started on port ", appPort);
        });
    } catch (e) {
        console.log(e);
    }
}

start()
