const projectsData = require('../../../data/projectData');
const palettesData = require('../../../data/paletteData');

const createProject = (knex, project) => {
  return knex('projects').insert({
    id: project.id,
    name: project.name
  });
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert({
    name: palette.name,
    id: palette.id,
    project_id: palette.project_id,
    color1: palette.color1,
    color2: palette.color2,
    color3: palette.color3,
    color4: palette.color4,
    color5: palette.color5
  });
};

exports.seed = (knex) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectsPromises = [];
      projectsData.forEach(project => {
        projectsPromises.push(createProject(knex, project));
      });
      return Promise.all(projectsPromises);
    })
    .then(() => knex('palettes').del())
    .then(() => {
      const palettesPromise = [];
      palettesData.forEach(palette => {
        palettesPromise.push(createPalette(knex, palette));
      });
      return Promise.all(palettesPromise);
    })
    .catch(error => console.error(`Error seeding data: ${error}`));
};






