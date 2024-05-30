import { useState, useEffect, useRef } from "react";

// Custom hook to track the content width of an element only on window resize
function useElementSize(ref) {
   // State to store the element's content width
   const [size, setSize] = useState({ width: 0, height: 0 });

   //console.log("useeELementWidth", width);

   useEffect(() => {
      // Function to update the element's width
      const updateWidth = () => {
         if (ref) {
            const computedStyle = window.getComputedStyle(ref);
            const paddingLeft = parseFloat(computedStyle.paddingLeft);
            const paddingRight = parseFloat(computedStyle.paddingRight);
            const paddingTop = parseFloat(computedStyle.paddingTop);
            const paddingBottom = parseFloat(computedStyle.paddingBottom);
            const contentWidth = ref.clientWidth - paddingLeft - paddingRight;
            const contentHeight = ref.clientHeight - paddingTop - paddingBottom;
            setSize({
               width: contentWidth,
               height: contentHeight,
            });
         }
      };

      // Update width once after the component mounts
      updateWidth();

      const delayedLoadUpdate = setTimeout(() => {
         updateWidth();
      }, 600);

      // Function to handle resize event
      const handleResize = () => {
         updateWidth();
      };

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Cleanup function to remove the event listener
      return () => {
         clearTimeout(delayedLoadUpdate);
         window.removeEventListener("resize", handleResize);
      };
   }, [ref]); // Empty dependency array ensures this runs once on mount

   // Return the content width and the ref to be attached to the element
   return [size];
}

export default useElementSize;
