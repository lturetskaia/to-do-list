export async function fetchAllProjects() {
  try {
    const response = await fetch("http://localhost:3000/projects");

    if (!response.ok) {
      // backend error
      const resError = await response.json();
      throw new Error(resError.message || "Failed to fetch projects.");
    }
    const allProjects = await response.json();
    console.log(allProjects);
    return allProjects;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function addNewProject(newProject) {
  try {
    const response = await fetch("http://localhost:3000/projects", {
      method: "PUT",
      body: JSON.stringify({ newProject }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // backend error
      const resError = await response.json();
      throw new Error(resError.message || "Failed to add a new project.");
    }
    const resData = await response.json();
    console.log(resData);
    return resData;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function editProject(id, projectData) {
  try {
    const response = await fetch(`http://localhost:3000/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({ projectData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
       // backend error
      const resError = await response.json();
      throw new Error(resError.message || "Failed to edit the project.");
    }
    const resData = await response.json();
    console.log(resData);

    return resData;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteTask(id, taskId) {
  try {
    const response = await fetch(
      `http://localhost:3000/projects/${id}/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
       // backend error
      const resError = await response.json();
      throw new Error(resError.message || "Failed to delete the task.");
    }
    const resData = await response.json();
    console.log(resData);

    return resData;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteProject(id) {
  try {
    const response = await fetch(`http://localhost:3000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
       // backend error
      const resError = await response.json();
      throw new Error(resError.message || "Failed to delete the project.");
    }
    const resData = await response.json();
    console.log(resData);

    return resData;
  } catch (error) {
    throw new Error(error.message);
  }
}
