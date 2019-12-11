const request = require('supertest');
const app = require('./app');

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('GET /api/v1/projects', () => {
    it('should return a 200 status and all of the projects', async () => {
      const expectedProjects = await database('projects').select();

      const response = await request(app).get('/api/v1/projects');
      const projects = response.body;

      expect(response.status).toBe(200);
      expect(projects.name).toEqual(expectedProjects.name);
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return a 200 status and all of the palettes', async () => {
      const expectedPalettes = await database('palettes').select();

      const response = await request(app).get('/api/v1/palettes');
      const palettes = response.body;

      expect(response.status).toBe(200);
      expect(palettes.name).toEqual(expectedPalettes.name);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a 200 status and the specific project requested', async () => {
      const expectedProject = await database('projects').select().first();
      const { id } = expectedProject;

      const response = await request(app).get(`/api/v1/projects/${id}`);
      const result = response.body[0];

      expect(response.status).toBe(200);
      expect(result.name).toEqual(expectedProject.name);
    });

    it('should return a 404 status and the message \'Project not found\'', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/projects/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Project not found');
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a 200 status and the specific project requested', async () => {
      const expectedPalette = await database('palettes').select().first();
      const { id } = expectedPalette;

      const response = await request(app).get(`/api/v1/palettes/${id}`);
      const result = response.body[0];

      expect(response.status).toBe(200);
      expect(result.name).toEqual(expectedPalette.name);
    });

    it('should return a 404 status and the message \'Palette not found\'', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/palettes/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Palette not found');
    });
  });

  describe('POST /api/v1/projects', () => {
    it.skip('should return a 201 status and add a new project to the database', async () => {
      const newProject = { name: 'New Project' }

      const response = await request(app).post('/api/v1/projects').send(newProject);
      const projects = await database('projects').where('id', response.body.id).select();
      const project = projects[0];

      expect(response.status).toBe(201);
      expect(project.name).toBe(newProject.name);
    });

    it('should return a 422 status and the message \'A message that is bad\'', async () => {
      const invalidOptions = { nothing: 'here'};

      const response = await request(app).post('/api/v1/projects').send(invalidOptions);

      expect(response.status).toBe(422);
    })
  });

  describe('POST /api/v1/palettes', () => {
    it.skip('should return a 201 status and add a new palette to the database', async () => {
      const newPalette = { project_id: 1,  name: 'New Palette', color1: '#123456', color2: '#987654', color3: '#345678', color4: '#876543', color5: '#102938'}
 
      const response = await request(app).post('/api/v1/palettes').send(newPalette);
      const palettes = await database('palettes').where('id', response.body.project_id).select();
      const palette = palettes[0];

      expect(response.status).toBe(201);
      expect(palette.name).toBe(newPalette.name);
    });

    it('should return a 422 status and the message \'A message that is also bad\'', async () => {
     const invalidOptions = { nothing: 'here'};

      const response = await request(app).post('/api/v1/projects').send(invalidOptions);

      expect(response.status).toBe(422);
    })
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it.skip('should return a 202 status and return the modified project', async () => {
      const prePatchProject = await database('projects').select().first();

      expect(prePatchProject.name).toEqual('Project Name 1')

      const postPatchProject = {name: 'Very New Name'}
      const project = await request(app).patch('/api/v1/projects/1').send(postPatchProject)
      const project1 = await database('projects').select()

      expect(project.status).toBe(202);
      expect(postPatchProject.name).toEqual(project1[2].name)
    });

    it('should return a 422 status and the missing information from the body', async () => {
      const invalidParam = { nombre: 'Bob' };

      const project = await request(app).patch('/api/v1/projects/1').send(invalidParam);

      expect(project.status).toBe(422);
      expect(project.body.error).toBe('Expected format { name: <String>. You are missing a name property }');
    });

    it('should return a 404 status and a message stating no project found', async () => {
      const invalidId = -1;
      const param = { name: 'Valid project name'}
      const response = await request(app).patch(`/api/v1/projects/${invalidId}`).send(param);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(`No project with the id: ${invalidId} found`);
    });
  });

  describe('PATCH /api/v1/palettes/:id', () => {
    it.skip('should return a 202 status and return the modified palette', async () => {
      const prePatchPalette = await database('palettes').select().first();

      expect(prePatchPalette.name).toEqual('Palette Name 1')

      const postPatchPalette = {
        name: 'Very New Name',
      }
      const palette = await request(app).patch('/api/v1/palettes/1').send(postPatchPalette)
      const palette1 = await database('palettes').select()

      expect(palette.status).toBe(202);
      expect(postPatchPalette.name).toEqual(palette1[2].name)
    });

    it('should return a 422 status and the missing information from the body', async () => {
      const invalidParam = { nombre: 'Bob' };

      const palette = await request(app).patch('/api/v1/palettes/1').send(invalidParam);

      expect(palette.status).toBe(422);
      expect(palette.body.error).toBe('Expected format { name: <String>. You are missing a name property }');
    });

    it('should return a 404 status and a message stating no palette found', async () => {
      const invalidId = -1;
      const param = { name: 'Valid project name'}
      const response = await request(app).patch(`/api/v1/palettes/${invalidId}`).send(param);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(`No palette with the id: ${invalidId} found`);
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should return a 200 status code and the id of the deleted palette', async () => {
      const palettes = await database('palettes').select();
      const palette = palettes[0];
      const paletteId = palette.id;

      const response = await request(app).delete(`/api/v1/palettes/${paletteId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(`Palette ${paletteId} has been deleted`);
    });

    it.skip('should reduce the size of the database if the deletion was successful', async () => {
      const palettes = await database('palettes').select();
      const palette = palettes[0];
      const paletteId = palette.id;

      expect(palettes.length).toEqual(3);

      const response = await request(app).delete(`/api/v1/palettes/${paletteId}`);

      const deletedPalettes = await database('palettes').select();

      expect(deletedPalettes.length).toEqual(2);
    git })

    it('should return a 404 status code if there is no palette with the matching id and the corresponding error message', async () => {
      const invalidId = -1;

      const response = await request(app).delete(`/api/v1/palettes/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body).toBe('Could not find palette with the id of: -1');
    })
  })

  describe('DELETE /projects/:id', () => {
    it.skip('should return a 204 status code and remove project from database', async () => {
        const deletedId = await database('projects').select().first().then(project => project.id)
        const response = await request(app).delete(`/api/v1/projects/${deletedId}`)
        expect(response.status).toBe(204)
    })

    it.skip('should return a 404 status code if a request id is not found', async () => {
        const response = await request(app).delete('/api/v1/projects/-10')
        expect(response.status).toBe(404)
    })
  })
}); 