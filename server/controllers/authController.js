const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const neo4j = require("neo4j-driver");
const { v4: uuidv4 } = require("uuid");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Missing data");
  }

  const loginSession = driver.session();
  const loginResult = await loginSession
    .run(
      `
      MATCH (u:User {email: "${email}"})
      RETURN u
      `
    )
    .then(async (result) => {
      loginSession.close();
      const user = result.records[0].get("u").properties;
      const match = await bcrypt.compare(password, user.hashed_password);
      if (!match) {
        res.status(401).send("Invalid credentials");
      } else {
        const token = jwt.sign(
          {
            UserInfo: {
              username: user.username,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { username: user.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true, // only web server can access
          secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.json({
          token,
          username: user.username,
          email: user.email,
          userId: user.userId,
        });
        console.log(token);
      }
    })
    .catch((error) => {
      res.status(401).send("Invalid credentials");
    });
});

const register = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).send("Missing data");
  }

  const emailSession = driver.session();
  const emailResult = await emailSession
    .run(
      `
      MATCH (u:User {email: "${email}"})
      RETURN u
      `
    )
    .then((result) => {
      emailSession.close();
      if (result.records.length > 0) {
        res.status(400).send("Email already exists");
      }
    })
    .catch((error) => {
      res.status(404).send("Email check error");
    });

  const usernameSession = driver.session();
  const usernameResult = await usernameSession
    .run(
      `
      MATCH (u:User {username: "${username}"})
      RETURN u
      `
    )
    .then((result) => {
      usernameSession.close();
      if (result.records.length > 0) {
        res.status(400).send("Username already exists");
      }
    })
    .catch((error) => {
      res.status(404).send("Username check error");
    });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  const folderId = uuidv4();

  const registerSession = driver.session();
  const registerResult = await registerSession
    .run(
      `
      CREATE (u:User {email: "${email}", username: "${username}", hashed_password: "${hashedPassword}", userId: "${userId}"})
      CREATE (templateFolder:TemplateFolder {folder_id: "${folderId}", name: "My templates", username: "${username}", created_at: datetime()})
      CREATE (workouts:Workouts {name: "${username}"})
      MERGE (u)-[:COMPLETED]->(workouts)
      MERGE (u)<-[:BELONGS_TO]-(templateFolder)
      RETURN u
      `
    )
    .then((result) => {
      const user = result.records[0].get("u").properties;
      registerSession.close();

      const token = jwt.sign(
        {
          UserInfo: {
            username: user.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true, // only web server can access
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.json({
        token,
        username: user.username,
        email: user.email,
        userId: user.userId,
      });
      console.log(token + " " + username);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.status(401).send("Unauthorized");
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).send("Forbidden");
      }
      const userSession = driver.session();
      const userResult = await userSession
        .run(
          `
          MATCH (u:User {username: "${decoded.username}"})
          RETURN u
          `
        )
        .then((result) => {
          userSession.close();
          const user = result.records[0].get("u").properties;
          const token = jwt.sign(
            {
              UserInfo: {
                username: user.username,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
          );
          res.json({
            token,
            username: user.username,
            email: user.email,
            userId: user.userId,
          });
        })
        .catch((error) => {
          res.status(401).send("Unauthorized");
        });
    })
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  console.log("cookies: ", cookies);
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  register,
  refresh,
  logout,
};
