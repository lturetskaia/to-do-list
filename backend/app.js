import fs from "node:fs/promises";
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
} from "./util/db-query,js";

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
    console.log(projects, tasks);
    const allProjectsData = [...projects];
    allProjectsData.map((project) => (project.tasks = []));

    tasks.forEach((task) => {
      const projectIndex = projects.findIndex(
        (project) => project.id === task.project_id
      );
      allProjectsData[projectIndex].tasks.push(task);
    });

    res.json(allProjectsData);
  } else {
    res.status(404).json({ message: "Unable to fetch projects" });
  }
});

// Update project data
app.put("/projects/:id", async (req, res, next) => {
  const projectId = req.params.id;
  const projectData = req.body.projectData;

  // error- no project data sent
  if (!projectData) {
    return res.status(400).json({ message: "Missing Data!" });
  }

  // !! check if the project exists !!

  // Add a new task
  if (projectData.task) {
    console.log(projectData);

    const newTask = {
      ...projectData.task,
      project_id: projectId,
    };

    const result = await createTask(newTask);
    console.log(result);

    if (result.insertId > 0) {
      return res.status(201).json({
        message: `Tasks updated`,
        taskId: result.insertId,
      });
    } else {
      res.status(404).json({ message: "Unable to add a new task" });
    }
  } else if (projectData.status && projectData.taskId) {
    // change status - active or completed

    // !! check if the task exists !!

    const result = await updateTaskStatus(
      projectData.taskId,
      projectData.status
    );
    console.log(result);
    if (result.changedRows === 1) {
      const updatedTask = await getTask(projectData.taskId);
      return res.status(201).json({
        message: `Task ${projectData.taskId} updated`,
        projectId: projectId,
        tasks: updatedTask,
      });
    } else {
      res.status(404).json({ message: "Unable to change task status" });
    }
  } else if (projectData.description) {
    // Update project name and/or description
    const result = await updateProject(
      projectId,
      projectData.name,
      projectData.description
    );

    if (result.changedRows === 1) {
      return res.status(201).json({
        message: `Project ${projectId} edited`,
        id: projectId,
      });
    } else {
      res
        .status(404)
        .json({ message: "Unable to change project name or description." });
    }
    console.log(result);
  }
});

// Add a new project
app.put("/projects", async (req, res) => {
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
app.delete("/projects/:id", async (req, res, next) => {
  const projectId = req.params.id;
  const result = await deleteItem(projectId, "projects");
  console.log(result);

  if (result.affectedRows === 1) {
    return res
      .status(200)
      .json({ message: "Project deleted", id: projectId, ok: true });
  } else {
    res.status(404).json({ message: "Failed to delete the selected project." });
  }

  // if (!project) {
  //   return next();
  // }
});

// Delete a task
app.delete("/projects/:id/:taskId", async (req, res, next) => {
  const projectId = req.params.id;
  const taskId = req.params.taskId;

  const data = await fs.readFile("./data/projects.json", "utf-8");
  const updatedProjects = JSON.parse(data);
  const projectIndex = updatedProjects.findIndex(
    (project) => project.id === projectId
  );

  if (projectIndex === -1) {
    return next();
  }

  const taskIndex = updatedProjects[projectIndex].tasks.findIndex(
    (task) => task.id == taskId
  );

  if (taskIndex === -1) {
    return next();
  }

  updatedProjects[projectIndex].tasks.splice(taskIndex, 1);

  await fs.writeFile("./data/projects.json", JSON.stringify(updatedProjects));
  return res
    .status(200)
    .json({ message: "Task deleted", id: projectId, taskId: taskId, ok: true });
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "The resource cannot be found." });
});

app.listen(3000);
