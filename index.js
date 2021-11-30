const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const appFile = require('./app');
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.use('/', appFile);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
