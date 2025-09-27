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
  const [inputError, setInputError] = useState({ status: false, message: "" });

  const [loadingError, setLoadingError] = useState();
  const [isPending, setIsPending] = useState(false);
  const [textInputError, setTextInputError] = useState({
    status: false,
    message: "",
  });

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
    //project name validation
    if (event.target.value.length < 3 || event.target.value.length > 20) {
      setInputError(() => {
        return {
          status: true,
          message: "Project name should contain 3-16 characters.",
        };
      });
    } else {
      setInputError(() => {
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
    //description validation
    if (event.target.value.length > 255) {
      setTextInputError(() => {
        return {
          status: true,
          message: "Project description may contain up to 255 characters.",
        };
      });
    } else {
      setTextInputError(() => {
        return { status: false, message: "" };
      });
    }
  }

  async function handleEditProject(event) {
    event.preventDefault();
    setIsPending(true);

    const fd = new FormData(event.target);
    const formData = Object.fromEntries(fd.entries());
    const projectData = {
      name: formData.projectName,
      description: formData.projectDescription || "",
    };

    try {
      const response = await editProject(selectedProject.id, projectData);
      projectCtx.updateProject(selectedProject.id, projectData);
      modalCtx.hideProjectModal();
    } catch (error) {
      setLoadingError(() => {
        return { status: true, message: error.message };
      });
    } finally {
      setIsPending(false);
    }
  }

  function handleCloseModal() {
    setInputError(() => {
      return { status: false, message: "" };
    });
    setEditedProject({
      name: selectedProject.name,
      description: selectedProject.description,
    });
    setLoadingError();
    setIsPending(false);

    modalCtx.hideProjectModal();
  }

  let saveBtnText = "Save";
  if (isPending) {
    saveBtnText = "Saving ...";
  }
  let errorMessage;
  if (loadingError) {
    errorMessage = (
      <p className="error-msg visible">Failed to save the project</p>
    );
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
            errorMsg={inputError.message}
            maxLength="20"
          />
        </div>

        <div className="control-input">
          <Input
            label="Description"
            name="projectDescription"
            type="textarea"
            value={editedProject.description}
            onChange={handleChangeDescription}
            errorMsg={textInputError.message}
            maxLength="255"
          />
        </div>
        <div className="control-input">
          <p className="form-control-btn">
            <Button onClick={handleCloseModal} type="button">
              Cancel
            </Button>
            <Button
              className="filled-btn"
              type="submit"
              disabled={inputError.status || textInputError.status || isPending}
            >
              {saveBtnText}
            </Button>
          </p>
          {errorMessage}
        </div>
      </form>
    </Modal>
  );
}
