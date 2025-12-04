const express = require('express')
const app = express()
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
app.use(express.json());
app.use('/', taskRoutes);
app.use('/', userRoutes);

app.listen(9000)
