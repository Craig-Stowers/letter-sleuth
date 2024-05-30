import { useState, useEffect, forwardRef } from "react";
import classes from "./GameScreen.module.css";
import useElementWidth from "../../hooks/useElementWidth";

const Letter = ({ value, boxState, disableExpand = false, showHighlight = false, gridWidth, style = {} }) => {
   const [filled, setFilled] = useState(false);
   const [letterWidth, ref] = useElementWidth(
      (newWidth, oldWidth) => {
         return newWidth > 0 ? newWidth : oldWidth;
      },
      [gridWidth]
   );

   useEffect(() => {
      setFilled(value !== undefined);
   }, [value]);

   //console.log("letterwidth", letterWidth);

   return (
      <div className={classes["letter-container"]} style={{ ...style, height: letterWidth + 4 + "px" }}>
         <div
            ref={ref}
            style={{ height: letterWidth + "px" }}
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
