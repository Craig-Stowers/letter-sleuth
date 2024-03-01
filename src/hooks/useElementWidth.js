import { useState, useEffect, useRef } from "react";

// Custom hook to track the width of an element
function useElementWidth() {
   // State to store the element's width
   const [width, setWidth] = useState(0);

   // Ref object to reference the element
   const ref = useRef(null);

   // Effect to attach and detach ResizeObserver
   useEffect(() => {
      // Update width function
      const updateWidth = () => {
         if (ref.current) {
            setWidth(ref.current.offsetWidth);
         }
      };

      // Create a ResizeObserver to observe size changes
      const resizeObserver = new ResizeObserver(updateWidth);
      if (ref.current) {
         resizeObserver.observe(ref.current);
      }

      // Initial update
      updateWidth();

      // Cleanup function to disconnect the ResizeObserver
      return () => {
         if (ref.current) {
            resizeObserver.disconnect();
         }
      };
   }, []); // Empty dependency array ensures this runs once on mount

   // Return the width and the ref to be attached to the element
   return [width, ref];
}

export default useElementWidth;
