const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;
const app = express();
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://speckle:hellospeckle2307@speckle.tltw5ja.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(connectionString)
  .then((client) => {
    console.log("Connected to database");
    const db = client.db("speckle");
    const collectionTeachers = db.collection("speckle-teachers");

    app.get("/", (req, res) => {
      res.status(200).json("HI! Speckle Api!");
    });

    app.get("/api/speckle-teachers", async (req, res) => {
      try {
        const teachers = await collectionTeachers.find({}).toArray();
        res.status(200).json(teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/api/speckle-teachers/:classCode", async (req, res) => {
      const classCode = parseInt(req.params.classCode);

      try {
        const user = await collectionTeachers.findOne({ classCode });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.patch("/api/speckle-teachers/:classCode", async (req, res) => {
      const classCode = parseInt(req.params.classCode);
      const updatedUserData = req.body;

      try {
        const result = await collectionTeachers.updateOne(
          { classCode },
          { $set: updatedUserData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        console.log("User updated successfully");
        return res.status(200).json({
          message: "User updated successfully",
          user: { classCode, ...updatedUserData },
        });
      } catch (error) {
        console.error("Error updating teacher:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/api/speckle-teachers", async (req, res) => {
      const newTeacher = req.body;

      try {
        const result = await collectionTeachers.insertOne(newTeacher);
        console.log(result);

        if (result.acknowledged === true) {
          console.log("User created successfully");
          return res.status(201).json({
            message: "User created successfully",
            user: newTeacher,
          });
        } else {
          console.error("Error creating user");
          return res
            .status(500)
            .json({ error: "Internal server error - Insertion failed" });
        }
      } catch (error) {
        console.error("Error creating user:", error);
        return res
          .status(500)
          .json({ error: "Internal server error", details: error.message });
      }
    });
  })
  .catch((error) => console.log(error));

// LISTENER
app.listen(port, () => {
  console.log(`Speckle-Api is now running on http://localhost:${port}!`);
});

module.exports = app;
