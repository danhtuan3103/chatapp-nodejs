const express = require('express');
const router = express.Router();
const auth = require('../midleware/auth');

const { userController } = require('../app/controllers');

router.get('/', userController.index);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/auth', auth, userController.authPoint);
router.get('/free', userController.freePoint);
router.get('/:id', userController.getUser);
module.exports = router;
