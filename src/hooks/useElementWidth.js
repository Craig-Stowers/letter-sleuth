import { useState, useEffect, useRef } from "react";

// Custom hook to track the content width of an element only on window resize
function useElementWidth(setWidthCallback) {
   // State to store the element's content width
   const [width, setWidth] = useState(0);

   // Ref object to reference the element
   const ref = useRef(null);

   useEffect(() => {
      // Function to update the element's width
      const updateWidth = () => {
         if (ref.current) {
            const computedStyle = window.getComputedStyle(ref.current);
            const paddingLeft = parseFloat(computedStyle.paddingLeft);
            const paddingRight = parseFloat(computedStyle.paddingRight);
            const contentWidth = ref.current.clientWidth - paddingLeft - paddingRight;
            setWidth((oldValue) => {
               return setWidthCallback ? setWidthCallback(contentWidth, oldValue) : contentWidth;
            });
         }
      };

      // Update width once after the component mounts
      updateWidth();

      // Function to handle resize event
      const handleResize = () => {
         updateWidth();
      };

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Cleanup function to remove the event listener
      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []); // Empty dependency array ensures this runs once on mount

   // Return the content width and the ref to be attached to the element
   return [width, ref];
}

export default useElementWidth;
