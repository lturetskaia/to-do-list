export async function fetchAllProjects() {
  const response = await fetch("http://localhost:3000/projects");
  if (!response.ok) {
    const error = new Error();
    error.code = response.status;
    const resData = await response.json();
    error.message = resData.message;
    throw error;
  }
  const allProjects = await response.json();
  return allProjects;
}

export async function addNewProject(newProject) {
  const response = await fetch("http://localhost:3000/projects", {
    method: "PUT",
    body: JSON.stringify({ newProject }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();
  console.log(resData);

  if (!response.ok) {
    throw new Error("Failed to update the project.");
  }

  return resData;
}

export async function editProject(id, projectData) {
  const response = await fetch(`http://localhost:3000/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({ projectData }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();
  console.log(resData);

  if (!response.ok) {
    throw new Error("Failed to update the project.");
  }

  return resData;
}

export async function deleteTask(id, taskId) {
  const response = await fetch(
    `http://localhost:3000/projects/${id}/${taskId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resData = await response.json();
  console.log(resData);
  if (!response.ok) {
    throw new Error("Failed to delete the task.");
  }

  return resData;
}

// export async function changeTaskStatus(id, taskId, status) {
//   const response = await fetch(
//     `http://localhost:3000/projects/${id}/${taskId}`,
//     {
//       method: "PUT",
//       body: JSON.stringify({status}),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const resData = await response.json();
//   console.log(resData);
//   if (!response.ok) {
//     throw new Error("Failed to change task status.");
//   }

//   return resData;

// }

export async function deleteProject(id) {
  const response = await fetch(`http://localhost:3000/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();
  console.log(resData);

  if (!response.ok) {
    throw new Error("Failed to update the project.");
  }

  return resData;
}
