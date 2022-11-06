const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const socketIo = require('socket.io');

const { normalizePort } = require('./src/helper/normalizePort');
const route = require('./src/routes');
const db = require('./src/config/db');
const { emit } = require('process');
const port = normalizePort(process.env.PORT || 4000);

db.connect();
dotenv.config();
const io = socketIo(server, {
    cors: {
        origin: process.env.REACT_APP_BASE_URL,
    },
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
route(app);
const getVisitor = async () => {
    const socket = (await io.fetchSockets()).map((socket) => socket.user);

    const users = socket.filter((user) => user !== undefined);
    const newArray = Array.from(new Set(users.map((el) => JSON.stringify(el)))).map((el) => JSON.parse(el));

    return newArray;
};

const updateUser = (users, id) => {
    const newUser = users.filter((user) => user.id !== id);
    return newUser;
};

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
    const users = getVisitor();
    users.then((result) => {
        console.log(result);
        io.emit('visitors', result);
    });
    socket.on('new_visitor', (user) => {
        socket.user = { id: socket.id, ...user };

        const users = getVisitor();
        users.then((result) => {
            console.log(result);
            io.emit('visitors', result);
        });
    });

    // socket.on('join_room', (data) => {
    //     console.log(data);
    //     socket.join(data);
    //     socket.emit('receive_message', {
    //         room: 'chat1',
    //         avatar: '',
    //         message: 'Welcome to the chat app!',
    //         class: 'admin-mes',
    //     });
    //     socket.broadcast.emit('receive_message', {
    //         room: 'chat1',
    //         avatar: '',
    //         message: `${socket.user.name} joined`,
    //         class: 'admin-mes',
    //     });
    // });

    socket.on('send_message', (data) => {
        console.log(data);
        io.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
        const users = getVisitor();
        users.then((result) => {
            io.emit('update', updateUser(result, socket.id));
        });
    });
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
server.listen(port, () => {
    console.log('listening on port ' + port);
});
