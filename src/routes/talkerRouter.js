const express = require('express');

const readingFile = require('../utils/handleFile/readingFile');
const writingFile = require('../utils/handleFile/writingFile');
const validateAge = require('../utils/validations/validateAge');
const validateName = require('../utils/validations/validateName');
const validateTalk = require('../utils/validations/validateTalk');
const validateToken = require('../utils/validations/validateToken');
const validateWatchedAt = require('../utils/validations/validateWatchedAt');
const validateTalkRate = require('../utils/validations/validateTalkRate');

const router = express.Router();

const filePath = 'src/talker.json';

router.get('/talker', async (_req, res) => {
  const talkers = await readingFile(filePath);

  if (!talkers) {
    return res.status(200).send([]);
  } 
    return res.status(200).json(talkers);
});

router.get('/talker/search/', validateToken, async (req, res) => {
  const talkers = await readingFile(filePath);

  const filteredTalker = talkers.filter((element) => element.name.includes(req.query.q));

  return res.status(200).json(filteredTalker);
});

router.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readingFile(filePath);
  const talker = talkers.find((element) => Number(element.id) === Number(id));

  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
    return res.status(200).json(talker);
});

router.post('/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateTalkRate,
  async (req, res) => {
  const { name, age, talk } = req.body;

  const data = await readingFile(filePath);

  const newTalker = { 
    id: data.length + 1,
    name,
    age,
    talk,
  };

  const newTalkers = [...data, newTalker];
  
  await writingFile(filePath, newTalkers);

  return res.status(201).json(newTalker);
});

router.put('/talker/:id', 
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateTalkRate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  
  const talkers = await readingFile(filePath);

  const talkerIndex = talkers.findIndex((element) => element.id === Number(id));

  if (!talkers[talkerIndex]) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
  talkers[talkerIndex] = {
    id: Number(id),
    name,
    age,
    talk,
  };
  await writingFile(filePath, talkers);
  return res.status(200).json(talkers[talkerIndex]);
});

router.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;

    const talkers = await readingFile(filePath);
    const newArray = talkers.filter((element) => Number(element.id) !== Number(id));
    await writingFile(filePath, newArray);
    return res.status(204).json();
});

module.exports = router;