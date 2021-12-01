const express = require('express');
const router = express.Router();
const { tokenValidateFunc } = require('../controller/users');
const { getInfoFunc, getUsersDbFunc } = require('../controller/api');

router.get('/v1/information', tokenValidateFunc, getInfoFunc);
router.get('/v1/users', tokenValidateFunc, getUsersDbFunc);

module.exports = router;
