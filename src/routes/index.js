const userRoute = require('./user');
function route(app) {
    app.use('/api/user', userRoute);
}

module.exports = route;
