const express = require('express');
const talkerDB = require('./talkerDB');

const tokenGenerator = require('./utils/tokenGenerator');
const validateFields = require('./utils/validateFields');
const validateToken = require('./utils/validations/validateToken');
const validateName = require('./utils/validations/validateName');
const validateAge = require('./utils/validations/validateAge');
const validateTalk = require('./utils/validations/validateTalk');
const validateWatchedAt = require('./utils/validations/validateWatchedAt');
const validateTalkRate = require('./utils/validations/validateTalkRate');
const writingFile = require('./utils/handleFile/writingFile');
const readingFile = require('./utils/handleFile/readingFile');
const validateRateSearch = require('./utils/validations/validateRateSearch');
const validateDateQuery = require('./utils/validations/validateDate');
const xablau = require('./utils/validations/xablau');

const app = express();
app.use(express.json());

const filePath = 'src/talker.json';

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Online na porta ${PORT}`);
});

app.get('/talker', async (_req, res) => {
  const talkers = await readingFile(filePath);

  if (!talkers) {
    return res.status(HTTP_OK_STATUS).json([]);
  } 
    return res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/db', async (req, res) => {
  try {
    const result = await talkerDB.getTalker();
    const xablau666 = result[0].map((element) => ({
      name: element.name,
      age: element.age,
      id: element.id,
      talk: {
        watchedAt: element.talk_watched_at,
        rate: element.talk_rate,
      },
    }));
    return res.status(HTTP_OK_STATUS).json(xablau666);
  } catch (error) {
    console.log(error.message);
  }
});

app.get('/talker/search',
  validateToken, validateRateSearch, validateDateQuery, async (req, res) => {
const { q, rate, date } = req.query;
const talkers = await readingFile(filePath);
let filteredTalker = talkers;

if (q) {
  filteredTalker = filteredTalker.filter((element) => element.name.includes(q));
}

if (rate) {
  filteredTalker = filteredTalker.filter((element) => element.talk.rate === Number(rate));
}

if (date) {
  filteredTalker = filteredTalker.filter((element) => element.talk.watchedAt === date);
}

return res.status(HTTP_OK_STATUS).json(filteredTalker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readingFile(filePath);
  const talker = talkers.find((element) => Number(element.id) === Number(id));

  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
    return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', validateFields, async (req, res) => {
  const { email, password } = req.body;
  const token = tokenGenerator();
  const user = { email, password, token };
  return res.status(HTTP_OK_STATUS).json(user);
});

app.post('/talker',
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

app.put('/talker/:id', 
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
  return res.status(HTTP_OK_STATUS).json(talkers[talkerIndex]);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;

    const talkers = await readingFile(filePath);
    const newArray = talkers.filter((element) => Number(element.id) !== Number(id));
    await writingFile(filePath, newArray);
    return res.status(204).json();
});

app.patch('/talker/rate/:id', validateToken, xablau, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;

  const talkers = await readingFile(filePath);

  console.log(talkers);
  const talker = talkers.find((element) => element.id === Number(id));

  talker.talk.rate = rate;

  const newTalker = [...talkers, talker];

  await writingFile(filePath, newTalker);

  return res.status(204).end();
});
