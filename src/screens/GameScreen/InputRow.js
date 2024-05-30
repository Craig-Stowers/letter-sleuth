import Letter from "./Letter";

import classes from "./GameScreen.module.css";
import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";

const InputRow = forwardRef(({ boxes, rowNumber, gridWidth }, parentRef) => {
   const [shake, setShake] = useState(false);
   const [key, setKey] = useState(0);
   const [message, setMessage] = useState("");
   const messageTimer = useRef(null);

   useImperativeHandle(parentRef, () => ({
      // Expose the internal DOM ref

      // You can also expose additional methods
      shake: (isShort) => {
         // if (isShort) {
         //    setMessage("missing input");
         // } else {
         //    setMessage("word not in list");
         // }

         setShake(false);
         messageTimer.current && clearTimeout(messageTimer.current);
         messageTimer.current = setTimeout(() => {
            setShake(true);
            //setMessage("");
         }, 20);
         setKey((prevKey) => prevKey + 1);
      },
   }));

   useEffect(() => {
      // if (message) {

      return () => messageTimer.current && clearTimeout(messageTimer.current);
      //  }
   }, []);

   return (
      <div className={classes.inputWrapper}>
         <div
            className={`${classes["input-row"]} ${shake ? classes["shake"] : ""}`}
            onAnimationEnd={(event) => {
               setShake(false);
            }}
            // key={key}
         >
            {boxes.map((el, i) => {
               return (
                  <Letter
                     value={el.value}
                     boxState={el.boxState}
                     showHighlight={el.showHighlight}
                     key={"letter-" + i}
                     gridWidth={gridWidth}
                  />
               );
            })}
         </div>
         {message && <div className={classes.message}>{message}</div>}
      </div>
   );
});

export default InputRow;
