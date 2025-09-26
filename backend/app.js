import bodyParser from "body-parser";
import express from "express";

import {
  createProject,
  createTask,
  getAllProjects,
  getAllTasks,
  getTask,
  updateTaskStatus,
  updateProject,
  deleteItem,
  deleteAllTasks,
} from "./util/db-query.js";

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Fetch all projects
app.get("/projects", async (req, res) => {
  const projects = await getAllProjects();
  const tasks = await getAllTasks();

  if (projects && tasks) {
    const allProjectsData = [...projects];
    allProjectsData.map((project) => (project.tasks = []));

    tasks.forEach((task) => {
      const projectIndex = projects.findIndex(
        (project) => project.id === task.project_id
      );

      if (projectIndex >= 0) {
        allProjectsData[projectIndex].tasks.push(task);
      }
    });

    res.status(200).json(allProjectsData);
  } else {
    res.status(404).json({ message: "Unable to fetch projects." });
  }
});

// Update project data
app.put("/projects/:id", async (req, res) => {
  const projectId = req.params.id;
  const projectData = req.body.projectData;

  if (!projectData || !projectId) {
    return res.status(400).json({ message: "Missing Data!" });
  }
  // Add a new task
  if (projectData.task) {
    const newTask = {
      ...projectData.task,
      project_id: projectId,
    };

    const result = await createTask(newTask);

    if (result.insertId > 0) {
      return res.status(201).json({
        message: `Added a new task`,
        taskId: result.insertId,
      });
    } else {
      res.status(404).json({ message: "Unable to add a new task." });
    }
  } else if (projectData.status && projectData.taskId) {
    // change status - active or completed
    const result = await updateTaskStatus(
      projectData.taskId,
      projectData.status
    );

    if (result.changedRows === 1) {
      const updatedTask = await getTask(projectData.taskId);

      return res.status(201).json({
        message: `Task ${projectData.taskId} updated`,
        projectId: projectId,
        tasks: updatedTask,
      });
    } else {
      res.status(404).json({ message: "Unable to change task status." });
    }
  } else if (projectData.description) {
    // Update project name and/or description
    const result = await updateProject(
      projectId,
      projectData.name,
      projectData.description
    );

    if (result.warningStatus === 0) {
      return res.status(201).json({
        message: `Project ${projectId} edited`,
        id: projectId,
      });
    } else {
      res
        .status(404)
        .json({ message: "Unable to change project name or description." });
    }
  }
});

// Add a new project
app.post("/projects", async (req, res) => {
  const projectData = req.body.newProject;
  if (!projectData || !projectData.name) {
    return res.status(400).json({ message: "Missing Data!" });
  }

  const result = await createProject(projectData);

  if (result.insertId > 0) {
    return res
      .status(201)
      .json({ message: "New project added!", id: result.insertId });
  } else {
    res.status(404).json({ message: "Unable to add a new project." });
  }
});

// Delete a project
app.delete("/projects/:id", async (req, res) => {
  const projectId = req.params.id;

  if (!projectId) {
    return res.status(400).json({ message: "Missing Data!" });
  }

  const resultProjects = await deleteItem(projectId, "projects");
  //delete all task associated with the projectId
  const resultTasks = await deleteAllTasks(projectId);

  if (resultProjects.affectedRows === 1) {
    return res
      .status(200)
      .json({ message: "Project deleted", id: projectId, ok: true });
  } else {
    res.status(404).json({ message: "Failed to delete the selected project." });
  }
});

// Delete a task
app.delete("/projects/:id/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  const result = await deleteItem(taskId, "tasks");

  if (result.affectedRows === 1) {
    return res
      .status(200)
      .json({ message: "Task deleted.", id: taskId, ok: true });
  } else {
    res.status(404).json({ message: "Failed to delete the selected task." });
  }
});

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "The resource cannot be found." });
});

app.listen(3000);
