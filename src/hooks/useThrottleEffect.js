import { useEffect, useRef } from "react";

function useThrottleEffect(callback, delay, deps) {
   const wait = useRef(null);
   const callbackRef = useRef(callback);
   const depsChanged = useRef(false);

   // Keep the latest callback in ref
   useEffect(() => {
      callbackRef.current = callback;
   }, [callback]);

   const addWait = () => {
      //  console.log("add wait with delay", delay);
      wait.current = setTimeout(() => {
         //console.log("timeout");
         wait.current = false;
         if (!depsChanged.current) return;
         // console.log("call after throttle");
         depsChanged.current = false;
         callbackRef.current();
         addWait();
      }, delay);
   };

   useEffect(() => {
      if (!wait.current) {
         // console.log("! wait ADD BRAND NEW");
         addWait();
         callbackRef.current();
      } else {
         depsChanged.current = true;
      }
   }, [...deps, delay]); // Execute the effect when dependencies or delay changes

   useEffect(() => {
      return () => {
         wait.current && clearTimeout(wait.current);
         wait.current = false;
      };
   }, []);

   // No need to return anything, similar to useEffect
}

export default useThrottleEffect;
