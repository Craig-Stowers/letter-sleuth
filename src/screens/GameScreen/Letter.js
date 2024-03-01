import { useState, useEffect, forwardRef } from "react";
import classes from "./GameScreen.module.css";
import useElementWidth from "../../hooks/useElementWidth";

const Letter = ({ value, boxState, disableExpand = false, showHighlight = false, style = {} }) => {
   const [filled, setFilled] = useState(false);
   const [width, ref] = useElementWidth();

   useEffect(() => {
      setFilled(value !== undefined);
   }, [value]);

   return (
      <div className={classes["letter-container"]} style={{ ...style, height: width + "px" }}>
         <div
            ref={ref}
            style={{ height: `calc(${width + "px"} - 4px)` }}
            className={[
               classes.letter,
               classes[boxState],
               filled ? classes.filled : "",
               showHighlight ? "letter-highlight" : "",
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
