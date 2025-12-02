const express = require('express');
const router = express.Router();
let tasks = require('../tasks.json');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const validateTask = (req, res, next) => {
    if (!req.body.title) {
        return res.status(400).json({ error: "Empty Body not allowed" });
    }
    next();
};

router.get('/tasks', (req, res) => {
    return res.status(200).send(JSON.stringify(tasks))
})

router.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const task = tasks.find((task) => task.id === id);
    return res.status(200).send(JSON.stringify(task))
})

router.post('/tasks',validateTask, (req, res) => {
  const newTask = {
        id: uuidv4(), ...req.body
    };
    tasks.push(newTask);
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err) => {
        return res.status(201).send(JSON.stringify(newTask));
    })
})

router.put('/tasks/:id', (req, res) => {
    const id =req.params.id;
    const taskIndex = tasks.findIndex((task) => task.id === id);
    const updatedTask = req.body;
    tasks[taskIndex] = { id, ...updatedTask };
    res.send(JSON.stringify(tasks[taskIndex]))
     fs.writeFile('./tasks.json', JSON.stringify(tasks), (err) => {
        return res.status(200).send(JSON.stringify(`updates data successfully`))
    })
})

router.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
        return res.status(404).send("id not found")
    }
    const deletedTask = tasks.splice(taskIndex, 1);
    fs.writeFile('./tasks.json', JSON.stringify(tasks), (err) => {
        return res.status(200).send(`delete successfully data`);
    })
})

module.exports = router;
