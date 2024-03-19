import { useEffect, useState } from "react";

export default function AdminPanel({ adminData, onAdminEvent }) {
   const [dayIncrement, setDayIncrement] = useState(0);

   useEffect(() => {
      if (dayIncrement === 0) return;
      onAdminEvent({ type: "changedays", days: dayIncrement });

      let interval = null;

      const delay = setTimeout(() => {
         interval = setInterval(() => {
            onAdminEvent({ type: "changedays", days: dayIncrement });
         }, 20);
      }, 500);

      return () => {
         clearTimeout(delay);
         interval && clearTimeout(interval);
      };
   }, [dayIncrement]);
   return (
      <div
         className="dayPicker"
         onClick={(e) => {
            e.preventDefault();
         }}
         onMouseLeave={() => {
            setDayIncrement(0);
         }}
         onMouseUp={() => {
            setDayIncrement(0);
         }}
      >
         <h4>ADMIN PANEL</h4>
         <p>
            Use this panel to simulate date changes. Scores will only be calculated up until the simulated date. Hold
            +/- day buttons for continuous seeking. "Start date" can be edited in the apps config.
         </p>
         <ul className="data">
            {Object.entries(adminData).map(([key, value], index) => {
               return (
                  <li key={`${key}`}>
                     <strong>{key}:</strong> {value}
                  </li>
               );
            })}
         </ul>

         <div className="buttonRow">
            <button
               onMouseDown={() => {
                  setDayIncrement(-1);
               }}
            >
               -1 day
            </button>
            <button
               onMouseDown={() => {
                  setDayIncrement(1);
               }}
            >
               +1 day
            </button>
         </div>

         <div className="buttonRow">
            <button
               onMouseDown={() => {
                  setDayIncrement(-10);
               }}
            >
               -10 days
            </button>
            <button
               onMouseDown={() => {
                  setDayIncrement(10);
               }}
            >
               +10 days
            </button>
         </div>
         <div className="buttonRow" style={{ marginBottom: "14px" }}>
            <button
               onMouseDown={() => {
                  onAdminEvent({ type: "gototoday" });
               }}
            >
               go to today
            </button>
         </div>
         <div className="buttonRow">
            <button
               className="warning"
               onMouseDown={() => {
                  onAdminEvent({ type: "cleartoday" });
               }}
            >
               clear todays data
            </button>
         </div>
         <div className="buttonRow">
            <button
               className="warning"
               onMouseDown={() => {
                  onAdminEvent({ type: "clearall" });
               }}
            >
               clear all data
            </button>
         </div>
      </div>
   );
}
