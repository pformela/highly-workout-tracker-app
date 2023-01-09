const asyncHandler = require("express-async-handler");
const neo4j = require("neo4j-driver");
const { v4: uuidv4 } = require("uuid");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

const createTemplateFolder = asyncHandler(async (req, res) => {
  const { username, folderName } = req.body;
  const folderId = uuidv4();

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (u:User {username: "${username}"})
    CREATE (f:TemplateFolder {folder_id: "${folderId}", name: "${folderName}", username: "${username}", created_at: datetime()})
    MERGE (f)-[:BELONGS_TO]->(u)
    RETURN f
    `
    )
    .then((result) => {
      const { folder_id, name, created_at } =
        result.records[0]._fields[0].properties;

      session.close();

      res.send({ folderId: folder_id, name, createdAt: created_at.toString() });
    })
    .catch((error) => {
      res.status(404).send("Error creating template folder");
    });
});

const getTemplateFolders = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (u:User {username: "${username}"})<-[:BELONGS_TO]-(f:TemplateFolder)
    RETURN f
    `
    )
    .then((result) => {
      const templateFolders = result.records.map((record) => {
        return {
          name: record._fields[0].properties.name,
          folderId: record._fields[0].properties.folder_id,
          createdAt: record._fields[0].properties.created_at.toString(),
        };
      });

      console.log(templateFolders);

      session.close();

      res.send(templateFolders);
    })
    .catch((error) => {
      console.log(error);
    });
});

const getFolderTemplates = asyncHandler(async (req, res) => {
  const { username, folderId } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (f:TemplateFolders {username: "${username}", folder_id: "${folderId}"})-[rel:CONTAINS]->(t:Template)
    RETURN t, rel
    `
    )
    .then((result) => {
      const folderTemplates = result.records.reduce((acc, record) => {
        const { name } = record._fields[0].properties;
        const templateId = record._fields[0].elementId;

        acc.push({
          templateId,
          name,
        });

        return acc;
      });

      session.close();

      res.send(folderTemplates);
    })
    .catch((error) => {
      console.log(error);
    });
});

const getTemplateExercises = asyncHandler(async (req, res) => {
  const { username, folderId } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (f:TemplateFolder {username: "${username}", folder_id: "${folderId}"})-[rel:CONTAINS]->(ex:Exercise)
    RETURN ex, rel
    `
    )
    .then((result) => {
      const templateExercises = result.records.reduce((acc, record) => {
        const { name } = record._fields[0].properties;
        const exerciseId = record._fields[0].elementId;
        const { sets, reps, weight } = record._fields[1].properties;

        acc.push({
          exerciseId,
          name,
          sets,
          reps,
          weight,
        });

        return acc;
      });

      session.close();

      res.send(templateExercises);
    })
    .catch((error) => {
      console.log(error);
    });
});

const createTemplate = asyncHandler(async (req, res) => {
  const { username, folderId, name, exercises } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (f:TemplateFolder {username: "${username}", folder_id: "${folderId}"})
    CREATE (t:Template {name: "${name}", username: "${username}"})
    MERGE (t)-[:BELONGS_TO]->(f)
    RETURN t
    `
    )
    .then((result) => {
      const { name, username } = result.records[0]._fields[0].properties;

      session.close();

      res.send({ name, username });
    })
    .catch((error) => {
      res.status(404).send("Error creating template");
    });
});

module.exports = {
  createTemplateFolder,
  getTemplateFolders,
  getFolderTemplates,
  getTemplateExercises,
  createTemplate,
};
