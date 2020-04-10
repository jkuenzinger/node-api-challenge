const express = require('express');
const server = express();
const actionsRouter = require('./actions/actionsRouter')

const projectDb =  require('./data/helpers/projectModel.js')


server.use(express.json());

server.use('/actions/', actionsRouter);

server.get('/', (req,res) => {
    res.send(`<h1>the server is running </h1>`)
})

// gets requests for the projects below

// this gets a list of all projects in db
server.get('/project/', (req,res) => {
    console.log(req.query);
    projectDb.get()
    .then(db => {
        res.status(200).json(db);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "could not retrieve the projects"})
    })
})

// this will get a list of specifcis projects by id using params.id

server.get('/projects/:id', (req,res) => {
    console.log(req,query);
    projectDb.get(rew.params.id)
    .then(db => {
        res.status(200).json(db);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "could not get information on specific post"})
    })
})

// put requests for the projects endpoints below 


// below will add a new project
server.post('/projects/', (req,res) => {
    const projectDb = req.body;
    console.log('req', req.body)
        if(projectDb.name && projectDb.description){
            projectDb.insert(req.body)
            .then(db => {
                res.status(201).json(db)
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({error: "project was not saved to the db"})
            })
        } else{
            console.log('object error');
                res.status(400).json({error: " please provide name and description for the project"})
        }
})

// below i will do a delete request for deleting a project by using it's id

server.delete('/projects/:id', (req, res) => {
    projectDb.remove(req.params.id)
        .then(count => {
            if (count>0) {
                res.status(200).json({message: 'the project was deleted from the database'})
            } else {
                res.status(404).json({message: ' there is no project with that id'})
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: 'the project was not removed'})
        })
})

module.exports = server;