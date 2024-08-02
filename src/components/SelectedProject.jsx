import { useContext, useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import Error from "./Error";
import Button from "./UI/Button";
import TaskInput from "./TaskInput";
import ProjectsContext from "./store/ProjectContext";
import ModalContext from "./store/ModalContext";
import NoProjectSelected from "./NoProjectSelected";
import EditProjectModal from "./EditProject";
import { deleteProject, fetchAllProjects } from "../http";

export default function SelectedProject() {
  const projectsCtx = useContext(ProjectsContext);
  const selectedProjectId = projectsCtx.selectedProject;
  const modalCtx = useContext(ModalContext);

  const [error, setError] = useState();
  const [isFetching, setIsFetching] = useState();

  useEffect(() => {
    async function fetchProjects() {
      setIsFetching(true);
      try {
        const allProjects = await fetchAllProjects();
        projectsCtx.loadAllProjects(allProjects);
        setIsFetching(false);

      } catch (error) {
        setError({
          message:
            error.message + ", please try again later" || "Could not fetch projects, please try again later."
        });
        setIsFetching(false);
      }
    }

    fetchProjects();
  }, []);
  async function handleDeleteProject() {
    try {
      const response = await deleteProject(selectedProjectId);
      console.log(response);

      if (response.ok) {
        projectsCtx.deleteProject(response.id);
        projectsCtx.selectProject("");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleEditProjectModal() {
    modalCtx.showEditProjectModal();
  }

  let content;

  if (!selectedProjectId && error) {
    
    content = <Error title='An error ocurred!' message={error.message}/>;
  }


  if (!selectedProjectId && !error) {
    content = <NoProjectSelected />;
  }
  if (isFetching) {
    content = <p>Loading your projects ...</p>
  }

  if (selectedProjectId) {
    const selectedProject = projectsCtx.projects.filter(
      (project) => project.id === selectedProjectId
    );
    content = (
      <>
        <header>
          <div className="control-project-header">
            <h2>{selectedProject[0].name}</h2>
            <div className="control-buttons">
              <Button className="filled-btn" onClick={handleEditProjectModal}>
                Edit
              </Button>
              <Button onClick={handleDeleteProject}>Delete</Button>
            </div>{" "}
          </div>

          <p>{selectedProject[0].description}</p>
        </header>

        <TaskInput />

        <section>
          <ul className="task-list">
            {selectedProject[0].tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </section>
        <EditProjectModal project={selectedProject[0]} />
      </>
    );
  }

  return <div className="project-area">{content}</div>;
}
