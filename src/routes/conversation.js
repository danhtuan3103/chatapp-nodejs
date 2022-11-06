const express = require('express');
const router = express.Router();

const { conversationController } = require('../app/controllers');

router.post('/', conversationController.index);
router.post('/send', conversationController.sendMessage);
router.post('/all', conversationController.findAllByUser);

module.exports = router;
