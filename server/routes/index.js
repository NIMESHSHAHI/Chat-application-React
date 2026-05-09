const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const http = require('http')
const { Server } = require('socket.io')

const connectDB = require('./config/connectDB')
const router = require('./routes')

dotenv.config()

const app = express()

const server = http.createServer(app)

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({
        message: "Server running at 10000"
    })
})

app.use('/api', router)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log("User connected :", socket.id)

    socket.on('disconnect', () => {
        console.log("User disconnected :", socket.id)
    })
})

const PORT = process.env.PORT || 10000

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server running at " + PORT)
    })
})