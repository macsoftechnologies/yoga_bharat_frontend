import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

function Modal({
  open,
  onClose,
  title,
  children,
  size,
  centered = false,
  backdropClosable = true
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  let sizeClass = "";
  if (size === "sm") sizeClass = "modal-sm";
  if (size === "lg") sizeClass = "modal-lg";
  if (size === "xl") sizeClass = "modal-xl";

  return ReactDOM.createPortal(
    <>
      <div
        className="custom-modal-backdrop"
        onClick={() => backdropClosable && onClose && onClose()}
      />

      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className={`modal-dialog ${sizeClass} ${centered ? "modal-dialog-centered" : ""}`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>

            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export default Modal;
