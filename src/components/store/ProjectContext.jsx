import { createContext, useEffect, useReducer } from "react";

const ProjectsContext = createContext({
  selectedProject: null,
  projects: [],
  loadAllProjects: () => {},
  selectProject: () => {},
  addNewProject: () => {},
  updateProject: () => {},
  addNewTask: () => {},
  deleteTask: () => {},
  deleteProject: () => {},
});

function projectsReducer(state, action) {
  if (action.type === "LOAD_ALL") {
    const fetchedProjects = [...action.projects];
    return { ...state, projects: fetchedProjects };
  }

  if (action.type === "SELECT_PROJECT") {
    const selectedProjectId = action.id;
    return { ...state, selectedProject: selectedProjectId };
  }

  if (action.type === "ADD_PROJECT") {
    const newProject = { ...action.project };
    const updatedProjects = [...state.projects];
    updatedProjects.push(newProject);
    return { ...state, projects: updatedProjects };
  }

  if (action.type === "UPDATE_PROJECT") {
    const projectData = { ...action.projectData };
    const id = action.id;
    const updatedProjects = [...state.projects];

    const projectIndex = updatedProjects.findIndex(
      (project) => project.id === id
    );

    if (projectData.name) {
      updatedProjects[projectIndex].name = projectData.name;
      updatedProjects[projectIndex].description = projectData.description;
    }

    return { ...state, updatedProjects };
  }

  if (action.type === "DELETE_PROJECT") {
    const projectId = action.id;
    const projects = [...state.projects];
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );
    return { ...state, projects: updatedProjects };
  }

  if (action.type === "ADD_TASK") {
    const projectData = { ...action.projectData };
    const id = action.id;
    const updatedProjects = [...state.projects];

    const projectIndex = updatedProjects.findIndex(
      (project) => project.id === id
    );

    if (projectData.task) {
      const existingTask = updatedProjects[projectIndex].tasks.filter(
        (task) => task.id === projectData.task.id
      );

      if (existingTask.length !== 0) {
      } else {
        const updatedTasks = [
          ...updatedProjects[projectIndex].tasks,
          projectData.task,
        ];

        updatedProjects[projectIndex].tasks = [...updatedTasks];
      }
    }

    return { ...state, projects: updatedProjects };
  }
  if (action.type === "DELETE_TASK") {
    const allProjects = [...state.projects];
    const projectId = action.id;
    const taskId = action.taskId;

    const projectIndex = allProjects.findIndex(
      (project) => project.id === projectId
    );

    const updatedTasks = allProjects[projectIndex].tasks.filter(
      (task) => task.id !== taskId
    );

    allProjects[projectIndex].tasks = [...updatedTasks];

    return { ...state, ...allProjects };
  }

  return state;
}

export function ProjectsContextProvider({ children }) {
  const [projectData, dispatchProjectDataAction] = useReducer(projectsReducer, {
    selectedProject: "",
    projects: [],
  });


  function loadAllProjects(allProjects) {
    dispatchProjectDataAction({
      type: "LOAD_ALL",
      projects: allProjects,
    });
  }

  function selectProject(id) {
    dispatchProjectDataAction({ type: "SELECT_PROJECT", id: id });
  }

  function addNewProject(project) {
    dispatchProjectDataAction({ type: "ADD_PROJECT", project: project });
  }
  function updateProject(id, projectData) {
    dispatchProjectDataAction({
      type: "UPDATE_PROJECT",
      id: id,
      projectData: projectData,
    });
  }

  function addNewTask(id, projectData) {
    dispatchProjectDataAction({
      type: "ADD_TASK",
      id: id,
      projectData: projectData,
    });
  }

  function deleteTask(id, taskId) {
    dispatchProjectDataAction({
      type: "DELETE_TASK",
      id: id,
      taskId: taskId,
    });
  }

  function deleteProject(id) {
    dispatchProjectDataAction({ type: "DELETE_PROJECT", id: id });
  }

  const ProjectsContextCtx = {
    selectedProject: projectData.selectedProject,
    projects: projectData.projects,
    loadAllProjects,
    selectProject,
    addNewProject,
    updateProject,
    addNewTask,
    deleteTask,
    deleteProject,
  };
  return (
    <ProjectsContext.Provider value={ProjectsContextCtx}>
      {children}
    </ProjectsContext.Provider>
  );
}

export default ProjectsContext;
