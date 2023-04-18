const express = require('express');

const router = express.Router();

const tokenGenerator = require('../utils/tokenGenerator');
const validateFields = require('../utils/validateFields');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;

router.post('/login', validateFields, async (req, res) => {
  const { email, password } = req.body;
  const token = tokenGenerator();
  const user = { email, password, token };
  return res.status(HTTP_OK_STATUS).json(user);
});

module.exports = router;