const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { normalizePort } = require('./src/helper/normalizePort');
const db = require('./src/config/db');
const route = require('./src/routes');

const port = normalizePort(process.env.PORT || 4000);
db.connect();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

route(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log('listening on port ' + port);
});
