import { useState, useContext } from "react";
import Modal from "./UI/Modal";
import Input from "./UI/Input";
import Button from "./UI/Button";
import ModalContext from "./store/ModalContext";
import { addNewProject } from "../http";
import ProjectsContext from "./store/ProjectContext";
import { inputIsValid } from "./util/validation";

export default function NewProject() {
  const modalCtx = useContext(ModalContext);
  const projectCtx = useContext(ProjectsContext);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [error, setError] = useState({ status: true, message: "" });
  const [isPending, setIsPending] = useState();

  function handleChangeInput(event) {
    setProjectName(event.target.value);

    if (inputIsValid(event.target.value, 3, 20)) {
      setError(() => {
        return {
          status: true,
          message: "Project name should contain 3-20 characters.",
        };
      });
    } else {
      setError(() => {
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

      if (response.ok) {
        console.log(response.id);
        const project = { id: response.id, ...projectData };
        projectCtx.addNewProject(project);
        projectCtx.selectProject(response.id);
        modalCtx.hideProjectModal();
        setIsPending(false);
      }
    } catch (error) {
      console.log(error.message);
    }

    // add error management
  }

  function handleCloseModal() {
    setProjectName("");
    setProjectDescription("");
    setError(() => {
      return { status: true, message: "" };
    });

    modalCtx.hideProjectModal();
  }

  let content = (
    <p className="form-control-btn">
      <Button onClick={handleCloseModal} type="button">
        Cancel
      </Button>
      <Button className="filled-btn" type="submit" disabled={error.status}>
        Save
      </Button>
    </p>
  );
  if (isPending) {
    content = <p className="form-control-btn">Saving the project ...</p>;
  }

  return (
    <Modal
      className="modal"
      open={modalCtx.state === "newProject"}
      onClose={modalCtx.state === "newProject" ? null : handleCloseModal}
    >
      <form onSubmit={handleCreateProject}>
        <div className="control-input">
          <Input
            label="Project name"
            name="projectName"
            type="text"
            errorMsg={error.message}
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

        {content}
      </form>
    </Modal>
  );
}
