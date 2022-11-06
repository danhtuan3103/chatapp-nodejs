const express = require('express');
const router = express.Router();

const { contactController } = require('../app/controllers');

router.post('/', contactController.index);

module.exports = router;
