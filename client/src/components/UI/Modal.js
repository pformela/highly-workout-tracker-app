import React from "react";

const Modal = (props) => {
  return (
    <div className="bg-blackRgba fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center opacity-100">
        <div className="flex-col justify-center bg-navy py-8 px-10 rounded-lg opacity-100 scrollbar overflow-auto max-h-screen">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
