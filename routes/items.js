const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Connection data for the local PostgreSQL database
const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'assignment6db',
    password: '1234',
    port: 5432
})

// GET /api/items
// Returns all rows of the users table
router.get('/', async (req, res) => {
    try{
         const result = await db.query(`SELECT * FROM users ORDER BY id ASC;`);
         res.status(200).json({status: 200, data: result.rows})
    } catch(err){
        console.log(err);
        res.status(400).json({status: 400, message: err});
    }
});

// GET /api/items/{id}
// Returns the users row from the table with the matching id
router.get('/:id', async (req, res) => {
    try{
         const result = await db.query(`SELECT * FROM users WHERE id = ${req.params.id};`);
         res.status(200).json({status: 200, data: result.rows[0]});
    } catch(err){
        console.log(err);
        res.status(400).json({status: 400, message: err});
    }
});

// POST /api/items
// Adds new row to the users table
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

// PUT /api/items/{id}
// Changes the values of the fields provided in the request body for the users row with the specified id
router.put('/:id', async (req, res) => {
    try{
        if(req.body && (req.body.first_name || req.body.last_name || req.body.age || req.body.address)){
            var updateFields = ``;
            for(const key of Object.keys(req.body)){
                // Adds all the provided update fields and values to the SQL query string
                if(key == 'first_name' || key == 'last_name' || key == 'age' || key == 'address'){
                    if(updateFields != ''){
                        updateFields += ', ';
                    }
                    updateFields += `${key} = '${req.body[key]}'`;
                }
            }
            const result = await db.query(`UPDATE users SET ${updateFields} WHERE id = ${req.params.id}`);
            // rowCount is the number of affected rows, if 0 then update was unsuccessful
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

// DELETE /api/items/{id}
// Deletes the row with the given id from the users table
router.delete('/:id', async (req, res) => {
    try{
        const result = await db.query(`DELETE FROM users WHERE id = ${req.params.id}`);
        // rowCount is the number of affected rows, if 0 then update was unsuccessful
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