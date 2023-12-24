import Letter from "./Letter";

import classes from "./GameScreen.module.css";
import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";

const alphabet = [
   "a",
   "b",
   "c",
   "d",
   "e",
   "f",
   "g",
   "h",
   "u",
   "j",
   "k",
   "l",
   "m",
   "n",
   "o",
   "p",
   "q",
   "r",
   "s",
   "t",
   "u",
   "v",
   "w",
   "x",
   "y",
   "z",
];
const InputRow = forwardRef(({ boxes, rowNumber }, parentRef) => {
   const [shake, setShake] = useState(false);
   const [key, setKey] = useState(0);
   const [message, setMessage] = useState("");
   const messageTimer = useRef(null);

   useImperativeHandle(parentRef, () => ({
      // Expose the internal DOM ref

      // You can also expose additional methods
      shake: (isShort) => {
         setMessage(isShort ? "it's short" : "get fucked!");
         setShake(true);
         messageTimer.current && clearTimeout(messageTimer.current);
         messageTimer.current = setTimeout(() => {
            setMessage("");
         }, 2000);
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
               console.log("animation end", rowNumber);
               console.log(event.target, event.currentTarget);
               setShake(false);
            }}
            key={key}
         >
            {boxes.map((el, i) => {
               return <Letter value={el.value} boxState={el.boxState} key={"letter-" + i} />;
            })}
         </div>
         {message && <div className={classes.message}>{message}</div>}
      </div>
   );
});

export default InputRow;
