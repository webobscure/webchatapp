const http = require("http");
const express = require("express");
const socketio = require('socket.io')
const cors = require('cors')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')
const router = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-type'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(router)

const users = {};

io.on('connect', socket => {
  socket.once('join', ({ name, room }, callback) => {
    const { error, user} = addUser({ id: socket.id, name, room})

    if(error) return callback(error)

    socket.join(user.room)
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}`})
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`})
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    

    callback()
  })
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);
   

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)
  
      io.to(user.room).emit('message', { user: user.name, text: message})
    
      callback()
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
    })

    socket.on('disconnect', () => {
      const user = removeUser(socket.id)
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.`})
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})
        }
      })
    
});
      
server.listen(process.env.PORT || 8080, () => console.log(`Server has started on 6060`))