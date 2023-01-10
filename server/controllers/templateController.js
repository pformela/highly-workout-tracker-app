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
    ORDER BY f.created_at DESC
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

      session.close();

      res.send(templateFolders);
    })
    .catch((error) => {
      console.log(error);
    });
});

const deleteTemplateFolder = asyncHandler(async (req, res) => {
  const { username, folderId } = req.body;
  console.log("username " + username + " folderId " + folderId);

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (f:TemplateFolder {username: "${username}", folder_id: "${folderId}"})
    OPTIONAL MATCH (f)-[:CONTAINS]->(t:Template)
    DETACH DELETE f, t
    `
    )
    .then((result) => {
      session.close();
      console.log("Folder deleted");
      console.log("folderID: " + folderId);

      res.send({ folderId });
    })
    .catch((error) => {
      console.log(error);
    });
});

const updateTemplateFolder = asyncHandler(async (req, res) => {
  const { folderId, folderName, username } = req.body;

  const session = driver.session();

  const result = await session
    .run(
      `
    MATCH (f:TemplateFolder {username: "${username}", folder_id: "${folderId}"})
    SET f.name = "${folderName}"
    RETURN f
    `
    )
    .then((result) => {
      const { folder_id, name, created_at } =
        result.records[0]._fields[0].properties;

      session.close();

      res.send({
        newFolderName: name,
        folderId: folder_id,
        createdAt: created_at.toString(),
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const getFolderTemplates = asyncHandler(async (req, res) => {
  const { username, folderName, folderId } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (f:TemplateFolder {username: "${username}", name: "${folderName}", folder_id: "${folderId}"})-[:CONTAINS]->(t:Template)<-[rel:IS_IN]-(ex:Exercise)
    RETURN t, rel, ex
    `
    )
    .then((result) => {
      const folderTemplates = result.records.reduce((acc, record) => {
        console.log(acc);
        const { name, template_id } = record._fields[0].properties;
        const { sets, reps, weight } = record._fields[1].properties;

        const exerciseName = record._fields[2].properties.name;
        const exerciseId = record._fields[2].identity.low;

        if (!acc.hasOwnProperty(template_id)) {
          acc[template_id] = {
            templateId: template_id.low,
            name,
            exercises: [
              {
                exerciseId,
                exerciseName,
                sets: sets.low,
                reps: reps.low,
                weight: weight.low,
              },
            ],
          };
        } else {
          acc[template_id].exercises.push({
            exerciseId,
            exerciseName,
            sets: sets.low,
            reps: reps.low,
            weight: weight.low,
          });
        }
        return acc;
      }, {});

      session.close();

      res.send({ folderId, templates: folderTemplates });
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
    MATCH (f:Template {username: "${username}", folder_id: "${folderId}"})-[rel:CONTAINS]->(ex:Exercise)
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

  const templateId = uuidv4();

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (f:TemplateFolder {username: "${username}", folder_id: "${folderId}"})
    ${exercises.map((exercise) => {
      return `
        MATCH (ex${exercise.exerciseId}:Exercise {name: "${exercise.name}"})
        WHERE elementId(ex${exercise.exerciseId}) = ${exercise.exerciseId}
      `;
    })}
    CREATE (t:Template {name: "${name}", username: "${username}", template_id: "${templateId}"})
    MERGE (t)-[:BELONGS_TO]->(f)
    ${exercises.map((exercise) => {
      return `
        MERGE (t)<-[:IS_IN {sets: ${exercise.sets}, reps: ${exercise.reps}, weight: ${exercise.weight}}]-(ex${exercise.exerciseId})
      `;
    })}
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
  deleteTemplateFolder,
  updateTemplateFolder,
  getFolderTemplates,
  getTemplateExercises,
  createTemplate,
};
