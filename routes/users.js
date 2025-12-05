const express = require('express');
const router = express.Router();
let usersDetails = require('../usersDetails.json');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 


const authenticateMiddlware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
};

router.get('/products', authenticateMiddlware, (req, res) => {
    return res.status(200).json({ message: "Products fetched", user: req.user });
});

const validateUser = (req, res, next) => {
    if ((!req.body.name) || (!req.body.email) || (!req.body.password)) {
        return res.status(400).json({ error: "Empty Body not allowed" });
    }
    next();
};

router.post('/userSignup', validateUser, (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }
        const newUser = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword
        };
        usersDetails.push(newUser);
        fs.writeFile('./usersDetails.json', JSON.stringify(usersDetails), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error saving user data" });
            }
            return res.status(201).send({
                message: "User Signup Successfully",
            });
        });
    });
});


router.post('/userLogin', (req, res) => {
    const { email, password } = req.body;
    const user = usersDetails.find(u => u.email === email);
    if (!user) {
        return res.status(401).send({ message: "User not found" });
    }
     bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).send({ message: "Error comparing passwords" });
        }
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid password" });
        }
        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
      
        return res.status(200).send({ message: "Login successful" , token});
    });
});

router.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    const userIndex = usersDetails.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }
    if (password) {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: "Error hashing password" });
            }
            usersDetails[userIndex].password = hashedPassword;
            fs.writeFile('./usersDetails.json', JSON.stringify(usersDetails), (err) => {
                if (err) {
                    return res.status(500).json({ error: "Error saving user data" });
                }
                return res.status(200).send({
                    message: "User updated successfully",
                });
            });
        });
    } else {
        return res.status(400).send({ message: "Password is required to update" });
    }
});
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = usersDetails.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).send("id not found")
    }
    const deletedUser = usersDetails.splice(userIndex, 1);
    fs.writeFile('./usersDetails.json', JSON.stringify(usersDetails), (err) => {
        return res.status(200).send(`delete successfully data`);
    })
})

module.exports = router;
