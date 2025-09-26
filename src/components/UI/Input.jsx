export default function Input({
  label,
  name,
  type,
  value,
  errorMsg,
  ...props
}) {
  let errorClasses = "error-msg";
  if (errorMsg !== "") {
    errorClasses += " visible";
  }
  let content = (
    <>
      <label htmlFor={name}>{label}</label>
      <input type={type} id={name} name={name} value={value} {...props} />
      <p className={errorClasses}> {errorMsg}</p>
    </>
  );
  if (type === "textarea") {
    content = (
      <>
        <label htmlFor={name}>{label}</label>
        <textarea id={name} name={name} value={value} {...props} />
        <p className={errorClasses}> {errorMsg}</p>
      </>
    );
  }
  return content;
}
