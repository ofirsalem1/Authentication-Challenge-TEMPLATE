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

exports.getUsersDbFunc = (req, res) => {
  console.log(req.user);
  if (req.user.isAdmin) {
    console.log('in', req.user);
    return res.status(200).send({ USERS: [USERS] });
  }
  console.log('out', req.user);
  res.status(400).send('No access');
};