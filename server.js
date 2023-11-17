const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;
const app = express();
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://speckle:hellospeckle2307@speckle.tltw5ja.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connectionString)
  .then((client) => {
    console.log("Connected to database");
    const db = client.db("speckle");
    const collectionTeachers = db.collection("speckle-teachers");
    /// CRUD REQUESTS GO HERE
  })
  .catch((error) => console.log(error));

app.locals = {
  title: "Speckle-api",
  speckleTeachers: [],
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

////// GET REQUESTS /////////

app.get("/api/speckle-teachers", (req, res) => {
  res.status(200).json(app.locals.speckleTeachers);
});

app.get("/api/speckle-teachers/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  const user = app.locals.speckleTeachers.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json({ user });
});

//// PATCH REQUESTS /////
app.patch("/api/speckle-teachers/:classCode", (req, res) => {
  const classCode = parseInt(req.params.classCode);
  const updatedUserData = req.body;

  const userToUpdate = app.locals.speckleTeachers.find(
    (user) => user.classCode === classCode
  );

  if (!userToUpdate) {
    console.log("User not found for ID:", userId);
    return res.status(404).json({ error: "User not found" });
  }

  for (const property in updatedUserData) {
    if (userToUpdate.hasOwnProperty(property)) {
      userToUpdate[property] = updatedUserData[property];
    }
  }

  console.log("User updated successfully");
  return res
    .status(200)
    .json({ message: "User updated successfully", user: userToUpdate });
});

///////POST REQUEST///////

app.post("/api/speckle-teachers", (req, res) => {
  const newTeacher = req.body;

  app.locals.speckleTeachers.push({ ...newTeacher });

  return res
    .status(201)
    .json({ message: "User created successfully", user: newTeacher });
});

app.post("/api/speckle-classes", (req, res) => {
  const newClass = req.body;

  app.locals.speckleTeachers.push({ ...newClass });

  return res
    .status(201)
    .json({ message: "class created successfully", user: newClass });
});

// LISTENER
app.listen(port, () => {
  console.log(
    `${app.locals.title} is now running on http://localhost:${port} !`
  );
});
