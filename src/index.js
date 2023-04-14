const express = require('express');

const fs = require('fs').promises;

const app = express();
app.use(express.json());

const filePath = './src/talker.json';

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Online na porta ${PORT}`);
});

const readFile = async () => {
  const file = await fs.readFile(filePath, 'utf-8');
  const fileParsed = JSON.parse(file);
  return fileParsed;
};

app.get('/talker', async (_req, res) => {
  const talkers = await readFile();

  if (!talkers) {
    return res.status(200).send([]);
  } 
    return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();
  const talker = talkers.find((element) => Number(element.id) === Number(id));

  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
    return res.status(200).json(talker);
});