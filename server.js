const express = require('express');
const adminRoute = require('./route/adminRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/admin', adminRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
