import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";

import {
  createProject,
  createTask,
  getAllProjects,
  getAllTasks,
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
    
    const updatedTasks = allProjects[projectIndex].tasks.map((task) =>
      task.id === projectData.taskId
        ? { ...task, status: projectData.status }
        : task
    );
    allProjects[projectIndex].tasks = [...updatedTasks];

    try {
      await fs.writeFile("./data/projects.json", JSON.stringify(allProjects));
      return res.status(201).json({
        message: `Task ${projectData.taskId} updated`,
        projectId: projectId,
        tasks: updatedTasks,
      });
    } catch (error) {
      res.status(404).json({ message: "Unable to change task status" });
    }
  } else if (projectData.description) {
    // Update project name and/or description
    allProjects[projectIndex].name = projectData.name;
    allProjects[projectIndex].description = projectData.description;

    try {
      await fs.writeFile("./data/projects.json", JSON.stringify(allProjects));
      return res.status(201).json({
        message: `Project ${projectIndex} edited`,
        id: projectId,
      });
    } catch (error) {
      res
        .status(404)
        .json({ message: "Unable to change project name or description." });
    }
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
  const projectsData = await fs.readFile("./data/projects.json", "utf-8");
  const projects = JSON.parse(projectsData);
  const project = projects.find((project) => project.id === projectId);

  if (!project) {
    return next();
  }
  const updatedProjects = projects.filter(
    (project) => project.id !== projectId
  );
  await fs.writeFile("./data/projects.json", JSON.stringify(updatedProjects));

  return res
    .status(200)
    .json({ message: "Project deleted", id: projectId, ok: true });
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
