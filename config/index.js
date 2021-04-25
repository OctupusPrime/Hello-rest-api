const app = require('./app');
const express = require('./express');
const userRoutes = require('./router/auth.router'); 

module.exports = {
    app,
    express,
    userRoutes
}