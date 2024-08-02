import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

const Modal = ({ children, className, open, onClose }) => {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    }
    return () => modal.close();
  }, [open]);

  return createPortal(
    <dialog ref={dialog} className={className} onClose={onClose}>
      {" "}
      {children}{" "}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
