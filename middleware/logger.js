
// This function prints a log to the terminal every time a fetch request is made to the server
function logger(req, res, next){
    console.log(`\n${new Date().toISOString()} ${req.method} request: ${req.path}`);
    if(req.body){
        console.log(`Data payload: `);
        console.log(req.body);
    }
    next();
}

module.exports = logger;