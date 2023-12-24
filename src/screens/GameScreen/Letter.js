import { useState, useEffect, forwardRef } from "react";
import classes from "./GameScreen.module.css";

const Letter = ({ value, boxState }) => {
   // const [animation, setAnimation] = useState(null);

   //    useEffect(() => {
   //       console.log("value", value);
   //       if (!value) {
   //          setAnimation("pulse");
   //       }
   //    }, [value]);

   const fillClass = value !== undefined ? classes.filled : "";

   // console.log("animation", animation);

   return (
      <div
         className={[classes.letter, classes[boxState], fillClass].join(" ")}
         onAnimationEnd={(event) => {
            console.log("Child Ended Animation");
            event.stopPropagation();
         }}
      >
         <label>{value}</label>
      </div>
   );
};

export default Letter;
