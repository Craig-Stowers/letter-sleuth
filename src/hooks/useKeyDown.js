import { useEffect } from "react";

const useKeyDown = (callback, deps) => {
   useEffect(() => {
      let keysPressed = {};

      const handleKeyDown = (e) => {
         if (!keysPressed[e.key]) {
            keysPressed[e.key] = true;

            if (e.key === "Enter" && document.activeElement.tagName === "BUTTON") {
               // e.stopPropagation();
               // e.preventDefault();
               // Do nothing, let the button handle its own 'Enter' key press
               return;
            }
            callback(e.key);
            // Handle key down event
         }
      };
      const handleKeyUp = (e) => {
         keysPressed[e.key] = false;
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
         document.removeEventListener("keydown", handleKeyDown);
         document.removeEventListener("keyup", handleKeyUp);
      };
   }, deps);
};

export default useKeyDown;
