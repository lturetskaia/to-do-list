import { useState } from "react";
import { createContext } from "react";

const ModalContext = createContext({
  state: "", //newProject, newTask
  showProjectModal: () => {},
  hideProjectModal: () => {},
  showTaskModal: () => {},
  hideTaskModal: () => {},
  showEditProjectModal: () => {},
  hideEditProjectModal: () => {},
});

export function ModalContextProvider({ children }) {
  const [modalState, setModalState] = useState("");

  function showProjectModal() {
    setModalState("newProject");
  }
  function hideProjectModal() {
    setModalState("");
  }
  function showTaskModal() {
    setModalState("newTask");
  }
  function hideTaskModal() {
    setModalState("");
  }

  function showEditProjectModal() {
    setModalState("editProject");
  }
  function hideEditProjectModal() {
    setModalState("");
  }

  const ModalContextCtx = {
    state: modalState,
    showProjectModal,
    hideProjectModal,
    showTaskModal,
    hideTaskModal,
    showEditProjectModal,
    hideEditProjectModal
  };
  return (
    <ModalContext.Provider value={ModalContextCtx}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
