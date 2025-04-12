import { useContext, useState } from "react";
import Button from "./UI/Button";
import ProjectsContext from "./store/ProjectContext";
import { deleteTask, editProject } from "../http";

export default function TaskItem({ task, handleActionError }) {
  const projectCtx = useContext(ProjectsContext);
  const [taskStatus, setTaskStatus] = useState(task.status);

  async function handleTaskStatus(event) {
    let status;

    if (event.target.checked) {
      status = "completed";
    } else {
      status = "active";
    }
    const data = { taskId: task.id, status: status };

    try {
      const response = await editProject(projectCtx.selectedProject, data);
      setTaskStatus(status);
    } catch (error) {
      handleActionError(error);
    }
  }

  async function handleDeleteTask() {
    try {
      const response = await deleteTask(projectCtx.selectedProject, task.id);
      projectCtx.deleteTask(projectCtx.selectedProject, task.id);
    } catch (error) {
      handleActionError(error);
    }
  }

  let taskClasses = "task-list-item";
  let btnClasses = "filled-btn";
  if (taskStatus === "completed") {
    taskClasses = "task-list-item completed";
    btnClasses = "btn";
  }

  return (
    <>
      <li className={taskClasses}>
        <div className="task-line-control">
          <input
            type="checkbox"
            id={task.id}
            checked={taskStatus === "completed"}
            onChange={handleTaskStatus}
          />
          <label htmlFor={task.id}>{task.name}</label>
        </div>
        <div>
          <Button
            id="delete-task-btn"
            className={btnClasses}
            onClick={() => handleDeleteTask(task.id)}
          >
            {" "}
            X
          </Button>
        </div>
      </li>{" "}
    </>
  );
}
