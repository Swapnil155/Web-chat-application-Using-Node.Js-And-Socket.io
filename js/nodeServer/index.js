// node Server Which will handel node server

const Socket = require('socket.io');

//import the Socket.io
const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket =>{
    //if any user join ,let other users connect to the server know
    socket.on('new-user-joined', name =>{
        //console.log("new user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //if someone send the message, broadcast it to other people
    socket.on('send',message =>{
        socket.broadcast.emit('receive', {message: message, name:users[socket.id]});
    });

    //if someone leves the chat then, let other know
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });

});