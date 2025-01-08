import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/projects", async (req, res) => {
  // Fetch all projects
  try {
    const projects = await fs.readFile("./data/projects.json", "utf-8");
    res.json(JSON.parse(projects));
  } catch (error) {
    return res.status(404).json({ message: "Unable to fetch projects" });
  }
});

app.put("/projects/:id", async (req, res) => {
  // Update project data
  const projectId = req.params.id;
  const projectData = req.body.projectData;
  if (projectData === null) {
    return res.status(400).json({ message: "Missing Data!" });
  }
  const allProjectsData = await fs.readFile("./data/projects.json", "utf-8");
  const allProjects = JSON.parse(allProjectsData);
  const projectIndex = allProjects.findIndex(
    (project) => project.id === projectId
  );

  if (projectData.task) {
    // Add a new task
    const newTask = {
      id: uuidv4(),
      name: projectData.task.name,
      date: projectData.task.date,
      status: projectData.task.status,
    };
    const updatedTasks = [...allProjects[projectIndex].tasks, newTask];
    allProjects[projectIndex].tasks = [...updatedTasks];
    await fs.writeFile("./data/projects.json", JSON.stringify(allProjects));
    return res.status(201).json({
      message: `Tasks updated`,
      taskId: newTask.id,
      ok: true,
    });
  } else if (projectData.status && projectData.taskId) {
    const updatedTasks = allProjects[projectIndex].tasks.map((task) =>
      task.id === projectData.taskId
        ? { ...task, status: projectData.status }
        : task
    );
    allProjects[projectIndex].tasks = [...updatedTasks];
    await fs.writeFile("./data/projects.json", JSON.stringify(allProjects));
    return res.status(201).json({
      message: `Task ${projectData.taskId} updated`,
      projectId: projectId,
      tasks: updatedTasks,
      ok: true,
    });
  } else if (projectData.description) {
    // Update project name and description
    allProjects[projectIndex].name = projectData.name;
    allProjects[projectIndex].description = projectData.description;
    await fs.writeFile("./data/projects.json", JSON.stringify(allProjects));
    return res.status(201).json({
      message: `Project ${projectIndex} edited`,
      id: projectId,
      ok: true,
    });
  }
});

app.put("/projects", async (req, res) => {
  const projectData = req.body.newProject;
  if (projectData === null || !projectData.name) {
    return res.status(400).json({ message: "Missing Data!" });
  }
  const newProject = {
    id: uuidv4(),
    ...projectData,
  };
  const projects = await fs.readFile("./data/projects.json", "utf-8");
  const allProjects = JSON.parse(projects);
  allProjects.push(newProject);
  await fs.writeFile("./data/projects.json", JSON.stringify(allProjects));
  return res
    .status(201)
    .json({ message: "New project added!", id: newProject.id, ok: true });
});

app.delete("/projects/:id", async (req, res) => {
  const projectId = req.params.id;
  const projectsData = await fs.readFile("./data/projects.json", "utf-8");
  const projects = JSON.parse(projectsData);
  const updatedProjects = projects.filter(
    (project) => project.id !== projectId
  );
  await fs.writeFile("./data/projects.json", JSON.stringify(updatedProjects));

  return res
    .status(200)
    .json({ message: "Project deleted", id: projectId, ok: true });
});

app.delete("/projects/:id/:taskId", async (req, res) => {
  const projectId = req.params.id;
  const taskId = req.params.taskId;

  const data = await fs.readFile("./data/projects.json", "utf-8");
  const updatedProjects = JSON.parse(data);
  const projectIndex = updatedProjects.findIndex(
    (project) => project.id === projectId
  );

  const taskIndex = updatedProjects[projectIndex].tasks.findIndex(
    (task) => task.id == taskId
  );
  updatedProjects[projectIndex].tasks.splice(taskIndex, 1);

  await fs.writeFile("./data/projects.json", JSON.stringify(updatedProjects));
  return res
    .status(200)
    .json({ message: "Task deleted", id: projectId, taskId: taskId, ok: true });
});


// 404
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     return next();
//   }
//   res.status(404).json({ message: '404 - Not Found' });
// });

app.listen(3000);
