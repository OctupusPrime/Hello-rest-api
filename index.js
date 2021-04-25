const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const authRouter = require("./router/auth.router")//Router of user

const app = express()
const PORT = process.env.PORT || 3000//server port

app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))//Get data from url

app.use("/api/auth", authRouter)

const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://MishaSokil:Warmisha_333444@todos.fhsuf.mongodb.net/todos", {//Connect mongoose
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        app.listen(PORT, () => {
            console.log("Server started on port ", PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
