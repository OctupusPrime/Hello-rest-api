const { Router } = require("express")
const authController = require("../controllers/authController")
const hasToken = require("../middleware/token")
const router = Router()

router.post('/reg', authController.register)
router.post("/log", authController.login)
router.get("/user", hasToken, authController.user)

module.exports = router