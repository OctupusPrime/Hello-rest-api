const authController = require("../../app/controllers/authController");
const hasToken = require("../../middleware/token");

module.exports = (app) => {
    app.post('/auth/reg', authController.register);
    app.post("/auth/log", authController.login);
    app.get("/auth/user", hasToken, authController.user);   
    app.post('/auth/refresh-token', authController.refreshToken);
};