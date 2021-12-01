const express = require('express');
const router = express.Router();
const { registerFunc, loginFunc, tokenValidateFunc, refreshTokenFunc } = require('../controller/users');
router.post('/register', registerFunc);
router.post('/login', loginFunc);
router.post('/tokenValidate', tokenValidateFunc);
router.post('/token', refreshTokenFunc);

module.exports = router;
