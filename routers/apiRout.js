const express = require('express');
const router = express.Router();
const { tokenValidateFunc } = require('../controller/users');
const { getInfoFunc } = require('../controller/api');
router.get('/v1/information', tokenValidateFunc, getInfoFunc);
module.exports = router;
