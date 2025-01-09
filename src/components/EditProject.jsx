import { useContext, useState, useEffect } from "react";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import Button from "./UI/Button";
import ModalContext from "./store/ModalContext";
import { editProject } from "../http";
import ProjectsContext from "./store/ProjectContext";

export default function EditProject() {
  const modalCtx = useContext(ModalContext);
  const projectCtx = useContext(ProjectsContext);
  const selectedProjectId = projectCtx.selectedProject;

  const selectedProjectData = projectCtx.projects.filter(
    (projectItem) => projectItem.id === selectedProjectId
  );
  const selectedProject = selectedProjectData[0];

  const [editedProject, setEditedProject] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState({ status: false, message: "" });

  useEffect(() => {
    setEditedProject({
      name: selectedProject.name,
      description: selectedProject.description,
    });
  }, [selectedProject.name, selectedProject.description]);

  function handleChangeName(event) {
    setEditedProject(() => {
      const editedProjectName = event.target.value;
      return {
        ...editedProject,
        name: editedProjectName,
      };
    });
    //input validation
    if (event.target.value.length < 3 || event.target.value.length > 20) {
      setError(() => {
        return {
          status: true,
          message: "Project name should contain 3-16 characters.",
        };
      });
    } else {
      setError(() => {
        return { status: false, message: "" };
      });
    }
  }
  function handleChangeDescription(event) {
    setEditedProject(() => {
      const editedProjectDescription = event.target.value;
      return {
        ...editedProject,
        description: editedProjectDescription,
      };
    });
  }

  async function handleEditProject(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const formData = Object.fromEntries(fd.entries());
    console.log(formData.projectDescription);
    const projectData = {
      name: formData.projectName,
      description: formData.projectDescription || "",
    };

    try {
      console.log("Editing the project ... ");
      const response = await editProject(selectedProject.id, projectData);
      console.log(response);

      projectCtx.updateProject(selectedProject.id, projectData);
      modalCtx.hideProjectModal();
    } catch (error) {
      console.log(error.message);
    }
    // add error management
  }

  function handleCloseModal() {
    modalCtx.hideProjectModal();
    setError(() => {
      return { status: false, message: "" };
    });
    setEditedProject({
      name: selectedProject.name,
      description: selectedProject.description,
    });
  }

  return (
    <Modal
      className="modal"
      open={modalCtx.state === "editProject"}
      onClose={handleCloseModal}
    >
      <form onSubmit={handleEditProject}>
        <div className="control-input">
          <Input
            label="Project name"
            name="projectName"
            type="text"
            value={editedProject.name}
            onChange={handleChangeName}
            errorMsg={error.message}
          />
        </div>

        <div className="control-input">
          <Input
            label="Description"
            name="projectDescription"
            type="textarea"
            value={editedProject.description}
            onChange={handleChangeDescription}
          />
        </div>
        <p className="form-control-btn">
          <Button onClick={handleCloseModal} type="button">
            Cancel
          </Button>
          <Button className="filled-btn" type="submit" disabled={error.status}>
            Save
          </Button>
        </p>
      </form>
    </Modal>
  );
}
