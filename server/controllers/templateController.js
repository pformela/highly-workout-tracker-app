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
    MATCH (f:TemplateFolder {username: "${username}", name: "${folderName}", folder_id: "${folderId}"})<-[:IS_IN_FOLDER]-(t:Template)-[rel:CONTAINS]-(ex:Exercise)
    RETURN t, rel, ex
    ORDER BY t.created_at DESC
    `
    )
    .then((result) => {
      const folderTemplates = result.records.reduce((acc, record) => {
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
  const { username, templateId } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (t:Template {username: "${username}", template_id: "${templateId}"})-[rel:CONTAINS]->(ex:Exercise)
    RETURN ex, rel
    ORDER BY t.created_at DESC
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
    ${exercises.reduce((prev, exercise) => {
      return (
        prev +
        `MATCH (ex${exercise.exerciseId}:Exercise {name: "${exercise.exerciseName}"})\n
        WHERE ID(ex${exercise.exerciseId}) = ${exercise.exerciseId}\n`
      );
    }, "")}
    CREATE (t:Template {name: "${name}", username: "${username}", template_id: "${templateId}", created_at: datetime()})
    MERGE (t)-[:IS_IN_FOLDER]->(f) 
    ${exercises.reduce((prev, exercise) => {
      return (
        prev +
        `MERGE (t)-[:CONTAINS {sets: ${exercise.sets}, reps: ${exercise.reps}, weight: ${exercise.weight}}]->(ex${exercise.exerciseId})\n`
      );
    }, "")}
    RETURN t 
    `
    )
    .then((result) => {
      const { name, username } = result.records[0]._fields[0].properties;
      console.log("Created template: " + name);
      session.close();

      res.send({ name, username });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Error creating template");
    });
});

const updateTemplate = asyncHandler(async (req, res) => {
  const { username, folderId, templateId, name, exercises } = req.body;

  console.log("username: " + username);
  console.log("folderId: " + folderId);
  console.log("templateId: " + templateId);
  console.log("name: " + name);

  let oldFolderId;
  let oldFolderName;
  let newFolderId;
  let newFolderName;

  const deleteSession = driver.session();
  const deleteResult = await deleteSession
    .run(
      `
    MATCH (t:Template {username: "${username}", template_id: "${templateId}"})-[rel:CONTAINS]->(ex:Exercise)
    MATCH (f:TemplateFolder {username: "${username}"})<-[is_in:IS_IN_FOLDER]-(t)
    DELETE rel, is_in
    RETURN f.name as oldFolderName, f.folder_id as oldFolderId
    `
    )
    .then((result) => {
      oldFolderName = result.records[0]._fields[0];
      oldFolderId = result.records[0]._fields[1];
      console.log("Deleted relationships for: " + name);
      deleteSession.close();

      const updateSession = driver.session();
      const updateResult = updateSession
        .run(
          `
          MATCH (t:Template {username: "${username}", template_id: "${templateId}"})
          MATCH (fCurr:TemplateFolder {username: "${username}", folder_id: "${folderId}"})
          ${exercises.reduce((prev, exercise) => {
            return (
              prev +
              `MATCH (ex${exercise.exerciseId}:Exercise {name: "${exercise.exerciseName}"})\n
              WHERE ID(ex${exercise.exerciseId}) = ${exercise.exerciseId}\n`
            );
          }, "")}
            ${exercises.reduce((prev, exercise) => {
              return (
                prev +
                `CREATE (t)-[:CONTAINS {sets: ${exercise.sets}, reps: ${exercise.reps}, weight: ${exercise.weight}}]->(ex${exercise.exerciseId})\n`
              );
            }, "")}
              CREATE (t)-[:IS_IN_FOLDER]->(fCurr)
              SET t.name = "${name}"
          RETURN fCurr.name as newFolderName, fCurr.folder_id as newFolderId
            `
        )
        .then((result) => {
          newFolderName = result.records[0]._fields[0];
          newFolderId = result.records[0]._fields[1];
          console.log("old folder id: " + oldFolderId);
          console.log("new folder id: " + newFolderId);
          updateSession.close();

          res.send({
            oldFolderId,
            oldFolderName,
            newFolderId,
            newFolderName,
            templateId,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(404).send("Error updating template");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Error updating template");
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
  updateTemplate,
};
