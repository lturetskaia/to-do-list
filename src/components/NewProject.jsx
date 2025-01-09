import { useState, useContext } from "react";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import Button from "./UI/Button";
import ModalContext from "./store/ModalContext";
import { addNewProject } from "../http";
import ProjectsContext from "./store/ProjectContext";
import { inputIsNotValid } from "./util/validation";

export default function NewProject() {
  const modalCtx = useContext(ModalContext);
  const projectCtx = useContext(ProjectsContext);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [inputError, setInputError] = useState({ status: true, message: "" });

  const [isPending, setIsPending] = useState();
  const [loadingError, setLoadingError] = useState();

  function handleChangeInput(event) {
    setProjectName(event.target.value);

    if (inputIsNotValid(event.target.value, 3, 20)) {
      setInputError(() => {
        return {
          status: true,
          message: "Project name should contain 3-20 characters.",
        };
      });
    } else {
      setInputError(() => {
        return { status: false, message: "" };
      });
    }
  }

  function handleChangeDescription(event) {
    setProjectDescription(event.target.value);
  }

  async function handleCreateProject(event) {
    setIsPending(true);

    event.preventDefault();
    const fd = new FormData(event.target);
    const formData = Object.fromEntries(fd.entries());

    const projectData = {
      name: formData.projectName,
      description: formData.projectDescription,
      tasks: [],
    };
    console.log(projectData);
    try {
      console.log("Sending project data...");
      const response = await addNewProject(projectData);
      console.log(response);

      const project = { id: response.id, ...projectData };
      projectCtx.addNewProject(project);
      projectCtx.selectProject(response.id);
      modalCtx.hideProjectModal();
    } catch (error) {
      console.log(error.message);
      setLoadingError(() => {
        return { status: true, message: "Failed to add a new project" };
      });
    } finally {
      setIsPending(false);
    }

    // add error management
  }

  function handleCloseModal() {
    setProjectName("");
    setProjectDescription("");
    setInputError(() => {
      return { status: true, message: "" };
    });
    setLoadingError("");
    console.log(modalCtx);

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
      open={modalCtx.state === "newProject"}
      onClose={handleCloseModal}
    >
      <form onSubmit={handleCreateProject}>
        <div className="control-input">
          <Input
            label="Project name"
            name="projectName"
            type="text"
            errorMsg={inputError.message}
            value={projectName}
            onChange={handleChangeInput}
          />
        </div>

        <div className="control-input">
          <Input
            label="Description"
            name="projectDescription"
            type="textarea"
            value={projectDescription}
            onChange={handleChangeDescription}
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
              disabled={inputError.status || isPending}
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
