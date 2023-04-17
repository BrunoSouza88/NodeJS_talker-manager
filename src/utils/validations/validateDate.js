const validateDateQuery = async (req, res, next) => {
  const { date } = req.query;  
  
  const validDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  if (date && !validDate.test(date)) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

module.exports = validateDateQuery;