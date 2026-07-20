const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'assignment6db',
    password: '1234',
    port: 5432
})

router.get('/', async (req, res) => {
    try{
         const result = await db.query(`SELECT * FROM users ORDER BY id ASC;`);
         res.status(200).json({status: 200, data: result.rows})
    } catch(err){
        console.log(err);
        res.status(400).json({status: 400, message: err});
    }
});

router.get('/:id', async (req, res) => {
    try{
         const result = await db.query(`SELECT * FROM users WHERE id = ${req.params.id};`);
         res.status(200).json({status: 200, data: result.rows[0]});
    } catch(err){
        console.log(err);
        res.status(400).json({status: 400, message: err});
    }
});

router.post('/', async (req, res) => {
    try{
        if(req.body && req.body.first_name && req.body.last_name){
            console.log(`INSERT INTO users (first_name, last_name, age, address) VALUES ('${req.body.first_name}', '${req.body.last_name}', '${req.body.age}', '${req.body.address}')`)
            const result = await db.query(`INSERT INTO users (first_name, last_name, age, address) VALUES ('${req.body.first_name}', '${req.body.last_name}', '${req.body.age}', '${req.body.address}')`);
            res.status(201).json({status: 201, message: 'user entry successfully created'});
        } else {
            throw(`Data payload is invalid. It must be in JSON format and contain the fields 'first_name' and 'last_name'.`);
        }
    } catch(err) {
        console.log(`\n` + err);
        res.status(400).json({status: 400, message: err});
    }
});

router.put('/:id', async (req, res) => {
    try{
        if(req.body && (req.body.first_name || req.body.last_name || req.body.age || req.body.address)){
            var updateFields = ``;
            for(const key of Object.keys(req.body)){
                if(key == 'first_name' || key == 'last_name' || key == 'age' || key == 'address'){
                    if(updateFields != ''){
                        updateFields += ', ';
                    }
                    updateFields += `${key} = '${req.body[key]}'`;
                }
            }
            const result = await db.query(`UPDATE users SET ${updateFields} WHERE id = ${req.params.id}`);
            if(result.rowCount > 0){
                res.status(200).json({status: 200, message: `succesfully updated ${result.rowCount} row(s)`});
            } else {
                res.status(404).json({status: 404, message: `User with id = ${req.params.id} not found.`});
            } 
        } else {
            throw(`Data payload is invalid. It must be in JSON format and contain atleast one of the fields 'first_name', 'last_name', 'age', or 'address'.`);
        }
    } catch(err) {
        console.log(`\n` + err);
        res.status(400).json({status: 400, message: err});
    }
    
});

router.delete('/:id', async (req, res) => {
    try{
        const result = await db.query(`DELETE FROM users WHERE id = ${req.params.id}`);
        if(result.rowCount > 0){
            res.status(200).json({status: 200, message: `Deletion of user with id: ${req.params.id} successfull`});
        } else {
            throw(`User with id: ${req.params.id}`)
        }
    } catch(err) {
        console.log(`\n` + err);
        res.status(404).json({status: 400, message: err});
    }
});

module.exports = router;