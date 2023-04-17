const connection = require('./mySql2/connection');

const getTalker = () => connection.execute(
  'SELECT * FROM TalkerDB.talkers',
);

module.exports = {
  getTalker,
};