import { useRef } from "react";

const Modal = ({ children, onClose }) => {
   const modalRef = useRef(null);
   return (
      <div
         ref={modalRef}
         onClick={(e) => {
            if (e.target !== modalRef.current) return;
            onClose && onClose();
         }}
         style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            position: "fixed",
            zIndex: 3,
         }}
      >
         <div
            style={{
               backgroundColor: "white",
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
            }}
         >
            {children}
         </div>
      </div>
   );
};

export default Modal;
