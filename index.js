const express = require('express');
const port = process.env.PORT || 3000;
const app = require('./app');
const morgan = require('morgan');

app.use(morgan('dev'));

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
