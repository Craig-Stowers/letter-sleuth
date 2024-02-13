import { useState, useEffect, forwardRef } from "react";
import classes from "./GameScreen.module.css";

const Letter = ({ value, boxState, disableExpand = false, showHighlight = false }) => {
   const [filled, setFilled] = useState(false);

   useEffect(() => {
      setFilled(value !== undefined);
   }, [value]);

   return (
      <div className={classes["letter-container"]}>
         <div
            className={[
               classes.letter,
               classes[boxState],
               filled ? classes.filled : "",
               showHighlight ? "letter-highlight2" : "",
            ].join(" ")}
            onAnimationEnd={(event) => {
               event.stopPropagation();
            }}
         >
            <label>{value}</label>
         </div>
      </div>
   );
};

export default Letter;
