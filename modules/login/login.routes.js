const express = require('express');
const router = express.Router();
const { login } = require('./login.controller');

// POST /login
router.post('/', login);

module.exports = router;