const express = require('express')

const app = express()
const http = require('http')
const expressServer = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server(expressServer)


io.on('connection', (socket) => {

    // create room
    socket.join('get_total')

    let total = io.sockets.adapter.rooms.get('get_total').size
    io.sockets.in('get_total').emit('total', total)

    socket.on('disconnect', () => {
        let total = io.sockets.adapter.rooms.get('get_total') && io.sockets.adapter.rooms.get('get_total').size
        io.sockets.in('get_total').emit('total', total)
    })

    socket.on('load', (username) => {
        io.emit('new', `${username} has connected!`)
        socket.on('disconnect', () => {
            io.emit('left', `${username} has left the chat!`)
        })
    })

    console.log('New user connected! id:' + socket.id)
    socket.on('chat', (msg) => {
        io.emit('chat_transfar', { ...msg, id: socket.id })
    })
})



app.use('/bootstrap.min.css', express.static('bootstrap.min.css'))

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


expressServer.listen(3000, () => {
    console.log('Server is running @3000')
})

