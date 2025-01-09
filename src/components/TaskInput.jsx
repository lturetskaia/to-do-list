import { useEffect, useState, useContext } from "react";
import ProjectsContext from "./store/ProjectContext";
import { editProject } from "../http";
import { inputIsNotValid } from "./util/validation";

import Button from "./UI/Button";
import Input from "./UI/Input";

export default function TaskInput({ handleActionError }) {
  const projectCtx = useContext(ProjectsContext);
  const selectedProjectId = projectCtx.selectedProject;

  const [userTask, setUserTask] = useState("");
  const [error, setError] = useState({ status: true, message: "" }); // input error
  const [isPending, setIsPending] = useState();

  useEffect(() => {
    setUserTask("");
  }, [selectedProjectId]);

  function handleChangeTask(event) {
    setUserTask(event.target.value);

    if (inputIsNotValid(event.target.value, 3, 70)) {
      setError(() => {
        return {
          status: true,
          message: "Tasks should contain 3-70 characters.",
        };
      });
    } else {
      setError(() => {
        return { status: false, message: "" };
      });
    }
  }

  async function handleSubmitTask(event) {
    setIsPending(true);

    event.preventDefault();
    const fd = new FormData(event.target);
    const formData = Object.fromEntries(fd.entries());
    //validation to be added

    const newTask = {
      task: { id: null, name: formData.task, date: null, status: "active" },
    };

    try {
      console.log("Trying to add a new task");
      const response = await editProject(selectedProjectId, newTask);

      newTask.task.id = response.taskId;
      projectCtx.addNewTask(selectedProjectId, newTask);

      setUserTask("");
    } catch (error) {
      handleActionError(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmitTask} className="control-task-area">
      <Button className={"filled-btn"} type="submit" disabled={isPending}>
        +
      </Button>
      <div className="control-task-input">
        <Input
          name="task"
          value={userTask}
          onChange={handleChangeTask}
          errorMsg={error.message}
        />
      </div>
    </form>
  );
}
