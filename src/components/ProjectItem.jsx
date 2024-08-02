export default function ProjectItem({ name, id, selectedProjectId, onClick }) {
  let cssClasses = "project-btn";
  if (id === selectedProjectId) {
    cssClasses += "-selected";
  }
  return (
    <>
      <li>
        <button className={cssClasses} onClick={onClick}>
          {name}
        </button>
      </li>
    </>
  );
}
