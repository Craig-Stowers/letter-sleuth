import { useEffect, useState, useMemo } from "react";

export default function useLocalData(keystring, defaultData) {
   const [mirrorData, setMirrorData] = useState(null);

   useEffect(() => {
      let data = localStorage.getItem(keystring);
      const parseData = data ? JSON.parse(data) : null;
      if (!data || data === "null") data = defaultData;
      setMirrorData(JSON.parse(data));
   }, [keystring, defaultData]);

   useEffect(() => {
      if (!mirrorData) return;
      localStorage.setItem(keystring, JSON.stringify(mirrorData));
   }, [mirrorData]);

   return [mirrorData, setMirrorData];
}
