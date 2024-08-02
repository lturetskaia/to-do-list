import { useContext, useState } from "react";
import Button from "./UI/Button";
import ProjectsContext from "./store/ProjectContext";
import { deleteTask, editProject } from "../http";

export default function TaskItem({ task }) {
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
      console.log("Updating task status" + data);
      const response = await editProject(projectCtx.selectedProject, data);
      console.log(response);
      if (response.ok) {
        setTaskStatus(status);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleDeleteTask(taskId) {
    console.log(
      "Deleting the task. ID:" +
        projectCtx.selectedProject +
        "   " +
        "TaskID: " +
        task.id
    );

    try {
      const response = await deleteTask(projectCtx.selectedProject, task.id);
      if (response.ok) {
        projectCtx.deleteTask(projectCtx.selectedProject, task.id);
      }
    } catch (error) {
      console.log(error.message);
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
