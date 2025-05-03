import { useContext } from "react";
import ProjectItem from "./ProjectItem";
import Button from "./UI/Button";
import ModalContext from "./store/ModalContext";
import ProjectsContext from "./store/ProjectContext";
import NewProject from "./NewProject";

export default function ProjectsSidebar() {
  const modalCtx = useContext(ModalContext);
  const { projects, selectedProject, selectProject } =
    useContext(ProjectsContext);

  function handleNewProjectModal() {
    modalCtx.showProjectModal();
  }

  function handleSelectProject(id) {
    selectProject(id);
  }

  return (
    <aside>
      <h2>MY PROJECTS</h2>
      <Button className="filled-btn new-project" onClick={handleNewProjectModal}>
        {" "}
        + New Project
      </Button>
      <ul>
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            id={project.id}
            name={project.name}
            selectedProjectId={selectedProject}
            onClick={() => handleSelectProject(project.id)}
          />
        ))}
      </ul>
      <NewProject />{" "}
    </aside>
  );
}
