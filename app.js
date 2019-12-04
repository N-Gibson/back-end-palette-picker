const express = require('express');
const cors = require('cors');
const app = express();

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(cors());
// Can pass options 
app.use(express.json());

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params
  database('projects').where({ 'id': id }).select()
    .then(project => {
      if(project.length) {
        response.status(200).json(project)
      } else {
        response.status(404).json({
          error: 'Project not found'
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params
  database('palettes').where({ 'id': id }).select()
    .then(palette => {
      if(palette.length) {
        response.status(200).json(palette)
      } else {
        response.status(404).json({
          error: 'Palette not found'
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/projects', (request, response) => {
  console.log(request)
})

module.exports = app;