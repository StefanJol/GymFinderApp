const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const crypto = require('crypto'); // built in thingy i want to use for the password
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) console.log('db error:', err.message);
    else console.log('db connected');
});

// REGISTRATION 
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    const salt = crypto.randomBytes(16).toString('hex');
    
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) return res.status(500).send('error');

        const passwordHash = salt + ":" + derivedKey.toString('hex');
        const role = 'regular'; // default role

        const sql = 'INSERT INTO user (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, email, passwordHash, role], (err, result) => {
            if (err) return res.status(500).send('fail');
            res.send('user created');
        });
    });
});

// LOGIN codee
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('no user');

        const user = results[0];
        const [salt, originalHash] = user.password_hash.split(':');

        crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (derivedKey.toString('hex') !== originalHash) {
                return res.status(400).send('wrong pass');
            }

            res.json({
                id: user.id,
                username: user.username,
                role: user.role
            });
        });
    });
});

app.listen(5000, () => console.log('running on 5000'));