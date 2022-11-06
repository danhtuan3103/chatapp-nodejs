const userRoute = require('./user');
const contactRouter = require('./contact');
const conversationRouter = require('./conversation');
function route(app) {
    app.use('/api/user', userRoute);
    app.use('/api/contact', contactRouter);
    app.use('/api/conversation', conversationRouter);
}

module.exports = route;
