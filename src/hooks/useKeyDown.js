import { useEffect } from "react";

const useKeyDown = (callback, deps) => {

    useEffect(() => {

        console.log("add KEY EVENTS")

        let keysPressed = {};

        const handleKeyDown = (e) => {

        //    console.log("key down", e)

         //   console.log("active", document.activeElement.tagName)

           
          //  e.key !== "Enter" && e.key !== "backspace" || e.stopPropagation()
              

            if (!keysPressed[e.key]) {
                keysPressed[e.key] = true;

                

                if (e.key === "Enter" && document.activeElement.tagName === 'BUTTON') {
                    console.log("abort")
                   // e.stopPropagation();
                   // e.preventDefault();
                    // Do nothing, let the button handle its own 'Enter' key press
                    return
                }
                callback(e.key);
                // Handle key down event
            }
        }
        const handleKeyUp = (e) => {
            keysPressed[e.key] = false;
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);           
        return () => {
            console.log("clear keys")
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);           
        }
    },deps);
}

export default useKeyDown;