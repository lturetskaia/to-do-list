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

  const [loadingError, setLoadingError] = useState();
  const [isFetching, setIsFetching] = useState();
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const [actionError, setActionError] = useState();

  useEffect(() => {
    async function fetchProjects() {
      setIsFetching(true);
      try {
        const allProjects = await fetchAllProjects();
        projectsCtx.loadAllProjects(allProjects);
      } catch (error) {
        console.log(error);
        setLoadingError({
          message:
            error.message + " Please try again later" ||
            "Could not fetch projects, please try again later.",
        });
      } finally {
        setIsFetching(false);
      }
    }

    fetchProjects();
  }, []);

  async function handleDeleteProject() {
    setIsPendingDelete(true);
    try {
      const response = await deleteProject(selectedProjectId);

      projectsCtx.deleteProject(selectedProjectId);
      projectsCtx.selectProject("");
    } catch (error) {
      handleActionError(error);
    } finally {
      setIsPendingDelete(false);
    }
  }

  function handleActionError(error) {
    console.log(error);
    setActionError({
      message:
        error.message + " Please try again later" ||
        "Unable to complete the action, please try again later.",
    });

    setTimeout(() => {
      setActionError(null);
    }, 5 * 1000);
  }

  function handleEditProjectModal() {
    modalCtx.showEditProjectModal();
  }

  //error on project actions

  let errorClasses = "error-msg";
  let errorMessage = "";
  if (actionError) {
    errorClasses += " visible";
    errorMessage = actionError.message;
  }

  //delete btn text
  let deleteBtnText = "Delete";
  if (isPendingDelete) {
    deleteBtnText = "Deleting...";
  }

  // Page content
  let content;

  if (isFetching) {
    content = <p>Loading your projects ...</p>;
  } else if (loadingError) {
    content = (
      <Error title="An error ocurred!" message={loadingError.message} />
    );
  } else if (!selectedProjectId && !loadingError) {
    content = <NoProjectSelected />;
  } else if (selectedProjectId && !loadingError) {
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
              <Button onClick={handleDeleteProject} disabled={isPendingDelete}>
                {deleteBtnText}
              </Button>
            </div>{" "}
          </div>
          <p className={errorClasses}> {errorMessage}</p>

          <p>{selectedProject[0].description}</p>
        </header>

        <TaskInput handleActionError={handleActionError} />

        <section>
          <ul className="task-list">
            {selectedProject[0].tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                handleActionError={handleActionError}
              />
            ))}
          </ul>
        </section>
        <EditProjectModal project={selectedProject[0]} />
      </>
    );
  }

  return <div className="project-area">{content}</div>;
}
