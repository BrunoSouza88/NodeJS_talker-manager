const express = require('express');

const router = express.Router();

const talkerRouter = require('./talkerRouter');
const loginRouter = require('./loginRouter');

router.use(talkerRouter);
router.use(loginRouter);

module.exports = router;
