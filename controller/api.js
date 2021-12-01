require('dotenv').config();
const { USERS, INFORMATION, REFRESHTOKENS } = require('../db/db');

exports.getInfoFunc = (req, res) => {
  const { email } = req.user;
  for (let i of INFORMATION) {
    if (i.email === email) {
      res.status(200).send([i]);
      return;
    }
  }
  res.status(500).send('something went wrong');
};
