const express = require('express');
const route = require('./route/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1', route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
