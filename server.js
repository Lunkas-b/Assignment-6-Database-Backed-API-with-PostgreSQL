const express = require('express');
const logger = require('./middleware/logger.js');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(logger);

// Gets the router that contains all the fetch request handling for the DB
const itemsRouter = require('./routes/items.js');
app.use('/api/items', itemsRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}\n`);
})