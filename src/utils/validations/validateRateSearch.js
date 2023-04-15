const validateRateSearch = (req, res, next) => {
  const { rate } = req.query;
  const numberRate = Number(rate);
  if (numberRate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  } 
  if (numberRate < 1 || numberRate > 5 || !Number.isInteger(numberRate)) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

module.exports = validateRateSearch;