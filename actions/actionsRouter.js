const express = require('express');

const router = express.Router();

const actionDb = require('../data/helpers/actionModel.js');
const projectDb = require('../data/helpers/projectModel.js');

// Get request for retrieving a list of actions on a specific project

router.get('/:id', (req, res) => {
    projectDb.getProjectActions(req.params.id)
    .then(db => {
        res.status(200).json(db);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: ' the data for this action was not recieved'})
    })
})

// Post rewuest to add a new action to a project going to use a middle ware to verify the project exists

router.post('/', validateProject, (req,res) => {
    const actionInfo = req.body;
     if(actionInfo.description){
        if (actionInfo.description.length < 128) {
            actionDb.insert(req.body)
                .then(db => { res.status(201).json(db)
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({error: 'something when wrong while adding action to database'})
            })
        } else {
            res.status(400).json({error: 'description must be below 128 characters'})
        }
     } else {
         console.log('object error');
            res.status(400).json({error: 'Description require for this action'})
     }
})

// here i will do a delete request for the actions on the projects

router.delete('/:id', (req,res) => {
    actionDb.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({message: 'action successfully remove'});
            } else {
                res.status(404).json({message: 'there is no action with specific id'})
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: 'action could not be removed from project'})
        })
})

// below is the put for updating an action on a project

router.put('/:id', validateAction, (req, res) => {
    const actionInfo = req.body;
    if (actionInfo.description) {
        if (actionInfo.description.length <129) {
            actionDb.update(req.params.id, req.body)
            .then(db => {
                res.status(201).json(db);
            })
            .catch(error => {
                // log error to database
                console.log(error);
                res.status(500).json({
                    error: "There was an error while saving the action to the database",
                });
            });
        } else {
            res.status(400).json({
                errorMessage: "reduce the descrption to less than 128 characters",
            });
        }

    } else {
        console.log('object error');
            res.status(400).json({
                errorMessage: "Please provide description for action.",
            });
    }
  });

  // here i will create my middleware for validate action and for validate project
  function validateAction(req, res, next){
    const project_id = req.body.project_id;
    if (project_id) {
        projectDb.getProjectActions(project_id)
        .then(actions => {
            console.log('actions', actions);
            result = actions.filter(e => e.id === req.params.id)
          if (result) {
            next();
          } else {
            res.status(404).json({error: 'this id was not found '});
          }
        })
        .catch(err => {
          res.status(500).json({error: 'was not able to retrieve id'})
        })
    } else {
        res.status(400).json({error: 'the project_id is missing'});
    }

  };


  function validateProject(req,res,next){
      const project_id = req.body.project_id;
      if(project_id) {
          projectDb.get(project_id)
            .then(id => {
                if (id) {
                    next();
                } else {
                    res.status(404).json({error: 'project id not found'})
                }
            })
            .catch(error => {
                res.status(500).json({error: ' was not able to retrieve id'})
            })
      } else {
          res.status(400).json({error: 'missing the project_id'})
      }
  }

  module.exports = router;