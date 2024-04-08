import { useEffect, useRef } from "react";

function useDebounceEffect(callback, delay, deps) {
   const timerRef = useRef(null);
   const callbackRef = useRef(callback);

   // Keep the latest callback in ref
   useEffect(() => {
      callbackRef.current = callback;
   }, [callback]);

   useEffect(() => {
      // Clear existing timer
      if (timerRef.current) {
         clearTimeout(timerRef.current);
      }

      // Set the new timer
      timerRef.current = setTimeout(() => {
         callbackRef.current(); // Execute the latest callback
      }, delay);

      // Cleanup timer on component unmount or when deps change
      return () => {
         if (timerRef.current) {
            clearTimeout(timerRef.current);
         }
      };
   }, [...deps, delay]); // Include delay in dependency array to handle its changes

   // No need to return anything, similar to useEffect
}

export default useDebounceEffect;
