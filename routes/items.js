const express = require('express');
const router = express.Router();
const Postgre = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const db = new Postgre({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
})

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.post('/', (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});


module.exports = router;