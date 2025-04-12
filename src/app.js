const express = require('express')
const cors = require('cors')
const { userRouter } = require('./routes/user.route')
const app = express()
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // Allow cookies if needed
}))

app.use('', userRouter)
module.exports={app}