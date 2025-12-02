const express = require('express')
let tasks = require('./tasks.json')
const fs = require("fs");
const app = express()
app.use(express.json());

app.get('/tasks', (req, res) => {
    return res.send(JSON.stringify(tasks))
})
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    return res.send(JSON.stringify(task))
})

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    newTask.id = tasks.length + 1;
    tasks.push(newTask);
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err) => {
        return res.send(JSON.stringify(newTask));
    })
})

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const taskIndex = tasks.findIndex((task) => task.id === id);
    const updatedTask = req.body;
    tasks[taskIndex] = { id, ...updatedTask };
    res.send(JSON.stringify(tasks[taskIndex]))
     fs.writeFile('./tasks.json', JSON.stringify(tasks), (err) => {
        return res.send(JSON.stringify(`updates data successfully`))
    })
})

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
        return res.send("id not found")
    }
    const deletedTask = tasks.splice(taskIndex, 1);
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err) => {
        return res.send(JSON.stringify(`delete successfully data`))
    })
})

app.listen(3001)
