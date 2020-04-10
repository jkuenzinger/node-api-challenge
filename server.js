const express = require('express');
const server = express();
const actionsRouter = require('./actions/actionsRouter')

const projectDB =  require('./data/helpers/projectModel.js')


server.use(express.json());

server.use('/actions/', actionsRouter);

server.get('/', (req,res) => {
    res.send(`<h1>the server is running </h1>`)
})

module.exports = server;