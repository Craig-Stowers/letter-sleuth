import { useState } from "react";
import useThrottleEffect from "./useThrottleEffect";
function useLocalData(key, initialState) {
   const [value, setValue] = useState(() => {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : initialState;
   });

   useThrottleEffect(
      () => {
         localStorage.setItem(key, JSON.stringify(value));
      },
      3000,
      [value]
   );

   return [value, setValue];
}

export default useLocalData;
