import ProjectsSidebar from "./components/ProjectsSidebar";
import SelectedProject from "./components/SelectedProject";
import { ModalContextProvider } from "./components/store/ModalContext";
import { ProjectsContextProvider } from "./components/store/ProjectContext";

function App() {
  
  return (
    <ProjectsContextProvider>
      <ModalContextProvider>
        {" "}
        <main>
          <ProjectsSidebar />
          <SelectedProject />
        </main>
      </ModalContextProvider>
    </ProjectsContextProvider>
  );
}

export default App;
