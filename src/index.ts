import { createNewHBOTrial } from './scripts/cards/hbo';

import express from 'express';

const app = express();

createNewHBOTrial('asd', 'adsf', { number: 123, expiryDate: '08/22', cvv: 12 });
app.get('/', (req, res) => {
  res.send('hello');
});

// Serve the files on port 3000.
const server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
