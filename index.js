const express = require('express')
const app = express()
const taskRoutes = require('./routes/tasks');
app.use(express.json());
app.use('/', taskRoutes);

app.listen(3001)
