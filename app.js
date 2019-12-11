const express = require('express');
const cors = require('cors');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'colorpicker';
app.use(cors());
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

app.patch('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  for (let requiredParameter of ['name']) {
    if (!request.body[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format { name: <String>. You are missing a ${requiredParameter} property }`
      });
    }
    database('projects')
      .where('id', request.params.id)
      .update({ ...request.body })
      .then(project => {
        if(project.length) {
          response.status(202).json({ id: id});
        } else {
          response.status(404).json(`No project with the id: ${id} found`);
        }
      })
      .catch(error => response.status(500).json({ error }));
  }
});

app.patch('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  for (let requiredParameter of ['name']) {
    if (!request.body[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format { name: <String>. You are missing a ${requiredParameter} property }`
      });
    }
    database('palettes')
      .where('id', request.params.id)
      .update({ ...request.body })
      .then(palette => {
        if(palette.length) {
          response.status(202).json({ id: id});
        } else {
          response.status(404).json(`No palette with the id: ${id} found`);
        }
      })
      .catch(error => response.status(500).json({ error }));
  }
});

// app.delete('api/v1/projects/:id', (request, response) => {
//   const { id } = request.params
//   database('palettes')
//     .where('project_id', id)
//     .del()
//     .then(res => {
//       database('projects')
//       .where('id', id)
//       .del()
//       .then(res => {
//         if(!res) {
//           response.status(404).json(`No project with id: ${id} found`)
//         } else {
//           response.status(204).json(`Project with id: ${id} has been deleted.`)
//         }
//       })
//       .catch(error => {
//         response.status(500).json({ error })
//       })
//     })
// });

app.delete('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params
  database('palettes')
    .where('project_id', id)
    .del()
    .then(() => {
  database('projects')
    .where('id', id)
    .del()
    .then(project => {
        if (!project) {
          response.status(404).json(`No project with id: ${ id } found`);
        } else {
          response.status(204).json(`Project with id: ${ id } has been deleted.`);
        }
      })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes')
    .where({ id: id })
    .del()
    .then(res => {
      if(res) {
        response.status(200).json(`Palette ${id} has been deleted`);
      } else {
        response.status(404).json(`Could not find palette with the id of: ${id}`);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    })
});

module.exports = app;
