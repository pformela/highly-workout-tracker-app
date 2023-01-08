import React from "react";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return <div className="bg-black opacity-40" onClick={props.onClose}></div>;
};

const ModalOverlay = (props) => {
  return (
    <div
      id="defaultModal"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
    >
      <div className="relative w-full h-full max-w-2xl md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="p-6 space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Elooooooooooooooooooo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClick} />,
        portalElement
      )}
      {ReactDOM.createPortal(<ModalOverlay />, portalElement)}
    </React.Fragment>
  );
};

export default Modal;
