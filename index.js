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
const port = normalizePort(process.env.PORT || 4000);

db.connect();
dotenv.config();
const io = socketIo(server, {
    cors: {
        origin: 'https://chatapp0001.netlify.app',
    },
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
route(app);
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        console.log(data);
        socket.join(data);
    });

    socket.on('send_message', (data) => {
        console.log(data);
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
server.listen(port, () => {
    console.log('listening on port ' + port);
});
