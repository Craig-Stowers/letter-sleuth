import { useState, useEffect, useRef } from "react";

// Custom hook to observe width of multiple elements
const useWidthsObserver = (elementsRef) => {
   const [widths, setWidths] = useState([]);

   useEffect(() => {
      if (!elementsRef.current) return;

      console.log("effect", elementsRef.current);

      // Initialize widths array with current widths
      const initialWidths = elementsRef.current.map((ref) => ref.current?.offsetWidth || 0);
      console.log("initalWidths", initialWidths);
      setWidths(initialWidths);

      // Create a ResizeObserver to observe width changes
      const resizeObserver = new ResizeObserver((entries) => {
         console.log("ResizeObserver triggered", entries);
         setWidths(entries.map((entry) => entry.target.offsetWidth));
      });

      // Observe each element
      elementsRef.current.forEach((ref) => {
         if (ref.current) resizeObserver.observe(ref.current);
      });

      // Cleanup function to unobserve elements
      return () => {
         elementsRef.current.forEach((ref) => {
            if (ref.current) resizeObserver.unobserve(ref.current);
         });
      };
   }, [elementsRef]); // Re-run the effect if the elementsRef changes

   return widths;
};

export default useWidthsObserver;
