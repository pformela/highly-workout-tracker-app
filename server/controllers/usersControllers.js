const bcrypt = require("bcrypt");

// Get all users
const getUser = async (req, res) => {
  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (u:User)
    RETURN u
    `
    )
    .then((result) => {
      const { [hashed_password]: ommited, user } =
        result.records[0]._fields[0].properties;
      session.close();

      if (user) res.send(user);
      else res.status(404).send("User not found");
    })
    .catch((error) => {
      console.log(error);
    });
};

// Create new user
const createNewUser = async (req, res) => {
  const { username, password, email } = req.body;

  // Confirm data
  if (!username || !password || !email) {
    res.status(400).send("Missing data");
  }

  // Check if username is taken
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
      if (result.records[0]) {
        res.status(409).send("Username is taken");
      }
    })
    .catch((error) => {
      console.log(error);
    });

  // Check if email is taken
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
      if (result.records[0]) {
        res.status(409).send("Email is taken");
      }
    })
    .catch((error) => {
      console.log(error);
    });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user_id = uuidv4();

  const userObject = {
    user_id,
    username,
    email,
    hashed_password: hashedPassword,
  };

  // Create user
  const createUserSession = driver.session();
  const createUserResult = await createUserSession
    .run(
      `
    CREATE (u:User)
    SET u.username = "${userObject.username}"
    SET u.email = "${userObject.email}"
    SET u.hashed_password = "${userObject.hashed_password}"
    SET u.user_id = "${userObject.user_id}"
    RETURN u
    `
    )
    .then((result) => {
      createUserSession.close();
      res.status(201).send("User created");
    })
    .catch((error) => {
      res.status(401).send("Invalid user data received");
    });
};

// Update a user
const updateUser = async (req, res) => {
  const { user_id, username, password, email } = req.body;

  // Confirm data
  if (!user_id || !username || !password || !email) {
    res.status(400).send("Missing data");
  }

  // Check if user is in database
  const userSession = driver.session();
  const userResult = await userSession
    .run(
      `
    MATCH (u:User {user_id: "${user_id}"})
    RETURN u
    `
    )
    .then((result) => {
      userSession.close();
      if (!result.records[0]) {
        res.status(404).send("User not found");
      }
    })
    .catch((error) => {
      console.log(error);
    });

  // finish updating user
};

// Delete a user
const deleteUser = async (req, res) => {};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
