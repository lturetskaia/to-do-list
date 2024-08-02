import TaskItem from "./TaskItem";

export default function AllTasks({ project }) {
  return (
    <div className="project-area">
      <h2>All Tasks</h2>

      <ul className="task-list">
        {project.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
