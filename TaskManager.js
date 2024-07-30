const express = require("express");
const app = express();
let conn = require("./db.js");

app.use(express.json());

app.get("/task-manager", (req, res) => {
  conn.query("SELECT * FROM TaskManager", (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.get("/task-manager/:id", (req, res) => {
  const id = req.params.id;
  conn.query("SELECT * FROM TaskManager WHERE id=?", [id], (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.post("/task-manager", (req, res) => {
  const { id, title, description } = req.body;
  conn.query(
    "INSERT INTO TaskManager (id, title, description) VALUES (?, ?, ?)",
    [id, title, description],
    (err) => {
      if (err) {
        console.log("Failed to create task", err);
        res.status(500).json("Failed to create task");
      } else {
        res.status(201).send("Task created successfully");
      }
    }
  );
});

app.put("/task-manager/:id", (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  conn.query(
    "UPDATE TaskManager SET title=?, description=? WHERE id=?",
    [title, description, id],
    (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json("Task updated successfully");
      }
    }
  );
});

app.patch("/task-manager/:id", (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  if (!title && !description) {
    return res
      .status(400)
      .json({ error: "At least one of title or description is required" });
  }

  const fields = [];
  const values = [];

  if (title) {
    fields.push("title = ?");
    values.push(title);
  }

  if (description) {
    fields.push("description = ?");
    values.push(description);
  }

  values.push(id);

  const query = `UPDATE TaskManager SET ${fields.join(", ")} WHERE id=?`;

  conn.query(query, values, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json("Task updated successfully");
  });
});

app.delete("/task-manager/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM TaskManager WHERE id=?";
  conn.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting task:", err);
      res.status(500).json("Failed to delete task");
    } else {
      res.status(200).json("Task deleted successfully");
    }
  });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
