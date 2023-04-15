const express = require('express');
const generateToken = require('../utils/tokenGenerator');
const validateFields = require('../utils/validateFields');

const router = express.Router();

router.post('/login', validateFields, async (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();
  const user = { email, password, token };
  return res.status(200).json(user);
});