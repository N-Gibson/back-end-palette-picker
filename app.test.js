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
    it('should return a 201 and add a new student to the database', async () => {
      const newProject = { name: 'New Project' }

      const response = await request(app).post('/api/v1/projects').send(newProject);
      const projects = await database('projects').where('id', response.body.id).select();
      const project = projects[0];

      expect(response.status).toBe(201);
      expect(project.name).toBe(newProject.name);
    })
  })
});