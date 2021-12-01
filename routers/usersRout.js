const express = require('express');
const router = express.Router();
const { registerFunc, loginFunc, tokenValidateFunc } = require('../controller/users');
router.post('/register', registerFunc);
router.post('/login', loginFunc);
router.post('/tokenValidate', tokenValidateFunc);
module.exports = router;
