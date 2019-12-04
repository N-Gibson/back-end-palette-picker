const express = require('express');
const cors = require('cors');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'colorpicker';
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
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for(let requiredParam of ["name"]) {
    if(!project[requiredParam]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You\'re missing a \'${requiredParam}\' property.`})
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for(let requiredParam of ['name', 'project_id', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if(!palette[requiredParam]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, project_id <Integer>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>}. You\'re missing a \'${requiredParam}\' property.`})
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

app.post('/api/v1/projects', (request, response) => {
  console.log(request)
})

module.exports = app;